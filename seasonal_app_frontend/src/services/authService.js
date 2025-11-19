/**
 * Auth service - handles authentication API calls
 */
import api from './api';

/**
 * Send OTP to phone number
 */
export const sendOTP = (mobile_number) => {
  return api.post('/auth/send-otp/', { mobile_number });
};

/**
 * Verify OTP and get tokens
 */
export const verifyOTP = (mobile_number, otp_code) => {
  return api.post('/auth/verify-otp/', { mobile_number, otp_code });
};

/**
 * Register new user
 */
export const register = (userData) => {
  return api.post('/auth/register/', userData);
};

/**
 * Login with email and password
 */
export const login = (credentials) => {
  return api.post('/auth/login/', credentials);
};

/**
 * Get current user profile
 */
export const getProfile = () => {
  return api.get('/auth/users/me/');
};

/**
 * Refresh access token
 */
export const refreshToken = (refresh) => {
  return api.post('/auth/refresh/', { refresh });
};

/**
 * Logout (clear tokens on server if needed)
 */
export const logout = () => {
  // If backend has logout endpoint, call it here
  // For now, just return resolved promise
  return Promise.resolve();
};

