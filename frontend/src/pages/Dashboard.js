import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const [username, setUsername] = useState(localStorage.getItem('username') || 'User');  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
        setUsername(payload?.username || payload?.user_id || 'User');    } catch (error) {
      console.error('Invalid token');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
  const hasCharacter = localStorage.getItem("selectedCharacter");
  if (!hasCharacter) {
    navigate("/character");
  }
  }, [navigate]);

  
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen px-6 py-12 bg-gtaBlack text-gtaWhite font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-gta text-gtaAccent drop-shadow-gta">Mission Control</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gtaRed text-white rounded hover:bg-red-700 shadow-gta"
          >
            🛑 Logout
          </button>
        </div>

        <p className="text-gtaWhite mb-8 text-lg">
          Welcome back, <strong className="text-gtaGreen">{username}</strong>! Choose your next move:
        </p>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <li className="bg-gtaBlack border border-gtaGreen p-4 rounded shadow-gta hover:scale-105 transition">
            <Link to="/notes" className="text-gtaGreen text-xl font-bold hover:underline">
              📝 Notes
            </Link>
            <p className="text-sm text-gtaWhite">Keep your course notes organized and accessible.</p>
          </li>

          <li className="bg-gtaBlack border border-gtaAccent p-4 rounded shadow-gta hover:scale-105 transition">
            <Link to="/flashcards" className="text-gtaAccent text-xl font-bold hover:underline">
              🧠 Flashcards
            </Link>
            <p className="text-sm text-gtaWhite">Turn your notes into memory weapons.</p>
          </li>

          <li className="bg-gtaBlack border border-gtaYellow p-4 rounded shadow-gta hover:scale-105 transition">
            <Link to="/share" className="text-gtaYellow text-xl font-bold hover:underline">
              🔁 Share
            </Link>
            <p className="text-sm text-gtaWhite">Collaborate with your crew on notes and sets.</p>
          </li>

          <li className="bg-gtaBlack border border-purple-600 p-4 rounded shadow-gta hover:scale-105 transition">
            <Link to="/planner" className="text-purple-400 text-xl font-bold hover:underline">
              📅 Planner
            </Link>
            <p className="text-sm text-gtaWhite">Keep your mission schedule tight and focused.</p>
          </li>

          <li className="bg-gtaBlack border border-indigo-500 p-4 rounded shadow-gta hover:scale-105 transition">
            <Link to="/tutor" className="text-indigo-300 text-xl font-bold hover:underline">
              🤖 AI Tutor
            </Link>
            <p className="text-sm text-gtaWhite">Ask your personal AI fixer for help anytime.</p>
          </li>
        </ul>
      </div>
    </div>
  );
}
