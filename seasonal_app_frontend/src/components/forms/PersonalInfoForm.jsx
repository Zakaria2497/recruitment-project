/**
 * Personal Information Form
 */
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button, Input } from '../ui';
import { savePersonalInfo, nextStep, previousStep } from '../../store/slices/profileSlice';
import { formatDate } from '../../utils';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const FileUploadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FileInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 2px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const PreviewImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 2px solid ${({ theme }) => theme.colors.gray200};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const PersonalInfoForm = () => {
  const dispatch = useDispatch();
  const { personalInfo, loading } = useSelector(state => state.profile);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (personalInfo) {
      Object.keys(personalInfo).forEach(key => {
        if (key !== 'photo' && personalInfo[key]) {
          setValue(key, personalInfo[key]);
        }
      });
      if (personalInfo.photo) {
        setPhotoPreview(personalInfo.photo);
      }
    }
  }, [personalInfo, setValue]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)) {
        alert('Only JPG, PNG, and GIF images are allowed');
        return;
      }
      setValue('photo', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    console.log('PersonalInfoForm - onSubmit called with data:', data);
    console.log('PersonalInfoForm - Data keys:', Object.keys(data));
    console.log('PersonalInfoForm - Data values:', Object.values(data));
    
    // Send raw data object (including File objects) to saga
    // The saga/service will handle FormData conversion
    console.log('PersonalInfoForm - Dispatching savePersonalInfo with raw data');
    await dispatch(savePersonalInfo(data));
    
    // Navigate to next step after successful save
    setTimeout(() => {
      dispatch(nextStep());
    }, 500);
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormRow>
          <Input
            label="First Name"
            {...register('first_name', { required: 'First name is required' })}
            error={errors.first_name?.message}
          />
          <Input
            label="Father Name"
            {...register('father_name', { required: 'Father name is required' })}
            error={errors.father_name?.message}
          />
        </FormRow>

        <FormRow>
          <Input
            label="Grand Name"
            {...register('grand_name')}
            error={errors.grand_name?.message}
          />
          <Input
            label="Family Name"
            {...register('family_name', { required: 'Family name is required' })}
            error={errors.family_name?.message}
          />
        </FormRow>

        <FormRow>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500
            }}>
              Gender
            </label>
            <select
              {...register('gender', { required: 'Gender is required' })}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '2px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && (
              <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>
                {errors.gender.message}
              </span>
            )}
          </div>

          <Input
            type="date"
            label="Birthdate"
            {...register('birthdate', { required: 'Birthdate is required' })}
            error={errors.birthdate?.message}
          />
        </FormRow>

        <FormRow>
          <Input
            label="Nationality"
            {...register('nationality', { required: 'Nationality is required' })}
            error={errors.nationality?.message}
          />
          <Input
            label="ID Number"
            {...register('id_number', { required: 'ID number is required' })}
            error={errors.id_number?.message}
          />
        </FormRow>

        <FormRow>
          <Input
            label="City"
            {...register('city', { required: 'City is required' })}
            error={errors.city?.message}
          />
        </FormRow>

        <Input
          label="Address"
          {...register('address', { required: 'Address is required' })}
          error={errors.address?.message}
        />

        <FileUploadWrapper>
          <label style={{ 
            fontSize: '0.875rem',
            fontWeight: 500,
            marginBottom: '0.5rem'
          }}>
            Profile Photo
          </label>
          <FileInput
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            onChange={handlePhotoChange}
          />
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            Max size: 5MB. Allowed: JPG, PNG, GIF
          </span>
          {photoPreview && (
            <PreviewImage src={photoPreview} alt="Profile preview" />
          )}
        </FileUploadWrapper>

        <NavigationButtons>
          <div></div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save & Continue'}
          </Button>
        </NavigationButtons>
      </form>
    </FormContainer>
  );
};

export default PersonalInfoForm;

