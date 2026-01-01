
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, role, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !role) {
    return <Navigate to="/login" replace />;
  }

  const isAuthorized = allowedRoles.includes(role);

  if (!isAuthorized) {
    const roleRoutes: Record<UserRole, string> = {
      [UserRole.ADMIN]: '/admin',
      [UserRole.HOSPITAL]: '/hospital',
      [UserRole.BLOOD_BANK]: '/bloodbank',
      [UserRole.DONOR]: '/donor',
      [UserRole.PATIENT]: '/patient',
    };
    return <Navigate to={roleRoutes[role] || '/'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
