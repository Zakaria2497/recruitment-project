/**
 * Profile Wizard - Multi-step form for profile completion
 */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Card } from '../components/ui';
import { loadProfile, setCurrentStep } from '../store/slices/profileSlice';
import PersonalInfoForm from '../components/forms/PersonalInfoForm';
import EducationForm from '../components/forms/EducationForm';
import ExperienceForm from '../components/forms/ExperienceForm';
import SkillsForm from '../components/forms/SkillsForm';
import BankInfoForm from '../components/forms/BankInfoForm';
import AttachmentsForm from '../components/forms/AttachmentsForm';

const WizardContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}15 0%, ${({ theme }) => theme.colors.secondary}15 100%);
  display: flex;
  flex-direction: column;
`;

const WizardHeader = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
  color: white;
  padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
  width: 100%;
`;

const HeaderContent = styled.div`
  width: 100%;
  max-width: 100%;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: white;
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
`;

const WizardContent = styled.div`
  flex: 1;
  display: flex;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing['2xl']};
  gap: ${({ theme }) => theme.spacing.xl};
  box-sizing: border-box;
  
  @media (max-width: 1024px) {
    flex-direction: column;
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

const Sidebar = styled.div`
  width: 380px;
  flex-shrink: 0;
  
  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const SidebarCard = styled(Card)`
  position: sticky;
  top: ${({ theme }) => theme.spacing.xl};
  height: fit-content;
`;

const MainContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

const MainCard = styled(Card)`
  min-height: 600px;
  width: 100%;
  flex: 1;
`;

const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StepItem = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'completed' && prop !== 'clickable',
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  cursor: ${({ clickable }) => clickable ? 'pointer' : 'default'};
  transition: all 0.2s ease;
  background-color: ${({ theme, active }) => active ? `${theme.colors.primary}10` : 'transparent'};
  border: 2px solid ${({ theme, active, completed }) => 
    active ? theme.colors.primary : 
    completed ? theme.colors.success : 
    'transparent'};
  
  &:hover {
    background-color: ${({ theme, clickable }) => clickable ? theme.colors.gray50 : 'transparent'};
  }
`;

const StepNumber = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'completed',
})`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${({ theme, active, completed }) => 
    completed ? theme.colors.success : 
    active ? theme.colors.primary : 
    theme.colors.gray300};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize.lg};
  flex-shrink: 0;
  transition: all 0.3s ease;
  box-shadow: ${({ theme, active }) => active ? theme.shadows.md : 'none'};
`;

const StepInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const StepTitle = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'active',
})`
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme, active }) => active ? theme.fontWeight.semibold : theme.fontWeight.medium};
  color: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StepDescription = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ProgressSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.xl};
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray200};
`;

const ProgressTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background-color: ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
  transition: width 0.3s ease;
  width: ${({ progress }) => progress}%;
  border-radius: ${({ theme }) => theme.borderRadius.full};
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ProgressPercentage = styled.span`
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.primary};
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.xl};
  border-top: 2px solid ${({ theme }) => theme.colors.gray200};
  gap: ${({ theme }) => theme.spacing.md};
`;

const steps = [
  { number: 1, label: 'Personal Info' },
  { number: 2, label: 'Education' },
  { number: 3, label: 'Experience' },
  { number: 4, label: 'Skills & Languages' },
  { number: 5, label: 'Bank Info' },
  { number: 6, label: 'Attachments' },
];

const ProfileWizard = () => {
  const dispatch = useDispatch();
  const { currentStep, progress, loading, personalInfo } = useSelector(state => state.profile);

  useEffect(() => {
    // Load profile data on mount only once, and only if not already loaded
    if (!personalInfo && !loading) {
      dispatch(loadProfile());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run on mount

  const handleStepClick = (stepNumber) => {
    if (stepNumber <= currentStep) {
      dispatch(setCurrentStep(stepNumber));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoForm />;
      case 2:
        return <EducationForm />;
      case 3:
        return <ExperienceForm />;
      case 4:
        return <SkillsForm />;
      case 5:
        return <BankInfoForm />;
      case 6:
        return <AttachmentsForm />;
      default:
        return <PersonalInfoForm />;
    }
  };

  const stepDescriptions = {
    1: 'Basic personal details',
    2: 'Educational background',
    3: 'Work experience history',
    4: 'Skills and languages',
    5: 'Banking information',
    6: 'Documents and submission',
  };

  return (
    <WizardContainer>
      <WizardHeader>
        <HeaderContent>
          <Title>Complete Your Profile</Title>
          <Subtitle>Fill in your information to complete your application</Subtitle>
        </HeaderContent>
      </WizardHeader>

      <WizardContent>
        <Sidebar>
          <SidebarCard>
            <ProgressSection>
              <ProgressTitle>Progress</ProgressTitle>
              <ProgressBar>
                <ProgressFill progress={progress} />
              </ProgressBar>
              <ProgressText>
                <span>Completion</span>
                <ProgressPercentage>{progress}%</ProgressPercentage>
              </ProgressText>
            </ProgressSection>

            <div>
              <ProgressTitle style={{ marginBottom: '1rem' }}>Steps</ProgressTitle>
              <StepList>
                {steps.map((step) => (
                  <StepItem
                    key={step.number}
                    active={step.number === currentStep}
                    completed={step.number < currentStep}
                    clickable={step.number <= currentStep}
                    onClick={() => handleStepClick(step.number)}
                  >
                    <StepNumber
                      active={step.number === currentStep}
                      completed={step.number < currentStep}
                    >
                      {step.number < currentStep ? '✓' : step.number}
                    </StepNumber>
                    <StepInfo>
                      <StepTitle active={step.number === currentStep}>
                        {step.label}
                      </StepTitle>
                      <StepDescription>
                        {stepDescriptions[step.number]}
                      </StepDescription>
                    </StepInfo>
                  </StepItem>
                ))}
              </StepList>
            </div>
          </SidebarCard>
        </Sidebar>

        <MainContent>
          <MainCard>
            {loading && (
              <div style={{ 
                textAlign: 'center', 
                padding: '4rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  border: '4px solid #e5e7eb',
                  borderTopColor: '#0ea5e9',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <p style={{ color: '#6b7280', fontSize: '1rem' }}>Loading your profile...</p>
              </div>
            )}

            {!loading && renderStepContent()}
          </MainCard>
        </MainContent>
      </WizardContent>
    </WizardContainer>
  );
};

export default ProfileWizard;

