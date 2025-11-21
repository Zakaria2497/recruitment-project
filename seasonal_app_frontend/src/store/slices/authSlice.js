/**
 * Auth slice - manages authentication state
 */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  tokens: null,
  loading: false,
  error: null,
  otpSent: false,
  isAuthenticated: false,
  lastOtpCode: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // OTP Actions
    sendOTPRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.lastOtpCode = null;
    },
    sendOTPSuccess: (state, action) => {
      state.loading = false;
      state.otpSent = true;
      state.error = null;
      state.lastOtpCode = action.payload?.otp || null;
    },
    sendOTPFailure: (state, action) => {
      state.loading = false;
      state.otpSent = false;
      state.error = action.payload;
      state.lastOtpCode = null;
    },

    // Verify OTP Actions
    verifyOTPRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isAuthenticated = true;
      state.otpSent = false;
      state.error = null;
      state.lastOtpCode = null;
      
      // Store tokens in localStorage
      if (action.payload.tokens) {
        localStorage.setItem('access_token', action.payload.tokens.access);
        localStorage.setItem('refresh_token', action.payload.tokens.refresh);
      }
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.lastOtpCode = null;
    },

    // Register Actions
    registerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isAuthenticated = true;
      state.error = null;
      state.lastOtpCode = null;
      
      if (action.payload.tokens) {
        localStorage.setItem('access_token', action.payload.tokens.access);
        localStorage.setItem('refresh_token', action.payload.tokens.refresh);
      }
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.lastOtpCode = null;
    },

    // Login Actions
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    // Logout
    logout: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.otpSent = false;
      state.error = null;
      state.lastOtpCode = null;
      
      // Clear tokens from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set user from stored token
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    // Update tokens
    updateTokens: (state, action) => {
      state.tokens = action.payload;
      if (action.payload?.access) {
        localStorage.setItem('access_token', action.payload.access);
      }
      if (action.payload?.refresh) {
        localStorage.setItem('refresh_token', action.payload.refresh);
      }
    },
  },
});

export const {
  sendOTPRequest,
  sendOTPSuccess,
  sendOTPFailure,
  verifyOTPRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  loginRequest,
  logout,
  clearError,
  setUser,
  updateTokens,
} = authSlice.actions;

export default authSlice.reducer;

