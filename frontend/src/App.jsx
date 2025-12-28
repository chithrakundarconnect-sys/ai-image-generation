import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Gallery from './component/Gallery';
import Dashboard from './pages/Dashboard';
import PromptInput from './component/PromptInput';
import ToastNotifications from './component/ToastNotifications';
import Navbar from './component/Navbar';
import PrivateRoute from './component/PrivateRoute';
import Profile from './pages/Profile'; // Import Profile page

function Generate() {
  const [imageUrl, setImageUrl] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [toast, setToast] = React.useState({ message: '', type: '' });

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const clearToast = () => {
    setToast({ message: '', type: '' });
  };

  const handleGenerate = async (prompt) => {
    setLoading(true);

    // ✅ FIX: Read token from "user" object in localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;

    if (!token) {
      showToast('❌ Please login again', 'error');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // ✅ Correct Authorization header
          },
          body: JSON.stringify({ prompt }),
        }
      );

      const data = await response.json();
      console.log('Returned image path:', data.image);

      if (response.ok) {
        setImageUrl(`${import.meta.env.VITE_BACKEND_URL}${data.image}`);
        showToast('✅ Image generated successfully!', 'success');
      } else {
        showToast(data.error || '❌ Image generation failed.', 'error');
      }
    } catch (error) {
      showToast('🚨 Server error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-6 transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        AI Image Generator
      </h1>

      <PromptInput onGenerate={handleGenerate} loading={loading} />

      {loading && (
        <div className="mt-4 text-blue-600 animate-pulse text-center">
          Generating image...
        </div>
      )}

      {imageUrl && !loading && (
        <div className="mt-6 flex flex-col items-center gap-4">
          <img
            src={imageUrl}
            alt="Generated"
            className="rounded shadow-md w-96 h-auto"
          />
          <button
            onClick={() => {
              const link = document.createElement('a');
              link.href = imageUrl;
              link.download = 'generated-image.png';
              link.click();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Download Image
          </button>
        </div>
      )}

      <ToastNotifications
        message={toast.message}
        type={toast.type}
        clearMessage={clearToast}
      />
    </div>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />

        <Route
          path="/generate"
          element={
            <PrivateRoute>
              <Generate />
            </PrivateRoute>
          }
        />

        <Route
          path="/gallery"
          element={
            <PrivateRoute>
              <Gallery />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}