/**
 * Role and authorization utilities
 */

// Role hierarchy (higher number = more privileged)
export const ROLE_HIERARCHY = {
  owner: 7,
  admin: 6,
  manager: 5,
  hr: 4,
  recruiter: 3,
  employee: 2,
  contractor: 1,
  applicant: 0,
};

// Role display names
export const ROLE_NAMES = {
  owner: 'Organization Owner',
  admin: 'Administrator',
  manager: 'Manager',
  hr: 'HR Personnel',
  recruiter: 'Recruiter',
  employee: 'Employee',
  contractor: 'Contractor',
  applicant: 'Applicant',
};

// Roles that can access admin dashboard
export const ADMIN_ROLES = ['owner', 'admin', 'hr', 'manager', 'recruiter'];

// Roles that can approve/reject applicants
export const APPROVER_ROLES = ['owner', 'admin', 'hr'];

/**
 * Check if user has admin access
 * @param {string} role - User's primary role
 * @returns {boolean}
 */
export const hasAdminAccess = (role) => {
  return ADMIN_ROLES.includes(role);
};

/**
 * Check if user can approve applicants
 * @param {string} role - User's primary role
 * @returns {boolean}
 */
export const canApproveApplicants = (role) => {
  return APPROVER_ROLES.includes(role);
};

/**
 * Get user's primary organization
 * @param {Array} memberships - User's memberships array
 * @returns {Object|null} Primary membership object
 */
export const getPrimaryOrganization = (memberships) => {
  if (!memberships || memberships.length === 0) return null;
  
  // Sort by role hierarchy and return highest
  const sorted = [...memberships].sort((a, b) => {
    return (ROLE_HIERARCHY[b.role] || 0) - (ROLE_HIERARCHY[a.role] || 0);
  });
  
  return sorted[0];
};

/**
 * Get dashboard route based on user role
 * @param {string} primaryRole - User's primary role
 * @param {Array} memberships - User's memberships
 * @returns {string} Route path
 */
export const getDashboardRoute = (primaryRole, memberships) => {
  // If user has admin access, show organization dashboard
  if (hasAdminAccess(primaryRole)) {
    const primaryOrg = getPrimaryOrganization(memberships);
    if (primaryOrg) {
      return `/dashboard/organization/${primaryOrg.organization_id}`;
    }
  }
  
  // Regular users (applicants/employees) go to profile
  return '/profile';
};

/**
 * Check if user has specific role in any organization
 * @param {Array} memberships - User's memberships
 * @param {string} role - Role to check
 * @returns {boolean}
 */
export const hasRole = (memberships, role) => {
  if (!memberships) return false;
  return memberships.some(m => m.role === role);
};

/**
 * Get all organizations where user has specific role
 * @param {Array} memberships - User's memberships
 * @param {string} role - Role to filter by
 * @returns {Array} Filtered memberships
 */
export const getOrganizationsByRole = (memberships, role) => {
  if (!memberships) return [];
  return memberships.filter(m => m.role === role);
};

/**
 * Format role for display
 * @param {string} role - Role key
 * @returns {string} Formatted role name
 */
export const formatRole = (role) => {
  return ROLE_NAMES[role] || role;
};

/**
 * Check if role can perform action
 * @param {string} role - User's role
 * @param {string} action - Action to check (approve, manage, view)
 * @returns {boolean}
 */
export const canPerformAction = (role, action) => {
  switch (action) {
    case 'approve_applicants':
      return canApproveApplicants(role);
    case 'view_dashboard':
      return hasAdminAccess(role);
    case 'manage_organization':
      return ['owner', 'admin'].includes(role);
    case 'view_all_applications':
      return hasAdminAccess(role);
    default:
      return false;
  }
};

