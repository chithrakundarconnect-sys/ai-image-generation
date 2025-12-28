import React from 'react';

export default function WelcomeMessage() {
  return (
    <div className="mb-6 p-4 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-center shadow">
      <h2 className="text-2xl font-semibold">Welcome to AI Image Generator!</h2>
      <p className="mt-2">Create amazing AI-generated images by entering your prompts.</p>
    </div>
  );
}