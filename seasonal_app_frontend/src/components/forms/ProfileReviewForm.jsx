/**
 * Profile Review Form - Final review before submission
 */
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button } from '../ui';
import { submitProfile, previousStep, setCurrentStep } from '../../store/slices/profileSlice';
import { formatFileSize } from '../../utils';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const SectionCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 2px solid ${({ theme, complete }) => complete ? theme.colors.success : theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme, complete }) => complete ? `${theme.colors.success}10` : 'white'};
  position: relative;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Badge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  background-color: ${({ theme, variant }) => 
    variant === 'success' ? theme.colors.success : theme.colors.warning};
  color: white;
`;

const DataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const DataItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DataLabel = styled.span`
  font-size: 0.875rem;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DataValue = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  word-break: break-word;
`;

const ListItem = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const EmptyMessage = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-style: italic;
  font-size: 0.875rem;
`;

const ProfileReviewForm = () => {
  const dispatch = useDispatch();
  const profileState = useSelector(state => state.profile);
  const {
    personalInfo,
    education,
    experiences = [],
    courses = [],
    languages = [],
    skills = [],
    bankInfo,
    attachments = [],
    completion,
    progress,
    loading,
    isSubmitted
  } = profileState;

  const handleEdit = (step) => {
    dispatch(setCurrentStep(step));
  };

  const handleSubmitProfile = () => {
    if (progress < 80) {
      alert('Profile must be at least 80% complete before submission');
      return;
    }

    if (window.confirm('Are you sure you want to submit your profile? You won\'t be able to edit it after submission.')) {
      dispatch(submitProfile());
    }
  };

  return (
    <FormContainer>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Review Your Profile</h2>
        <p style={{ color: '#6b7280' }}>
          Please review all your information before submitting. You can edit any section by clicking the "Edit" button.
        </p>
      </div>

      {isSubmitted && (
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#d1fae5',
          border: '2px solid #059669',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
          <strong style={{ color: '#065f46', fontSize: '1.25rem' }}>Profile Already Submitted!</strong>
          <p style={{ color: '#047857', margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
            Your profile has been submitted for review.
          </p>
        </div>
      )}

      {/* Personal Information */}
      <SectionCard complete={completion?.personal_info_complete}>
        <SectionHeader>
          <SectionTitle>
            Personal Information
            <Badge variant={completion?.personal_info_complete ? 'success' : 'warning'}>
              {completion?.personal_info_complete ? '✓ Complete' : '⚠ Incomplete'}
            </Badge>
          </SectionTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleEdit(1)}
            disabled={isSubmitted}
          >
            Edit
          </Button>
        </SectionHeader>
        {personalInfo ? (
          <DataGrid>
            <DataItem>
              <DataLabel>Full Name</DataLabel>
              <DataValue>{personalInfo.first_name} {personalInfo.father_name} {personalInfo.grand_name} {personalInfo.family_name}</DataValue>
            </DataItem>
            <DataItem>
              <DataLabel>Gender</DataLabel>
              <DataValue>{personalInfo.gender || 'Not specified'}</DataValue>
            </DataItem>
            <DataItem>
              <DataLabel>Date of Birth</DataLabel>
              <DataValue>{personalInfo.birthdate || 'Not specified'}</DataValue>
            </DataItem>
            <DataItem>
              <DataLabel>Nationality</DataLabel>
              <DataValue>{personalInfo.nationality || 'Not specified'}</DataValue>
            </DataItem>
            <DataItem>
              <DataLabel>ID Number</DataLabel>
              <DataValue>{personalInfo.id_number || 'Not specified'}</DataValue>
            </DataItem>
            <DataItem>
              <DataLabel>City</DataLabel>
              <DataValue>{personalInfo.city || 'Not specified'}</DataValue>
            </DataItem>
            <DataItem>
              <DataLabel>Address</DataLabel>
              <DataValue>{personalInfo.address || 'Not specified'}</DataValue>
            </DataItem>
          </DataGrid>
        ) : (
          <EmptyMessage>No personal information provided</EmptyMessage>
        )}
      </SectionCard>

      {/* Education */}
      <SectionCard complete={completion?.education_complete}>
        <SectionHeader>
          <SectionTitle>
            Education
            <Badge variant={completion?.education_complete ? 'success' : 'warning'}>
              {completion?.education_complete ? '✓ Complete' : '⚠ Incomplete'}
            </Badge>
          </SectionTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleEdit(2)}
            disabled={isSubmitted}
          >
            Edit
          </Button>
        </SectionHeader>
        {education ? (
          <>
            <DataGrid>
              <DataItem>
                <DataLabel>Highest Degree</DataLabel>
                <DataValue>{education.last_degree || 'Not specified'}</DataValue>
              </DataItem>
              <DataItem>
                <DataLabel>Major/Field of Study</DataLabel>
                <DataValue>{education.major || 'Not specified'}</DataValue>
              </DataItem>
              <DataItem>
                <DataLabel>School/Institution</DataLabel>
                <DataValue>{education.school || 'Not specified'}</DataValue>
              </DataItem>
              <DataItem>
                <DataLabel>Graduation Year</DataLabel>
                <DataValue>{education.grad_year || 'Not specified'}</DataValue>
              </DataItem>
            </DataGrid>
            {courses && courses.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <DataLabel>Courses & Certifications:</DataLabel>
                {courses.map((course, index) => (
                  <ListItem key={course.id || index}>
                    <strong>{course.title}</strong> - {course.provider} ({new Date(course.completion_date).getFullYear()})
                  </ListItem>
                ))}
              </div>
            )}
          </>
        ) : (
          <EmptyMessage>No education information provided</EmptyMessage>
        )}
      </SectionCard>

      {/* Experience */}
      <SectionCard complete={completion?.experience_complete}>
        <SectionHeader>
          <SectionTitle>
            Work Experience
            <Badge variant={completion?.experience_complete ? 'success' : 'warning'}>
              {completion?.experience_complete ? '✓ Complete' : '⚠ Incomplete'}
            </Badge>
          </SectionTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleEdit(3)}
            disabled={isSubmitted}
          >
            Edit
          </Button>
        </SectionHeader>
        {experiences && experiences.length > 0 ? (
          experiences.map((exp, index) => (
            <ListItem key={exp.id || index}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong>{exp.job_title}</strong>
                <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
                </span>
              </div>
              <div style={{ color: '#6b7280' }}>{exp.employer}</div>
              {exp.tasks && <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>{exp.tasks}</div>}
            </ListItem>
          ))
        ) : (
          <EmptyMessage>No work experience added</EmptyMessage>
        )}
      </SectionCard>

      {/* Skills & Languages */}
      <SectionCard complete={completion?.skills_complete}>
        <SectionHeader>
          <SectionTitle>
            Skills & Languages
            <Badge variant={completion?.skills_complete ? 'success' : 'warning'}>
              {completion?.skills_complete ? '✓ Complete' : '⚠ Incomplete'}
            </Badge>
          </SectionTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleEdit(4)}
            disabled={isSubmitted}
          >
            Edit
          </Button>
        </SectionHeader>
        <DataGrid>
          <div>
            <DataLabel>Languages:</DataLabel>
            {languages && languages.length > 0 ? (
              languages.map((lang, index) => (
                <ListItem key={lang.id || index}>
                  {lang.language} - {lang.proficiency_level}
                </ListItem>
              ))
            ) : (
              <EmptyMessage>No languages added</EmptyMessage>
            )}
          </div>
          <div>
            <DataLabel>Skills:</DataLabel>
            {skills && skills.length > 0 ? (
              skills.map((skill, index) => (
                <ListItem key={skill.id || index}>
                  {skill.skill_name}
                </ListItem>
              ))
            ) : (
              <EmptyMessage>No skills added</EmptyMessage>
            )}
          </div>
        </DataGrid>
      </SectionCard>

      {/* Bank Information */}
      <SectionCard complete={completion?.bank_info_complete}>
        <SectionHeader>
          <SectionTitle>
            Bank Information
            <Badge variant={completion?.bank_info_complete ? 'success' : 'warning'}>
              {completion?.bank_info_complete ? '✓ Complete' : '⚠ Incomplete'}
            </Badge>
          </SectionTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleEdit(5)}
            disabled={isSubmitted}
          >
            Edit
          </Button>
        </SectionHeader>
        {bankInfo ? (
          <DataGrid>
            <DataItem>
              <DataLabel>Bank Name</DataLabel>
              <DataValue>{bankInfo.bank_name || 'Not specified'}</DataValue>
            </DataItem>
            <DataItem>
              <DataLabel>Account Holder Name</DataLabel>
              <DataValue>{bankInfo.account_holder_name || 'Not specified'}</DataValue>
            </DataItem>
            <DataItem>
              <DataLabel>IBAN</DataLabel>
              <DataValue>{bankInfo.iban || 'Not specified'}</DataValue>
            </DataItem>
          </DataGrid>
        ) : (
          <EmptyMessage>No bank information provided</EmptyMessage>
        )}
      </SectionCard>

      {/* Attachments */}
      <SectionCard complete={completion?.attachments_complete}>
        <SectionHeader>
          <SectionTitle>
            Documents
            <Badge variant={completion?.attachments_complete ? 'success' : 'warning'}>
              {completion?.attachments_complete ? '✓ Complete' : '⚠ Incomplete'}
            </Badge>
          </SectionTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleEdit(6)}
            disabled={isSubmitted}
          >
            Edit
          </Button>
        </SectionHeader>
        {attachments && attachments.length > 0 ? (
          attachments.map((att, index) => (
            <ListItem key={att.id || index}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{att.attachment_type === 'cv_resume' ? 'CV/Resume' : att.attachment_type === 'cover_letter' ? 'Cover Letter' : 'Portfolio'}</strong>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {att.original_filename} ({formatFileSize(att.file_size)})
                  </div>
                </div>
              </div>
            </ListItem>
          ))
        ) : (
          <EmptyMessage>No documents uploaded</EmptyMessage>
        )}
      </SectionCard>

      {/* Completion Summary */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: progress >= 80 ? '#d1fae5' : '#fef3c7',
        border: `2px solid ${progress >= 80 ? '#059669' : '#fbbf24'}`,
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          {progress >= 80 ? '✅' : '⚠️'}
        </div>
        <strong style={{ fontSize: '1.25rem' }}>
          Profile Completion: {progress}%
        </strong>
        {progress < 80 && (
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            You need at least 80% completion to submit your profile. Please complete the missing sections.
          </p>
        )}
        {progress >= 80 && !isSubmitted && (
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#047857' }}>
            Your profile is ready for submission!
          </p>
        )}
      </div>

      {/* Navigation */}
      <NavigationButtons>
        <Button type="button" variant="outline" onClick={() => dispatch(previousStep())}>
          Previous
        </Button>
        {!isSubmitted && (
          <Button
            type="button"
            onClick={handleSubmitProfile}
            disabled={loading || progress < 80}
            variant="primary"
            style={{
              minWidth: '200px',
              opacity: (loading || progress < 80) ? 0.7 : 1,
              cursor: (loading || progress < 80) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Submitting...' : progress < 80 ? `Complete Profile (${progress}%)` : 'Submit Profile'}
          </Button>
        )}
      </NavigationButtons>
    </FormContainer>
  );
};

export default ProfileReviewForm;

