/**
 * Attachments Form - CV/Resume, Cover Letter, Portfolio
 */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button, Input } from '../ui';
import { uploadAttachment, deleteAttachment, submitProfile, previousStep, nextStep } from '../../store/slices/profileSlice';
import { formatFileSize } from '../../utils';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const AttachmentSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const SectionTitle = styled.h4`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FileInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 2px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FileInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const FileDetails = styled.div`
  flex: 1;
`;

const FileName = styled.div`
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const FileSize = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  transition: width 0.3s ease;
  width: ${({ progress }) => progress}%;
`;

const SummaryCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.success}10;
  border: 1px solid ${({ theme }) => theme.colors.success};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const attachmentTypes = [
  { value: 'cv_resume', label: 'CV/Resume' },
  { value: 'cover_letter', label: 'Cover Letter' },
  { value: 'portfolio', label: 'Portfolio' },
];

const AttachmentsForm = () => {
  const dispatch = useDispatch();
  const profileState = useSelector(state => state.profile);
  const { 
    attachments = [], 
    progress = 0, 
    isSubmitted = false, 
    loading = false 
  } = profileState || {};
  
  const [fileInputs, setFileInputs] = useState({
    cv_resume: null,
    cover_letter: null,
    portfolio: null,
  });

  const handleFileChange = (type, file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      alert('Only PDF, DOC, and DOCX files are allowed');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    console.log('AttachmentsForm - handleFileChange with type:', type, 'file:', file);
    
    // Dispatch raw data object with file, not FormData
    const data = {
      attachment_type: type,
      file: file
    };

    dispatch(uploadAttachment(data));
    setFileInputs({ ...fileInputs, [type]: null });
  };

  const handleDeleteAttachment = (id) => {
    if (window.confirm('Are you sure you want to delete this attachment?')) {
      dispatch(deleteAttachment(id));
    }
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

  const getAttachmentByType = (type) => {
    // Ensure attachments is an array
    const attachmentsList = Array.isArray(attachments) ? attachments : 
                           attachments?.results ? attachments.results : [];
    return attachmentsList.find(a => a.attachment_type === type);
  };

  return (
    <FormContainer>
      <h2 style={{ marginBottom: '1.5rem' }}>Upload Documents</h2>

      {attachmentTypes.map(({ value, label }) => {
        const existingAttachment = getAttachmentByType(value);
        
        return (
          <AttachmentSection key={value}>
            <SectionTitle>{label}</SectionTitle>
            
            {!existingAttachment ? (
              <>
                <FileInput
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      handleFileChange(value, e.target.files[0]);
                    }
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Max size: 10MB. Allowed: PDF, DOC, DOCX
                </span>
              </>
            ) : (
              <FileInfo>
                <FileDetails>
                  <FileName>{existingAttachment.original_filename}</FileName>
                  <FileSize>{formatFileSize(existingAttachment.file_size)}</FileSize>
                </FileDetails>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteAttachment(existingAttachment.id)}
                >
                  Delete
                </Button>
              </FileInfo>
            )}
          </AttachmentSection>
        );
      })}

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
          <strong style={{ color: '#065f46', fontSize: '1.25rem' }}>Profile Submitted Successfully!</strong>
          <p style={{ color: '#047857', margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
            Your profile has been submitted for review. You will be notified once it's processed.
          </p>
        </div>
      )}

      <SummaryCard>
        <h3 style={{ marginBottom: '1rem' }}>Profile Summary</h3>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>Completion:</strong> {progress}%
        </div>
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
      </SummaryCard>

      {progress < 80 && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fef3c7',
          border: '1px solid #fbbf24',
          borderRadius: '8px',
          marginTop: '1.5rem',
          marginBottom: '1rem'
        }}>
          <strong style={{ color: '#92400e' }}>⚠️ Complete your profile to submit</strong>
          <p style={{ color: '#78350f', margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
            You need at least 80% completion to submit. Current: {progress}%
          </p>
          <p style={{ color: '#78350f', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
            Go back and fill in the missing sections (Education, Bank Info, etc.)
          </p>
        </div>
      )}

      <NavigationButtons>
        <Button type="button" variant="outline" onClick={() => dispatch(previousStep())}>
          Previous
        </Button>
        <Button
          type="button"
          onClick={() => dispatch(nextStep())}
          variant="primary"
        >
          Next: Review & Submit
        </Button>
      </NavigationButtons>
    </FormContainer>
  );
};

export default AttachmentsForm;

