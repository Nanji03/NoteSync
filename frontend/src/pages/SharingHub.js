import React, { useState, useEffect } from "react";
import Share from "./Share";
import IncomingRequests from "./IncomingRequests";
import AcceptedShares from "./AcceptedShares";

export default function SharingHub() {
  const [activeTab, setActiveTab] = useState("send");

  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [userNotes, setUserNotes] = useState([]);
  const [userFlashcardSets, setUserFlashcardSets] = useState([]);

  // Get current user
  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/current-user/");
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Error fetching current user", err);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await fetch("/api/all-users/");
      const data = await res.json();
      setAllUsers(data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const fetchUserNotes = async () => {
    try {
      const res = await fetch("/notes/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      const data = await res.json();
      setUserNotes(data);
    } catch (err) {
      console.error("Error fetching notes", err);
    }
  };

  const fetchFlashcardSets = async () => {
    try {
      const res = await fetch("/flashcards/sets/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      const data = await res.json();
      setUserFlashcardSets(data);
    } catch (err) {
      console.error("Error fetching flashcards", err);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchAllUsers();
    fetchUserNotes();
    fetchFlashcardSets();
  }, []);

  const tabs = {
    send: (
      <Share
        user={user}
        allUsers={allUsers}
        userNotes={userNotes}
        userFlashcardSets={userFlashcardSets}
      />
    ),
    incoming: <IncomingRequests />,
    accepted: <AcceptedShares />,
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">📤 Sharing Hub</h1>

      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "send"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("send")}
        >
          ✉️ Send
        </button>

        <button
          className={`px-4 py-2 rounded ${
            activeTab === "incoming"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("incoming")}
        >
          📥 Incoming
        </button>

        <button
          className={`px-4 py-2 rounded ${
            activeTab === "accepted"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("accepted")}
        >
          ✅ Accepted
        </button>
      </div>

      {user ? tabs[activeTab] : <p>Loading user...</p>}
    </div>
  );
}
