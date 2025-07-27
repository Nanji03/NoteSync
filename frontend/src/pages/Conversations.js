// Conversations.js — View & toggle saved conversation sets
import React, { useEffect, useState } from "react";

export default function Conversations() {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState([]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("http://localhost:8000/api/tutor/conversations/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSets(data);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteConvo = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this convo?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("accessToken");
      await fetch(`http://localhost:8000/api/tutor/conversations/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setSets((prev) => prev.filter((set) => set.id !== id));
      setExpandedIds((prev) => prev.filter((eid) => eid !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Error deleting conversation");
    }
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className="min-h-screen bg-gtaBlack text-gtaWhite p-6">
      <h1 className="text-3xl font-gta text-gtaAccent mb-6">🗂️ Saved AI Conversations</h1>
      {loading ? (
        <p>Loading...</p>
      ) : sets.length === 0 ? (
        <p className="text-gtaWhite/60">No conversations saved yet.</p>
      ) : (
        <ul className="space-y-6">
          {sets.map((set, index) => (
            <li key={set.id} className="border-b border-gtaWhite/20 pb-2">
              <div className="flex justify-between items-center">
                <span className="text-lg font-gta">
                  {index + 1}. {set.title || "Untitled Session"}
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => toggleExpand(set.id)}
  className="bg-transparent border border-gtaAccent text-gtaAccent font-gta px-6 py-2 rounded shadow-gta hover:bg-gtaAccent hover:text-gtaBlack transition-all mb-6"
                  >
                    {expandedIds.includes(set.id) ? "🔽 Hide" : "🗂 View"}
                  </button>
                  <button
                    onClick={() => deleteConvo(set.id)}
                    className="text-sm text-red-400 hover:underline"
                  >
                    ❌ Delete
                  </button>
                </div>
              </div>
              {expandedIds.includes(set.id) && (
                <ul className="mt-3 ml-4 space-y-1 text-sm">
                  {set.messages.map((msg, i) => (
                    <li key={i}>
                      <strong>{msg.sender === "user" ? "You" : "AI"}:</strong> {msg.text}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
