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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('bookly_user');
    const savedToken = localStorage.getItem('bookly_token');
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
        api.setToken(savedToken);
      } catch {
        localStorage.removeItem('bookly_user');
        localStorage.removeItem('bookly_token');
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
  };

  const register = async (dto: RegisterDto) => {
    const res = await api.register(dto);
    setUser(res.user);
    setToken(res.accessToken);
    localStorage.setItem('bookly_user', JSON.stringify(res.user));
    localStorage.setItem('bookly_token', res.accessToken);
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setToken(null);
    localStorage.removeItem('bookly_user');
    localStorage.removeItem('bookly_token');
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
