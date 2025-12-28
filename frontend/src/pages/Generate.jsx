import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import PromptInput from './PromptInput';

export default function Generate() {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [promptText, setPromptText] = useState('');

  const handleGenerate = async (prompt) => {
    setLoading(true);
    setError('');
    setImageUrl('');
    setPromptText(prompt);

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
        setImageUrl(data.imageUrl);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Error contacting server');
    } finally {
      setLoading(false);
    }
  };

  // Save image to DB and trigger download
  const handleDownload = async () => {
    if (!imageUrl || !promptText) return;

    try {
      // Save image to gallery (your backend)
      const saveResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          prompt: promptText,
          imageUrl: imageUrl,
          tags: [], // optionally add tags
        }),
      });

      if (!saveResponse.ok) {
        const errData = await saveResponse.json();
        setError(errData.error || 'Failed to save image');
        return;
      }

      // Trigger browser download
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'generated-image.png'; // or dynamic filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      setError('Failed to save image or download');
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
          <button
            onClick={handleDownload}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Download & Save to Gallery
          </button>
        </div>
      )}
    </div>
  );
}