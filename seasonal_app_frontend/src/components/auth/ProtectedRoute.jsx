/**
 * Protected Route component - checks authentication
 */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import * as authService from '../../services/authService';
import { setUser } from '../../store/slices/authSlice';
import { useDispatch } from 'react-redux';

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.bgSecondary};
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid ${({ theme }) => theme.colors.gray200};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const authState = useSelector(state => state.auth);
  const { isAuthenticated, user } = authState;
  const [isChecking, setIsChecking] = useState(true);

  console.log('🔐 ProtectedRoute - RENDER');
  console.log('🔐 ProtectedRoute - Full auth state:', authState);
  console.log('🔐 ProtectedRoute - isAuthenticated:', isAuthenticated);
  console.log('🔐 ProtectedRoute - user:', user);
  console.log('🔐 ProtectedRoute - isChecking:', isChecking);

  useEffect(() => {
    console.log('🔐 ProtectedRoute - useEffect running');
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      console.log('🔐 ProtectedRoute - access_token:', token ? 'exists' : 'null');
      
      if (!token) {
        console.log('🔐 ProtectedRoute - No token found');
        setIsChecking(false);
        return;
      }

      // If we have a token but no user, try to fetch user profile
      if (!user) {
        console.log('🔐 ProtectedRoute - Token exists but no user, fetching profile...');
        try {
          const response = await authService.getProfile();
          console.log('🔐 ProtectedRoute - Profile fetched:', response.data);
          dispatch(setUser(response.data));
        } catch (error) {
          console.error('🔐 ProtectedRoute - Error fetching profile:', error);
          // Token is invalid, clear it
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      } else {
        console.log('🔐 ProtectedRoute - User already exists:', user);
      }
      
      setIsChecking(false);
      console.log('🔐 ProtectedRoute - Auth check complete');
    };

    checkAuth();
  }, [dispatch, user]);

  if (isChecking) {
    console.log('🔐 ProtectedRoute - Still checking auth, showing spinner');
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  if (!isAuthenticated) {
    console.log('🔐 ProtectedRoute - Not authenticated, redirecting to login');
    // Redirect to login with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('🔐 ProtectedRoute - Authenticated, rendering children');
  return children;
};

export default ProtectedRoute;

