/**
 * DashboardSidebar Component
 * Navigation sidebar for organization dashboard
 */
import React from 'react';
import './DashboardSidebar.css';

const DashboardSidebar = ({ stats, activeView, onViewChange, onClose }) => {
  const menuItems = [
    {
      id: 'pending',
      label: 'Pending Applicants',
      icon: '⏳',
      badge: stats?.pending_count,
      color: 'pending',
    },
    {
      id: 'approved',
      label: 'Approved Members',
      icon: '✓',
      badge: stats?.approved_count,
      color: 'approved',
    },
    {
      id: 'rejected',
      label: 'Rejected',
      icon: '✗',
      badge: stats?.rejected_count,
      color: 'rejected',
    },
    {
      id: 'suspended',
      label: 'Suspended',
      icon: '⚠️',
      badge: stats?.suspended_count,
      color: 'suspended',
    },
    {
      id: 'all',
      label: 'All Applications',
      icon: '📊',
      badge: stats?.total_applications,
      color: 'all',
    },
  ];

  return (
    <div className="dashboard-sidebar">
      {/* Close button for mobile */}
      <button className="sidebar-close" onClick={onClose}>
        ✕
      </button>

      {/* Header */}
      <div className="sidebar-header">
        <h2 className="sidebar-title">Dashboard</h2>
        <p className="sidebar-subtitle">Organization Management</p>
      </div>

      {/* Menu Items */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeView === item.id ? 'active' : ''} nav-${item.color}`}
            onClick={() => {
              onViewChange(item.id);
              if (window.innerWidth < 768) {
                onClose();
              }
            }}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
          </button>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="sidebar-footer">
        <div className="footer-stat">
          <span className="footer-label">Recent (7 days)</span>
          <span className="footer-value">{stats?.recent_applications_count || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;

