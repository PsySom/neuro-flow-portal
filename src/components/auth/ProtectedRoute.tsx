import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useSupabaseAuth();

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return children;
};

export default ProtectedRoute;
