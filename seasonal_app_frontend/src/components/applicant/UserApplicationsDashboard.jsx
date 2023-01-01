/**
 * UserApplicationsDashboard Component
 * Shows applicant's application statuses across organizations
 */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ApplicationStatusCard from './ApplicationStatusCard';
import LogoutButton from '../common/LogoutButton';
import './UserApplicationsDashboard.css';

const UserApplicationsDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('access_token');
      const response = await axios.get(
        'http://localhost:8000/api/profile/my-memberships/',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Applications loaded:', response.data);
      
      // Transform data for display
      const transformedData = response.data.map((membership) => ({
        membership_id: membership.id,
        organization_id: membership.organization,
        organization_name: membership.organization_name,
        role: membership.role,
        status: membership.status,
        applied_at: membership.created_at,
        joined_at: membership.joined_at,
        notes: membership.notes || '',
      }));

      setApplications(transformedData);
    } catch (err) {
      console.error('Error loading applications:', err);
      setError('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = applications.filter((a) => a.status === 'pending').length;
  const approvedCount = applications.filter((a) => a.status === 'approved').length;

  return (
    <div className="user-applications-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">My Applications</h1>
          <p className="dashboard-subtitle">
            Track your job applications and membership status
          </p>
        </div>
        <div className="header-actions">
          <span className="user-email">{user?.email}</span>
          <LogoutButton />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stats-summary">
        <div className="stat-item">
          <span className="stat-label">Total Applications</span>
          <span className="stat-value">{applications.length}</span>
        </div>
        <div className="stat-item stat-pending">
          <span className="stat-label">Pending</span>
          <span className="stat-value">{pendingCount}</span>
        </div>
        <div className="stat-item stat-approved">
          <span className="stat-label">Approved</span>
          <span className="stat-value">{approvedCount}</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button onClick={loadApplications}>Try Again</button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your applications...</p>
        </div>
      )}

      {/* Applications List */}
      {!loading && !error && (
        <>
          {applications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No Applications Yet</h3>
              <p>You haven't applied to any organizations yet.</p>
              <p>Complete your profile and apply to start working!</p>
              <button className="btn-primary" onClick={() => (window.location.href = '/profile')}>
                Complete Profile
              </button>
            </div>
          ) : (
            <div className="applications-grid">
              {applications.map((application) => (
                <ApplicationStatusCard key={application.membership_id} application={application} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserApplicationsDashboard;

