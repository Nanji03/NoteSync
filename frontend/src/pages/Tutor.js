// Revised Tutor.js: Full AI-User chat log with saved conversation support
import React, { useState, useEffect } from "react";
import SpeechBubble from "../components/SpeechBubble";

export default function Tutor() {
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedConvos, setSavedConvos] = useState([]);

  const characterMap = {
    cj: {
      name: "CJ",
      tone:
        "You're CJ, a streetwise tutor from San Andreas. Explain with swagger and real-life examples.",
    },
    professor: {
      name: "Professor Payne",
      tone:
        "You're Professor Payne, a strict but clear academic. Use formal tone and precise logic.",
    },
    neuro: {
      name: "Mr. Neuro",
      tone:
        "You're Mr. Neuro, a sci-fi genius alien tutor. Explain using metaphors and future-world logic.",
    },
  };

  const characterId = localStorage.getItem("selectedCharacter");
  const character = characterMap[characterId];

  const askTutor = async () => {
    if (!question.trim()) return;
    const token = localStorage.getItem("accessToken");
    if (!token || !character) return alert("Missing login or character.");

    setLoading(true);
    const prompt = `${character.tone}\n\nQuestion: ${question}`;

    try {
      const res = await fetch("/api/tutor/ask/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: prompt }),
      });

      const text = await res.text();
      const data = JSON.parse(text);
      const answer = data.answer || "(No answer returned)";

      setChat((prev) => [...prev, { sender: "user", text: question }, { sender: "ai", text: answer }]);
      setQuestion("");
    } catch (err) {
      console.error(err);
      alert("Error during AI request.");
    } finally {
      setLoading(false);
    }
  };

  // const saveChat = () => {
  //   if (chat.length === 0) return alert("No conversation to save.");
  //   setSavedConvos((prev) => [...prev, chat]);
  //   alert("📁 Conversation saved!");
  // };

  const deleteSaved = (i) => {
    setSavedConvos((prev) => prev.filter((_, idx) => idx !== i));
  };
const saveChatToBackend = async () => {
  if (chat.length === 0) return alert("No conversation to save.");
  const token = localStorage.getItem("accessToken");
  const title = prompt("Give your convo a title:");
  if (!title) return;

  try {
    const res = await fetch("http://localhost:8000/api/tutor/conversations/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, messages: chat }),
    });

    const data = await res.json();
    alert(data.message || "Conversation saved!");
  } catch (err) {
    alert("Failed to save conversation.");
    console.error(err);
  }
};

  return (
    <div className="p-6 min-h-screen bg-gtaBlack text-gtaWhite">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-gta text-gtaAccent">🤖 AI Tutor Chat</h1>
        <button
          onClick={() => window.location.href = "/character"}
  className="bg-transparent border border-gtaAccent text-gtaAccent font-gta px-6 py-2 rounded shadow-gta hover:bg-gtaAccent hover:text-gtaBlack transition-all mb-6"
        >
          🎭 Change Character
        </button>
        <button
      onClick={() => window.location.href = "/conversations"}
  className="bg-transparent border border-gtaAccent text-gtaAccent font-gta px-6 py-2 rounded shadow-gta hover:bg-gtaAccent hover:text-gtaBlack transition-all mb-6"
    >
      🗂 View Saved Chats
    </button>
      </div>
      {character && (
        <p className="text-sm mb-4 text-gtaWhite/60">
          Current Persona: <span className="text-gtaGreen">{character.name}</span>
        </p>
      )}

      <div className="bg-gtaWhite/10 p-4 rounded-lg h-[400px] overflow-y-auto mb-4 border border-gtaAccent">
        {chat.map((entry, i) => (
          <div key={i} className={`mb-3 ${entry.sender === "user" ? "text-right" : "text-left"}`}>
            <SpeechBubble text={entry.text} isUser={entry.sender === "user"} />
          </div>
        ))}
      </div>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Type your question like texting..."
        className="w-full p-4 mb-4 rounded text-black"
        rows={3}
      />

      <div className="flex gap-4">
        <button
          onClick={askTutor}
          disabled={loading}
  className="bg-transparent border border-gtaAccent text-gtaAccent font-gta px-6 py-2 rounded shadow-gta hover:bg-gtaAccent hover:text-gtaBlack transition-all mb-6"
        >
          {loading ? "Responding..." : "Send"}
        </button>
        <button
          onClick={saveChatToBackend}
  className="bg-transparent border border-gtaAccent text-gtaAccent font-gta px-6 py-2 rounded shadow-gta hover:bg-gtaAccent hover:text-gtaBlack transition-all mb-6"
        >
          Save Conversation
        </button>
      </div>

      {savedConvos.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl text-gtaAccent font-gta mb-4">📚 Saved Conversations</h3>
          {savedConvos.map((convo, i) => (
            <div key={i} className="bg-gtaBlack border border-gtaWhite/20 p-4 mb-6 rounded shadow">
              <ul className="space-y-2">
                {convo.map((msg, j) => (
                  <li key={j}>
                    <strong>{msg.sender === "user" ? "You" : character.name}:</strong> {msg.text}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => deleteSaved(i)}
                className="mt-2 text-sm text-red-400 hover:underline"
              >
                ❌ Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
