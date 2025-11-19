/**
 * useFormProgress hook - calculates completion percentage
 */
import { useSelector } from 'react-redux';

export const useFormProgress = () => {
  const { 
    personalInfo, 
    education, 
    experiences, 
    courses,
    languages, 
    skills, 
    bankInfo, 
    attachments,
    completion 
  } = useSelector(state => state.profile);

  // Calculate progress based on filled sections
  const calculateProgress = () => {
    if (completion?.overall_completion_percentage) {
      return completion.overall_completion_percentage;
    }

    let completedSections = 0;
    const totalSections = 8;

    // Personal Info
    if (personalInfo && personalInfo.first_name && personalInfo.family_name) {
      completedSections++;
    }

    // Education
    if (education && education.last_degree && education.major) {
      completedSections++;
    }

    // Experiences (at least one)
    if (experiences && experiences.length > 0) {
      completedSections++;
    }

    // Courses (optional but counted if exists)
    if (courses && courses.length > 0) {
      completedSections++;
    }

    // Languages (at least one)
    if (languages && languages.length > 0) {
      completedSections++;
    }

    // Skills (at least one)
    if (skills && skills.length > 0) {
      completedSections++;
    }

    // Bank Info
    if (bankInfo && bankInfo.bank_name && bankInfo.iban) {
      completedSections++;
    }

    // Attachments (at least CV/Resume)
    if (attachments && attachments.some(a => a.attachment_type === 'cv_resume')) {
      completedSections++;
    }

    return Math.round((completedSections / totalSections) * 100);
  };

  const progress = calculateProgress();

  // Check which sections are complete
  const sectionStatus = {
    personalInfo: !!(personalInfo && personalInfo.first_name && personalInfo.family_name),
    education: !!(education && education.last_degree && education.major),
    experiences: !!(experiences && experiences.length > 0),
    courses: !!(courses && courses.length > 0),
    languages: !!(languages && languages.length > 0),
    skills: !!(skills && skills.length > 0),
    bankInfo: !!(bankInfo && bankInfo.bank_name && bankInfo.iban),
    attachments: !!(attachments && attachments.some(a => a.attachment_type === 'cv_resume')),
  };

  return {
    progress,
    sectionStatus,
    canSubmit: progress >= 80,
  };
};

