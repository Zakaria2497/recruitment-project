/**
 * Main App component with Role-Based Routing
 */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components';
import store, { persistor } from './store';
import theme from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import Login from './components/auth/Login';
import { ProtectedRoute, AdminRoute, PublicRoute } from './components/routing/ProtectedRoute';
import RoleBasedRedirect from './components/routing/RoleBasedRedirect';
import { OrganizationDashboard } from './components/dashboard';
import { UserApplicationsDashboard } from './components/applicant';
import Dashboard from './pages/Dashboard';
import ProfileWizard from './pages/ProfileWizard';

/**
 * DashboardWrapper - Handles organization dashboard access
 */
function DashboardWrapper() {
  const { user } = useSelector((state) => state.auth);
  
  // Extract orgId from URL (UUID string)
  const urlParts = window.location.pathname.split('/');
  const orgId = urlParts[urlParts.length - 1];
  
  console.log('DashboardWrapper - orgId from URL:', orgId);
  console.log('DashboardWrapper - user memberships:', user?.memberships);
  
  // Verify user has access to this organization
  const hasMembership = user?.memberships?.some(
    (m) => String(m.organization_id) === String(orgId) && m.status === 'approved'
  );

  console.log('DashboardWrapper - hasMembership:', hasMembership);

  if (!hasMembership) {
    console.log('DashboardWrapper - No membership, redirecting to profile');
    return <Navigate to="/profile" replace />;
  }

  return <OrganizationDashboard organizationId={orgId} />;
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <Router>
            <Routes>
              {/* Public routes - Only accessible when NOT logged in */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              
              {/* Home - Role-based redirect */}
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
              
              {/* Old dashboard route - redirect based on role */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <RoleBasedRedirect />
                  </ProtectedRoute>
                }
              />
              
              {/* Applications Dashboard - For regular users/applicants */}
              <Route
                path="/applications"
                element={
                  <ProtectedRoute>
                    <UserApplicationsDashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* Applicant/Employee Profile Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileWizard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/profile/:section"
                element={
                  <ProtectedRoute>
                    <ProfileWizard />
                  </ProtectedRoute>
                }
              />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
