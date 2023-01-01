/**
 * Dashboard API Service
 * Handles all API calls for organization dashboard
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('access_token');
  return token ? `Bearer ${token}` : '';
};

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to every request
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// Dashboard API endpoints
export const dashboardApi = {
  /**
   * Get dashboard statistics
   * @param {number} orgId - Organization ID
   * @returns {Promise} Statistics object
   */
  getStatistics: async (orgId) => {
    const response = await api.get(`/profile/organizations/${orgId}/statistics/`);
    return response.data;
  },

  /**
   * Get pending applicants
   * @param {number} orgId - Organization ID
   * @returns {Promise} Array of applicant cards
   */
  getPendingApplicants: async (orgId) => {
    const response = await api.get(`/profile/organizations/${orgId}/applicants/`);
    return response.data;
  },

  /**
   * Get approved members
   * @param {number} orgId - Organization ID
   * @returns {Promise} Array of member cards
   */
  getApprovedMembers: async (orgId) => {
    const response = await api.get(`/profile/organizations/${orgId}/approved-members/`);
    return response.data;
  },

  /**
   * Get all applications with optional status filter
   * @param {number} orgId - Organization ID
   * @param {string} status - Optional status filter (pending, approved, rejected, suspended)
   * @returns {Promise} Array of application cards
   */
  getAllApplications: async (orgId, status = null) => {
    const url = status
      ? `/profile/organizations/${orgId}/all-applications/?status=${status}`
      : `/profile/organizations/${orgId}/all-applications/`;
    const response = await api.get(url);
    return response.data;
  },

  /**
   * Get detailed applicant profile
   * @param {string} membershipId - Membership UUID
   * @returns {Promise} Detailed applicant data
   */
  getApplicantDetail: async (membershipId) => {
    const response = await api.get(`/profile/applicants/${membershipId}/`);
    return response.data;
  },

  /**
   * Approve an applicant
   * @param {string} membershipId - Membership UUID
   * @param {string} notes - Approval notes
   * @returns {Promise} Updated membership
   */
  approveApplicant: async (membershipId, notes = '') => {
    const response = await api.post(`/profile/memberships/${membershipId}/approve/`, {
      status: 'approved',
      notes: notes || 'Approved from dashboard',
    });
    return response.data;
  },

  /**
   * Reject an applicant
   * @param {string} membershipId - Membership UUID
   * @param {string} notes - Rejection reason
   * @returns {Promise} Updated membership
   */
  rejectApplicant: async (membershipId, notes) => {
    const response = await api.post(`/profile/memberships/${membershipId}/approve/`, {
      status: 'rejected',
      notes: notes || 'Rejected from dashboard',
    });
    return response.data;
  },

  /**
   * Suspend a member
   * @param {string} membershipId - Membership UUID
   * @param {string} notes - Suspension reason
   * @returns {Promise} Updated membership
   */
  suspendMember: async (membershipId, notes) => {
    const response = await api.post(`/profile/memberships/${membershipId}/approve/`, {
      status: 'suspended',
      notes: notes || 'Suspended from dashboard',
    });
    return response.data;
  },
};

export default dashboardApi;

