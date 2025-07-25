from rest_framework import serializers
from .models import Note, ShareRequest, Flashcard, FlashcardSet, AITutorEntry

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'file', 'uploaded_at']

class ShareRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShareRequest
        fields = '__all__'

class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = ['id', 'question', 'answer']


class FlashcardSetSerializer(serializers.ModelSerializer):
    cards = FlashcardSerializer(many=True, read_only=True)

    class Meta:
        model = FlashcardSet
        fields = ['id', 'title', 'created_at', 'cards'] 

class AITutorEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = AITutorEntry
        fields = '__all__'