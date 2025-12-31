
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    // Redirect to their respective dashboard
    const roleRoutes: Record<UserRole, string> = {
      [UserRole.ADMIN]: '/admin',
      [UserRole.HOSPITAL]: '/hospital',
      [UserRole.BLOOD_BANK]: '/bloodbank',
      [UserRole.DONOR]: '/donor',
      [UserRole.PATIENT]: '/patient',
    };
    return <Navigate to={roleRoutes[user.role]} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
