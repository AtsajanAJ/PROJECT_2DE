import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// API base URL
const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('jwt_token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Validate token with backend
          try {
            await apiClient.post('/auth/validate');
          } catch (validationError) {
            // Token is invalid, clear storage
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.post('/auth/login', {
        username,
        password,
      });

      if (response.data.success && response.data.token) {
        const { token: newToken, username: userData } = response.data;
        
        // Store token and user data
        localStorage.setItem('jwt_token', newToken);
        localStorage.setItem('user', JSON.stringify({ username: userData }));
        
        setToken(newToken);
        setUser({ username: userData });
        
        return { success: true, message: 'Login successful!' };
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.post('/auth/register', userData);

      if (response.status === 201) {
        return { success: true, message: 'Registration successful! Please login.' };
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setError(null);
  };

  // Get current user info
  const getCurrentUser = async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (err) {
      console.error('Failed to get current user:', err);
      return null;
    }
  };

  // Validate token
  const validateToken = async () => {
    try {
      const response = await apiClient.post('/auth/validate');
      return response.data;
    } catch (err) {
      console.error('Token validation failed:', err);
      return null;
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    getCurrentUser,
    validateToken,
    clearError,
    apiClient, // Export axios instance for other components
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
