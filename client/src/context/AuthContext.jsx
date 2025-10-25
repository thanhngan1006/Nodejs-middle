import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api'; // Dùng file api vừa tạo

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      setUserRole(localStorage.getItem('role'));
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      // Gọi API login
      const response = await api.post('/auth/login', { email, password });
      const { token, role } = response.data;

      // Lưu vào localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // Cập nhật state
      setToken(token);
      return true; // Thành công
    } catch (error) {
      console.error('Login failed:', error);
      return false; // Thất bại
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  return useContext(AuthContext);
};