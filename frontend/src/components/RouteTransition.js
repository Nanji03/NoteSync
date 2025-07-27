import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const routeMessages = {
  "/tutor": "📡 Connecting to your AI tutor…",
  "/planner": "📆 Loading your study planner…",
  "/flashcards": "🃏 Shuffling your flashcards…",
  "/dashboard": "📊 Preparing your dashboard…",
  "/notes": "📂 Syncing uploaded notes…",
  "/login": "🔐 Logging you in…",
  "/register": "📝 Creating your account…",
  "/conversations": "🗂 Loading saved conversations…",
  "/quiz": "🎯 Deploying memory challenge protocol…",

  "/": "🔄 Loading workspace…"
};

export default function RouteTransition({ isVisible }) {
  const location = useLocation();
  const message = routeMessages[location.pathname] || "🔄 Loading NoteSync…";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
        >
          <div className="text-white text-2xl font-gta text-center animate-pulse">
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
