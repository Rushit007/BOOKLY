'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, LoginDto, RegisterDto } from '../types/user';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (dto: LoginDto) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to manage session cookies for Next.js middleware and persistent browser sessions
function setAuthCookies(token: string, user: User) {
  if (typeof document === 'undefined') return;
  const maxAge = 60 * 60 * 24 * 30; // 30 days
  document.cookie = `bookly_auth_token=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `bookly_session=${encodeURIComponent(user.id)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `bookly_role=${encodeURIComponent(user.role)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function clearAuthCookies() {
  if (typeof document === 'undefined') return;
  document.cookie = 'bookly_auth_token=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'bookly_session=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'bookly_role=; path=/; max-age=0; SameSite=Lax';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Check localStorage first
    const savedUser = localStorage.getItem('bookly_user');
    const savedToken = localStorage.getItem('bookly_token');

    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Automatically purge any insecure demo admin session
        if (parsedUser.id === 'admin-1' || savedToken.includes('demo_admin')) {
          localStorage.removeItem('bookly_user');
          localStorage.removeItem('bookly_token');
          clearAuthCookies();
          setUser(null);
          setToken(null);
        } else {
          setUser(parsedUser);
          setToken(savedToken);
          api.setToken(savedToken);
          setAuthCookies(savedToken, parsedUser);
        }
      } catch {
        localStorage.removeItem('bookly_user');
        localStorage.removeItem('bookly_token');
        clearAuthCookies();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (dto: LoginDto) => {
    const res = await api.login(dto);
    setUser(res.user);
    setToken(res.accessToken);
    localStorage.setItem('bookly_user', JSON.stringify(res.user));
    localStorage.setItem('bookly_token', res.accessToken);
    setAuthCookies(res.accessToken, res.user);
  };

  const register = async (dto: RegisterDto) => {
    const res = await api.register(dto);
    setUser(res.user);
    setToken(res.accessToken);
    localStorage.setItem('bookly_user', JSON.stringify(res.user));
    localStorage.setItem('bookly_token', res.accessToken);
    setAuthCookies(res.accessToken, res.user);
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setToken(null);
    localStorage.removeItem('bookly_user');
    localStorage.removeItem('bookly_token');
    clearAuthCookies();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
