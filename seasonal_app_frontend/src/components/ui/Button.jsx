/**
 * Button component with variants
 */
import styled from 'styled-components';

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;
  cursor: pointer;
  border: 2px solid transparent;
  min-height: 44px;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background-color: ${theme.colors.primary};
          color: white;
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primaryDark};
          }
        `;
      case 'secondary':
        return `
          background-color: ${theme.colors.secondary};
          color: white;
          &:hover:not(:disabled) {
            background-color: #4f46e5;
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: ${theme.colors.primary};
          border-color: ${theme.colors.primary};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary};
            color: white;
          }
        `;
      case 'danger':
        return `
          background-color: ${theme.colors.danger};
          color: white;
          &:hover:not(:disabled) {
            background-color: #dc2626;
          }
        `;
      case 'success':
        return `
          background-color: ${theme.colors.success};
          color: white;
          &:hover:not(:disabled) {
            background-color: #059669;
          }
        `;
      default:
        return `
          background-color: ${theme.colors.gray200};
          color: ${theme.colors.textPrimary};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.gray300};
          }
        `;
    }
  }}

  ${({ fullWidth }) => fullWidth && 'width: 100%;'}
  ${({ size, theme }) => {
    switch (size) {
      case 'sm':
        return `
          padding: ${theme.spacing.xs} ${theme.spacing.md};
          font-size: ${theme.fontSize.sm};
          min-height: 36px;
        `;
      case 'lg':
        return `
          padding: ${theme.spacing.md} ${theme.spacing.xl};
          font-size: ${theme.fontSize.lg};
          min-height: 52px;
        `;
      default:
        return '';
    }
  }}
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  ...props 
}) => {
  return (
    <StyledButton 
      variant={variant} 
      size={size}
      fullWidth={fullWidth}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;

