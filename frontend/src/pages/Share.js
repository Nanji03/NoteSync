import React, { useState, useEffect } from "react";

const Share = ({ user, userNotes = [], userFlashcardSets = [] }) => {
  const [recipient, setRecipient] = useState("");
  const [contentType, setContentType] = useState("notes");
  const [contentId, setContentId] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/all-users/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const data = await res.json();
        setAllUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleShare = async (e) => {
    e.preventDefault();

    if (!recipient || !contentId) {
      alert("Please fill in all fields.");
      return;
    }

    const payload = {
      from_user: user?.username || "unknown",
      to_user: recipient,
      content_type: contentType,
      content_id: contentId,
    };

    try {
      const res = await fetch("/api/share-request/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data.message || "Share request sent!");
    } catch (err) {
      alert("Failed to send share request. Please try again.");
      console.error(err);
    }
  };

  const getAvailableContent = () => {
    return contentType === "notes" ? userNotes : userFlashcardSets;
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gtaBlack text-gtaWhite rounded shadow-gta">
      <h2 className="text-3xl font-gta text-gtaAccent mb-6">
        📤 Share Content 
      </h2>

      <form onSubmit={handleShare} className="space-y-6">
        <div>
          <label className="block text-sm text-gtaGreen mb-1">
            👤 Select a User
          </label>
          <input
            list="user-options"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Type recipient's username"
            className="w-full p-2 bg-gtaBlack text-gtaWhite border border-gtaAccent rounded"
            required
          />
          <datalist id="user-options">
            {Array.isArray(allUsers) &&
              allUsers
                .filter((u) => u.username !== user.username)
                .map((u) => (
                  <option key={u.id} value={u.username} />
                ))}
          </datalist>
        </div>

        <div>
          <label className="block text-sm text-gtaGreen mb-1">
            🗂️ Content Type
          </label>
          <select
            value={contentType}
            onChange={(e) => {
              setContentType(e.target.value);
              setContentId("");
            }}
            className="w-full p-2 bg-gtaBlack text-gtaWhite border border-gtaAccent rounded"
          >
            <option value="notes">Notes</option>
            <option value="flashcards">Flashcard Sets</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gtaGreen mb-1">
            📑 Select Content
          </label>
          <input
            list="content-options"
            value={contentId}
            onChange={(e) => setContentId(e.target.value)}
            placeholder="Type or select content ID"
            className="w-full p-2 bg-gtaBlack text-gtaWhite border border-gtaAccent rounded"
            required
          />
          <datalist id="content-options">
            {getAvailableContent().map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </datalist>
        </div>

        <button
          type="submit"
  className="bg-transparent border border-gtaAccent text-gtaAccent font-gta px-6 py-2 rounded shadow-gta hover:bg-gtaAccent hover:text-gtaBlack transition-all mb-6"
        >
          🚀 Send Share Request
        </button>
      </form>
    </div>
  );
};

export default Share;
