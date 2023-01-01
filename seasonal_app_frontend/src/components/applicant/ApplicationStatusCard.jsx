/**
 * ApplicationStatusCard Component
 * Shows user's application status for an organization
 */
import React from 'react';
import './ApplicationStatusCard.css';

const ApplicationStatusCard = ({ application }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusConfig = () => {
    switch (application.status) {
      case 'pending':
        return {
          color: 'status-pending',
          icon: '⏳',
          message: 'Your application is under review',
        };
      case 'approved':
        return {
          color: 'status-approved',
          icon: '✓',
          message: 'Congratulations! You have been accepted',
        };
      case 'rejected':
        return {
          color: 'status-rejected',
          icon: '✗',
          message: 'Application was not approved',
        };
      case 'suspended':
        return {
          color: 'status-suspended',
          icon: '⚠️',
          message: 'Your membership has been suspended',
        };
      default:
        return {
          color: '',
          icon: '📋',
          message: 'Application status',
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className={`application-status-card ${statusConfig.color}`}>
      {/* Header */}
      <div className="card-header">
        <div className="org-info">
          <h3 className="org-name">{application.organization_name}</h3>
          <p className="role-applied">Applied as: <strong>{application.role}</strong></p>
        </div>
        <div className={`status-badge ${statusConfig.color}`}>
          <span className="status-icon">{statusConfig.icon}</span>
          <span className="status-text">{application.status}</span>
        </div>
      </div>

      {/* Status Message */}
      <div className="status-message">
        <p>{statusConfig.message}</p>
      </div>

      {/* Dates */}
      <div className="dates-section">
        <div className="date-item">
          <label>Applied:</label>
          <span>{formatDate(application.applied_at)}</span>
        </div>
        {application.status === 'approved' && application.joined_at && (
          <div className="date-item">
            <label>Joined:</label>
            <span>{formatDate(application.joined_at)}</span>
          </div>
        )}
      </div>

      {/* Notes */}
      {application.notes && (
        <div className="notes-section">
          <label>Notes:</label>
          <p>{application.notes}</p>
        </div>
      )}

      {/* Actions */}
      {application.status === 'pending' && (
        <div className="card-footer">
          <button className="btn-secondary" disabled>
            ⏳ Waiting for approval
          </button>
        </div>
      )}

      {application.status === 'approved' && (
        <div className="card-footer success">
          <span>✓ You are now a member of this organization</span>
        </div>
      )}
    </div>
  );
};

export default ApplicationStatusCard;

