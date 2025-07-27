import { useState, useEffect } from "react";

export default function QuizMission() {
  const [source, setSource] = useState(""); // "notes" or "flashcards"
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showFinishMessage, setShowFinishMessage] = useState(false);

  const token = localStorage.getItem("accessToken");

  const loadItems = async () => {
    const url = source === "notes"
      ? "http://localhost:8000/api/notes/"
      : "http://localhost:8000/api/flashcards/sets/";

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Failed to load content:", err);
    }
  };

  useEffect(() => {
    setItems([]);
    setSelectedId(null);
    setQuestions([]);
    setCurrent(0);
    setShowFinishMessage(false);
    if (source) loadItems();
  }, [source]);

  const startQuiz = async () => {
    if (!selectedId) return alert("Please select a content item.");
    setLoading(true);
    setQuestions([]);
    setCurrent(0);
    setShowFinishMessage(false);

    try {
      const res = await fetch("http://localhost:8000/api/quiz/generate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          source,
          ...(source === "notes" ? { note_id: selectedId } : { set_id: selectedId }),
        }),
      });

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        alert("⚠️ Could not generate quiz questions. Try another item.");
      }
    } catch (err) {
      console.error("Failed to generate quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (current + 1 === questions.length) {
      setShowFinishMessage(true);
    } else {
      setCurrent((prev) => prev + 1);
    }
    setAnswer("");
  };

  const resetQuiz = () => {
    setQuestions([]);
    setCurrent(0);
    setAnswer("");
    setShowFinishMessage(false);
  };

  return (
    <div className="min-h-screen bg-gtaBlack text-gtaWhite p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-gta text-gtaAccent mb-4">🎯 AI Quiz Mission</h1>

      {!questions.length && !showFinishMessage ? (
        <>
          <p className="mb-6 text-gtaWhite/70">Select a content type to start your quiz mission.</p>

          <div className="flex gap-4 mb-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="source"
                value="notes"
                checked={source === "notes"}
                onChange={() => setSource("notes")}
              />
              <span>📂 Notes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="source"
                value="flashcards"
                checked={source === "flashcards"}
                onChange={() => setSource("flashcards")}
              />
              <span>🧠 Flashcards</span>
            </label>
          </div>

          {items.length > 0 && (
            <div className="mb-6">
              <label className="block mb-2 font-bold text-gtaAccent">Choose your content:</label>
              <select
                value={selectedId || ""}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full p-2 bg-gtaBlack border border-gtaAccent rounded text-gtaWhite"
              >
                <option value="">-- Select --</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title || item.name || `Untitled ${source}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={startQuiz}
            disabled={loading || !selectedId}
            className="bg-transparent border border-gtaAccent text-gtaAccent font-gta px-6 py-2 rounded shadow-gta hover:bg-gtaAccent hover:text-gtaBlack transition-all mb-6"
          >
            🚀 Start Quiz
          </button>
        </>
      ) : showFinishMessage ? (
        <div className="text-center mt-10">
          <h2 className="text-2xl font-gta text-gtaAccent mb-4">✅ Mission Complete!</h2>
          <p className="text-gtaWhite/70 mb-6">You finished the quiz. Great job!</p>
          <button
            onClick={resetQuiz}
            className="bg-gtaAccent text-gtaBlack font-bold px-6 py-2 rounded shadow-gta hover:scale-105 transition-all"
          >
            🔁 Take Another Quiz
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-gta text-gtaAccent mb-2">Question {current + 1}</h2>
          <p className="mb-4">{questions[current].q}</p>

          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full mb-4 p-2 bg-gtaBlack text-gtaWhite border border-gtaAccent rounded"
            placeholder="Your answer here..."
          />

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="bg-gtaAccent text-gtaBlack font-bold px-6 py-2 rounded shadow-gta hover:scale-105 transition-all"
            >
              {current + 1 === questions.length ? "Finish" : "Next"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
