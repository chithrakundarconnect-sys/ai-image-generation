import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function ImageGallery() {
  const { user } = useContext(AuthContext);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    const fetchUserImages = async () => {
      if (!user) return;

      setLoading(true);
      setError('');

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/images/user/images`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          setImages(data);
        } else {
          setError(data.error || 'Failed to fetch your images');
        }
      } catch (err) {
        setError('Error fetching images');
      } finally {
        setLoading(false);
      }
    };

    fetchUserImages();
  }, [user]);

  const toggleFavorite = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/images/${id}/favorite`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to toggle favorite');

      const updated = await response.json();

      setImages((prev) =>
        prev.map((img) =>
          img._id === id ? { ...img, favorite: updated.favorite } : img
        )
      );
    } catch (err) {
      alert(err.message || 'Error toggling favorite');
    }
  };

  const deleteImage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/images/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to delete image');

      setImages((prev) => prev.filter((img) => img._id !== id));
    } catch (err) {
      alert(err.message || 'Error deleting image');
    }
  };

  // Optional: function to download image by URL
  const downloadImage = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredImages = showFavoritesOnly
    ? images.filter((img) => img.favorite)
    : images;

  if (!user) {
    return (
      <div className="mt-10 text-center text-red-500 font-semibold">
        Please login to view your gallery.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-4 text-blue-500 text-center">Loading your gallery...</div>
    );
  }

  if (error) {
    return <div className="mt-4 text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="mt-8 max-w-6xl mx-auto px-4">
      {/* Tabs */}
      <div className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => setShowFavoritesOnly(false)}
          className={`px-4 py-2 rounded ${
            !showFavoritesOnly
              ? 'bg-blue-600 text-white'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white'
          }`}
        >
          All Images
        </button>
        <button
          onClick={() => setShowFavoritesOnly(true)}
          className={`px-4 py-2 rounded ${
            showFavoritesOnly
              ? 'bg-blue-600 text-white'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white'
          }`}
        >
          Favorites
        </button>
      </div>

      {filteredImages.length === 0 ? (
        <div className="text-center text-gray-500">
          {showFavoritesOnly
            ? 'No favorite images found.'
            : 'No images found. Start generating some!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredImages.map((img) => (
            <div
              key={img._id}
              className="relative group border rounded shadow overflow-hidden bg-white dark:bg-gray-800"
              style={{ height: '250px' }}
            >
              <img
                src={
                  img.imageUrl.startsWith('http')
                    ? img.imageUrl
                    : img.imageUrl.startsWith('/uploads')
                    ? `${import.meta.env.VITE_BACKEND_URL}${img.imageUrl}`
                    : `${import.meta.env.VITE_BACKEND_URL}/uploads/${img.imageUrl}`
                }
                alt={img.prompt || 'Generated'}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 text-white z-10">
                <button
                  onClick={() => toggleFavorite(img._id)}
                  className={`px-3 py-1 rounded ${
                    img.favorite ? 'bg-yellow-400 text-black' : 'bg-white text-gray-800'
                  }`}
                  title={img.favorite ? 'Unfavorite' : 'Favorite'}
                >
                  {img.favorite ? '★' : '☆'}
                </button>

                <button
                  onClick={() => {
                    const url = img.imageUrl.startsWith('http')
                      ? img.imageUrl
                      : `${import.meta.env.VITE_BACKEND_URL}/uploads/${img.imageUrl}`;
                    navigator.clipboard.writeText(url);
                    alert('Image link copied!');
                  }}
                  className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-600"
                  title="Share"
                >
                  Share
                </button>

                <button
                  onClick={() => deleteImage(img._id)}
                  className="px-3 py-1 bg-red-500 rounded hover:bg-red-600"
                  title="Delete"
                >
                  Delete
                </button>

                <button
                  onClick={() => {
                    const url = img.imageUrl.startsWith('http')
                      ? img.imageUrl
                      : img.imageUrl.startsWith('/uploads')
                      ? `${import.meta.env.VITE_BACKEND_URL}${img.imageUrl}`
                      : `${import.meta.env.VITE_BACKEND_URL}/uploads/${img.imageUrl}`;
                    downloadImage(url, `${img._id}.jpg`);
                  }}
                  className="px-3 py-1 bg-green-500 rounded hover:bg-green-600"
                  title="Download"
                >
                  Download
                </button>
              </div>

              <div className="p-3 text-sm text-gray-700 dark:text-gray-300 absolute bottom-0 bg-white bg-opacity-80 dark:bg-gray-900 dark:bg-opacity-80 w-full">
                {img.prompt || 'No description'}
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(img.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}