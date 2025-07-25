import AuthFormWrapper from '../components/AuthFormWrapper';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GiPistolGun } from 'react-icons/gi';
import { FaUserPlus } from 'react-icons/fa';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("🚫 Passwords don't match, homie.");
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/register/', {
        username: form.username,
        email: form.email,
        password: form.password
      });

      alert('✅ Mission complete! Account created.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || '❌ Registration failed, try again.');
    }
  };

  return (
    <AuthFormWrapper title="📝 Sign Up for NoteSync">
      <form onSubmit={handleSubmit} className="space-y-4 text-white font-gta">
        <div className="border-2 border-yellow-400 rounded-xl p-3 shadow-gta-box">
          <label className="block text-sm mb-1 uppercase tracking-widest">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-700 rounded-md bg-black text-white focus:ring-2 focus:ring-yellow-400 shadow-inner"
            required
          />
        </div>
        <div className="border-2 border-yellow-400 rounded-xl p-3 shadow-gta-box">
          <label className="block text-sm mb-1 uppercase tracking-widest">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-700 rounded-md bg-black text-white focus:ring-2 focus:ring-yellow-400 shadow-inner"
            required
          />
        </div>
        <div className="border-2 border-yellow-400 rounded-xl p-3 shadow-gta-box">
          <label className="block text-sm mb-1 uppercase tracking-widest">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-700 rounded-md bg-black text-white focus:ring-2 focus:ring-yellow-400 shadow-inner"
            required
          />
        </div>
        <div className="border-2 border-yellow-400 rounded-xl p-3 shadow-gta-box">
          <label className="block text-sm mb-1 uppercase tracking-widest">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-700 rounded-md bg-black text-white focus:ring-2 focus:ring-yellow-400 shadow-inner"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 shadow-gta-btn"
        >
          <FaUserPlus /> Register
        </button>
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-yellow-300 underline hover:text-yellow-200 transition-all"
          >
            Head to login 🚗
          </a>
        </p>
      </form>
    </AuthFormWrapper>
  );
}
