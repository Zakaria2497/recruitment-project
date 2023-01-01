/**
 * Experience Form
 */
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button, Input } from '../ui';
import { createExperience, deleteExperience, previousStep, nextStep } from '../../store/slices/profileSlice';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ExperienceItem = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ExperienceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ExperienceTitle = styled.h4`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

const ExperienceDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FileInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 2px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const ExperienceForm = () => {
  const dispatch = useDispatch();
  const { experiences, loading } = useSelector(state => state.profile);
  
  // Ensure experiences is an array
  const experiencesList = Array.isArray(experiences) ? experiences : 
                         experiences?.results ? experiences.results : [];
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    job_title: '',
    employer: '',
    start_date: '',
    end_date: '',
    tasks: '',
    is_current: false,
    certificate: null,
  });

  const handleAddExperience = () => {
    if (!formData.job_title || !formData.employer || !formData.start_date) {
      alert('Please fill all required fields');
      return;
    }

    if (!formData.is_current && !formData.end_date) {
      alert('Please provide an end date or mark as current job');
      return;
    }

    console.log('ExperienceForm - handleAddExperience with data:', formData);
    
    // Dispatch raw data object, not FormData
    dispatch(createExperience(formData));
    setFormData({
      job_title: '',
      employer: '',
      start_date: '',
      end_date: '',
      tasks: '',
      is_current: false,
      certificate: null,
    });
    setShowForm(false);
  };

  const handleDeleteExperience = (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      dispatch(deleteExperience(id));
    }
  };

  return (
    <FormContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>Work Experience</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Experience'}
        </Button>
      </div>

      {showForm && (
        <div style={{ 
          padding: '1.5rem', 
          border: '1px solid #e5e7eb', 
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <Input
            label="Job Title"
            value={formData.job_title}
            onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
            required
          />
          <Input
            label="Employer"
            value={formData.employer}
            onChange={(e) => setFormData({ ...formData, employer: e.target.value })}
            required
          />
          <ExperienceDetails>
            <Input
              type="date"
              label="Start Date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              required
            />
            {!formData.is_current && (
              <Input
                type="date"
                label="End Date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                required
              />
            )}
          </ExperienceDetails>
          <Input
            as="textarea"
            label="Tasks & Responsibilities"
            value={formData.tasks}
            onChange={(e) => setFormData({ ...formData, tasks: e.target.value })}
            rows={4}
          />
          <CheckboxWrapper>
            <input
              type="checkbox"
              id="is_current"
              checked={formData.is_current}
              onChange={(e) => setFormData({ ...formData, is_current: e.target.checked, end_date: '' })}
            />
            <label htmlFor="is_current">This is my current job</label>
          </CheckboxWrapper>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}>
              Experience Certificate
            </label>
            <FileInput
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFormData({ ...formData, certificate: e.target.files[0] })}
            />
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Max size: 10MB. Allowed: PDF, DOC, DOCX
            </span>
          </div>
          <Button type="button" onClick={handleAddExperience} size="sm">
            Add Experience
          </Button>
        </div>
      )}

      {experiencesList && experiencesList.length > 0 ? (
        experiencesList.map((experience) => (
          <ExperienceItem key={experience.id}>
            <ExperienceHeader>
              <ExperienceTitle>{experience.job_title}</ExperienceTitle>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => handleDeleteExperience(experience.id)}
              >
                Delete
              </Button>
            </ExperienceHeader>
            <ExperienceDetails>
              <div>
                <strong>Employer:</strong> {experience.employer}
              </div>
              <div>
                <strong>Period:</strong> {experience.start_date} - {experience.is_current ? 'Present' : experience.end_date}
              </div>
            </ExperienceDetails>
            {experience.tasks && (
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Tasks:</strong>
                <p style={{ marginTop: '0.25rem', color: '#6b7280' }}>{experience.tasks}</p>
              </div>
            )}
          </ExperienceItem>
        ))
      ) : (
        <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center', padding: '2rem' }}>
          No work experience added yet
        </p>
      )}

      <NavigationButtons>
        <Button type="button" variant="outline" onClick={() => dispatch(previousStep())}>
          Previous
        </Button>
        <Button type="button" onClick={() => dispatch(nextStep())} disabled={loading}>
          Continue
        </Button>
      </NavigationButtons>
    </FormContainer>
  );
};

export default ExperienceForm;

