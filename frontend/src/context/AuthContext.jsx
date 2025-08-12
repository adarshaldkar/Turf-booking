// AuthContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from '../utils/axios';
import { Navigate } from 'react-router-dom';

const AuthContext = createContext();

// Auth state reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };
    
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload
      };
    
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
        isLoading: false
      };
    
    case 'UPDATE_USER':
      return { 
        ...state, 
        user: { ...state.user, ...action.payload },
        error: null
      };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    default:
      return state;
  }
};

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: true,
  error: null
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is already logged in
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: userData, token: storedToken }
        });
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        logout();
      }
    }
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  // Login function
  const login = async (email, password) => {
    const response = await axios.post('auth/login', { email, password });
    
    if (response.data.success) {
      const { token: newToken, user: userData } = response.data.data;
      
      // Store in localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: userData, token: newToken }
      });
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true, user: userData };
    } else {
      return { success: false, message: response.data.message };
    }
  };
  

  // Signup function (alias for register)
  const signup = async (userData) => {
    const response = await axios.post('auth/signup', userData);
    
    if (response.data.success) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, message: response.data.message };
    }
  };

  // Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear state
    dispatch({ type: 'LOGOUT' });
    
    // Clear axios default header
    delete axios.defaults.headers.common['Authorization'];
  };

  // Update user profile
  const updateUser = (updatedUser) => {
    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Verify OTP
  const verifyOTP = async (otpData) => {
    const response = await axios.post('auth/verify-otp', otpData);
    
    if (response.data.success) {
      // Update user verification status
      if (response.data.data.user) {
        updateUser(response.data.data.user);
      }
      return { success: true, message: response.data.message };
    } else {
      return { success: false, message: response.data.message };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    const response = await axios.post('auth/forgot-password', { email });
    return response.data;
  };

  // Reset password
  const resetPassword = async (token, password) => {
    const response = await axios.post('auth/reset-password', { token, password });
    return response.data;
  };

  // Resend OTP
  const resendOTP = async (otpData) => {
    const response = await axios.post('auth/resend-otp', otpData);
    return response.data;
  };

  // Context value
  const contextValue = {
    // State
    ...state,
    
    // Authentication methods
    login,
    signup,
    logout,
    updateUser,
    verifyOTP,
    forgotPassword,
    resetPassword,
    resendOTP
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Protected route component
export const ProtectedRoute = ({ children, requireAuth = true, requireVerification = false }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // If route requires authentication but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If route requires verification but user is not verified
  if (requireVerification && user && !user.emailVerified) {
    return <Navigate to="/verify-otp" state={{ 
      email: user.email, 
      verificationType: 'signup' 
    }} replace />;
  }

  // If user is authenticated but trying to access auth pages, redirect to home
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/turfs" replace />;
  }

  return children;
};


export default AuthContext;
