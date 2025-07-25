import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const characters = [
  {
    id: "cj",
    name: "CJ",
    role: "Streetwise Explainer",
    emoji: "🕵️",
    description: "Breaks it down like it’s the streets of Los Santos.",
  },
  {
    id: "professor",
    name: "Professor Payne",
    role: "Strict Academic",
    emoji: "🧑‍🏫",
    description: "Formal, direct, textbook-style explanations.",
  },
  {
    id: "neuro",
    name: "Mr. Neuro",
    role: "Sci-fi AI Genius",
    emoji: "👽",
    description: "Talks like a friendly alien with high-level metaphors.",
  },
];

export default function CharacterSelect() {
  const navigate = useNavigate();

  const handleSelect = (characterId) => {
    localStorage.setItem("selectedCharacter", characterId);
    navigate("/tutor");
  };

  return (
    <div className="min-h-screen bg-gtaBlack text-gtaWhite font-gta flex flex-col items-center justify-center p-6">
      <h1 className="text-5xl mb-6 text-gtaAccent drop-shadow-gta">
        Choose Your Persona
      </h1>
      <p className="mb-10 text-lg text-gtaWhite/80">
        This will guide your AI tutor's tone & style.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {characters.map((char) => (
          <motion.div
            key={char.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gtaBlack border border-gtaAccent p-6 rounded-lg shadow-gta text-center cursor-pointer hover:border-gtaGreen transition-all"
            onClick={() => handleSelect(char.id)}
          >
            <div className="text-6xl mb-2">{char.emoji}</div>
            <h2 className="text-2xl text-gtaAccent font-gta mb-1">{char.name}</h2>
            <p className="text-sm text-gtaGreen font-bold mb-2">{char.role}</p>
            <p className="text-gtaWhite/70 text-sm">{char.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
