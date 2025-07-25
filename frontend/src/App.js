import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import Flashcards from './pages/Flashcards';
import Share from './pages/Share';
import Planner from './pages/Planner';
import IncomingRequests from './pages/IncomingRequests';
import AcceptedShares from './pages/AcceptedShares';
import SharingHub from './pages/SharingHub';
import SavedFlashcardSets from './pages/SavedFlashcardSets';
import Tutor from './pages/Tutor';
import Character from './pages/CharacterSelect';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gtaBlack text-gtaWhite font-sans">
        <header className="bg-gtaBlack border-b border-gtaAccent shadow-gta px-6 py-4 flex justify-between items-center">
          <h1 className="text-4xl font-gta text-gtaAccent drop-shadow-gta">
            NoteSync
          </h1>
          <nav>
            <ul className="flex gap-4 text-sm text-gtaWhite">
              <li><Link to="/" className="hover:text-gtaAccent">🏠 Home</Link></li>
              <li><Link to="/login" className="hover:text-gtaAccent">🔑 Login</Link></li>
              <li><Link to="/register" className="hover:text-gtaAccent">📝 Register</Link></li>
              <li><Link to="/sharing" className="hover:text-gtaAccent">🔔 Requests</Link></li>
            </ul>
          </nav>
        </header>

        <main className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/share" element={<Share />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/incoming-requests" element={<IncomingRequests />} />
            <Route path="/accepted-shares" element={<AcceptedShares />} />
            <Route path="/sharing" element={<SharingHub />} />
            <Route path="/flashcard-sets" element={<SavedFlashcardSets />} />
            <Route path="/tutor" element={<Tutor />} />
            <Route path="/character" element={<Character />} />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
