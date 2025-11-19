/**
 * Education Form
 */
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button, Input } from '../ui';
import { saveEducation, nextStep, previousStep, createCourse, deleteCourse } from '../../store/slices/profileSlice';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const CoursesSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const CourseItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CourseInfo = styled.div`
  flex: 1;
`;

const CourseTitle = styled.h4`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CourseDetails = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
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

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const EducationForm = () => {
  const dispatch = useDispatch();
  const { education, courses, loading } = useSelector(state => state.profile);
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseFormData, setCourseFormData] = useState({
    title: '',
    provider: '',
    completion_date: '',
    certificate: null,
  });

  useEffect(() => {
    if (education) {
      Object.keys(education).forEach(key => {
        if (key !== 'certificates' && education[key]) {
          setValue(key, education[key]);
        }
      });
    }
  }, [education, setValue]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
        if (key === 'certificates' && data[key] instanceof File) {
          formData.append('certificates', data[key]);
        } else {
          formData.append(key, data[key]);
        }
      }
    });
    
    await dispatch(saveEducation(formData));
    // Navigate to next step after successful save
    setTimeout(() => {
      dispatch(nextStep());
    }, 500);
  };

  const handleAddCourse = () => {
    if (!courseFormData.title || !courseFormData.provider || !courseFormData.completion_date) {
      alert('Please fill all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', courseFormData.title);
    formData.append('provider', courseFormData.provider);
    formData.append('completion_date', courseFormData.completion_date);
    if (courseFormData.certificate) {
      formData.append('certificate', courseFormData.certificate);
    }

    dispatch(createCourse(formData));
    setCourseFormData({ title: '', provider: '', completion_date: '', certificate: null });
    setShowCourseForm(false);
  };

  const handleDeleteCourse = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      dispatch(deleteCourse(id));
    }
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormRow>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500
            }}>
              Highest Degree
            </label>
            <select
              {...register('last_degree', { required: 'Degree is required' })}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '2px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            >
              <option value="">Select Degree</option>
              <option value="High School">High School</option>
              <option value="Diploma">Diploma</option>
              <option value="Bachelor">Bachelor</option>
              <option value="Master">Master</option>
              <option value="PhD">PhD</option>
            </select>
            {errors.last_degree && (
              <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>
                {errors.last_degree.message}
              </span>
            )}
          </div>

          <Input
            label="Major"
            {...register('major', { required: 'Major is required' })}
            error={errors.major?.message}
          />
        </FormRow>

        <FormRow>
          <Input
            label="School/Institution"
            {...register('school', { required: 'School is required' })}
            error={errors.school?.message}
          />
          <Input
            type="number"
            label="Graduation Year"
            {...register('grad_year', { 
              required: 'Graduation year is required',
              min: { value: 1950, message: 'Invalid year' },
              max: { value: new Date().getFullYear() + 5, message: 'Invalid year' }
            })}
            error={errors.grad_year?.message}
          />
        </FormRow>

        <div>
          <label style={{ 
            fontSize: '0.875rem',
            fontWeight: 500,
            marginBottom: '0.5rem',
            display: 'block'
          }}>
            Education Certificates
          </label>
          <FileInput
            type="file"
            accept=".pdf,.doc,.docx"
            {...register('certificates')}
          />
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            Max size: 10MB. Allowed: PDF, DOC, DOCX
          </span>
        </div>

        <CoursesSection>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Additional Courses</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => setShowCourseForm(!showCourseForm)}
            >
              {showCourseForm ? 'Cancel' : 'Add Course'}
            </Button>
          </div>

          {showCourseForm && (
            <div style={{ 
              padding: '1rem', 
              border: '1px solid #e5e7eb', 
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <Input
                label="Course Title"
                value={courseFormData.title}
                onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
              />
              <Input
                label="Provider"
                value={courseFormData.provider}
                onChange={(e) => setCourseFormData({ ...courseFormData, provider: e.target.value })}
              />
              <Input
                type="date"
                label="Completion Date"
                value={courseFormData.completion_date}
                onChange={(e) => setCourseFormData({ ...courseFormData, completion_date: e.target.value })}
              />
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}>
                  Certificate
                </label>
                <FileInput
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setCourseFormData({ ...courseFormData, certificate: e.target.files[0] })}
                />
              </div>
              <Button type="button" onClick={handleAddCourse} size="sm">
                Add Course
              </Button>
            </div>
          )}

          {courses && courses.length > 0 ? (
            courses.map((course) => (
              <CourseItem key={course.id}>
                <CourseInfo>
                  <CourseTitle>{course.title}</CourseTitle>
                  <CourseDetails>
                    {course.provider} • {course.completion_date}
                  </CourseDetails>
                </CourseInfo>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteCourse(course.id)}
                >
                  Delete
                </Button>
              </CourseItem>
            ))
          ) : (
            <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No courses added yet</p>
          )}
        </CoursesSection>

        <NavigationButtons>
          <Button type="button" variant="outline" onClick={() => dispatch(previousStep())}>
            Previous
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save & Continue'}
          </Button>
        </NavigationButtons>
      </form>
    </FormContainer>
  );
};

export default EducationForm;

