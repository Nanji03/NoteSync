from django.db import models
from django.contrib.auth.models import User

class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='notes/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.user.username}"

class ShareRequest(models.Model):
    CONTENT_TYPE_CHOICES = [
        ('notes', 'Notes'),
        ('flashcards', 'Flashcards'),
    ]

    from_user = models.ForeignKey(User, related_name='sent_requests', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='received_requests', on_delete=models.CASCADE)
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPE_CHOICES)
    content_id = models.CharField(max_length=100)
    status = models.CharField(max_length=20, default='pending')  # pending, accepted, rejected
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.from_user} → {self.to_user} ({self.content_type})"
    

class FlashcardSet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

class Flashcard(models.Model):
    set = models.ForeignKey(FlashcardSet, related_name='cards', on_delete=models.CASCADE, null=True)
    question = models.TextField()
    answer = models.TextField()

class AITutorEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.TextField()
    answer = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.question[:40]}"


class ConversationSet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    messages = models.JSONField()  # List of {"sender": "user"/"ai", "text": "..."}
    created_at = models.DateTimeField(auto_now_add=True)

