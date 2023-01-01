/**
 * RoleBasedRedirect Component
 * Redirects user to appropriate dashboard based on role
 */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { hasAdminAccess, getPrimaryOrganization } from '../../utils/roleUtils';

const RoleBasedRedirect = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  useEffect(() => {
    console.log('RoleBasedRedirect - isAuthenticated:', isAuthenticated);
    console.log('RoleBasedRedirect - user:', user);
    
    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      navigate('/login', { replace: true });
      return;
    }
    
    if (!user) {
      console.log('No user data, redirecting to login');
      navigate('/login', { replace: true });
      return;
    }
    
    const primaryRole = user.primary_role || 'applicant';
    const memberships = user.memberships || [];
    
    console.log('Primary Role:', primaryRole);
    console.log('Memberships:', memberships);
    console.log('Has Admin Access:', hasAdminAccess(primaryRole));
    
    // If user has admin access, redirect to organization dashboard
    if (hasAdminAccess(primaryRole)) {
      const primaryOrg = getPrimaryOrganization(memberships);
      console.log('Primary Organization:', primaryOrg);
      
      if (primaryOrg && primaryOrg.organization_id) {
        const route = `/dashboard/organization/${primaryOrg.organization_id}`;
        console.log('Redirecting admin to:', route);
        navigate(route, { replace: true });
        return;
      }
    }
    
    // Default: redirect to applications dashboard (for regular users/applicants)
    console.log('Redirecting to applications dashboard');
    navigate('/applications', { replace: true });
  }, [isAuthenticated, user, navigate]);
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div style={{ fontSize: '18px', color: '#666' }}>Redirecting...</div>
      <div style={{ fontSize: '14px', color: '#999' }}>
        {user?.primary_role && `Role: ${user.primary_role}`}
      </div>
    </div>
  );
};

export default RoleBasedRedirect;

