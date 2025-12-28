import React, { useState } from 'react';

export default function PromptInput({ onGenerate, loading }) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
      setPrompt('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your image prompt..."
        disabled={loading}
        className="w-full px-4 py-2 border rounded shadow-sm 
                   focus:outline-none focus:ring focus:border-blue-300 
                   disabled:opacity-50
                   bg-white text-black 
                   dark:bg-gray-800 dark:text-white dark:border-gray-600"
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full bg-blue-500 text-white py-2 rounded 
                   hover:bg-blue-600 disabled:opacity-50 
                   dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        {loading ? 'Generating...' : 'Generate Image'}
      </button>
    </form>
  );
}