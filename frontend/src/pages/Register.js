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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
    <label className="block text-lg mb-1 text-gtaAccent font-bold">Username</label>
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
    <label className="block text-lg mb-1 text-gtaAccent font-bold">Email</label>
    <input
      type="email"
      name="email"
      value={form.email}
      onChange={handleChange}
      className="w-full px-4 py-2 bg-gtaBlack text-gtaWhite border border-gtaAccent rounded shadow-gta"
      required
    />
  </div>
  <div>
    <label className="block text-lg mb-1 text-gtaAccent font-bold">Password</label>
    <input
      type="password"
      name="password"
      value={form.password}
      onChange={handleChange}
      className="w-full px-4 py-2 bg-gtaBlack text-gtaWhite border border-gtaAccent rounded shadow-gta"
      required
    />
  </div>
  <div>
    <label className="block text-lg mb-1 text-gtaAccent font-bold">Confirm Password</label>
    <input
      type="password"
      name="confirmPassword"
      value={form.confirmPassword}
      onChange={handleChange}
      className="w-full px-4 py-2 bg-gtaBlack text-gtaWhite border border-gtaAccent rounded shadow-gta"
      required
    />
  </div>
  <button
    type="submit"
    className="w-full py-2 bg-gtaAccent text-gtaBlack font-bold rounded shadow-gta hover:scale-105 transition-all"
  >
    📝 Register
  </button>
  <p className="text-sm text-center mt-4 text-gtaWhite/60">
    Already have an account?{' '}
    <a href="/login" className="text-gtaAccent hover:underline">Head to login</a>
  </p>
</form>

    </AuthFormWrapper>
  );
}
