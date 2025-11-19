/**
 * useProfile hook - profile data management
 */
import { useSelector, useDispatch } from 'react-redux';
import {
  loadProfile,
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
  nextStep,
  previousStep,
  goToStep,
  setCurrentStep,
} from '../store/slices/profileSlice';

export const useProfile = () => {
  const dispatch = useDispatch();
  const profile = useSelector(state => state.profile);

  return {
    // State
    ...profile,
    
    // Actions
    loadProfile: () => dispatch(loadProfile()),
    savePersonalInfo: (data) => dispatch(savePersonalInfo(data)),
    saveEducation: (data) => dispatch(saveEducation(data)),
    createCourse: (data) => dispatch(createCourse(data)),
    deleteCourse: (id) => dispatch(deleteCourse(id)),
    createExperience: (data) => dispatch(createExperience(data)),
    deleteExperience: (id) => dispatch(deleteExperience(id)),
    createLanguage: (data) => dispatch(createLanguage(data)),
    deleteLanguage: (id) => dispatch(deleteLanguage(id)),
    createSkill: (data) => dispatch(createSkill(data)),
    deleteSkill: (id) => dispatch(deleteSkill(id)),
    saveBankInfo: (data) => dispatch(saveBankInfo(data)),
    uploadAttachment: (data) => dispatch(uploadAttachment(data)),
    deleteAttachment: (id) => dispatch(deleteAttachment(id)),
    submitProfile: () => dispatch(submitProfile()),
    
    // Navigation
    nextStep: () => dispatch(nextStep()),
    previousStep: () => dispatch(previousStep()),
    goToStep: (step) => dispatch(goToStep(step)),
    setCurrentStep: (step) => dispatch(setCurrentStep(step)),
  };
};

