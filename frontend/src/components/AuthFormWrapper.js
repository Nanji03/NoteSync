export default function AuthFormWrapper({ title, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white">
<div className="bg-[#111] text-gtaWhite p-8 rounded-xl shadow-gta border-2 border-gtaAccent font-gta">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
}
