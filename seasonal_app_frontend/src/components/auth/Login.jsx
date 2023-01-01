/**
 * Login & Sign Up screen with modern tabbed layout
 */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Card, Input } from '../ui';
import {
  clearError,
  loginRequest,
  registerRequest,
  sendOTPRequest,
} from '../../store/slices/authSlice';

const SIGNUP_DEMO_CODE = '123456';
const SIGNUP_CODE_LENGTH = 6;

const Background = styled.div`
  min-height: 100vh;
  width: 100%;
  padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.xl};
  background:
    radial-gradient(circle at 7% 12%, ${({ theme }) => `${theme.colors.primary}22`} 0%, transparent 45%),
    radial-gradient(circle at 80% 0%, ${({ theme }) => `${theme.colors.secondary}18`} 0%, transparent 40%),
    linear-gradient(135deg, #fdfbff 0%, #eef4ff 45%, #f9f5ff 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;

const AuthCard = styled(Card)`
  width: 100%;
  max-width: 1100px;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: ${({ theme }) => theme.spacing['2xl']};
  padding: ${({ theme }) => theme.spacing['2xl']};

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

const Showcase = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing['2xl']};
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 420px;
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const ShowcaseTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
`;

const ShowcaseList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  li {
    display: flex;
    gap: ${({ theme }) => theme.spacing.md};
    align-items: flex-start;
  }

  strong {
    display: block;
    font-size: ${({ theme }) => theme.fontSize.lg};
  }
`;

const AuthPane = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2xl']};
`;

const Tabs = styled.div`
  display: inline-flex;
  padding: 6px;
  background-color: ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  width: fit-content;
`;

const TabButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'active',
})`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: none;
  background: ${({ active, theme }) => (active ? theme.colors.bgPrimary : 'transparent')};
  color: ${({ active, theme }) => (active ? theme.colors.textPrimary : theme.colors.textSecondary)};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  cursor: pointer;
  box-shadow: ${({ active, theme }) => (active ? theme.shadows.sm : 'none')};
  transition: all 0.2s ease;
`;

const FormHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FormTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const FormSubtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSize.base};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const ErrorBanner = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme }) => theme.colors.danger}12;
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSize.sm};
  border: 1px solid ${({ theme }) => `${theme.colors.danger}33`};
  white-space: pre-line;
  line-height: 1.6;
`;

const HelperText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const NameGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const VerificationPane = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  border: 2px dashed ${({ theme }) => theme.colors.gray200};
  background-color: ${({ theme }) => theme.colors.gray50};
`;

const VerificationTargets = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};

  strong {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const OTPGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${SIGNUP_CODE_LENGTH}, 52px);
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 480px) {
    grid-template-columns: repeat(${SIGNUP_CODE_LENGTH}, 1fr);
  }
`;

const OTPInput = styled.input`
  width: 52px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 2px solid ${({ theme }) => theme.colors.gray300};
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  background-color: ${({ theme }) => theme.colors.bgPrimary};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const VerificationActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: calc(50% + 12px);
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: color 0.2s ease;
  z-index: 10;
  
  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    transform: translateY(-50%);
  }
  
  &:focus {
    outline: none;
    color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, lastOtpCode } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    firstName: '',
    fatherName: '',
    grandName: '',
    familyName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [signupErrors, setSignupErrors] = useState({});
  const [signupStep, setSignupStep] = useState('form'); // form | verify
  const [verificationTargets, setVerificationTargets] = useState({ phone: '', email: '' });
  const [verificationCode, setVerificationCode] = useState(Array(SIGNUP_CODE_LENGTH).fill(''));
  const [verificationCountdown, setVerificationCountdown] = useState(0);
  const [verificationError, setVerificationError] = useState(null);
  const [pendingSignupPayload, setPendingSignupPayload] = useState(null);
  const otpRefs = useRef([]);
  
  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      console.log('Login - User authenticated, redirecting to home');
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
    setSignupErrors({});
    if (activeTab !== 'signup') {
      setSignupStep('form');
      setVerificationCountdown(0);
      setVerificationCode(Array(SIGNUP_CODE_LENGTH).fill(''));
    }
  }, [activeTab, dispatch]);

  useEffect(() => {
    if (signupStep !== 'verify') return;
    if (verificationCountdown <= 0) return;
    const timer = setTimeout(() => setVerificationCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [signupStep, verificationCountdown]);

  const handleLoginChange = (field) => (event) => {
    setLoginForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSignupChange = (field) => (event) => {
    const value = event.target.value;
    setSignupForm((prev) => ({ ...prev, [field]: value }));
    if (signupErrors[field]) {
      setSignupErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateSignup = () => {
    const errors = {};
    if (!signupForm.firstName.trim()) errors.firstName = 'First name is required';
    if (!signupForm.fatherName.trim()) errors.fatherName = 'Father name is required';
    if (!signupForm.grandName.trim()) errors.grandName = 'Grand name is required';
    if (!signupForm.familyName.trim()) errors.familyName = 'Family name is required';
    if (!signupForm.email.trim()) errors.email = 'Email is required';
    if (!signupForm.phone.trim()) errors.phone = 'Phone number is required';
    if (!signupForm.password) errors.password = 'Password is required';
    if (!signupForm.confirmPassword) errors.confirmPassword = 'Confirm your password';
    if (
      signupForm.password &&
      signupForm.confirmPassword &&
      signupForm.password !== signupForm.confirmPassword
    ) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setSignupErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    dispatch(
      loginRequest({
        email: loginForm.email.trim(),
        password: loginForm.password,
      }),
    );
  };

  const handleSignupSubmit = (event) => {
    event.preventDefault();
    if (!validateSignup()) return;
    const trimmedEmail = signupForm.email.trim();
    const trimmedPhone = signupForm.phone.trim();
    const payload = {
      email: trimmedEmail,
      phone: trimmedPhone,
      password: signupForm.password,
      sign_up_source: 'web_app',
      first_name: signupForm.firstName.trim(),
      father_name: signupForm.fatherName.trim(),
      grand_name: signupForm.grandName.trim(),
      family_name: signupForm.familyName.trim(),
    };

    setPendingSignupPayload(payload);
    dispatch(sendOTPRequest({ mobile_number: trimmedPhone }));
    setVerificationTargets({ email: trimmedEmail, phone: trimmedPhone });
    setVerificationCode(Array(SIGNUP_CODE_LENGTH).fill(''));
    setVerificationCountdown(60);
    setVerificationError(null);
    setSignupStep('verify');

    // Persist names locally so we can pre-fill the Profile wizard later
    try {
      localStorage.setItem(
        'pending_personal_names',
        JSON.stringify({
          first_name: signupForm.firstName.trim(),
          father_name: signupForm.fatherName.trim(),
          grand_name: signupForm.grandName.trim(),
          family_name: signupForm.familyName.trim(),
        }),
      );
    } catch (err) {
      console.warn('Unable to cache personal names:', err);
    }
  };

  const handleVerificationInputChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...verificationCode];
    next[index] = value.slice(-1);
    setVerificationCode(next);

    if (value && index < SIGNUP_CODE_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerificationKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !verificationCode[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifySignupCode = () => {
    const joined = verificationCode.join('');
    if (joined.length !== SIGNUP_CODE_LENGTH) {
      setVerificationError('Enter the 6-digit verification code.');
      return;
    }
    const expectedCode = lastOtpCode || SIGNUP_DEMO_CODE;
    if (joined !== expectedCode) {
      setVerificationError('Invalid code. Please try again.');
      return;
    }
    setVerificationError(null);
    if (pendingSignupPayload) {
      dispatch(registerRequest(pendingSignupPayload));
    }
  };

  const handleResendSignupCode = () => {
    if (verificationCountdown > 0) return;
    setVerificationCode(Array(SIGNUP_CODE_LENGTH).fill(''));
    setVerificationCountdown(60);
    setVerificationError(null);
    
    // Resend OTP to the phone number
    if (verificationTargets.phone) {
      dispatch(sendOTPRequest({ mobile_number: verificationTargets.phone }));
    }
  };

  const handleEditSignupInfo = () => {
    setSignupStep('form');
    setVerificationCountdown(0);
    setVerificationCode(Array(SIGNUP_CODE_LENGTH).fill(''));
    setVerificationError(null);
  };

  return (
    <Background>
      <AuthCard>
        <Showcase>
          <div>
            <ShowcaseTitle>Seasonal Hiring Portal</ShowcaseTitle>
            <p style={{ fontSize: '1.125rem', margin: 0, opacity: 0.9 }}>
              Manage your workforce applications, review onboarding progress, and keep every seasonal hire in sync with one modern workspace.
            </p>
          </div>
          <ShowcaseList>
            <li>
              <span>✅</span>
              <div>
                <strong>Secure access</strong>
                <span>Multi-factor ready with audit-friendly session handling.</span>
              </div>
            </li>
            <li>
              <span>⚡</span>
              <div>
                <strong>Fast onboarding</strong>
                <span>Switch between login and sign up instantly with a single click.</span>
              </div>
            </li>
            <li>
              <span>🧭</span>
              <div>
                <strong>Guided experience</strong>
                <span>After sign in you land directly inside the dashboard &amp; profile wizard.</span>
              </div>
            </li>
          </ShowcaseList>
        </Showcase>

        <AuthPane>
          <Tabs role="tablist" aria-label="Authentication Tabs">
            <TabButton
              type="button"
              active={activeTab === 'login'}
              onClick={() => setActiveTab('login')}
            >
              Login
            </TabButton>
            <TabButton
              type="button"
              active={activeTab === 'signup'}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </TabButton>
          </Tabs>

          {activeTab === 'login' ? (
            <>
              <FormHeader>
                <FormTitle>Welcome back</FormTitle>
                <FormSubtitle>Use your work email and password to continue.</FormSubtitle>
              </FormHeader>
              <Form onSubmit={handleLoginSubmit}>
                {error && <ErrorBanner>{error}</ErrorBanner>}
                <Input
                  type="email"
                  label="Email"
                  placeholder="you@company.com"
                  value={loginForm.email}
                  onChange={handleLoginChange('email')}
                  required
                />
                <div>
                  <PasswordWrapper>
                    <Input
                      type={showLoginPassword ? "text" : "password"}
                      label="Password"
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={handleLoginChange('password')}
                      required
                    />
                    <PasswordToggle
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      aria-label={showLoginPassword ? "Hide password" : "Show password"}
                    >
                      {showLoginPassword ? (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </PasswordToggle>
                  </PasswordWrapper>
                </div>
                <Button type="submit" fullWidth disabled={loading}>
                  {loading ? 'Signing in...' : 'Login'}
                </Button>
              </Form>
            </>
          ) : signupStep === 'form' ? (
            <>
              <FormHeader>
                <FormTitle>Create an account</FormTitle>
                <FormSubtitle>
                  Register with your best contact info to access the hiring wizard.
                </FormSubtitle>
              </FormHeader>
              <Form onSubmit={handleSignupSubmit}>
                {error && <ErrorBanner>{error}</ErrorBanner>}
                <NameGrid>
                  <Input
                    label="First Name"
                    placeholder="First name"
                    value={signupForm.firstName}
                    onChange={handleSignupChange('firstName')}
                    error={signupErrors.firstName}
                  />
                  <Input
                    label="Father Name"
                    placeholder="Father name"
                    value={signupForm.fatherName}
                    onChange={handleSignupChange('fatherName')}
                    error={signupErrors.fatherName}
                  />
                  <Input
                    label="Grand Name"
                    placeholder="Grand name"
                    value={signupForm.grandName}
                    onChange={handleSignupChange('grandName')}
                    error={signupErrors.grandName}
                  />
                  <Input
                    label="Family Name"
                    placeholder="Family name"
                    value={signupForm.familyName}
                    onChange={handleSignupChange('familyName')}
                    error={signupErrors.familyName}
                  />
                </NameGrid>
                <Input
                  type="email"
                  label="Email"
                  placeholder="you@company.com"
                  value={signupForm.email}
                  onChange={handleSignupChange('email')}
                  error={signupErrors.email}
                />
                <FieldRow>
                  <Input
                    type="tel"
                    label="Mobile Number"
                    placeholder="+971501234567"
                    value={signupForm.phone}
                    onChange={handleSignupChange('phone')}
                    error={signupErrors.phone}
                  />
                </FieldRow>
                <FieldRow>
                  <PasswordWrapper>
                    <Input
                      type={showSignupPassword ? "text" : "password"}
                      label="Password"
                      placeholder="Create a password"
                      value={signupForm.password}
                      onChange={handleSignupChange('password')}
                      error={signupErrors.password}
                    />
                    <PasswordToggle
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      aria-label={showSignupPassword ? "Hide password" : "Show password"}
                    >
                      {showSignupPassword ? (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </PasswordToggle>
                  </PasswordWrapper>
                  <PasswordWrapper>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      label="Confirm Password"
                      placeholder="Repeat password"
                      value={signupForm.confirmPassword}
                      onChange={handleSignupChange('confirmPassword')}
                      error={signupErrors.confirmPassword}
                    />
                    <PasswordToggle
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </PasswordToggle>
                  </PasswordWrapper>
                </FieldRow>
                <HelperText>
                  Once you tap “Create Account” we’ll send a 6-digit verification code to both your
                  mobile number and email address.
                </HelperText>
                <Button type="submit" fullWidth disabled={loading}>
                  {loading ? 'Preparing verification...' : 'Create Account'}
                </Button>
              </Form>
            </>
          ) : (
            <VerificationPane>
              <FormHeader>
                <FormTitle>Verify your contact details</FormTitle>
                <FormSubtitle>
                  Enter the 6-digit code we just sent to your phone and email. This confirms you own
                  both channels before we finish creating your account.
                </FormSubtitle>
              </FormHeader>
              {error && <ErrorBanner>{error}</ErrorBanner>}
              <VerificationTargets>
                <span>
                  📱 <strong>Mobile:</strong> {verificationTargets.phone || '—'}
                </span>
                <span>
                  📧 <strong>Email:</strong> {verificationTargets.email || '—'}
                </span>
              </VerificationTargets>
              <div>
                <HelperText style={{ marginBottom: '0.5rem' }}>
                  Enter the verification code we sent. (Dev mode code: {lastOtpCode || SIGNUP_DEMO_CODE})
                </HelperText>
                <OTPGrid>
                  {verificationCode.map((digit, index) => (
                    <OTPInput
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(event) => handleVerificationInputChange(index, event.target.value)}
                      onKeyDown={(event) => handleVerificationKeyDown(index, event)}
                      ref={(element) => {
                        otpRefs.current[index] = element;
                      }}
                      disabled={loading}
                    />
                  ))}
                </OTPGrid>
              </div>
              {verificationError && <ErrorBanner>{verificationError}</ErrorBanner>}
              <VerificationActions>
                <Button variant="success" onClick={handleVerifySignupCode} disabled={loading}>
                  {loading ? 'Creating account...' : 'Verify & Create Account'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleResendSignupCode}
                  disabled={verificationCountdown > 0}
                >
                  {verificationCountdown > 0
                    ? `Resend Code in ${verificationCountdown}s`
                    : 'Resend Code'}
                </Button>
                <Button variant="outline" onClick={handleEditSignupInfo} disabled={loading}>
                  Edit info
                </Button>
              </VerificationActions>
            </VerificationPane>
          )}
        </AuthPane>
      </AuthCard>
    </Background>
  );
};

export default Login;

