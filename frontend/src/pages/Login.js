import AuthFormWrapper from '../components/AuthFormWrapper';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8000/api/login/', {
        username: form.username,
        password: form.password
      });

      localStorage.setItem('accessToken', res.data.access);
      localStorage.setItem('refreshToken', res.data.refresh);
      localStorage.setItem('username', res.data.user); // If you want to use refresh later      alert('🎮 Welcome back to NoteSync!');
      navigate('/dashboard'); // Or wherever your logged-in users go
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    
<div className=" bg-gtaBlack">

    <AuthFormWrapper title="🔑 Login to NoteSync">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg mb-2 text-gtaAccent font-bold">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gtaBlack text-gtaWhite border border-gtaAccent rounded shadow-gta"
            required
          />
        </div>
        <div>
          <label className="block text-lg mb-2 text-gtaAccent font-bold">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gtaBlack text-gtaWhite border border-gtaAccent rounded shadow-gta"
            required
          />
        </div>
        <button 
          type="submit"
          className="w-full py-2 bg-gtaAccent text-gtaBlack font-bold rounded shadow-gta hover:scale-105 transition-all"
        >
          🚪 Login
        </button>
        <p className="text-sm text-center mt-4 text-gtaWhite/60">
          Don’t have an account?{' '}
          <a href="/register" className="text-gtaAccent hover:underline">Create one</a>
        </p>
      </form>
      </AuthFormWrapper>
    </div>
  );
}
