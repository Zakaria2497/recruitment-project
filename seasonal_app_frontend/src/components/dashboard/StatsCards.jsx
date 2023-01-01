/**
 * StatsCards Component
 * Displays organization dashboard statistics
 */
import React from 'react';
import './StatsCards.css';

const StatsCards = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="stats-container">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-card loading">
            <div className="stat-skeleton"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statsData = [
    {
      title: 'Pending',
      count: stats.pending_count,
      icon: '⏳',
      color: 'pending',
      description: 'Awaiting review',
    },
    {
      title: 'Approved',
      count: stats.approved_count,
      icon: '✓',
      color: 'approved',
      description: 'Active members',
    },
    {
      title: 'Rejected',
      count: stats.rejected_count,
      icon: '✗',
      color: 'rejected',
      description: 'Applications declined',
    },
    {
      title: 'Total',
      count: stats.total_applications,
      icon: '📊',
      color: 'total',
      description: 'All applications',
    },
  ];

  return (
    <div className="stats-container">
      {statsData.map((stat, index) => (
        <div key={index} className={`stat-card stat-${stat.color}`}>
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-content">
            <h3 className="stat-title">{stat.title}</h3>
            <p className="stat-count">{stat.count}</p>
            <p className="stat-description">{stat.description}</p>
          </div>
        </div>
      ))}

      {/* Recent Applications Badge */}
      {stats.recent_applications_count > 0 && (
        <div className="recent-badge">
          <span className="recent-icon">🔔</span>
          <span className="recent-text">
            {stats.recent_applications_count} new application
            {stats.recent_applications_count !== 1 ? 's' : ''} this week
          </span>
        </div>
      )}
    </div>
  );
};

export default StatsCards;

