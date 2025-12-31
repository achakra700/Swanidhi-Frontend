
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthState, UserRole } from '../types';

import { signalRService } from '../services/signalR';

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const logout = useCallback(() => {
    localStorage.removeItem('ls_token');
    localStorage.removeItem('ls_user');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    if (!window.location.hash.includes('/login')) {
      window.location.hash = '#/login';
    }
  }, []);

  const initializeSignalR = useCallback(async (user: User) => {
    try {
      await signalRService.start();
      await signalRService.joinRoleGroup(user.role, user.id);
      if (user.role === UserRole.ADMIN) {
        await signalRService.joinRoleGroup('admin', 'global');
      }
    } catch (err) {
      // Production path: silent failure for background real-time features
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
            isAuthenticated: true,
            isLoading: false,
          });
          initializeSignalR(user);
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
  }, [logout, initializeSignalR]);

  const login = (token: string, user: User) => {
    localStorage.setItem('ls_token', token);
    localStorage.setItem('ls_user', JSON.stringify(user));
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
    initializeSignalR(user);

    // Auto-logout after 8 hours (standard shift)
    setTimeout(() => {
      logout();
    }, 28800000);
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
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
