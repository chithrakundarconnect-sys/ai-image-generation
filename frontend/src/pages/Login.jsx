import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  // ✅ Clear form and storage on mount
  useEffect(() => {
    setFormData({ email: '', password: '' });
    localStorage.removeItem('user');
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      login(data); // Save in context + localStorage
      navigate('/generate');
    } catch {
      setError('Something went wrong. Try again later.');
    }
  };

  return (
    <div className="animated-bg min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-sm z-10"
      >
        <h2 className="text-2xl mb-4 font-bold text-center text-gray-800 dark:text-white">
          Login
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 rounded border dark:bg-gray-700 dark:text-white"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 rounded border dark:bg-gray-700 dark:text-white"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}