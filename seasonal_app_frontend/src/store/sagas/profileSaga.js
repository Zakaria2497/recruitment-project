/**
 * Profile sagas - handles profile management side effects
 */
import { call, put, takeLatest, select, debounce, all } from 'redux-saga/effects';
import {
  setLoading,
  setError,
  setPersonalInfo,
  setEducation,
  setCourses,
  setExperiences,
  setLanguages,
  setSkills,
  setBankInfo,
  setAttachments,
  setCompletion,
  setSubmitted,
  setProfileData,
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
  autoSave,
} from '../slices/profileSlice';
import * as profileService from '../../services/profileService';

/**
 * Save personal info saga
 */
function* savePersonalInfoSaga(action) {
  try {
    yield put(setLoading(true));
    const response = yield call(profileService.updatePersonalInfo, action.payload);
    yield put(setPersonalInfo(response.data));
    yield put(setLoading(false));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.detail || 
                        error.message || 
                        'Failed to save personal information';
    yield put(setError(errorMessage));
  }
}

/**
 * Save education saga
 */
function* saveEducationSaga(action) {
  try {
    yield put(setLoading(true));
    const response = yield call(profileService.updateEducation, action.payload);
    yield put(setEducation(response.data));
    yield put(setLoading(false));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.detail || 
                        error.message || 
                        'Failed to save education';
    yield put(setError(errorMessage));
  }
}

/**
 * Create course saga
 */
function* createCourseSaga(action) {
  try {
    yield put(setLoading(true));
    const response = yield call(profileService.createCourse, action.payload);
    const courses = yield select(state => state.profile.courses);
    yield put(setCourses([...courses, response.data]));
    yield put(setLoading(false));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.detail || 
                        error.message || 
                        'Failed to create course';
    yield put(setError(errorMessage));
  }
}

/**
 * Delete course saga
 */
function* deleteCourseSaga(action) {
  try {
    yield put(setLoading(true));
    yield call(profileService.deleteCourse, action.payload);
    const courses = yield select(state => state.profile.courses);
    yield put(setCourses(courses.filter(c => c.id !== action.payload)));
    yield put(setLoading(false));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.detail || 
                        error.message || 
                        'Failed to delete course';
    yield put(setError(errorMessage));
  }
}

/**
 * Create experience saga
 */
function* createExperienceSaga(action) {
  try {
    yield put(setLoading(true));
    const response = yield call(profileService.createExperience, action.payload);
    const experiences = yield select(state => state.profile.experiences);
    yield put(setExperiences([...experiences, response.data]));
    yield put(setLoading(false));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.detail || 
                        error.message || 
                        'Failed to create experience';
    yield put(setError(errorMessage));
  }
}

/**
 * Delete experience saga
 */
function* deleteExperienceSaga(action) {
  try {
    yield put(setLoading(true));
    yield call(profileService.deleteExperience, action.payload);
    const experiences = yield select(state => state.profile.experiences);
    yield put(setExperiences(experiences.filter(e => e.id !== action.payload)));
    yield put(setLoading(false));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.detail || 
                        error.message || 
                        'Failed to delete experience';
    yield put(setError(errorMessage));
  }
}

/**
 * Create language saga
 */
function* createLanguageSaga(action) {
  try {
    yield put(setLoading(true));
    const response = yield call(profileService.createLanguage, action.payload);
    const languages = yield select(state => state.profile.languages);
    yield put(setLanguages([...languages, response.data]));
    yield put(setLoading(false));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.detail || 
                        error.message || 
                        'Failed to create language';
    yield put(setError(errorMessage));
  }
}

/**
 * Delete language saga
 */
function* deleteLanguageSaga(action) {
  try {
    yield put(setLoading(true));
    yield call(profileService.deleteLanguage, action.payload);
    const languages = yield select(state => state.profile.languages);
    yield put(setLanguages(languages.filter(l => l.id !== action.payload)));
    yield put(setLoading(false));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.detail || 
                        error.message || 
                        'Failed to delete language';
    yield put(setError(errorMessage));
  }
}

/**
 * Create skill saga
 */
function* createSkillSaga(action) {
  try {
    yield put(setLoading(true));
    const response = yield call(profileService.createSkill, action.payload);
    const skills = yield select(state => state.profile.skills);
    yield put(setSkills([...skills, response.data]));
    yield put(setLoading(false));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.detail || 
                        error.message || 
                        'Failed to create skill';
    yield put(setError(errorMessage));
  }
}

/**
 * Delete skill saga
 */
function* deleteSkillSaga(action) {
  try {
    yield put(setLoading(true));
    yield call(profileService.deleteSkill, action.payload);
    const skills = yield select(state => state.profile.skills);
    yield put(setSkills(skills.filter(s => s.id !== action.payload)));
    yield put(setLoading(false));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.detail || 
                        error.message || 
                        'Failed to delete skill';
    yield put(setError(errorMessage));
  }
}

/**
 * Save bank info saga
 */
function* saveBankInfoSaga(action) {
  try {
    yield put(setLoading(true));
    const response = yield call(profileService.updateBankInfo, action.payload);
    yield put(setBankInfo(response.data));
    yield put(setLoading(false));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.detail || 
                        error.message || 
                        'Failed to save bank information';
    yield put(setError(errorMessage));
  }
}

/**
 * Upload attachment saga
 */
function* uploadAttachmentSaga(action) {
  try {
    yield put(setLoading(true));
    const response = yield call(profileService.uploadAttachment, action.payload);
    const attachments = yield select(state => state.profile.attachments);
    yield put(setAttachments([...attachments, response.data]));
    yield put(setLoading(false));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.detail || 
                        error.message || 
                        'Failed to upload attachment';
    yield put(setError(errorMessage));
  }
}

/**
 * Delete attachment saga
 */
function* deleteAttachmentSaga(action) {
  try {
    yield put(setLoading(true));
    yield call(profileService.deleteAttachment, action.payload);
    const attachments = yield select(state => state.profile.attachments);
    yield put(setAttachments(attachments.filter(a => a.id !== action.payload)));
    yield put(setLoading(false));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.detail || 
                        error.message || 
                        'Failed to delete attachment';
    yield put(setError(errorMessage));
  }
}

/**
 * Load profile saga
 */
function* loadProfileSaga() {
  try {
    yield put(setLoading(true));
    
    // Load all profile data in parallel
    const [personalInfo, education, courses, experiences, languages, skills, bankInfo, attachments, completion] = yield all([
      call(profileService.getPersonalInfo),
      call(profileService.getEducation),
      call(profileService.getCourses),
      call(profileService.getExperiences),
      call(profileService.getLanguages),
      call(profileService.getSkills),
      call(profileService.getBankInfo),
      call(profileService.getAttachments),
      call(profileService.getCompletion),
    ]);
    
    yield put(setProfileData({
      personalInfo: personalInfo.data,
      education: education.data,
      courses: courses.data,
      experiences: experiences.data,
      languages: languages.data,
      skills: skills.data,
      bankInfo: bankInfo.data,
      attachments: attachments.data,
      completion: completion.data,
    }));
    
    yield put(setLoading(false));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.detail || 
                        error.message || 
                        'Failed to load profile';
    yield put(setError(errorMessage));
  }
}

/**
 * Submit profile saga
 */
function* submitProfileSaga() {
  try {
    yield put(setLoading(true));
    const response = yield call(profileService.submitProfile);
    yield put(setCompletion(response.data.completion));
    yield put(setSubmitted(true));
    yield put(setLoading(false));
  } catch (error) {
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.detail || 
                        error.message || 
                        'Failed to submit profile';
    yield put(setError(errorMessage));
  }
}

/**
 * Auto-save profile saga (debounced)
 */
function* autoSaveProfileSaga(action) {
  try {
    const { section, data } = action.payload;
    
    switch (section) {
      case 'personalInfo':
        yield call(profileService.updatePersonalInfo, data);
        break;
      case 'education':
        yield call(profileService.updateEducation, data);
        break;
      case 'bankInfo':
        yield call(profileService.updateBankInfo, data);
        break;
      default:
        break;
    }
  } catch (error) {
    console.error('Auto-save failed:', error);
    // Don't show error for auto-save failures
  }
}

/**
 * Watch profile sagas
 */
export function* watchProfileSagas() {
  yield takeLatest(savePersonalInfo.type, savePersonalInfoSaga);
  yield takeLatest(saveEducation.type, saveEducationSaga);
  yield takeLatest(createCourse.type, createCourseSaga);
  yield takeLatest(deleteCourse.type, deleteCourseSaga);
  yield takeLatest(createExperience.type, createExperienceSaga);
  yield takeLatest(deleteExperience.type, deleteExperienceSaga);
  yield takeLatest(createLanguage.type, createLanguageSaga);
  yield takeLatest(deleteLanguage.type, deleteLanguageSaga);
  yield takeLatest(createSkill.type, createSkillSaga);
  yield takeLatest(deleteSkill.type, deleteSkillSaga);
  yield takeLatest(saveBankInfo.type, saveBankInfoSaga);
  yield takeLatest(uploadAttachment.type, uploadAttachmentSaga);
  yield takeLatest(deleteAttachment.type, deleteAttachmentSaga);
  yield takeLatest(loadProfile.type, loadProfileSaga);
  yield takeLatest(submitProfile.type, submitProfileSaga);
  yield debounce(1000, autoSave.type, autoSaveProfileSaga);
}

