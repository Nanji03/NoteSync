from django.urls import path
from .views import RegisterView, LoginView, NoteUploadView, NoteDetailView, GenerateFlashcardsView, share_request, incoming_requests, respond_to_share_request, accepted_shares, save_flashcards, get_user_flashcards, get_flashcard_sets, delete_flashcard_set, current_user, all_users, tutor_ask, tutor_save, tutor_saved, tutor_delete, tutor_ask, tutor_save, tutor_saved, tutor_delete, tutor_recommend

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('notes/', NoteUploadView.as_view(), name='note-upload'),
    path('notes/<int:pk>/', NoteDetailView.as_view()),  # DELETE endpoint
    path('flashcards/generate/', GenerateFlashcardsView.as_view(), name='generate-flashcards'),
    path('share-request/', share_request, name='share-request'),
    path('incoming-requests/', incoming_requests, name='incoming-requests'),
    path('share-request/respond/', respond_to_share_request, name='respond-to-share-request'),
    path('accepted-shares/', accepted_shares, name='accepted-shares'),
    path('flashcards/save/', save_flashcards, name='save-flashcards'),
    path('flashcards/', get_user_flashcards, name='get-user-flashcards'),
    path('flashcards/sets/', get_flashcard_sets, name='get-flashcard-sets'),
    path('flashcards/sets/<int:set_id>/', delete_flashcard_set, name='delete-flashcard-set'),
    path('current-user/', current_user, name='current-user'),
    path('all-users/', all_users, name='all-users'),
    path('tutor/ask/', tutor_ask, name='tutor-ask'),
    path('tutor/save/', tutor_save, name='tutor-save'),
    path('tutor/saved/', tutor_saved, name='tutor-saved'),
    path('tutor/saved/<int:entry_id>/', tutor_delete, name='tutor-delete'),
    path('tutor/recommend/', tutor_recommend, name='tutor-recommend'),

]
