import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ImageGallery from './ImageGallery';

export default function Gallery() {
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
      <div className="mt-4 text-blue-500 text-center">
        Loading your gallery...
      </div>
    );
  }

  if (error) {
    return <div className="mt-4 text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="mt-8 max-w-6xl mx-auto">
      {/* Filter Tabs */}
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

      {/* Gallery */}
      <ImageGallery
        images={filteredImages}
        toggleFavorite={toggleFavorite}
        deleteImage={deleteImage}
        showFavoritesOnly={showFavoritesOnly}
      />
    </div>
  );
}