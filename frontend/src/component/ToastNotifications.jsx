import React, { useEffect } from 'react';

export default function ToastNotifications({ message, type, clearMessage }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clearMessage();
      }, 3000); // Clear toast after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [message, clearMessage]);

  if (!message) return null;

  const bgColor =
    type === 'error' ? 'bg-red-500' :
    type === 'success' ? 'bg-green-500' :
    'bg-gray-700';

  return (
    <div
      className={`${bgColor} fixed top-4 right-4 text-white px-4 py-2 rounded shadow-lg z-50`}
    >
      {message}
    </div>
  );
}