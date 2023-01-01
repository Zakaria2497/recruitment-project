/**
 * App.jsx Example with Role-Based Routing
 * This is an example showing how to integrate role-based dashboard access
 */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './components/auth/Login';
import { OrganizationDashboard } from './components/dashboard';
import { ProtectedRoute, AdminRoute, PublicRoute } from './components/routing/ProtectedRoute';
import RoleBasedRedirect from './components/routing/RoleBasedRedirect';

// Your other components
// import ProfileWizard from './components/profile/ProfileWizard';
// import ApplicantProfile from './components/profile/ApplicantProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - Only accessible when NOT logged in */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Role-Based Home - Redirects based on user role */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <RoleBasedRedirect />
            </ProtectedRoute>
          }
        />

        {/* Admin/Owner/HR Dashboard - Requires admin access */}
        <Route
          path="/dashboard/organization/:orgId"
          element={
            <AdminRoute>
              <DashboardWrapper />
            </AdminRoute>
          }
        />

        {/* Applicant/Employee Profile Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <div>Profile Page (Your Profile Wizard)</div>
              {/* <ProfileWizard /> */}
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:section"
          element={
            <ProtectedRoute>
              <div>Profile Section (Personal Info, Education, etc)</div>
              {/* <ApplicantProfile /> */}
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

/**
 * DashboardWrapper - Extracts orgId from URL params
 */
function DashboardWrapper() {
  const { user } = useSelector((state) => state.auth);
  const urlParams = window.location.pathname.split('/');
  const orgId = parseInt(urlParams[urlParams.length - 1]);

  // Verify user has access to this organization
  const hasMembership = user?.memberships?.some(
    (m) => m.organization_id === orgId && m.status === 'approved'
  );

  if (!hasMembership) {
    return <Navigate to="/profile" replace />;
  }

  return <OrganizationDashboard organizationId={orgId} />;
}

export default App;

