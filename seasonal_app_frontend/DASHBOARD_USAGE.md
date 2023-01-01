# Dashboard Frontend Usage Guide

## 📦 Installation Complete

All dashboard components have been created and are ready to use!

## 📁 Files Created

### Components
```
src/components/dashboard/
├── OrganizationDashboard.jsx   - Main dashboard container
├── OrganizationDashboard.css   - Dashboard styles
├── ApplicantCard.jsx            - Individual applicant card
├── ApplicantCard.css            - Card styles
├── DashboardSidebar.jsx         - Navigation sidebar
├── DashboardSidebar.css         - Sidebar styles
├── StatsCards.jsx               - Statistics cards
├── StatsCards.css               - Stats styles
├── ApplicantDetailModal.jsx     - Full profile modal
├── ApplicantDetailModal.css     - Modal styles
└── index.js                     - Barrel exports
```

### Services
```
src/services/
└── dashboardApi.js              - API service for dashboard
```

## 🚀 Quick Start

### 1. Basic Usage

Import and use the dashboard in your app:

```jsx
import React from 'react';
import { OrganizationDashboard } from './components/dashboard';

function App() {
  return (
    <OrganizationDashboard organizationId={1} />
  );
}

export default App;
```

### 2. Add to Router

If using React Router:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { OrganizationDashboard } from './components/dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<OrganizationDashboard organizationId={1} />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 3. With Dynamic Organization ID

```jsx
import { useParams } from 'react-router-dom';
import { OrganizationDashboard } from './components/dashboard';

function DashboardPage() {
  const { orgId } = useParams();
  
  return <OrganizationDashboard organizationId={parseInt(orgId)} />;
}
```

## 🔧 Configuration

### Environment Variables

Create/update `.env` file:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

### API Base URL

The dashboard uses the `dashboardApi` service which reads from `process.env.REACT_APP_API_URL`.

To change the API URL, edit:

```javascript
// src/services/dashboardApi.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
```

### Authentication Token

The dashboard automatically reads the JWT token from `localStorage`:

```javascript
localStorage.getItem('access_token')
```

Make sure your login process saves the token:

```javascript
// After successful login
localStorage.setItem('access_token', response.data.tokens.access);
```

## 📊 Features

### 1. Statistics Cards
- Displays pending, approved, rejected, and total counts
- Shows recent applications (last 7 days)
- Auto-refreshes when view changes

### 2. Sidebar Navigation
- Pending Applicants
- Approved Members
- Rejected Applications
- Suspended Members
- All Applications
- Badge counts for each section

### 3. Applicant Cards
- Profile photo with fallback initials
- Basic info (name, email, phone)
- Demographics (age, location, nationality)
- Education summary
- Years of experience
- Application details
- Profile completion progress bar
- Action buttons (Approve/Reject/View Details)

### 4. Detail Modal
- Tabbed interface (Personal, Education, Experience, Application)
- Full applicant profile
- Approve/Reject actions

### 5. Responsive Design
- Desktop: 3-column grid
- Tablet: 2-column grid
- Mobile: 1-column grid with hamburger menu

## 🎨 Customization

### Change Colors

Edit CSS files to customize colors:

```css
/* Primary color */
--primary-color: #3b82f6;

/* Status colors */
--pending-color: #f59e0b;
--approved-color: #10b981;
--rejected-color: #ef4444;
--suspended-color: #6b7280;
```

### Add Custom Actions

Extend the ApplicantCard component:

```jsx
<ApplicantCard
  applicant={applicant}
  onViewDetails={handleViewDetails}
  onApprove={handleApprove}
  onReject={handleReject}
  onSuspend={handleSuspend}
  onCustomAction={(id) => {
    // Your custom action
    console.log('Custom action for:', id);
  }}
/>
```

### Modify Stats Cards

Edit `StatsCards.jsx` to add more stats:

```javascript
const statsData = [
  // ... existing stats
  {
    title: 'Interview',
    count: stats.interview_count,
    icon: '📞',
    color: 'interview',
    description: 'Scheduled interviews',
  },
];
```

## 🔐 Authentication

### Protect Dashboard Route

```jsx
import { Navigate } from 'react-router-dom';
import { OrganizationDashboard } from './components/dashboard';

function ProtectedDashboard() {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return <OrganizationDashboard organizationId={1} />;
}
```

### Handle Token Expiry

The API service will receive 401 errors when token expires. Add an interceptor:

```javascript
// src/services/dashboardApi.js
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 📱 Mobile Menu

The sidebar automatically becomes a mobile menu on small screens:

- Hamburger button appears
- Sidebar slides in from left
- Overlay closes menu when clicked
- Menu closes after selecting a view

## 🎯 Advanced Usage

### With State Management (Redux)

```jsx
import { useSelector, useDispatch } from 'react-redux';
import { OrganizationDashboard } from './components/dashboard';

function DashboardContainer() {
  const organizationId = useSelector(state => state.auth.organizationId);
  const dispatch = useDispatch();
  
  return <OrganizationDashboard organizationId={organizationId} />;
}
```

### With Custom Loading Component

```jsx
import { OrganizationDashboard } from './components/dashboard';
import CustomLoader from './CustomLoader';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  
  if (loading) return <CustomLoader />;
  
  return <OrganizationDashboard organizationId={1} />;
}
```

### Export/Download Feature

Add export button to dashboard:

```jsx
const handleExport = () => {
  // Export applicants to CSV
  const csv = applicants.map(a => 
    `${a.full_name},${a.email},${a.status}`
  ).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'applicants.csv';
  a.click();
};
```

## 🐛 Troubleshooting

### API Calls Failing

1. Check backend is running: `http://localhost:8000`
2. Check CORS is configured
3. Check token is valid: `localStorage.getItem('access_token')`
4. Check network tab for errors

### Cards Not Displaying

1. Check browser console for errors
2. Verify API is returning data
3. Check organizationId is valid
4. Ensure backend migration is run

### Styles Not Loading

1. Ensure CSS files are imported
2. Check for CSS conflicts
3. Clear browser cache
4. Check file paths

### Mobile Menu Not Working

1. Check window width detection
2. Ensure overlay is rendering
3. Check z-index conflicts
4. Test on actual mobile device

## 📚 API Endpoints Used

- `GET /api/profile/organizations/{id}/statistics/`
- `GET /api/profile/organizations/{id}/applicants/`
- `GET /api/profile/organizations/{id}/approved-members/`
- `GET /api/profile/organizations/{id}/all-applications/`
- `GET /api/profile/applicants/{membership_id}/`
- `POST /api/profile/memberships/{id}/approve/`

## 🎭 Example Implementation

Complete example with error handling:

```jsx
import React, { useEffect, useState } from 'react';
import { OrganizationDashboard } from './components/dashboard';

function DashboardPage() {
  const [orgId, setOrgId] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Get organization ID from user profile
    const fetchOrgId = async () => {
      try {
        const response = await fetch('/api/profile/my-memberships/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        const data = await response.json();
        
        if (data.length > 0) {
          setOrgId(data[0].organization);
        } else {
          setError('No organization found');
        }
      } catch (err) {
        setError('Failed to load organization');
      }
    };
    
    fetchOrgId();
  }, []);
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  if (!orgId) {
    return <div>Loading...</div>;
  }
  
  return <OrganizationDashboard organizationId={orgId} />;
}

export default DashboardPage;
```

## 🚦 Next Steps

1. ✅ Components created
2. ✅ API service configured
3. ⏳ Add to your app routing
4. ⏳ Configure environment variables
5. ⏳ Run backend migration
6. ⏳ Test with real data
7. ⏳ Customize styles if needed
8. ⏳ Add role-based permissions
9. ⏳ Deploy to production

## 📞 Support

Check these files for reference:
- `API_DOCUMENTATION.md` - Backend API details
- `DASHBOARD_DESIGN.md` - Design specifications
- `FRONTEND_API_QUICK_REFERENCE.md` - Quick API reference

---

**Status:** Frontend implementation complete ✅  
**Ready to use!** Import and add to your app routing.

