/**
 * QuickRegistration
 * Standalone registration + dual-channel verification experience
 * Mirrors the seasonal_onboarding_en_updated.html flow but in React/styled-components
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { Card, Button, Input } from '../ui';

const SIM_OTP = '123456';
const OTP_LENGTH = 6;

const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.xl};
  background:
    radial-gradient(circle at 5% 15%, rgba(14, 165, 233, 0.18), transparent 55%),
    radial-gradient(circle at 85% 0%, rgba(79, 70, 229, 0.18), transparent 45%),
    linear-gradient(135deg, #fffefd 0%, #f4f7ff 40%, #f8f5ff 100%);
  box-sizing: border-box;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2xl']};
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing['2xl']};
`;

const InfoCard = styled(Card)`
  background: linear-gradient(160deg, ${({ theme }) => `${theme.colors.primary}15`} 0%, ${({ theme }) => `${theme.colors.secondary}10`} 100%);
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const InfoList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  li {
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    align-items: flex-start;
    font-size: ${({ theme }) => theme.fontSize.base};
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  span.icon {
    font-size: ${({ theme }) => theme.fontSize['2xl']};
    line-height: 1;
  }
`;

const FormCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2xl']};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const NameGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const ActionsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

const StatusMessage = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'type',
})`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ type, theme }) => (type === 'success' ? theme.colors.success : theme.colors.danger)};
`;

const OTPSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 2px dashed ${({ theme }) => theme.colors.gray200};
  background-color: ${({ theme }) => theme.colors.gray50};
`;

const OTPTargets = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  strong {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const OTPInputs = styled.div`
  display: grid;
  grid-template-columns: repeat(${OTP_LENGTH}, 48px);
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 480px) {
    grid-template-columns: repeat(${OTP_LENGTH}, 1fr);
  }
`;

const OTPInput = styled.input`
  width: 48px;
  height: 56px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
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

const HelperText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const VerifiedBadge = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme }) => theme.colors.success}15;
  color: ${({ theme }) => theme.colors.success};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const initialFormState = {
  firstName: '',
  fatherName: '',
  grandName: '',
  familyName: '',
  phone: '',
  email: '',
  password: '',
};

const demoProfile = {
  firstName: 'Ahmed',
  fatherName: 'Mohammed',
  grandName: 'Abdullah',
  familyName: 'Al-Rashid',
  phone: '+971501234567',
  email: 'ahmed.demo@example.com',
  password: 'Demo@1234',
};

const QuickRegistration = ({ onVerified }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [fieldErrors, setFieldErrors] = useState({});
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationTargets, setVerificationTargets] = useState({ phone: '', email: '' });
  const [otpValues, setOtpValues] = useState(Array(OTP_LENGTH).fill(''));
  const [status, setStatus] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (!verificationSent || countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, verificationSent]);

  const otpCode = useMemo(() => otpValues.join(''), [otpValues]);

  const handleFieldChange = (field) => (event) => {
    const { value } = event.target;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'Required';
    if (!formData.familyName.trim()) errors.familyName = 'Required';
    if (!formData.phone.trim()) errors.phone = 'Required';
    if (!formData.email.trim()) errors.email = 'Required';
    if (!formData.password.trim()) errors.password = 'Required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendVerification = () => {
    if (!validateForm()) {
      setStatus({ type: 'error', message: 'Fill the required fields before continuing.' });
      return;
    }

    setVerificationSent(true);
    setCountdown(60);
    setOtpValues(Array(OTP_LENGTH).fill(''));
    setVerificationTargets({ phone: formData.phone.trim(), email: formData.email.trim() });
    setStatus({
      type: 'success',
      message: 'Verification code sent to your mobile number and email address.',
    });
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const nextValues = [...otpValues];
    nextValues[index] = value.slice(-1);
    setOtpValues(nextValues);

    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = () => {
    if (otpCode.length !== OTP_LENGTH) {
      setStatus({ type: 'error', message: 'Enter the 6-digit verification code.' });
      return;
    }

    if (otpCode === SIM_OTP) {
      setIsVerified(true);
      setStatus({ type: 'success', message: 'Verified — you can continue filling your profile.' });
      if (typeof onVerified === 'function') {
        onVerified({
          ...formData,
          verificationTargets,
        });
      }
    } else {
      setStatus({ type: 'error', message: 'Invalid code. Please try again.' });
    }
  };

  const handleResendCode = () => {
    if (countdown > 0) return;
    setCountdown(60);
    setOtpValues(Array(OTP_LENGTH).fill(''));
    setStatus({
      type: 'success',
      message: 'Verification code resent to your phone and email.',
    });
  };

  const handleStartDemo = () => {
    setFormData(demoProfile);
    setStatus({
      type: 'success',
      message: 'Demo profile pre-filled. Send verification to continue.',
    });
  };

  return (
    <PageWrapper>
      <Content>
        <Header>
          <Title>Quick Registration</Title>
          <Subtitle>
            Capture basic information and verify applicants with a single 6-digit code sent to both channels.
          </Subtitle>
        </Header>

        <Grid>
          <InfoCard>
            <Section>
              <SectionTitle>What happens next?</SectionTitle>
              <InfoList>
                <li>
                  <span className="icon">1️⃣</span>
                  <div>
                    <strong>Send verification</strong>
                    <p style={{ margin: 0 }}>
                      We deliver a 6-digit code to both the applicant&apos;s mobile number and email address.
                    </p>
                  </div>
                </li>
                <li>
                  <span className="icon">2️⃣</span>
                  <div>
                    <strong>Verify identity</strong>
                    <p style={{ margin: 0 }}>
                      Applicants confirm their identity by entering the code from either channel.
                    </p>
                  </div>
                </li>
                <li>
                  <span className="icon">3️⃣</span>
                  <div>
                    <strong>Unlock the profile wizard</strong>
                    <p style={{ margin: 0 }}>
                      Once verified, the full multi-step profile wizard becomes available.
                    </p>
                  </div>
                </li>
              </InfoList>
            </Section>
            <Section>
              <SectionTitle>Demo mode</SectionTitle>
              <HelperText>
                Use demo mode to auto-fill realistic test data and explore the experience without typing everything from scratch.
              </HelperText>
              <Button variant="outline" onClick={handleStartDemo}>
                🚀 Fill Demo Data
              </Button>
            </Section>
          </InfoCard>

          <FormCard>
            <Section>
              <SectionTitle>Applicant details</SectionTitle>
              <NameGrid>
                <Input
                  label="First Name *"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleFieldChange('firstName')}
                  error={fieldErrors.firstName}
                />
                <Input
                  label="Father Name"
                  placeholder="Father name"
                  value={formData.fatherName}
                  onChange={handleFieldChange('fatherName')}
                />
                <Input
                  label="Grand Name"
                  placeholder="Grand name"
                  value={formData.grandName}
                  onChange={handleFieldChange('grandName')}
                />
                <Input
                  label="Family Name *"
                  placeholder="Family name"
                  value={formData.familyName}
                  onChange={handleFieldChange('familyName')}
                  error={fieldErrors.familyName}
                />
              </NameGrid>
              <FieldGrid>
                <Input
                  label="Phone *"
                  placeholder="+971501234567"
                  value={formData.phone}
                  onChange={handleFieldChange('phone')}
                  error={fieldErrors.phone}
                />
                <Input
                  type="email"
                  label="Email *"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleFieldChange('email')}
                  error={fieldErrors.email}
                />
                <Input
                  type="password"
                  label="Password *"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleFieldChange('password')}
                  error={fieldErrors.password}
                />
              </FieldGrid>
            </Section>

            <Section>
              <SectionTitle>Verify &amp; continue</SectionTitle>
              <HelperText>
                We send a single 6-digit code to both the phone number and email address above. Applicants can use either channel to confirm their account.
              </HelperText>
              <ActionsRow>
                <Button onClick={handleSendVerification}>Continue &amp; Send Verification Code</Button>
                <Button variant="outline" onClick={handleStartDemo}>
                  Skip (Demo)
                </Button>
                {status && <StatusMessage type={status.type}>{status.message}</StatusMessage>}
              </ActionsRow>

              {verificationSent && (
                <OTPSection>
                  <OTPTargets>
                    <span>
                      📱 <strong>Mobile:</strong> {verificationTargets.phone || '—'}
                    </span>
                    <span>
                      📧 <strong>Email:</strong> {verificationTargets.email || '—'}
                    </span>
                  </OTPTargets>
                  <div>
                    <HelperText style={{ marginBottom: '0.5rem' }}>
                      Enter the 6-digit verification code from either channel.
                    </HelperText>
                    <OTPInputs>
                      {otpValues.map((value, index) => (
                        <OTPInput
                          key={index}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={value}
                          onChange={(event) => handleOtpChange(index, event.target.value)}
                          ref={(element) => {
                            otpRefs.current[index] = element;
                          }}
                        />
                      ))}
                    </OTPInputs>
                  </div>
                  <ActionsRow>
                    <Button variant="success" onClick={handleVerifyCode} disabled={isVerified}>
                      {isVerified ? 'Verified' : 'Verify Code'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleResendCode}
                      disabled={countdown > 0}
                    >
                      {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                    </Button>
                  </ActionsRow>
                  <HelperText>
                    Default demo code: <strong>{SIM_OTP}</strong>
                  </HelperText>
                  {isVerified && (
                    <VerifiedBadge>
                      ✅ Identity verified. The profile wizard can now be unlocked.
                    </VerifiedBadge>
                  )}
                </OTPSection>
              )}
            </Section>
          </FormCard>
        </Grid>
      </Content>
    </PageWrapper>
  );
};

export default QuickRegistration;

