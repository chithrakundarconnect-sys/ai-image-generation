import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);

  // If user is logged in, render children components; otherwise redirect to login page
  return user ? children : <Navigate to="/login" replace />;
}