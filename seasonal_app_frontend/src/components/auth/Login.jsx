/**
 * Login component with OTP flow
 */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Input, Card } from '../ui';
import { 
  sendOTPRequest, 
  verifyOTPRequest,
  clearError 
} from '../../store/slices/authSlice';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
`;

const LoginCard = styled(Card)`
  max-width: 450px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.danger}20;
  color: ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: center;
`;

const OTPInputs = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
`;

const OTPInput = styled.input`
  width: 100%;
  aspect-ratio: 1;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  border: 2px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const ResendText = styled.p`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  
  button {
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    text-decoration: underline;
    font-weight: ${({ theme }) => theme.fontWeight.medium};
    
    &:hover {
      color: ${({ theme }) => theme.colors.primaryDark};
    }
  }
`;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, otpSent, isAuthenticated } = useSelector(state => state.auth);
  
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpInputs, setOtpInputs] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!mobileNumber.trim()) {
      return;
    }
    
    dispatch(clearError());
    dispatch(sendOTPRequest({ mobile_number: mobileNumber }));
    setCountdown(60);
  };

  const handleOTPChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtpInputs = [...otpInputs];
    newOtpInputs[index] = value.slice(-1);
    setOtpInputs(newOtpInputs);
    
    const otp = newOtpInputs.join('');
    setOtpCode(otp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
    
    // Auto-submit when all 6 digits are entered
    if (otp.length === 6) {
      handleVerifyOTP(otp);
    }
  };

  const handleVerifyOTP = async (code = otpCode) => {
    if (code.length !== 6) {
      return;
    }
    
    dispatch(clearError());
    dispatch(verifyOTPRequest({ 
      mobile_number: mobileNumber, 
      otp_code: code 
    }));
  };

  const handleResendOTP = () => {
    if (countdown > 0) return;
    setOtpInputs(['', '', '', '', '', '']);
    setOtpCode('');
    handleSendOTP({ preventDefault: () => {} });
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpInputs[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>Welcome</Title>
        <Subtitle>Enter your phone number to continue</Subtitle>
        
        <Form onSubmit={handleSendOTP}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          {!otpSent ? (
            <>
              <Input
                type="tel"
                label="Phone Number"
                placeholder="+971501234567"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
                disabled={loading}
              />
              <Button 
                type="submit" 
                fullWidth 
                disabled={loading || !mobileNumber.trim()}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </Button>
            </>
          ) : (
            <>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}>
                  Enter OTP Code
                </label>
                <OTPInputs>
                  {otpInputs.map((value, index) => (
                    <OTPInput
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={value}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      disabled={loading}
                      autoFocus={index === 0}
                    />
                  ))}
                </OTPInputs>
              </div>
              
              <Button 
                type="button"
                onClick={() => handleVerifyOTP()}
                fullWidth 
                disabled={loading || otpCode.length !== 6}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
              
              <ResendText>
                Didn't receive code?{' '}
                {countdown > 0 ? (
                  <span>Resend in {countdown}s</span>
                ) : (
                  <button type="button" onClick={handleResendOTP}>
                    Resend OTP
                  </button>
                )}
              </ResendText>
            </>
          )}
        </Form>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;

