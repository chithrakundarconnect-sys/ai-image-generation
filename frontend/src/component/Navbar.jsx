import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { AuthContext } from '../context/AuthContext';
import { UserCircle2 } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const linkClass = (path) =>
    location.pathname === path
      ? 'text-blue-600 font-semibold underline'
      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center px-6">
      <div className="flex gap-6 items-center">
        <Link to="/" className="text-xl font-bold text-blue-600 dark:text-white">
          AI Image Generator
        </Link>

        {user ? (
          <>
            <Link className={linkClass('/generate')} to="/generate">
              Generate
            </Link>
            {/* Removed Gallery link */}
            <Link className={linkClass('/dashboard')} to="/dashboard">
              Dashboard
            </Link>
            {/* Profile Icon + Username */}
            <Link
              to="/profile"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600"
            >
              <UserCircle2 className="w-6 h-6" />
              <span className="text-sm font-medium">{user.username}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-700 dark:text-gray-300 hover:text-red-600 font-semibold"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className={linkClass('/login')} to="/login">
              Login
            </Link>
            <Link className={linkClass('/register')} to="/register">
              Register
            </Link>
          </>
        )}
      </div>

      <DarkModeToggle />
    </nav>
  );
}