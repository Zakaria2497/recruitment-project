/**
 * Profile service - handles profile API calls
 */
import api from './api';

/**
 * Personal Information
 */
export const getPersonalInfo = () => {
  return api.get('/profile/personal-info/');
};

export const updatePersonalInfo = (data) => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    if (key === 'photo' && data[key] instanceof File) {
      formData.append('photo', data[key]);
    } else if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  
  return api.patch('/profile/personal-info/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Education
 */
export const getEducation = () => {
  return api.get('/profile/education/');
};

export const updateEducation = (data) => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    if (key === 'certificates' && data[key] instanceof File) {
      formData.append('certificates', data[key]);
    } else if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  
  return api.patch('/profile/education/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Courses
 */
export const getCourses = () => {
  return api.get('/profile/courses/');
};

export const createCourse = (data) => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    if (key === 'certificate' && data[key] instanceof File) {
      formData.append('certificate', data[key]);
    } else if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  
  return api.post('/profile/courses/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteCourse = (id) => {
  return api.delete(`/profile/courses/${id}/`);
};

/**
 * Experiences
 */
export const getExperiences = () => {
  return api.get('/profile/experiences/');
};

export const createExperience = (data) => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    if (key === 'certificate' && data[key] instanceof File) {
      formData.append('certificate', data[key]);
    } else if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  
  return api.post('/profile/experiences/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteExperience = (id) => {
  return api.delete(`/profile/experiences/${id}/`);
};

/**
 * Languages
 */
export const getLanguages = () => {
  return api.get('/profile/languages/');
};

export const createLanguage = (data) => {
  return api.post('/profile/languages/', data);
};

export const deleteLanguage = (id) => {
  return api.delete(`/profile/languages/${id}/`);
};

/**
 * Skills
 */
export const getSkills = () => {
  return api.get('/profile/skills/');
};

export const createSkill = (data) => {
  return api.post('/profile/skills/', data);
};

export const deleteSkill = (id) => {
  return api.delete(`/profile/skills/${id}/`);
};

/**
 * Bank Information
 */
export const getBankInfo = () => {
  return api.get('/profile/bank-info/');
};

export const updateBankInfo = (data) => {
  return api.patch('/profile/bank-info/', data);
};

/**
 * Attachments
 */
export const getAttachments = () => {
  return api.get('/profile/attachments/');
};

export const uploadAttachment = (data) => {
  const formData = new FormData();
  formData.append('attachment_type', data.attachment_type);
  formData.append('file', data.file);
  
  return api.post('/profile/attachments/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteAttachment = (id) => {
  return api.delete(`/profile/attachments/${id}/`);
};

/**
 * Profile Completion
 */
export const getCompletion = () => {
  return api.get('/profile/completion/');
};

/**
 * Submit Profile
 */
export const submitProfile = () => {
  return api.post('/profile/submit/');
};

