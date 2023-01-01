/**
 * ApplicantCard Component
 * Displays applicant information in card format for dashboard
 */
import React from 'react';
import './ApplicantCard.css';

const ApplicantCard = ({ applicant, onViewDetails, onApprove, onReject, onSuspend }) => {
  // Format date to readable string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status badge color
  const getStatusColor = () => {
    switch (applicant.status) {
      case 'pending':
        return 'status-pending';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      case 'suspended':
        return 'status-suspended';
      default:
        return '';
    }
  };

  // Get initials for photo fallback
  const getInitials = () => {
    const names = applicant.full_name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return applicant.full_name.substring(0, 2).toUpperCase();
  };

  return (
    <div className={`applicant-card ${getStatusColor()}`}>
      {/* Header - Photo and Basic Info */}
      <div className="card-header">
        <div className="profile-photo-container">
          {applicant.photo ? (
            <img
              src={applicant.photo}
              alt={applicant.full_name}
              className="profile-photo"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className="profile-photo-fallback"
            style={{ display: applicant.photo ? 'none' : 'flex' }}
          >
            {getInitials()}
          </div>
        </div>
        <div className="header-info">
          <h3 className="applicant-name">{applicant.full_name}</h3>
          <p className="applicant-email">{applicant.email}</p>
          {applicant.phone && <p className="applicant-phone">{applicant.phone}</p>}
        </div>
      </div>

      {/* Body - Details */}
      <div className="card-body">
        {/* Location and Age */}
        <div className="info-row">
          {(applicant.city || applicant.nationality) && (
            <span className="info-item">
              📍 {applicant.city}
              {applicant.city && applicant.nationality && ', '}
              {applicant.nationality}
            </span>
          )}
          {applicant.age && (
            <span className="info-item">👤 {applicant.age} years</span>
          )}
        </div>

        {/* Education */}
        {applicant.education && (
          <div className="info-row">
            <span className="info-item">🎓 {applicant.education}</span>
          </div>
        )}

        {/* Experience */}
        <div className="info-row">
          <span className="info-item">
            💼 {applicant.experience_years} years experience
          </span>
        </div>

        {/* Membership Info */}
        <div className="membership-info">
          <p className="applied-date">
            Applied: {formatDate(applicant.applied_at)}
          </p>
          <p className="role-info">
            Role: <span className={`badge badge-role`}>{applicant.role}</span>
          </p>
          <p className="status-info">
            Status: <span className={`badge ${getStatusColor()}`}>{applicant.status}</span>
          </p>
          {applicant.notes && (
            <p className="applicant-notes">
              <em>"{applicant.notes}"</em>
            </p>
          )}
        </div>

        {/* Profile Completion */}
        <div className="progress-section">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${applicant.completion_percentage}%` }}
            />
          </div>
          <span className="progress-text">
            Profile: {applicant.completion_percentage}%
            {applicant.is_submitted && (
              <span className="submitted-badge">✓ Submitted</span>
            )}
          </span>
        </div>
      </div>

      {/* Footer - Action Buttons */}
      <div className="card-actions">
        <button
          className="btn btn-secondary"
          onClick={() => onViewDetails(applicant.membership_id)}
        >
          View Details
        </button>

        {applicant.status === 'pending' && (
          <>
            <button
              className="btn btn-success"
              onClick={() => onApprove(applicant.membership_id)}
            >
              ✓ Approve
            </button>
            <button
              className="btn btn-danger"
              onClick={() => onReject(applicant.membership_id)}
            >
              ✗ Reject
            </button>
          </>
        )}

        {applicant.status === 'approved' && onSuspend && (
          <button
            className="btn btn-warning"
            onClick={() => onSuspend(applicant.membership_id)}
          >
            Suspend
          </button>
        )}
      </div>
    </div>
  );
};

export default ApplicantCard;

