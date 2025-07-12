import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import LoadingScreen from '../ui/LoadingScreen';

export default function AuthGuard({ children }) {
  const { user, loading } = useAuthStore();
  const location = useLocation();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    // Redirect to login but save the location they were trying to access
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  
  return children;
}