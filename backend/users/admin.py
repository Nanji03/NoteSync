from django.contrib import admin
from .models import Note, Flashcard, ConversationSet

admin.site.register(Note)
admin.site.register(Flashcard)
admin.site.register(ConversationSet)