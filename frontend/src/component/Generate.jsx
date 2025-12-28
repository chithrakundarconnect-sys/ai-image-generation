import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import PromptInput from './PromptInput'; // assuming PromptInput is in the same folder

export default function Generate() {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async (prompt) => {
    setLoading(true);
    setError('');
    setImageUrl('');

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (response.ok) {
        setImageUrl(data.imageUrl);  // Correct key here
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Error contacting server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl mb-2 font-bold">Generate Image</h2>

      {user && (
        <p className="mb-4 text-green-600 font-semibold">
          Welcome back, {user.name || 'User'}!
        </p>
      )}

      <PromptInput onGenerate={handleGenerate} loading={loading} />

      {error && <div className="text-red-500 mt-3">{error}</div>}

      {imageUrl && (
        <div className="mt-4">
          <img src={imageUrl} alt="Generated" className="w-full h-auto rounded shadow" />
        </div>
      )}
    </div>
  );
}