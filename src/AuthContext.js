import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);

  // Load token & user from localStorage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('user');
    if (token) {
      setAuthToken(token);
      setUser(username);
    }
  }, []);

  const register = async (email, password, username) => {
    try {
      const response = await axios.post('https://mystore-be.onrender.com/api/users/register/', {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      throw new Error(message);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('https://mystore-be.onrender.com/api/users/login/', {
        email,
        password,
      });

      const { token, username } = response.data;
      setAuthToken(token);
      setUser(username);

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', username);

      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      throw new Error(message);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ register, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
