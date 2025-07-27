import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
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
import Conversations from './pages/Conversations';
import RouteTransition from "./components/RouteTransition";
import QuizMission from './pages/QuizMission';

import { useEffect, useState } from 'react';


function InnerApp() {
  const location = useLocation();
  const [showTransition, setShowTransition] = useState(false);

  useEffect(() => {
    setShowTransition(true);
    const timeout = setTimeout(() => setShowTransition(false), 800);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gtaBlack text-gtaWhite font-sans">
      <RouteTransition isVisible={showTransition} />
      <header className="bg-gtaBlack border-b border-gtaAccent shadow-gta px-6 py-4 flex justify-between items-center">
        <h1 className="text-4xl font-gta text-gtaAccent drop-shadow-gta">
          NoteSync
        </h1>
        <nav>
          <ul className="flex gap-4 text-sm text-gtaWhite">
            <li><Link to="/" className="hover:text-gtaAccent"> Home</Link></li>
            <li><Link to="/login" className="hover:text-gtaAccent"> Login</Link></li>
            <li><Link to="/register" className="hover:text-gtaAccent"> Register</Link></li>
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
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/quiz" element={<QuizMission />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <InnerApp />
    </Router>
  );
}

export default App;
