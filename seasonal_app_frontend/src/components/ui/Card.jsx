/**
 * Card component - container with shadow and padding
 */
import styled from 'styled-components';

const StyledCard = styled.div`
  background-color: ${({ theme }) => theme.colors.bgPrimary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing.xl};
  width: 100%;
  max-width: 100%;
  
  ${({ variant, theme }) => {
    switch (variant) {
      case 'outlined':
        return `
          box-shadow: none;
          border: 2px solid ${theme.colors.gray200};
        `;
      case 'elevated':
        return `
          box-shadow: ${theme.shadows.xl};
        `;
      default:
        return '';
    }
  }}
  
  ${({ padding, theme }) => {
    switch (padding) {
      case 'sm':
        return `padding: ${theme.spacing.md};`;
      case 'lg':
        return `padding: ${theme.spacing['2xl']};`;
      default:
        return '';
    }
  }}
`;

const Card = ({ children, variant = 'default', padding = 'default', ...props }) => {
  return (
    <StyledCard variant={variant} padding={padding} {...props}>
      {children}
    </StyledCard>
  );
};

export default Card;

