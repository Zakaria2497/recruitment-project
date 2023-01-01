/**
 * ApplicantDetailModal Component
 * Full applicant profile view in modal
 */
import React, { useState, useEffect } from 'react';
import dashboardApi from '../../services/dashboardApi';
import './ApplicantDetailModal.css';

const ApplicantDetailModal = ({ membershipId, onClose, onApprove, onReject }) => {
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    loadApplicantDetail();
  }, [membershipId]);

  const loadApplicantDetail = async () => {
    try {
      setLoading(true);
      const data = await dashboardApi.getApplicantDetail(membershipId);
      setApplicant(data);
    } catch (err) {
      setError('Failed to load applicant details');
      console.error('Error loading applicant details:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content loading-modal" onClick={(e) => e.stopPropagation()}>
          <div className="loading-spinner"></div>
          <p>Loading applicant details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content error-modal" onClick={(e) => e.stopPropagation()}>
          <p className="error-message">{error}</p>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!applicant) return null;

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'application', label: 'Application', icon: '📋' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="header-left">
            {applicant.photo && (
              <img
                src={applicant.photo}
                alt={applicant.first_name}
                className="modal-photo"
                onError={(e) => (e.target.style.display = 'none')}
              />
            )}
            <div>
              <h2 className="modal-title">
                {applicant.first_name} {applicant.father_name} {applicant.family_name}
              </h2>
              <p className="modal-subtitle">{applicant.email}</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="modal-body">
          {activeTab === 'personal' && (
            <div className="tab-content">
              <h3>Personal Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Full Name</label>
                  <p>
                    {applicant.first_name} {applicant.father_name} {applicant.grand_name}{' '}
                    {applicant.family_name}
                  </p>
                </div>
                <div className="info-item">
                  <label>Gender</label>
                  <p>{applicant.gender || 'N/A'}</p>
                </div>
                <div className="info-item">
                  <label>Date of Birth</label>
                  <p>{formatDate(applicant.birthdate)}</p>
                </div>
                <div className="info-item">
                  <label>Nationality</label>
                  <p>{applicant.nationality || 'N/A'}</p>
                </div>
                <div className="info-item">
                  <label>City</label>
                  <p>{applicant.city || 'N/A'}</p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>{applicant.email}</p>
                </div>
                <div className="info-item">
                  <label>Phone</label>
                  <p>{applicant.phone || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="tab-content">
              <h3>Education Background</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Highest Degree</label>
                  <p>{applicant.last_degree || 'N/A'}</p>
                </div>
                <div className="info-item">
                  <label>Major/Field of Study</label>
                  <p>{applicant.major || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="tab-content">
              <h3>Work Experience</h3>
              <div className="info-item">
                <label>Total Experience</label>
                <p>{applicant.experience_years} years</p>
              </div>
            </div>
          )}

          {activeTab === 'application' && (
            <div className="tab-content">
              <h3>Application Details</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Applied Role</label>
                  <p className="capitalize">{applicant.role}</p>
                </div>
                <div className="info-item">
                  <label>Status</label>
                  <p className={`status-badge status-${applicant.status}`}>{applicant.status}</p>
                </div>
                <div className="info-item">
                  <label>Applied Date</label>
                  <p>{formatDate(applicant.applied_at)}</p>
                </div>
                <div className="info-item">
                  <label>Profile Completion</label>
                  <p>{applicant.completion_percentage}%</p>
                </div>
                {applicant.notes && (
                  <div className="info-item full-width">
                    <label>Application Notes</label>
                    <p className="notes-text">{applicant.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {applicant.status === 'pending' && (
          <div className="modal-footer">
            <button
              className="btn btn-success"
              onClick={() => {
                onApprove(membershipId);
                onClose();
              }}
            >
              ✓ Approve Applicant
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                onReject(membershipId);
                onClose();
              }}
            >
              ✗ Reject Applicant
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        )}

        {applicant.status !== 'pending' && (
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantDetailModal;

