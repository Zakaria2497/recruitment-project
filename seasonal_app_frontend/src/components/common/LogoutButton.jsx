/**
 * LogoutButton Component
 * Simple logout button that can be placed anywhere
 */
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import styled from 'styled-components';

const Button = styled.button`
  padding: 10px 20px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #dc2626;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LogoutButton = ({ className, children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logging out...');
    
    // Dispatch logout action (will clear Redux state and localStorage)
    dispatch(logout());
    
    // Navigate to login
    navigate('/login', { replace: true });
  };

  return (
    <Button className={className} onClick={handleLogout}>
      {children || 'Logout'}
    </Button>
  );
};

export default LogoutButton;

