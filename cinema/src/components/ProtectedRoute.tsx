import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  role: 'admin' | 'cliente';
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ role, children }) => {
  const { user } = useAuth();

  if (!user || user.role !== role) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
