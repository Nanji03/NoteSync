from datetime import timezone
from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Note, ShareRequest, Flashcard, FlashcardSet, AITutorEntry, ConversationSet
from .serializers import NoteSerializer, ShareRequestSerializer, FlashcardSerializer, FlashcardSetSerializer, AITutorEntrySerializer, ConversationSetSerializer
from rest_framework.permissions import IsAuthenticated
import os
from openai import OpenAI
#
import fitz  # PyMuPDF
import docx
from dotenv import load_dotenv
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes


load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class RegisterView(APIView):
    def post(self, request):
        data = request.data
        if User.objects.filter(username=data['username']).exists():
            return Response({'error': 'Username already exists'}, status=400)

        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password']
        )
        return Response({'message': 'User created'}, status=201)

class LoginView(APIView):
    def post(self, request):
        user = authenticate(
            username=request.data['username'],
            password=request.data['password']
        )
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': user.username
            })
        return Response({'error': 'Invalid credentials'}, status=400)

class NoteUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def get(self, request):
        notes = Note.objects.filter(user=request.user).order_by('-uploaded_at')
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)
    

class NoteDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            note = Note.objects.get(id=pk, user=request.user)
            note.delete()
            return Response({'message': 'Note deleted'}, status=status.HTTP_204_NO_CONTENT)
        except Note.DoesNotExist:
            return Response({'error': 'Note not found'}, status=status.HTTP_404_NOT_FOUND)
        

class GenerateFlashcardsView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]

    def post(self, request):
        uploaded_file = request.FILES.get('file')
        if not uploaded_file:
            return Response({"error": "No file uploaded."}, status=400)

        ext = uploaded_file.name.split('.')[-1].lower()

        try:
            if ext == 'pdf':
                text = self.extract_text_from_pdf(uploaded_file)
            elif ext in ['doc', 'docx']:
                text = self.extract_text_from_docx(uploaded_file)
            elif ext == 'txt':
                text = uploaded_file.read().decode()
            else:
                return Response({"error": "Unsupported file type."}, status=400)
        except Exception as e:
            return Response({"error": f"Failed to read file: {str(e)}"}, status=400)

        prompt = f"Generate at least 5 flashcards from the following study material. Format it clearly as:\n\nQ: <question>\nA: <answer>\n\nUse meaningful and unique answers. Don't repeat the question in the answer. Text:\n\n{text[:4000]}"

        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=500
            )
            flashcards = response.choices[0].message.content
            return Response({"flashcards": flashcards}, status=200)

        except Exception as e:
            return Response({"error": f"OpenAI API error: {str(e)}"}, status=500)

    def extract_text_from_pdf(self, file):
        text = ""
        with fitz.open(stream=file.read(), filetype="pdf") as doc:
            for page in doc:
                text += page.get_text()
        return text

    def extract_text_from_docx(self, file):
        doc = docx.Document(file)
        return "\n".join([p.text for p in doc.paragraphs])


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def share_request(request):
    data = request.data
    try:
        to_user = User.objects.get(username=data['to_user'])

        share = ShareRequest.objects.create(
            from_user=request.user,
            to_user=to_user,
            content_type=data['content_type'],
            content_id=data['content_id'],
        )

        return Response({"message": "Share request sent!", "id": share.id})
    except User.DoesNotExist:
        return Response({"error": "Recipient user not found."}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    
    # 1. GET /api/incoming-requests/
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def incoming_requests(request):
    pending = ShareRequest.objects.filter(to_user=request.user, status='pending')
    serializer = ShareRequestSerializer(pending, many=True)
    return Response(serializer.data)


# 2. POST /api/share-request/accept/
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def respond_to_share_request(request):
    data = request.data
    try:
        share_request = ShareRequest.objects.get(id=data['id'])

        if share_request.to_user != request.user:
            return Response({"error": "Unauthorized."}, status=403)

        new_status = data.get('action')
        if new_status not in ['accepted', 'rejected']:
            return Response({"error": "Invalid action."}, status=400)

        share_request.status = new_status
        share_request.save()
        return Response({"message": f"Request {new_status}."})
    except ShareRequest.DoesNotExist:
        return Response({"error": "Request not found."}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def accepted_shares(request):
    shares = ShareRequest.objects.filter(to_user=request.user, status='accepted')
    serializer = ShareRequestSerializer(shares, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def regenerate_flashcard_answer(request):
    question = request.data.get("question")
    if not question:
        return Response({"error": "Missing question."}, status=400)

    try:
        # USE `client`, not `openai`
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an academic assistant."},
                {"role": "user", "content": f"Answer this clearly: {question}"}
            ]
        )
        answer = response.choices[0].message.content.strip()
        return Response({"answer": answer})
    except Exception as e:
        return Response({"error": str(e)}, status=500)

    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_flashcards(request):
    cards = request.data.get("cards", [])
    title = request.data.get("title", "Untitled Set")

    card_set = FlashcardSet.objects.create(user=request.user, title=title)

    for card in cards:
        Flashcard.objects.create(
            set=card_set,
            question=card["question"],
            answer=card["answer"]
        )

    return Response({"message": "Flashcard set saved.", "set_id": card_set.id})

    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_flashcards(request):
    flashcards = Flashcard.objects.filter(user=request.user)
    serializer = FlashcardSerializer(flashcards, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_flashcard_sets(request):
    sets = FlashcardSet.objects.filter(user=request.user).prefetch_related('cards')
    serializer = FlashcardSetSerializer(sets, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_flashcard_set(request, set_id):
    try:
        flashcard_set = FlashcardSet.objects.get(id=set_id, user=request.user)
        flashcard_set.delete()
        return Response({"message": "Set deleted."})
    except FlashcardSet.DoesNotExist:
        return Response({"error": "Not found."}, status=404)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    return Response({
        "id": request.user.id,
        "username": request.user.username,
        "email": request.user.email
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def all_users(request):
    users = User.objects.exclude(id=request.user.id)  # exclude current user
    data = [{"id": u.id, "username": u.username, "email": u.email} for u in users]
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def tutor_ask(request):
    question = request.data.get("question")
    print("🔥 tutor_ask hit, question:", question)

    if not question:
        return Response({"error": "Missing question."}, status=400)

    prompt = f"You are an academic tutor. Answer this clearly:\n\n{question}"

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=500
        )
        answer = response.choices[0].message.content.strip()
        print("✅ Got answer from OpenAI")
        return Response({"answer": answer})
    except Exception as e:
        print("❌ OpenAI error:", str(e))
        return Response({"error": f"AI error: {str(e)}"}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def tutor_save(request):
    question = request.data.get("question")
    answer = request.data.get("answer")

    if not question or not answer:
        return Response({"error": "Missing question or answer."}, status=400)

    entry = AITutorEntry.objects.create(user=request.user, question=question, answer=answer)
    return Response({"message": "Saved!", "entry": AITutorEntrySerializer(entry).data})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def tutor_saved(request):
    entries = AITutorEntry.objects.filter(user=request.user).order_by('-created_at')
    serializer = AITutorEntrySerializer(entries, many=True)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def tutor_delete(request, entry_id):
    try:
        entry = AITutorEntry.objects.get(id=entry_id, user=request.user)
        entry.delete()
        return Response({"message": "Deleted."})
    except AITutorEntry.DoesNotExist:
        return Response({"error": "Entry not found."}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def tutor_recommend(request):
    question = request.data.get("question")
    if not question:
        return Response({"error": "Missing question."}, status=400)

    # You can replace this with real search APIs later
    sample_links = {
        "articles": [
            f"https://en.wikipedia.org/wiki/{question.replace(' ', '_')}",
            f"https://www.geeksforgeeks.org/?s={question.replace(' ', '+')}"
        ],
        "videos": [
            f"https://www.youtube.com/results?search_query={question.replace(' ', '+')}"
        ]
    }
    return Response(sample_links)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def conversation_sets(request):
    if request.method == 'GET':
        sets = ConversationSet.objects.filter(user=request.user).order_by('-created_at')
        return Response(ConversationSetSerializer(sets, many=True).data)
    elif request.method == 'POST':
        title = request.data.get('title') or f"Session on {timezone.now().strftime('%b %d, %Y')}"
        serializer = ConversationSetSerializer(data={
            'title': title,
            'messages': request.data.get('messages', [])
        })
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({'message': 'Chat saved!'})
        return Response(serializer.errors, status=400)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def generate_quiz(request):
    source = request.data.get("source")
    text = ""

    print("⚡ Source:", source)

    try:
        if source == "notes":
            note_id = request.data.get("note_id")
            print("📝 Note ID:", note_id)
            note = Note.objects.get(id=note_id, user=request.user)

            if not note.file:
                return Response({"error": "Note file not found."}, status=400)

            try:
                file_data = note.file.read()
                if isinstance(file_data, bytes):
                    text = file_data.decode()[:4000]
                else:
                    text = str(file_data)[:4000]
            except Exception as e:
                print("❌ Failed to read note file:", str(e))
                return Response({"error": "Failed to read note file."}, status=500)

        elif source == "flashcards":
            set_id = request.data.get("set_id")
            print("🧠 Flashcard Set ID:", set_id)
            flashcards = Flashcard.objects.filter(set__id=set_id, set__user=request.user)

            if not flashcards.exists():
                return Response({"error": "Flashcard set not found or empty."}, status=400)

            for fc in flashcards:
                text += f"Q: {fc.question}\nA: {fc.answer}\n\n"

        else:
            return Response({"error": "Invalid quiz source selected."}, status=400)

        if not text.strip():
            return Response({"error": "No content found to generate questions."}, status=400)

        print("📚 Extracted text length:", len(text))

# ✨ New Improved Prompt
        prompt = f"""
Generate exactly 5 short-answer quiz questions based on the study material below.

Each question must begin with "Q:" and each answer must begin with "A:".
Use this format:

Q: What is X?
A: X is ...

Q: What does Y mean?
A: Y means ...

Study Material:
{text}
"""
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
            max_tokens=800
        )

        raw = response.choices[0].message.content
        print("✅ Raw LLM response received.")

        questions = []
        for chunk in raw.split("Q:"):
            if "A:" not in chunk:
                continue
            try:
                q, a = chunk.split("A:", 1)
                questions.append({ "q": q.strip(), "a": a.strip() })
            except Exception as e:
                print("⚠️ Skipped malformed QA chunk:", chunk)


        return Response({ "questions": questions })

    except Note.DoesNotExist:
        return Response({"error": "Note not found."}, status=404)
    except Exception as e:
        print("❌ Unhandled server error:", str(e))
        return Response({"error": str(e)}, status=500)
