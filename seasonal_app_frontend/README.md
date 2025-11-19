# Seasonal Hiring Platform - Frontend

Modern React frontend application for the Seasonal Hiring Platform, built with Vite, Redux Toolkit, and styled-components.

## 🚀 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **Redux Saga** - Side effects management
- **React Router DOM** - Routing
- **React Hook Form** - Form handling
- **Styled Components** - CSS-in-JS styling
- **Axios** - HTTP client

## 📁 Project Structure

```
src/
  components/
    auth/          # Authentication components
    forms/          # Form components
    common/         # Shared/common components
    ui/             # UI components (buttons, inputs, etc.)
  pages/            # Page components
  hooks/             # Custom React hooks
  services/          # API services
  store/
    slices/          # Redux slices
    sagas/           # Redux sagas
    selectors/       # Redux selectors
  styles/            # Global styles and theme
  utils/              # Utility functions
  App.jsx            # Main App component
  main.jsx           # Entry point
```

## 🛠️ Installation

### Prerequisites
- **Node.js**: Version 18.0.0 or higher (LTS recommended)
- **npm**: Version 9.0.0 or higher
- **Backend API**: Django backend running on `http://localhost:8000`

### Setup Steps

1. **Install dependencies:**
```bash
npm install
```

2. **Create `.env` file:**
```bash
cp .env.example .env
```

3. **Update `.env` with your API base URL:**
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

4. **Start development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

> 📖 **For detailed usage instructions, see [USER_GUIDE.md](./USER_GUIDE.md)**

## 🚦 Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📦 Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔗 API Integration

The app is configured to work with the Django REST API backend. Make sure the backend is running at the URL specified in `.env`.

### API Endpoints Used:
- `/api/auth/send-otp/` - Send OTP
- `/api/auth/verify-otp/` - Verify OTP
- `/api/auth/register/` - User registration
- `/api/auth/login/` - User login
- `/api/auth/refresh/` - Refresh JWT token
- `/api/profile/*` - Profile management endpoints

## 🎨 Styling

The app uses styled-components with a centralized theme. Theme configuration is in `src/styles/theme.js`.

## 📚 State Management

Redux Toolkit is used for state management with Redux Saga for handling async operations. The store is configured in `src/store/index.js`.

## 🔐 Authentication

JWT tokens are stored in localStorage and automatically included in API requests via axios interceptors.

## 📄 License

Part of the Seasonal Hiring Platform project.

