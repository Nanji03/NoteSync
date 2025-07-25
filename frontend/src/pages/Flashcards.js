import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Flashcards() {
  const [file, setFile] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [flipStates, setFlipStates] = useState([]);
  const [savedSets, setSavedSets] = useState([]);
  const [setTitle, setSetTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchSavedSets = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await axios.get('http://localhost:8000/api/flashcards/sets/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedSets(res.data);
    } catch (err) {
      console.error('Failed to load saved sets:', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchSavedSets();
  }, [navigate]);

  const handleUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (!file || !token) return alert('Login and select a file.');

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/flashcards/generate/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const raw = res.data.flashcards;
      const parsed = raw
        .split(/Q:/)
        .map(chunk => chunk.trim())
        .filter(Boolean)
        .map(chunk => {
          const [qRaw, aRaw] = chunk.split(/A:/);
          const question = qRaw?.trim() || "Q (missing)";
          let answer = aRaw?.trim() || "A (missing or unclear)";

          if (answer.toLowerCase() === question.toLowerCase() || answer.length < 4) {
            answer = "This answer could not be generated properly.";
          }

          return { question, answer };
        });

      setFlashcards(parsed);
      setFlipStates(Array(parsed.length).fill(false));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to generate flashcards.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFlip = (index) => {
    const updated = [...flipStates];
    updated[index] = !updated[index];
    setFlipStates(updated);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("accessToken");
    if (!setTitle.trim()) return alert("Please enter a title for your flashcard set.");
    try {
      const res = await fetch("http://localhost:8000/api/flashcards/save/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: setTitle, cards: flashcards }),
      });
      const data = await res.json();
      alert(data.message || "Flashcards saved!");
      setSetTitle('');
      fetchSavedSets();
    } catch (err) {
      alert("Failed to save flashcards.");
      console.error(err);
    }
  };

  const handleDeleteSet = async (setId) => {
    const token = localStorage.getItem('accessToken');
    if (!window.confirm('Are you sure you want to delete this flashcard set?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/flashcards/sets/${setId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedSets(savedSets.filter(set => set.id !== setId));
    } catch (err) {
      alert('Failed to delete flashcard set.');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gtaBlack text-gtaWhite">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-gta text-gtaAccent mb-6">🧠 CJ's Flashcard Mission</h1>

        <h2 className="text-2xl font-gta text-gtaAccent mb-6">📂 Saved Flashcard Sets</h2>
        <ul className="space-y-4 mb-10">
          {savedSets.length === 0 ? (
            <p className="text-gtaWhite/60">You haven’t saved any flashcard sets yet.</p>
          ) : (
            savedSets.map((set) => (
              <li key={set.id} className="bg-gtaBlack border border-gtaWhite/20 p-4 rounded shadow-gta">
                <div className="flex justify-between items-center mb-2">
                <h3 className="text-2xl font-gta text-gtaAccent mb-1 border-b border-gtaAccent pb-1 shadow-gta uppercase tracking-wide">
                📘 {set.title}
                </h3>
                  <button
                    onClick={() => handleDeleteSet(set.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    💥 Delete
                  </button>
                </div>
                <ul className="pl-4 space-y-1">
                  {set.cards.map((card, i) => (
                    <li key={i}>
                      <strong>Q:</strong> {card.question} <br />
                      <strong>A:</strong> {card.answer}
                    </li>
                  ))}
                </ul>
              </li>
            ))
          )}
        </ul>

        <form onSubmit={handleUpload} className="space-y-6 mb-10">
          <div>
            <label className="block text-sm text-gtaAccent mb-6">Select Note File</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".pdf,.doc,.docx,.txt"
              className="w-full bg-gtaBlack text-gtaWhite border border-gtaAccent px-2 py-1 rounded"
              required
            />
          </div>

          <button
  type="submit"
  className="bg-transparent border border-gtaAccent text-gtaAccent font-gta px-6 py-2 rounded shadow-gta hover:bg-gtaAccent hover:text-gtaBlack transition-all mb-6"
>
  {loading ? 'Generating...' : 'Generate Flashcards'}
</button>

        </form>

        {flashcards.length > 0 && (
          <div>
            <h2 className="text-2xl font-gta text-gtaAccent mb-4">🃏 Click a Card to Flip</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {flashcards.map((card, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleFlip(idx)}
                  style={{ perspective: '1000px' }}
                  className="cursor-pointer"
                >
                  <div
                    className={`relative w-full h-48 transition-transform duration-500 ${
                      flipStates[idx] ? 'transform rotate-y-180' : 'transform rotate-y-0'
                    }`}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Front */}
                    <div
                      className="absolute w-full h-full flex items-center justify-center p-4 bg-gtaAccent text-gtaBlack font-bold rounded-xl"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <p className="text-center">{card.question}</p>
                    </div>
                    {/* Back */}
                    <div
                      className="absolute w-full h-full flex items-center justify-center p-4 bg-gtaBlack text-gtaWhite border border-gtaAccent rounded-xl"
                      style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                    >
                      <p className="text-center text-sm">{card.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center space-y-4">
              <input
                type="text"
                value={setTitle}
                onChange={(e) => setSetTitle(e.target.value)}
                placeholder="Enter a title for your flashcard set"
                className="w-full p-2 bg-gtaBlack text-gtaWhite border border-gtaAccent rounded"
                required
              />
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gtaGreen text-gtaBlack font-bold rounded shadow-gta hover:scale-105"
              >
                💾 Save All Flashcards
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
