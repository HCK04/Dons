import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function OrgRoute({ children }) {
  const { currentUser } = useAppContext();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== 'organisation' && currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
}
