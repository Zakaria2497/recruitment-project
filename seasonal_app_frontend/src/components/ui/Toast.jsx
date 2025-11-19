/**
 * Toast notification component
 */
import { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing.xl};
  right: ${({ theme }) => theme.spacing.xl};
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ToastWrapper = styled.div`
  background-color: ${({ theme, type }) => {
    switch (type) {
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.danger;
      case 'warning':
        return theme.colors.warning;
      case 'info':
        return theme.colors.info;
      default:
        return theme.colors.gray800;
    }
  }};
  color: white;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  min-width: 300px;
  max-width: 500px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  animation: ${slideIn} 0.3s ease-out;
  
  ${({ isClosing }) => isClosing && `
    animation: ${slideOut} 0.3s ease-out forwards;
  `}
`;

const ToastMessage = styled.div`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSize.base};
  line-height: 1.5;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: ${({ theme }) => theme.fontSize.xl};
  cursor: pointer;
  padding: 0;
  line-height: 1;
  opacity: 0.8;
  
  &:hover {
    opacity: 1;
  }
`;

const Toast = ({ message, type = 'info', duration = 5000, onClose }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <ToastWrapper type={type}>
      <ToastMessage>{message}</ToastMessage>
      <CloseButton onClick={onClose}>&times;</CloseButton>
    </ToastWrapper>
  );
};

export const ToastContainerWrapper = ({ children }) => {
  return <ToastContainer>{children}</ToastContainer>;
};

export default Toast;

