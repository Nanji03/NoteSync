import React, { useState, useEffect } from "react";

export default function Tutor() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [typedAnswer, setTypedAnswer] = useState("");
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState(null);

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
    if (!question) return;
    setLoading(true);
    setAnswer("");
    setTypedAnswer("");
    setResources(null);

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("You're not logged in. No token found.");
      setLoading(false);
      return;
    }

    if (!character) {
      alert("Please select a character first.");
      setLoading(false);
      return;
    }

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
      try {
        const data = JSON.parse(text);
        if (data.answer) {
          setAnswer(data.answer);
        } else {
          alert(data.error || "Something went wrong.");
        }
      } catch (err) {
        console.error("❌ Failed to parse JSON:", err);
        alert("Server returned an invalid response. See console.");
      }
    } catch (err) {
      console.error("❌ Network or server error:", err);
      alert("Network error. See console.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (answer) {
      let index = 0;
      const interval = setInterval(() => {
        setTypedAnswer((prev) => {
          if (index === 0) {
            return answer.charAt(0);
          }
          return prev + answer.charAt(index);
        });
        index++;
        if (index >= answer.length) clearInterval(interval);
      }, 25);
      return () => clearInterval(interval);
    }
  }, [answer]);

  const saveQA = () => {
    const newEntry = { question, answer };
    setSaved((prev) => [...prev, newEntry]);
    alert("Q&A saved!");
  };

  const deleteQA = (index) => {
    setSaved((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-gta text-gtaAccent">🤖 Ask Your AI Tutor</h1>
        <button
          onClick={() => window.location.href = "/character"}
          className="bg-gtaAccent text-gtaBlack font-bold px-4 py-2 rounded shadow-gta hover:scale-105 transition-all"
        >
          🎭 Change Character
        </button>
      </div>
      {character && (
        <p className="text-sm text-gtaWhite/60 mb-4">
          🎮 Current Persona: <span className="text-gtaGreen">{character.name}</span>
        </p>
      )}
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask your question..."
        className="w-full p-4 rounded-lg text-black"
        rows={4}
      ></textarea>
      <button
        onClick={askTutor}
  className="bg-transparent border border-gtaAccent text-gtaAccent font-gta px-6 py-2 rounded shadow-gta hover:bg-gtaAccent hover:text-gtaBlack transition-all mb-6"
        disabled={loading}
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>
      {typedAnswer && (
        <div className="mt-6 bg-gtaBlack text-gtaWhite border border-gtaAccent p-4 rounded shadow-gta">
          <h2 className="font-gta text-xl text-gtaAccent mb-2">💬 AI Says:</h2>
          <p className="whitespace-pre-line font-mono tracking-wide leading-relaxed">
            {typedAnswer}
          </p>
          <button
            onClick={saveQA}
  className="bg-transparent border border-gtaAccent text-gtaAccent font-gta px-6 py-2 rounded shadow-gta hover:bg-gtaAccent hover:text-gtaBlack transition-all mb-6"
          >
            💾 Save This Q&A
          </button>
        </div>
      )}
      {saved.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-gta text-gtaAccent mb-2">📚 Saved Q&A</h3>
          {saved.map((entry, i) => (
            <div key={i} className="bg-gtaBlack text-gtaWhite border border-gtaWhite/20 p-4 rounded mb-4">
              <p><strong>Q:</strong> {entry.question}</p>
              <p><strong>A:</strong> {entry.answer}</p>
              <button
                onClick={() => deleteQA(i)}
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
