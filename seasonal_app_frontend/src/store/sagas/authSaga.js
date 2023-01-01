/**
 * Auth sagas - handles authentication side effects
 */
import { call, put, takeLatest } from 'redux-saga/effects';
import {
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
} from '../slices/authSlice';
import * as authService from '../../services/authService';

/**
 * Send OTP saga
 */
function* sendOTPSaga(action) {
  try {
    const { mobile_number } = action.payload;
    const response = yield call(authService.sendOTP, mobile_number);
    
    yield put(sendOTPSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.detail || 
                        error.message || 
                        'Failed to send OTP';
    yield put(sendOTPFailure(errorMessage));
  }
}

/**
 * Verify OTP saga
 */
function* verifyOTPSaga(action) {
  try {
    const { mobile_number, otp_code } = action.payload;
    const response = yield call(authService.verifyOTP, mobile_number, otp_code);
    
    const { user, tokens } = response.data;
    yield put(loginSuccess({ user, tokens }));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.detail || 
                        error.message || 
                        'Invalid OTP code';
    yield put(loginFailure(errorMessage));
  }
}

/**
 * Register saga
 */
function* registerSaga(action) {
  try {
    const userData = action.payload;
    const response = yield call(authService.register, userData);
    
    const { user, tokens } = response.data;
    yield put(registerSuccess({ user, tokens }));
  } catch (error) {
    let errorMessage = 'Registration failed';
    
    // Handle Django REST Framework validation errors
    if (error.response?.data) {
      const errors = error.response.data;
      
      // Check if it's a field validation error object
      if (typeof errors === 'object' && !errors.error && !errors.detail) {
        const errorMessages = [];
        
        // Convert field errors to readable messages
        Object.keys(errors).forEach(field => {
          const fieldErrors = errors[field];
          if (Array.isArray(fieldErrors)) {
            fieldErrors.forEach(msg => {
              // Capitalize field name and format message
              const fieldName = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              errorMessages.push(`${fieldName}: ${msg}`);
            });
          }
        });
        
        errorMessage = errorMessages.join('\n') || 'Validation failed';
      } else {
        // Handle single error message
        errorMessage = errors.error || errors.detail || error.message || 'Registration failed';
      }
    } else {
      errorMessage = error.message || 'Registration failed';
    }
    
    yield put(registerFailure(errorMessage));
  }
}

/**
 * Login saga
 */
function* loginSaga(action) {
  try {
    const credentials = action.payload;
    const response = yield call(authService.login, credentials);
    
    const { user, tokens } = response.data;
    yield put(loginSuccess({ user, tokens }));
  } catch (error) {
    let errorMessage = 'Login failed';
    
    // Handle Django REST Framework validation errors
    if (error.response?.data) {
      const errors = error.response.data;
      
      // Check if it's a field validation error object
      if (typeof errors === 'object' && !errors.error && !errors.detail) {
        const errorMessages = [];
        
        // Convert field errors to readable messages
        Object.keys(errors).forEach(field => {
          const fieldErrors = errors[field];
          if (Array.isArray(fieldErrors)) {
            fieldErrors.forEach(msg => {
              const fieldName = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              errorMessages.push(`${fieldName}: ${msg}`);
            });
          }
        });
        
        errorMessage = errorMessages.join('\n') || 'Login failed';
      } else {
        // Handle single error message
        errorMessage = errors.error || errors.detail || error.message || 'Login failed';
      }
    } else {
      errorMessage = error.message || 'Login failed';
    }
    
    yield put(loginFailure(errorMessage));
  }
}

/**
 * Logout saga
 */
function* logoutSaga() {
  try {
    // Clear tokens from API if needed
    yield call(authService.logout);
    // Clear persisted state
    localStorage.clear();
    sessionStorage.clear();
  } catch (error) {
    // Even if API call fails, clear local state
    console.error('Logout error:', error);
    localStorage.clear();
    sessionStorage.clear();
  }
}

/**
 * Watch auth sagas
 */
export function* watchAuthSagas() {
  yield takeLatest(sendOTPRequest.type, sendOTPSaga);
  yield takeLatest(verifyOTPRequest.type, verifyOTPSaga);
  yield takeLatest(registerRequest.type, registerSaga);
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(logout.type, logoutSaga);
}

