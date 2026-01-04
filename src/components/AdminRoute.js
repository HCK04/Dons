import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function AdminRoute({ children }) {
  const { currentUser } = useAppContext();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}
