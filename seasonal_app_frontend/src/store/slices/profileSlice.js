/**
 * Profile slice - manages profile state
 */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  personalInfo: null,
  education: null,
  experiences: [],
  courses: [],
  languages: [],
  skills: [],
  bankInfo: null,
  attachments: [],
  currentStep: 1,
  progress: 0,
  loading: false,
  error: null,
  isSubmitted: false,
  completion: null, // Store completion status from API
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },

    // Personal Info
    setPersonalInfo: (state, action) => {
      state.personalInfo = action.payload;
    },
    updatePersonalInfo: (state, action) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
    },

    // Education
    setEducation: (state, action) => {
      state.education = action.payload;
    },
    updateEducation: (state, action) => {
      state.education = { ...state.education, ...action.payload };
    },

    // Courses
    setCourses: (state, action) => {
      state.courses = action.payload || [];
    },
    addCourse: (state, action) => {
      state.courses.push(action.payload);
    },
    updateCourse: (state, action) => {
      const index = state.courses.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.courses[index] = action.payload;
      }
    },
    removeCourse: (state, action) => {
      state.courses = state.courses.filter(c => c.id !== action.payload);
    },

    // Experiences
    setExperiences: (state, action) => {
      state.experiences = action.payload || [];
    },
    addExperience: (state, action) => {
      state.experiences.push(action.payload);
    },
    updateExperience: (state, action) => {
      const index = state.experiences.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.experiences[index] = action.payload;
      }
    },
    removeExperience: (state, action) => {
      state.experiences = state.experiences.filter(e => e.id !== action.payload);
    },

    // Languages
    setLanguages: (state, action) => {
      state.languages = action.payload || [];
    },
    addLanguage: (state, action) => {
      state.languages.push(action.payload);
    },
    updateLanguage: (state, action) => {
      const index = state.languages.findIndex(l => l.id === action.payload.id);
      if (index !== -1) {
        state.languages[index] = action.payload;
      }
    },
    removeLanguage: (state, action) => {
      state.languages = state.languages.filter(l => l.id !== action.payload);
    },

    // Skills
    setSkills: (state, action) => {
      state.skills = action.payload || [];
    },
    addSkill: (state, action) => {
      state.skills.push(action.payload);
    },
    removeSkill: (state, action) => {
      state.skills = state.skills.filter(s => s.id !== action.payload);
    },

    // Bank Info
    setBankInfo: (state, action) => {
      state.bankInfo = action.payload;
    },
    updateBankInfo: (state, action) => {
      state.bankInfo = { ...state.bankInfo, ...action.payload };
    },

    // Attachments
    setAttachments: (state, action) => {
      state.attachments = action.payload || [];
    },
    addAttachment: (state, action) => {
      state.attachments.push(action.payload);
    },
    removeAttachment: (state, action) => {
      state.attachments = state.attachments.filter(a => a.id !== action.payload);
    },

    // Wizard Navigation
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      if (state.currentStep < 6) {
        state.currentStep += 1;
      }
    },
    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },
    goToStep: (state, action) => {
      if (action.payload >= 1 && action.payload <= 6) {
        state.currentStep = action.payload;
      }
    },

    // Progress
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    setCompletion: (state, action) => {
      state.completion = action.payload;
      state.progress = action.payload?.overall_completion_percentage || 0;
      state.isSubmitted = action.payload?.is_submitted || false;
    },

    // Submit
    setSubmitted: (state, action) => {
      state.isSubmitted = action.payload;
    },

    // Load complete profile (reducer - sets state from saga)
    setProfileData: (state, action) => {
      const profile = action.payload;
      state.personalInfo = profile.personalInfo || null;
      state.education = profile.education || null;
      state.experiences = profile.experiences || [];
      state.courses = profile.courses || [];
      state.languages = profile.languages || [];
      state.skills = profile.skills || [];
      state.bankInfo = profile.bankInfo || null;
      state.attachments = profile.attachments || [];
      state.completion = profile.completion || null;
      state.progress = profile.completion?.overall_completion_percentage || 0;
      state.isSubmitted = profile.completion?.is_submitted || false;
    },

    // Reset profile
    resetProfile: (state) => {
      return initialState;
    },

    // Saga action creators (these don't modify state, just trigger sagas)
    savePersonalInfo: (state, action) => {
      // Saga will handle the API call
    },
    saveEducation: (state, action) => {
      // Saga will handle the API call
    },
    createCourse: (state, action) => {
      // Saga will handle the API call
    },
    deleteCourse: (state, action) => {
      // Saga will handle the API call
    },
    createExperience: (state, action) => {
      // Saga will handle the API call
    },
    deleteExperience: (state, action) => {
      // Saga will handle the API call
    },
    createLanguage: (state, action) => {
      // Saga will handle the API call
    },
    deleteLanguage: (state, action) => {
      // Saga will handle the API call
    },
    createSkill: (state, action) => {
      // Saga will handle the API call
    },
    deleteSkill: (state, action) => {
      // Saga will handle the API call
    },
    saveBankInfo: (state, action) => {
      // Saga will handle the API call
    },
    uploadAttachment: (state, action) => {
      // Saga will handle the API call
    },
    deleteAttachment: (state, action) => {
      // Saga will handle the API call
    },
    loadProfile: (state, action) => {
      // Saga will handle the API call - this triggers the saga
    },
    submitProfile: (state, action) => {
      // Saga will handle the API call
    },
    autoSave: (state, action) => {
      // Saga will handle the API call
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setPersonalInfo,
  updatePersonalInfo,
  setEducation,
  updateEducation,
  setCourses,
  addCourse,
  updateCourse,
  removeCourse,
  setExperiences,
  addExperience,
  updateExperience,
  removeExperience,
  setLanguages,
  addLanguage,
  updateLanguage,
  removeLanguage,
  setSkills,
  addSkill,
  removeSkill,
  setBankInfo,
  updateBankInfo,
  setAttachments,
  addAttachment,
  removeAttachment,
  setCurrentStep,
  nextStep,
  previousStep,
  goToStep,
  setProgress,
  setCompletion,
  setSubmitted,
  setProfileData,
  loadProfile,
  resetProfile,
  savePersonalInfo,
  saveEducation,
  createCourse,
  deleteCourse,
  createExperience,
  deleteExperience,
  createLanguage,
  deleteLanguage,
  createSkill,
  deleteSkill,
  saveBankInfo,
  uploadAttachment,
  deleteAttachment,
  submitProfile,
  autoSave,
} = profileSlice.actions;

export default profileSlice.reducer;

