/**
 * Form validation rules
 */

/**
 * Validate email
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Invalid email format';
  return true;
};

/**
 * Validate phone number
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[1-9]\d{9,14}$/;
  if (!phone) return 'Phone number is required';
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return 'Invalid phone number format (e.g., +971501234567)';
  }
  return true;
};

/**
 * Validate IBAN
 */
export const validateIBAN = (iban) => {
  if (!iban) return 'IBAN is required';
  const ibanRegex = /^[A-Z0-9]{15,34}$/i;
  const cleaned = iban.replace(/\s/g, '');
  if (!ibanRegex.test(cleaned)) {
    return 'Invalid IBAN format (15-34 alphanumeric characters)';
  }
  return true;
};

/**
 * Validate required field
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return true;
};

/**
 * Validate file size
 */
export const validateFileSize = (file, maxSizeMB = 10) => {
  if (!file) return true;
  const maxSize = maxSizeMB * 1024 * 1024;
  if (file.size > maxSize) {
    return `File size must be less than ${maxSizeMB}MB`;
  }
  return true;
};

/**
 * Validate file type
 */
export const validateFileType = (file, allowedTypes = []) => {
  if (!file) return true;
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  if (!allowedTypes.includes(fileExtension)) {
    return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
  }
  return true;
};

/**
 * Validate date
 */
export const validateDate = (date, fieldName = 'Date') => {
  if (!date) return `${fieldName} is required`;
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return `Invalid ${fieldName.toLowerCase()}`;
  }
  return true;
};

/**
 * Validate date range
 */
export const validateDateRange = (startDate, endDate, allowCurrent = false) => {
  if (!startDate || !endDate) return true;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (end < start) {
    return 'End date must be after start date';
  }
  
  if (!allowCurrent && end > new Date()) {
    return 'End date cannot be in the future';
  }
  
  return true;
};

/**
 * Validate year
 */
export const validateYear = (year, minYear = 1950, maxYear = new Date().getFullYear() + 5) => {
  if (!year) return 'Year is required';
  const yearNum = parseInt(year, 10);
  if (isNaN(yearNum) || yearNum < minYear || yearNum > maxYear) {
    return `Year must be between ${minYear} and ${maxYear}`;
  }
  return true;
};

/**
 * Validate password
 */
export const validatePassword = (password, minLength = 8) => {
  if (!password) return 'Password is required';
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters`;
  }
  return true;
};

/**
 * Validate password match
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return true;
};

