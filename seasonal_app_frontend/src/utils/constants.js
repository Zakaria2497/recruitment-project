/**
 * App constants and configuration
 */

export const APP_NAME = 'Seasonal Recruitment App';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const FILE_UPLOAD_LIMITS = {
  PHOTO: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['.jpg', '.jpeg', '.png', '.gif'],
    MIME_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  },
  DOCUMENTS: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['.pdf', '.doc', '.docx'],
    MIME_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
};

export const PROFICIENCY_LEVELS = [
  'Basic',
  'Good',
  'Very Good',
  'Excellent',
];

export const DEGREE_LEVELS = [
  'High School',
  'Diploma',
  'Bachelor',
  'Master',
  'PhD',
];

export const GENDERS = [
  'Male',
  'Female',
];

export const ATTACHMENT_TYPES = {
  CV_RESUME: 'cv_resume',
  COVER_LETTER: 'cover_letter',
  PORTFOLIO: 'portfolio',
};

export const PROFILE_STEPS = [
  { number: 1, label: 'Personal Info', key: 'personalInfo' },
  { number: 2, label: 'Education', key: 'education' },
  { number: 3, label: 'Experience', key: 'experiences' },
  { number: 4, label: 'Skills & Languages', key: 'skills' },
  { number: 5, label: 'Bank Info', key: 'bankInfo' },
  { number: 6, label: 'Attachments', key: 'attachments' },
];

export const MIN_PROFILE_COMPLETION = 80; // Percentage required to submit

export const OTP_RESEND_COOLDOWN = 60; // seconds

export const AUTO_SAVE_DELAY = 1000; // milliseconds

