/**
 * OrganizationDashboard Component
 * Main dashboard for Admin/Owner/HR to manage applicants
 */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import dashboardApi from '../../services/dashboardApi';
import DashboardSidebar from './DashboardSidebar';
import StatsCards from './StatsCards';
import ApplicantCard from './ApplicantCard';
import ApplicantDetailModal from './ApplicantDetailModal';
import LogoutButton from '../common/LogoutButton';
import './OrganizationDashboard.css';

const OrganizationDashboard = ({ organizationId = 1 }) => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('pending');
  const [selectedMembershipId, setSelectedMembershipId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('OrganizationDashboard - organizationId:', organizationId);
    console.log('OrganizationDashboard - organizationId type:', typeof organizationId);
    loadDashboardData();
  }, [organizationId, activeView]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Loading dashboard data for org:', organizationId);

      // Load statistics
      const statsData = await dashboardApi.getStatistics(organizationId);
      console.log('Stats loaded:', statsData);
      setStats(statsData);

      // Load applicants based on active view
      let applicantsData;
      switch (activeView) {
        case 'pending':
          applicantsData = await dashboardApi.getPendingApplicants(organizationId);
          break;
        case 'approved':
          applicantsData = await dashboardApi.getApprovedMembers(organizationId);
          break;
        case 'rejected':
          applicantsData = await dashboardApi.getAllApplications(organizationId, 'rejected');
          break;
        case 'suspended':
          applicantsData = await dashboardApi.getAllApplications(organizationId, 'suspended');
          break;
        case 'all':
          applicantsData = await dashboardApi.getAllApplications(organizationId);
          break;
        default:
          applicantsData = await dashboardApi.getPendingApplicants(organizationId);
      }

      console.log('Applicants data received:', applicantsData);
      console.log('Is array?', Array.isArray(applicantsData));
      
      // Ensure applicantsData is an array
      if (Array.isArray(applicantsData)) {
        setApplicants(applicantsData);
      } else {
        console.error('Applicants data is not an array:', applicantsData);
        setApplicants([]);
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (membershipId) => {
    const notes = prompt('Add approval notes (optional):');
    if (notes === null) return; // User cancelled

    try {
      await dashboardApi.approveApplicant(membershipId, notes);
      alert('Applicant approved successfully!');
      loadDashboardData(); // Refresh
    } catch (err) {
      console.error('Error approving applicant:', err);
      alert('Failed to approve applicant. Please try again.');
    }
  };

  const handleReject = async (membershipId) => {
    const notes = prompt('Reason for rejection (required):');
    if (!notes) {
      alert('Rejection reason is required.');
      return;
    }

    if (!confirm('Are you sure you want to reject this applicant?')) {
      return;
    }

    try {
      await dashboardApi.rejectApplicant(membershipId, notes);
      alert('Applicant rejected.');
      loadDashboardData(); // Refresh
    } catch (err) {
      console.error('Error rejecting applicant:', err);
      alert('Failed to reject applicant. Please try again.');
    }
  };

  const handleSuspend = async (membershipId) => {
    const notes = prompt('Reason for suspension (required):');
    if (!notes) {
      alert('Suspension reason is required.');
      return;
    }

    if (!confirm('Are you sure you want to suspend this member?')) {
      return;
    }

    try {
      await dashboardApi.suspendMember(membershipId, notes);
      alert('Member suspended.');
      loadDashboardData(); // Refresh
    } catch (err) {
      console.error('Error suspending member:', err);
      alert('Failed to suspend member. Please try again.');
    }
  };

  const getViewTitle = () => {
    switch (activeView) {
      case 'pending':
        return 'Pending Applicants';
      case 'approved':
        return 'Approved Members';
      case 'rejected':
        return 'Rejected Applications';
      case 'suspended':
        return 'Suspended Members';
      case 'all':
        return 'All Applications';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="organization-dashboard">
      {/* Sidebar */}
      <DashboardSidebar
        stats={stats}
        activeView={activeView}
        onViewChange={setActiveView}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
        ☰ Menu
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-left">
            <h1 className="dashboard-title">{getViewTitle()}</h1>
          </div>
          <div className="header-right">
            <span className="user-info">
              {user?.email} ({user?.primary_role})
            </span>
            <button className="btn-refresh" onClick={loadDashboardData} disabled={loading}>
              🔄 Refresh
            </button>
            <LogoutButton />
          </div>
        </div>

        {/* Statistics Cards */}
        <StatsCards stats={stats} loading={loading && !stats} />

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button onClick={loadDashboardData}>Try Again</button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner-large"></div>
            <p>Loading {getViewTitle().toLowerCase()}...</p>
          </div>
        )}

        {/* Applicants Grid */}
        {!loading && !error && (
          <>
            {!Array.isArray(applicants) || applicants.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>No {getViewTitle().toLowerCase()} found</h3>
                <p>There are currently no applications in this category.</p>
              </div>
            ) : (
              <div className="applicants-grid">
                {applicants.map((applicant) => (
                  <ApplicantCard
                    key={applicant.membership_id}
                    applicant={applicant}
                    onViewDetails={setSelectedMembershipId}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onSuspend={handleSuspend}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Applicant Detail Modal */}
      {selectedMembershipId && (
        <ApplicantDetailModal
          membershipId={selectedMembershipId}
          onClose={() => setSelectedMembershipId(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default OrganizationDashboard;

