/**
 * Input component with styled-components
 */
import styled from 'styled-components';

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  width: 100%;
`;

const StyledLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.base};
  color: ${({ theme }) => theme.colors.textPrimary};
  background-color: ${({ theme }) => theme.colors.bgPrimary};
  border: 2px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray100};
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
  
  ${({ error, theme }) => error && `
    border-color: ${theme.colors.danger};
    &:focus {
      border-color: ${theme.colors.danger};
      box-shadow: 0 0 0 3px ${theme.colors.danger}20;
    }
  `}
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.base};
  color: ${({ theme }) => theme.colors.textPrimary};
  background-color: ${({ theme }) => theme.colors.bgPrimary};
  border: 2px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray100};
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
  
  ${({ error, theme }) => error && `
    border-color: ${theme.colors.danger};
    &:focus {
      border-color: ${theme.colors.danger};
      box-shadow: 0 0 0 3px ${theme.colors.danger}20;
    }
  `}
`;

const ErrorMessage = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.danger};
`;

const Input = ({ 
  label, 
  error, 
  helperText,
  fullWidth = true,
  as = 'input',
  ...props 
}) => {
  const InputComponent = as === 'textarea' ? StyledTextarea : StyledInput;
  
  return (
    <InputWrapper>
      {label && <StyledLabel>{label}</StyledLabel>}
      <InputComponent error={error} {...props} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {helperText && !error && (
        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          {helperText}
        </span>
      )}
    </InputWrapper>
  );
};

export default Input;

