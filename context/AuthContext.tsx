
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthState, UserRole } from '../types';

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
    // Redirect to login if on a protected route
    if (!window.location.hash.includes('/login')) {
      window.location.hash = '#/login';
    }
  }, []);

  useEffect(() => {
    const initAuth = () => {
      const storedUser = localStorage.getItem('ls_user');
      const storedToken = localStorage.getItem('ls_token');
      
      if (storedUser && storedToken) {
        try {
          const user = JSON.parse(storedUser);
          // Simulation: Check if token is "expired" (mock logic)
          // In real implementation, decode JWT and check 'exp' claim
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (e) {
          logout();
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();

    // Auto-logout simulation: Listen for storage changes (e.g., from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ls_token' && !e.newValue) {
        logout();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [logout]);

  const login = (token: string, user: User) => {
    localStorage.setItem('ls_token', token);
    localStorage.setItem('ls_user', JSON.stringify(user));
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });

    // Simulated Auto-logout after 1 hour of "token life" for security demo
    setTimeout(() => {
      console.warn('Session expired - Auto logging out');
      logout();
    }, 3600000); // 1 hour
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
