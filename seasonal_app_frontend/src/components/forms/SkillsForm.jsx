/**
 * Skills and Languages Form
 */
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button, Input } from '../ui';
import { createLanguage, deleteLanguage, createSkill, deleteSkill, previousStep, nextStep } from '../../store/slices/profileSlice';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

const ItemList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ItemChip = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.danger};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize.lg};
  line-height: 1;
  padding: 0;
  margin-left: ${({ theme }) => theme.spacing.xs};
  
  &:hover {
    opacity: 0.8;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const SkillsForm = () => {
  const dispatch = useDispatch();
  const { languages, skills, loading } = useSelector(state => state.profile);
  const [languageForm, setLanguageForm] = useState({
    language: '',
    proficiency_level: 'Good',
  });
  const [skillInput, setSkillInput] = useState('');

  const handleAddLanguage = () => {
    if (!languageForm.language.trim()) {
      alert('Please enter a language');
      return;
    }

    dispatch(createLanguage(languageForm));
    setLanguageForm({ language: '', proficiency_level: 'Good' });
  };

  const handleAddSkill = () => {
    if (!skillInput.trim()) {
      alert('Please enter a skill');
      return;
    }

    // Split by comma and add each skill
    const skillsToAdd = skillInput.split(',').map(s => s.trim()).filter(s => s);
    skillsToAdd.forEach(skill => {
      dispatch(createSkill({ skill_name: skill }));
    });
    setSkillInput('');
  };

  const handleDeleteLanguage = (id) => {
    if (window.confirm('Are you sure you want to delete this language?')) {
      dispatch(deleteLanguage(id));
    }
  };

  const handleDeleteSkill = (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      dispatch(deleteSkill(id));
    }
  };

  return (
    <FormContainer>
      <Section>
        <SectionTitle>Languages</SectionTitle>
        
        <FormRow>
          <div>
            <Input
              label="Language"
              value={languageForm.language}
              onChange={(e) => setLanguageForm({ ...languageForm, language: e.target.value })}
              placeholder="e.g., Arabic, English"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Proficiency</label>
            <select
              value={languageForm.proficiency_level}
              onChange={(e) => setLanguageForm({ ...languageForm, proficiency_level: e.target.value })}
              style={{
                padding: '0.5rem',
                border: '2px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                minWidth: '150px'
              }}
            >
              <option value="Basic">Basic</option>
              <option value="Good">Good</option>
              <option value="Very Good">Very Good</option>
              <option value="Excellent">Excellent</option>
            </select>
          </div>
        </FormRow>
        <Button type="button" onClick={handleAddLanguage} size="sm" variant="outline">
          Add Language
        </Button>

        {languages && languages.length > 0 ? (
          <ItemList>
            {languages.map((lang) => (
              <ItemChip key={lang.id}>
                {lang.language} ({lang.proficiency_level})
                <DeleteButton onClick={() => handleDeleteLanguage(lang.id)}>
                  ×
                </DeleteButton>
              </ItemChip>
            ))}
          </ItemList>
        ) : (
          <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No languages added yet</p>
        )}
      </Section>

      <Section>
        <SectionTitle>Skills</SectionTitle>
        
        <FormRow>
          <Input
            label="Skills (comma-separated)"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="e.g., Customer Service, Sales, Communication"
            helperText="Enter multiple skills separated by commas"
          />
        </FormRow>
        <Button type="button" onClick={handleAddSkill} size="sm" variant="outline">
          Add Skills
        </Button>

        {skills && skills.length > 0 ? (
          <ItemList>
            {skills.map((skill) => (
              <ItemChip key={skill.id}>
                {skill.skill_name}
                <DeleteButton onClick={() => handleDeleteSkill(skill.id)}>
                  ×
                </DeleteButton>
              </ItemChip>
            ))}
          </ItemList>
        ) : (
          <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No skills added yet</p>
        )}
      </Section>

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

export default SkillsForm;

