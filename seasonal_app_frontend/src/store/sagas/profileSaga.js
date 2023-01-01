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
    console.log('=== SAGA: savePersonalInfoSaga called ===');
    console.log('SAGA - action:', action);
    console.log('SAGA - action.type:', action.type);
    console.log('SAGA - action.payload:', action.payload);
    console.log('SAGA - action.payload type:', typeof action.payload);
    console.log('SAGA - action.payload keys:', action.payload ? Object.keys(action.payload) : 'null/undefined');
    
    yield put(setLoading(true));
    
    console.log('SAGA - Calling profileService.updatePersonalInfo with payload:', action.payload);
    const response = yield call(profileService.updatePersonalInfo, action.payload);
    
    console.log('SAGA - Response received:', response);
    yield put(setPersonalInfo(response.data));
    yield put(setError(null));
    yield put(setLoading(false));
  } catch (error) {
    console.error('SAGA - Error occurred:', error);
    console.error('SAGA - Error response:', error.response);
    console.error('SAGA - Error response data:', error.response?.data);
    
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
    console.log('=== SAGA: saveEducationSaga called ===');
    console.log('SAGA - action.payload:', action.payload);
    
    yield put(setLoading(true));
    const currentEducation = yield select(state => state.profile.education);
    
    console.log('SAGA - currentEducation:', currentEducation);
    
    let response;
    if (currentEducation && currentEducation.id) {
      // Update existing education
      console.log('SAGA - Updating existing education with ID:', currentEducation.id);
      response = yield call(profileService.updateEducation, currentEducation.id, action.payload);
    } else {
      // Create new education
      console.log('SAGA - Creating new education');
      response = yield call(profileService.createEducation, action.payload);
    }
    
    console.log('SAGA - Response received:', response);
    yield put(setEducation(response.data));
    yield put(setError(null));
    
    // Reload completion status
    try {
      const completionResponse = yield call(profileService.getCompletion);
      yield put(setCompletion(completionResponse.data));
      console.log('SAGA - Completion reloaded after education save');
    } catch (err) {
      console.error('SAGA - Failed to reload completion:', err);
    }
    
    yield put(setLoading(false));
  } catch (error) {
    console.error('SAGA - Error occurred:', error);
    console.error('SAGA - Error response:', error.response?.data);
    
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
    yield put(setError(null));
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
    yield put(setError(null));
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
    yield put(setError(null));
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
    yield put(setError(null));
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
    yield put(setError(null));
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
    yield put(setError(null));
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
    yield put(setError(null));
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
    yield put(setError(null));
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
    console.log('=== SAGA: saveBankInfoSaga called ===');
    console.log('SAGA - action.payload:', action.payload);
    
    yield put(setLoading(true));
    const currentBankInfo = yield select(state => state.profile.bankInfo);
    
    console.log('SAGA - currentBankInfo:', currentBankInfo);
    
    let response;
    if (currentBankInfo && currentBankInfo.id) {
      // Update existing bank info
      console.log('SAGA - Updating existing bank info with ID:', currentBankInfo.id);
      response = yield call(profileService.updateBankInfo, currentBankInfo.id, action.payload);
    } else {
      // Create new bank info
      console.log('SAGA - Creating new bank info');
      response = yield call(profileService.createBankInfo, action.payload);
    }
    
    console.log('SAGA - Response received:', response);
    console.log('SAGA - Response data:', response.data);
    console.log('SAGA - Setting bank info with ID:', response.data?.id);
    yield put(setBankInfo(response.data));
    yield put(setError(null));
    
    // Reload completion status
    try {
      const completionResponse = yield call(profileService.getCompletion);
      yield put(setCompletion(completionResponse.data));
      console.log('SAGA - Completion reloaded after bank info save');
    } catch (err) {
      console.error('SAGA - Failed to reload completion:', err);
    }
    
    yield put(setLoading(false));
  } catch (error) {
    console.error('SAGA - Error occurred:', error);
    console.error('SAGA - Error response:', error.response?.data);
    
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
    yield put(setError(null));
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
    yield put(setError(null));
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
    console.log('🚀 SAGA: loadProfileSaga - Starting to load profile data...');
    yield put(setLoading(true));
    
    // Load each API call individually to catch specific errors
    let personalInfo, education, courses, experiences, languages, skills, bankInfo, attachments, completion;
    
    try {
      console.log('📡 Loading personalInfo...');
      personalInfo = yield call(profileService.getPersonalInfo);
      console.log('✅ personalInfo loaded:', personalInfo.data);
    } catch (error) {
      console.error('❌ personalInfo error:', error.response?.status, error.response?.data);
      personalInfo = { data: null };
    }
    
    try {
      console.log('📡 Loading education...');
      education = yield call(profileService.getEducation);
      console.log('✅ education loaded:', education.data);
    } catch (error) {
      console.error('❌ education error:', error.response?.status, error.response?.data);
      education = { data: [] };
    }
    
    try {
      console.log('📡 Loading courses...');
      courses = yield call(profileService.getCourses);
      console.log('✅ courses loaded:', courses.data);
      // Handle paginated response
      if (courses.data && courses.data.results) {
        courses = { data: courses.data.results };
      }
    } catch (error) {
      console.error('❌ courses error:', error.response?.status, error.response?.data);
      courses = { data: [] };
    }
    
    try {
      console.log('📡 Loading experiences...');
      experiences = yield call(profileService.getExperiences);
      console.log('✅ experiences loaded:', experiences.data);
      // Handle paginated response
      if (experiences.data && experiences.data.results) {
        experiences = { data: experiences.data.results };
      }
    } catch (error) {
      console.error('❌ experiences error:', error.response?.status, error.response?.data);
      experiences = { data: [] };
    }
    
    try {
      console.log('📡 Loading languages...');
      languages = yield call(profileService.getLanguages);
      console.log('✅ languages loaded:', languages.data);
      // Handle paginated response
      if (languages.data && languages.data.results) {
        languages = { data: languages.data.results };
      }
    } catch (error) {
      console.error('❌ languages error:', error.response?.status, error.response?.data);
      languages = { data: [] };
    }
    
    try {
      console.log('📡 Loading skills...');
      skills = yield call(profileService.getSkills);
      console.log('✅ skills loaded:', skills.data);
      // Handle paginated response
      if (skills.data && skills.data.results) {
        skills = { data: skills.data.results };
      }
    } catch (error) {
      console.error('❌ skills error:', error.response?.status, error.response?.data);
      skills = { data: [] };
    }
    
    try {
      console.log('📡 Loading bankInfo...');
      bankInfo = yield call(profileService.getBankInfo);
      console.log('✅ bankInfo loaded:', bankInfo.data);
      console.log('✅ bankInfo type:', typeof bankInfo.data, 'isArray:', Array.isArray(bankInfo.data));
      // Handle paginated response - extract results array if present
      if (bankInfo.data && bankInfo.data.results) {
        console.log('📦 BankInfo: Extracting results from paginated response');
        bankInfo = { data: bankInfo.data.results };
      }
    } catch (error) {
      console.error('❌ bankInfo error:', error.response?.status, error.response?.data);
      bankInfo = { data: [] };
    }
    
    try {
      console.log('📡 Loading attachments...');
      attachments = yield call(profileService.getAttachments);
      console.log('✅ attachments loaded:', attachments.data);
      // Handle paginated response - extract results array
      if (attachments.data && attachments.data.results) {
        console.log('📦 Extracting results from paginated response');
        attachments = { data: attachments.data.results };
      }
    } catch (error) {
      console.error('❌ attachments error:', error.response?.status, error.response?.data);
      attachments = { data: [] };
    }
    
    try {
      console.log('📡 Loading completion...');
      completion = yield call(profileService.getCompletion);
      console.log('✅ completion loaded:', completion.data);
    } catch (error) {
      console.error('❌ completion error:', error.response?.status, error.response?.data);
      completion = { data: { overall_completion_percentage: 0 } };
    }
    
    // Education and BankInfo are returned as arrays, get the first item
    console.log('📦 Processing education.data:', education.data, 'isArray:', Array.isArray(education.data));
    console.log('📦 Processing bankInfo.data:', bankInfo.data, 'isArray:', Array.isArray(bankInfo.data));
    
    const educationData = Array.isArray(education.data) && education.data.length > 0 
      ? education.data[0] 
      : null;
    const bankInfoData = Array.isArray(bankInfo.data) && bankInfo.data.length > 0 
      ? bankInfo.data[0] 
      : null;
    
    console.log('📦 Setting profile data...');
    console.log('📦 educationData:', educationData);
    console.log('📦 bankInfoData:', bankInfoData);
    console.log('📦 bankInfoData has ID?:', bankInfoData?.id);
    
    yield put(setProfileData({
      personalInfo: personalInfo.data,
      education: educationData,
      courses: courses.data,
      experiences: experiences.data,
      languages: languages.data,
      skills: skills.data,
      bankInfo: bankInfoData,
      attachments: attachments.data,
      completion: completion.data,
    }));
    
    yield put(setLoading(false));
    // Clear any previous errors since we loaded successfully
    yield put(setError(null));
    console.log('✅ SAGA: loadProfileSaga - Profile loaded successfully!');
  } catch (error) {
    console.error('💥 SAGA: loadProfileSaga - Fatal error:', error);
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.detail || 
                        error.message || 
                        'Failed to load profile';
    yield put(setError(errorMessage));
    yield put(setLoading(false));
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
    yield put(setError(null));
    yield put(setLoading(false));
  } catch (error) {
    yield put(setLoading(false));
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      const errorMessage = 'Your session has expired. Please log out and log back in.';
      yield put(setError(errorMessage));
      return;
    }
    
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
      case 'education': {
        const currentEducation = yield select(state => state.profile.education);
        if (currentEducation && currentEducation.id) {
          yield call(profileService.updateEducation, currentEducation.id, data);
        } else {
          yield call(profileService.createEducation, data);
        }
        break;
      }
      case 'bankInfo': {
        const currentBankInfo = yield select(state => state.profile.bankInfo);
        if (currentBankInfo && currentBankInfo.id) {
          yield call(profileService.updateBankInfo, currentBankInfo.id, data);
        } else {
          yield call(profileService.createBankInfo, data);
        }
        break;
      }
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

