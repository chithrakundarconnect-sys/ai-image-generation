// Dashboard.jsx
import React from 'react';
import ImageGallery from '../component/ImageGallery'; // rename import to actual component

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Total Images</h2>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="bg-green-100 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Favorites</h2>
          <p className="text-2xl font-bold">5</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Tags Used</h2>
          <p className="text-2xl font-bold">8</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Last Upload</h2>
          <p className="text-2xl font-bold">2h ago</p>
        </div>
      </div>

      {/* User Gallery */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">My Gallery</h2>
        <ImageGallery />
      </section>
    </div>
  );
}