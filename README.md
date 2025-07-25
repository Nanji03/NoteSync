#  NoteSync

**NoteSync** is a modern educational platform designed to help students organize their academic life more efficiently.

Built with **Django** (backend) and **React** (frontend), NoteSync offers tools for note-taking, flashcard generation, study planning, and collaborative learning.

---

##  Features

-  **Lecture Note Management**  
  Create, upload, and organize lecture notes by course.

-  **Auto-Generated Flashcards**  
  Instantly generate flashcards from your notes using smart parsing.

-  **Sharing & Collaboration**  
  Share your notes and flashcards with other students on the platform.

-  **Study Plan Builder**  
  Create personalized study plans to stay on track with your learning goals.

-  **Time Scheduler**  
  Allocate specific time blocks for topics using a built-in scheduling system.

- **User Authentication**  
  Secure registration and login system for a personalized experience.

---

##  Tech Stack

- **Frontend:** React, Tailwind CSS (or CSS Framework of your choice)  
- **Backend:** Django, Django REST Framework  
- **Database:** PostgreSQL (or SQLite for local development)  
- **Authentication:** JWT / Django Allauth  
- **Deployment (optional):** Render, Vercel, Netlify, or Heroku

---

##  Getting Started

### Prerequisites

- Python 3.10+
- Node.js & npm
- PostgreSQL (optional)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
>>>>>>> 60110a2 (Initial commit)
