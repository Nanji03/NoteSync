import React, { useEffect, useState } from "react";

export default function SavedFlashcardSets() {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch("http://localhost:8000/api/flashcards/sets/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setSets(data);
      } catch (err) {
        console.error("Failed to load sets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSets();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">📚 Your Flashcard Sets</h1>

      {loading ? (
        <p>Loading...</p>
      ) : sets.length === 0 ? (
        <p className="text-gray-500">No flashcard sets saved yet.</p>
      ) : (
        sets.map((set) => (
          <div key={set.id} className="mb-6 border p-4 rounded bg-white shadow">
            <h2 className="text-2xl font-gta text-gtaAccent mb-2 border-b border-gtaAccent pb-1 shadow-gta uppercase tracking-wide">
            📂 {set.title}
            </h2>

            <ul className="space-y-2">
              {set.cards.map((card, index) => (
                <li key={index} className="border rounded p-3 bg-gray-50">
                  <strong>Q:</strong> {card.question}<br />
                  <strong>A:</strong> {card.answer}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
