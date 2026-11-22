import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('synccart_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('synccart_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (token) {
        try {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
          localStorage.setItem('synccart_user', JSON.stringify(userData));
        } catch (err) {
          console.error("Token invalid or expired", err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, [token]);

  const login = async (username, password) => {
    const data = await authApi.login(username, password);
    setToken(data.token);
    localStorage.setItem('synccart_token', data.token);

    const userInfo = {
      id: data.id,
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      avatarUrl: data.avatarUrl,
      role: data.role,
    };
    setUser(userInfo);
    localStorage.setItem('synccart_user', JSON.stringify(userInfo));
    return userInfo;
  };

  const register = async (formData) => {
    const data = await authApi.register(formData);
    setToken(data.token);
    localStorage.setItem('synccart_token', data.token);

    const userInfo = {
      id: data.id,
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      avatarUrl: data.avatarUrl,
      role: data.role,
    };
    setUser(userInfo);
    localStorage.setItem('synccart_user', JSON.stringify(userInfo));
    return userInfo;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('synccart_token');
    localStorage.removeItem('synccart_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
