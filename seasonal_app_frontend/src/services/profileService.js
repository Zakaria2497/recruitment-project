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
  console.log('updatePersonalInfo - Raw data:', data);
  
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    if (key === 'photo' && data[key] instanceof File) {
      formData.append('photo', data[key]);
    } else if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  
  // Log FormData contents
  console.log('updatePersonalInfo - FormData contents:');
  for (let [key, value] of formData.entries()) {
    console.log(`  ${key}:`, value);
  }
  
  return api.post('/profile/personal-info/', formData, {
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

export const createEducation = (data) => {
  console.log('createEducation - Raw data:', data);
  
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    if (key === 'certificates' && data[key] instanceof File) {
      formData.append('certificates', data[key]);
    } else if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  
  console.log('createEducation - FormData contents:');
  for (let [key, value] of formData.entries()) {
    console.log(`  ${key}:`, value);
  }
  
  return api.post('/profile/education/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateEducation = (id, data) => {
  console.log('updateEducation - ID:', id, 'Raw data:', data);
  
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    if (key === 'certificates' && data[key] instanceof File) {
      formData.append('certificates', data[key]);
    } else if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  
  console.log('updateEducation - FormData contents:');
  for (let [key, value] of formData.entries()) {
    console.log(`  ${key}:`, value);
  }
  
  return api.put(`/profile/education/${id}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteEducation = (id) => {
  return api.delete(`/profile/education/${id}/`);
};

/**
 * Courses
 */
export const getCourses = () => {
  return api.get('/profile/courses/');
};

export const createCourse = (data) => {
  console.log('createCourse - Raw data:', data);
  
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    if (key === 'certificate' && data[key] instanceof File) {
      formData.append('certificate', data[key]);
    } else if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  
  console.log('createCourse - FormData contents:');
  for (let [key, value] of formData.entries()) {
    console.log(`  ${key}:`, value);
  }
  
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
  console.log('createExperience - Raw data:', data);
  
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    if (key === 'certificate' && data[key] instanceof File) {
      formData.append('certificate', data[key]);
    } else if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  
  console.log('createExperience - FormData contents:');
  for (let [key, value] of formData.entries()) {
    console.log(`  ${key}:`, value);
  }
  
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
  console.log('createLanguage - Raw data:', data);
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
  console.log('createSkill - Raw data:', data);
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

export const createBankInfo = (data) => {
  console.log('createBankInfo - Raw data:', data);
  return api.post('/profile/bank-info/', data);
};

export const updateBankInfo = (id, data) => {
  console.log('updateBankInfo - ID:', id, 'Raw data:', data);
  return api.put(`/profile/bank-info/${id}/`, data);
};

export const deleteBankInfo = (id) => {
  return api.delete(`/profile/bank-info/${id}/`);
};

/**
 * Attachments
 */
export const getAttachments = () => {
  return api.get('/profile/attachments/');
};

export const uploadAttachment = (data) => {
  console.log('uploadAttachment - Raw data:', data);
  
  const formData = new FormData();
  formData.append('attachment_type', data.attachment_type);
  formData.append('file', data.file);
  
  console.log('uploadAttachment - FormData contents:');
  for (let [key, value] of formData.entries()) {
    console.log(`  ${key}:`, value);
  }
  
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

