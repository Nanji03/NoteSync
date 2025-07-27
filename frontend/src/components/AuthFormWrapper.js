import { motion } from "framer-motion";
import "./AuthFormWrapper.css";

export default function AuthFormWrapper({ title, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-3xl bg-[#111] text-gtaWhite p-10 rounded-2xl shadow-gta border-2 border-gtaAccent font-gta animate-glow"
      >
        <h2 className="text-3xl font-bold text-center text-yellow-600 mb-8">{title}</h2>
        {children}
      </motion.div>
    </div>
  );
}
