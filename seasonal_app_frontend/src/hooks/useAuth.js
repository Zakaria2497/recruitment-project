/**
 * useAuth hook - authentication logic and user state
 */
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, sendOTPRequest, verifyOTPRequest, loginRequest, registerRequest } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error, otpSent } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSendOTP = (mobileNumber) => {
    dispatch(sendOTPRequest({ mobile_number: mobileNumber }));
  };

  const handleVerifyOTP = (mobileNumber, otpCode) => {
    dispatch(verifyOTPRequest({ mobile_number: mobileNumber, otp_code: otpCode }));
  };

  const handleLogin = (credentials) => {
    dispatch(loginRequest(credentials));
  };

  const handleRegister = (userData) => {
    dispatch(registerRequest(userData));
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    otpSent,
    logout: handleLogout,
    sendOTP: handleSendOTP,
    verifyOTP: handleVerifyOTP,
    login: handleLogin,
    register: handleRegister,
  };
};

