
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthState, UserRole } from '../types';

import { socketIOService } from '../services/socketio';

interface AuthContextType extends AuthState {
  login: (token: string, user: User, refreshToken?: string) => void;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    role: null,
    token: null,
    organizationId: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const logout = useCallback(() => {
    localStorage.clear(); // Explicitly clear everything on logout
    setState({
      user: null,
      role: null,
      token: null,
      organizationId: null,
      isAuthenticated: false,
      isLoading: false,
    });
    if (!window.location.hash.includes('/login')) {
      window.location.hash = '#/login';
    }
  }, []);

  const hasRole = useCallback((role: UserRole) => {
    return state.role === role;
  }, [state.role]);

  const initializeSocketIO = useCallback(async (user: User) => {
    try {
      await socketIOService.start();
      await socketIOService.joinRoleGroup(user.role, user.id);
      if (user.role === UserRole.ADMIN) {
        await socketIOService.joinRoleGroup('admin', 'global');
      }
    } catch (err) {
      // Background real-time failure is non-critical
      console.warn('Socket.IO initialization failed:', err);
    }
  }, []);

  useEffect(() => {
    const initAuth = () => {
      const storedUser = localStorage.getItem('ls_user');
      const storedToken = localStorage.getItem('ls_token');

      if (storedUser && storedToken) {
        try {
          const user = JSON.parse(storedUser);
          setState({
            user,
            role: user.role,
            token: storedToken,
            organizationId: user.organizationId || null,
            isAuthenticated: true,
            isLoading: false,
          });
          initializeSocketIO(user);
        } catch (e) {
          logout();
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ls_token' && !e.newValue) {
        logout();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [logout, initializeSocketIO]);

  const login = (token: string, user: User, refreshToken?: string) => {
    localStorage.setItem('ls_token', token);
    if (refreshToken) {
      localStorage.setItem('ls_refresh_token', refreshToken);
    }
    // Inject isRootAdmin flag if role is ADMIN and no org ID
    if (user.role === UserRole.ADMIN && !user.organizationId) {
      user.isRootAdmin = true;
    }

    localStorage.setItem('ls_user', JSON.stringify(user));
    localStorage.setItem('ls_role', user.role);

    setState({
      user,
      role: user.role,
      token,
      organizationId: user.organizationId || null,
      isAuthenticated: true,
      isLoading: false,
    });

    initializeSocketIO(user);

    // Standard shift session (8 hours)
    setTimeout(logout, 28800000);
  };


  return (
    <AuthContext.Provider value={{ ...state, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

