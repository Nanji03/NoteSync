export default function Home() {
  return (
    <div className="min-h-screen bg-gtaBlack text-gtaWhite px-6 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-gta text-gtaAccent mb-4">
          Welcome to NoteSync 🧠
        </h1>
        <p className="text-lg text-gtaWhite/70 mb-8">
          Your all-in-one academic platform — now with mission vibes and street-smart studying.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto mt-10">
        <div className="bg-gtaBlack border border-gtaAccent p-6 rounded-lg shadow-gta">
          <h2 className="text-xl font-gta text-gtaGreen mb-2">📝 Upload Mission Notes</h2>
          <p className="text-gtaWhite/80">
            Organize your course intelligence, upload documents, and access your mission logs anytime.
          </p>
        </div>

        <div className="bg-gtaBlack border border-gtaAccent p-6 rounded-lg shadow-gta">
          <h2 className="text-xl font-gta text-gtaGreen mb-2">🧠 Smart Flashcard Arsenal</h2>
          <p className="text-gtaWhite/80">
            Turn intel into training cards. Activate your recall and level up your study loadout.
          </p>
        </div>

        <div className="bg-gtaBlack border border-gtaAccent p-6 rounded-lg shadow-gta">
          <h2 className="text-xl font-gta text-gtaGreen mb-2">🔁 Share with Your Crew</h2>
          <p className="text-gtaWhite/80">
            Share flashcards and notes with classmates like a true San Andreas scholar.
          </p>
        </div>

        <div className="bg-gtaBlack border border-gtaAccent p-6 rounded-lg shadow-gta">
          <h2 className="text-xl font-gta text-gtaGreen mb-2">📅 Study Plan Control Panel</h2>
          <p className="text-gtaWhite/80">
            Schedule your study time like prepping for a heist. Topics, time, and total focus.
          </p>
        </div>
      </div>
    </div>
  );
}
