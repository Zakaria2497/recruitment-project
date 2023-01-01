/**
 * ProtectedRoute Component
 * Handles route protection based on authentication and roles
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { hasAdminAccess, getPrimaryOrganization } from '../../utils/roleUtils';

/**
 * ProtectedRoute - Requires authentication
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
  
  if (!isAuthenticated) {
    console.log('ProtectedRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

/**
 * AdminRoute - Requires admin/owner/hr role
 */
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  console.log('AdminRoute - isAuthenticated:', isAuthenticated);
  console.log('AdminRoute - user:', user);
  console.log('AdminRoute - primary_role:', user?.primary_role);
  
  if (!isAuthenticated) {
    console.log('AdminRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  if (!user) {
    console.log('AdminRoute - No user data, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  const hasAccess = hasAdminAccess(user.primary_role);
  console.log('AdminRoute - hasAdminAccess:', hasAccess);
  
  if (!hasAccess) {
    console.log('AdminRoute - No admin access, redirecting to profile');
    return <Navigate to="/profile" replace />;
  }
  
  return children;
};

/**
 * PublicRoute - Only accessible when not authenticated
 */
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  console.log('PublicRoute - isAuthenticated:', isAuthenticated);
  console.log('PublicRoute - user:', user);
  
  if (isAuthenticated && user) {
    const primaryRole = user.primary_role || 'applicant';
    console.log('PublicRoute - Authenticated, primary_role:', primaryRole);
    
    // Redirect based on role
    if (hasAdminAccess(primaryRole)) {
      const primaryOrg = getPrimaryOrganization(user.memberships);
      console.log('PublicRoute - Primary org:', primaryOrg);
      
      if (primaryOrg && primaryOrg.organization_id) {
        const route = `/dashboard/organization/${primaryOrg.organization_id}`;
        console.log('PublicRoute - Redirecting admin to:', route);
        return <Navigate to={route} replace />;
      }
    }
    
    console.log('PublicRoute - Redirecting to profile');
    return <Navigate to="/profile" replace />;
  }
  
  return children;
};

export default ProtectedRoute;

