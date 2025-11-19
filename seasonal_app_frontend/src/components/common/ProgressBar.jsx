/**
 * Progress Bar component
 */
import styled from 'styled-components';

const ProgressBarContainer = styled.div`
  width: 100%;
  height: ${({ height }) => height || '8px'};
  background-color: ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${({ theme, variant }) => {
    switch (variant) {
      case 'success':
        return `linear-gradient(90deg, ${theme.colors.success} 0%, #059669 100%)`;
      case 'warning':
        return `linear-gradient(90deg, ${theme.colors.warning} 0%, #d97706 100%)`;
      default:
        return `linear-gradient(90deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`;
    }
  }};
  transition: width 0.3s ease;
  width: ${({ progress }) => Math.min(100, Math.max(0, progress))}%;
  border-radius: ${({ theme }) => theme.borderRadius.full};
`;

const ProgressText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
`;

const ProgressBar = ({ progress = 0, height, variant = 'default', showText = false }) => {
  return (
    <ProgressBarContainer height={height}>
      <ProgressFill progress={progress} variant={variant} />
      {showText && (
        <ProgressText>{Math.round(progress)}%</ProgressText>
      )}
    </ProgressBarContainer>
  );
};

export default ProgressBar;

