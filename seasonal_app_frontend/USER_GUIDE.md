# Frontend Application - User Guide

## 📋 Prerequisites

### Required Software
- **Node.js**: Version 18.0.0 or higher (LTS version recommended: 18.x or 20.x)
- **npm**: Version 9.0.0 or higher (comes with Node.js)
- **Backend API**: Django backend must be running on `http://localhost:8000`

### Check Your Node.js Version
```bash
node --version
npm --version
```

If you don't have Node.js installed:
- Download from: https://nodejs.org/
- Choose the LTS (Long Term Support) version

---

## 🚀 Quick Start Guide

### Step 1: Navigate to Frontend Directory
```bash
cd seasonal_app_frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages including:
- React 19
- Vite
- Redux Toolkit
- Redux Saga
- React Router
- Styled Components
- Axios
- React Hook Form

### Step 3: Configure Environment Variables

Create a `.env` file in the `seasonal_app_frontend` directory:

```bash
# Copy the example file (if it exists)
cp .env.example .env
```

Or create a new `.env` file with:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

**Important**: 
- Make sure your Django backend is running on `http://localhost:8000`
- If your backend runs on a different port, update the URL accordingly

### Step 4: Start the Development Server
```bash
npm run dev
```

The app will start and you'll see:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 5: Open in Browser
Open your browser and navigate to:
```
http://localhost:5173
```

---

## 📱 Using the Application

### 1. Login/Authentication

#### Step 1: Enter Phone Number
- On the login page, enter your phone number in international format
- Example: `+971501234567`
- Click **"Send OTP"** button

#### Step 2: Enter OTP Code
- After clicking "Send OTP", you'll receive a 6-digit code
- Enter the code in the 6 input boxes (auto-focuses to next box)
- The code will auto-submit when all 6 digits are entered
- Or click **"Verify OTP"** button manually

#### Step 3: Resend OTP (if needed)
- If you didn't receive the code, click **"Resend OTP"**
- There's a 60-second cooldown between resend requests

### 2. Dashboard

After successful login, you'll see:
- **Welcome message** with your email/phone
- **Navigation menu** at the top
- **"Go to Profile"** button to start/continue profile setup

### 3. Complete Your Profile

The profile wizard has 6 steps:

#### Step 1: Personal Information
- **First Name** (required)
- **Father Name** (required)
- **Grand Name** (optional)
- **Family Name** (required)
- **Gender** (required) - Select from dropdown
- **Birthdate** (required) - Use date picker
- **Nationality** (required)
- **ID Number** (required)
- **City** (required)
- **Address** (required)
- **Profile Photo** (optional) - Max 5MB, JPG/PNG/GIF

Click **"Save & Continue"** to proceed.

#### Step 2: Education
- **Highest Degree** (required) - Select from dropdown
- **Major** (required)
- **School/Institution** (required)
- **Graduation Year** (required)
- **Education Certificates** (optional) - PDF/DOC/DOCX, Max 10MB

**Additional Courses**:
- Click **"Add Course"** to add extra courses
- Fill in: Title, Provider, Completion Date, Certificate (optional)
- Courses can be deleted using the "Delete" button

Click **"Save & Continue"** to proceed.

#### Step 3: Work Experience
- Click **"Add Experience"** to add work history
- Fill in:
  - **Job Title** (required)
  - **Employer** (required)
  - **Start Date** (required)
  - **End Date** (required, unless current job)
  - **Tasks & Responsibilities** (optional)
  - **Current Job** checkbox (if still working there)
  - **Experience Certificate** (optional) - PDF/DOC/DOCX, Max 10MB
- You can add multiple experiences
- Delete experiences using the "Delete" button

Click **"Continue"** to proceed (no save needed, auto-saves).

#### Step 4: Skills & Languages
**Languages**:
- Enter language name
- Select proficiency level: Basic, Good, Very Good, or Excellent
- Click **"Add Language"**
- Languages appear as chips and can be deleted

**Skills**:
- Enter skills separated by commas
- Example: `Customer Service, Sales, Communication`
- Click **"Add Skills"**
- Skills appear as chips and can be deleted individually

Click **"Continue"** to proceed.

#### Step 5: Bank Information
- **Bank Name** (required)
- **Account Holder Name** (required) - Full name as on bank account
- **IBAN** (required) - 15-34 alphanumeric characters
  - Example: `AE070331234567890123456`
  - Auto-formats with spaces as you type

Click **"Save & Continue"** to proceed.

#### Step 6: Attachments & Submit
Upload documents:
- **CV/Resume** (required for submission) - PDF/DOC/DOCX, Max 10MB
- **Cover Letter** (optional) - PDF/DOC/DOCX, Max 10MB
- **Portfolio** (optional) - PDF/DOC/DOCX, Max 10MB

**Profile Summary**:
- Shows completion percentage
- Progress bar visualization
- Must be at least 80% complete to submit

**Submit Profile**:
- Click **"Submit Profile"** when ready
- Confirmation dialog will appear
- Once submitted, profile cannot be edited
- Success message will be displayed

### 4. Navigation

**Header Navigation**:
- **Logo/App Name** - Click to go to Dashboard
- **Dashboard** - View main dashboard
- **Profile** - Continue/Edit profile
- **User Info** - Shows your email/phone
- **Logout** - Sign out of the application

---

## 🛠️ Development Commands

### Start Development Server
```bash
npm run dev
```
- Runs on `http://localhost:5173`
- Hot reload enabled (changes reflect immediately)
- Opens browser automatically

### Build for Production
```bash
npm run build
```
- Creates optimized production build in `dist/` folder
- Minified and optimized for performance

### Preview Production Build
```bash
npm run preview
```
- Preview the production build locally
- Useful for testing before deployment

### Run Linter
```bash
npm run lint
```
- Checks code for errors and style issues
- Uses ESLint configuration

---

## 🔧 Configuration

### Environment Variables

Create `.env` file in `seasonal_app_frontend/`:

```env
# API Base URL
VITE_API_BASE_URL=http://localhost:8000/api

# Optional: Add other environment variables as needed
```

**Note**: All environment variables must start with `VITE_` to be accessible in the app.

### Changing API URL

If your backend runs on a different URL:
1. Update `.env` file:
   ```env
   VITE_API_BASE_URL=http://your-backend-url:port/api
   ```
2. Restart the development server

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to API"
**Solution**:
- Check if Django backend is running
- Verify `VITE_API_BASE_URL` in `.env` file
- Check browser console for CORS errors
- Ensure backend allows requests from `http://localhost:5173`

### Issue: "Module not found" errors
**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 5173 already in use
**Solution**:
```bash
# Vite will automatically try next port, or specify:
npm run dev -- --port 3000
```

### Issue: OTP not received
**Solution**:
- Check backend logs
- In development, OTP is returned in API response (check Network tab)
- Wait 60 seconds before resending
- Verify phone number format: `+971501234567`

### Issue: File upload fails
**Solution**:
- Check file size (max 5MB for photos, 10MB for documents)
- Verify file type is allowed
- Check browser console for errors
- Ensure backend accepts multipart/form-data

### Issue: "401 Unauthorized" errors
**Solution**:
- Token may have expired - try logging out and logging in again
- Check if tokens are stored in localStorage
- Verify backend JWT settings

### Issue: Form validation errors
**Solution**:
- Check required fields are filled
- Verify date formats (YYYY-MM-DD)
- Check IBAN format (15-34 alphanumeric characters)
- Ensure phone number is in international format

---

## 📂 Project Structure

```
seasonal_app_frontend/
├── src/
│   ├── components/
│   │   ├── auth/          # Login, ProtectedRoute
│   │   ├── forms/         # All form components
│   │   ├── common/        # Layout, ProgressBar
│   │   └── ui/            # Button, Input, Card, Modal, Toast
│   ├── pages/             # Dashboard, ProfileWizard
│   ├── hooks/             # useAuth, useProfile, useFormProgress
│   ├── services/          # API services (authService, profileService)
│   ├── store/             # Redux store, slices, sagas
│   ├── styles/            # Theme, GlobalStyles
│   ├── utils/             # Helpers, validation, constants
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── public/                # Static assets
├── .env                   # Environment variables (create this)
├── package.json           # Dependencies
└── vite.config.js        # Vite configuration
```

---

## 🔐 Authentication Flow

1. **User enters phone number** → `POST /api/auth/send-otp/`
2. **User enters OTP** → `POST /api/auth/verify-otp/`
3. **Tokens stored** → Access token & Refresh token in localStorage
4. **Auto token refresh** → Automatically refreshes on 401 errors
5. **Logout** → Clears tokens and redirects to login

---

## 📊 State Management

The app uses **Redux Toolkit** with **Redux Saga**:

- **Auth State**: User info, tokens, authentication status
- **Profile State**: All profile data, current step, progress, completion status

State is automatically synced with the backend API.

---

## 🎨 Styling

- **Styled Components** for component styling
- **Theme** configuration in `src/styles/theme.js`
- **Responsive design** - works on desktop, tablet, and mobile
- **Consistent colors** and spacing throughout

---

## 📝 Tips & Best Practices

1. **Save Frequently**: Forms auto-save, but click "Save & Continue" to ensure data is saved
2. **Complete in Order**: While you can navigate between steps, complete them in order for best experience
3. **Check Progress**: Monitor the progress bar to see completion percentage
4. **File Uploads**: Ensure files are within size limits before uploading
5. **Network Issues**: If you lose connection, data is saved locally in Redux state

---

## 🚀 Production Deployment

### Build the App
```bash
npm run build
```

### Deploy Options
- **Static Hosting**: Deploy `dist/` folder to:
  - Netlify
  - Vercel
  - AWS S3 + CloudFront
  - GitHub Pages
  - Any static hosting service

### Environment Variables for Production
Set `VITE_API_BASE_URL` to your production API URL:
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check Network tab for API errors
3. Verify backend is running and accessible
4. Check `.env` file configuration
5. Review this guide's troubleshooting section

---

## ✅ Checklist Before Starting

- [ ] Node.js 18+ installed
- [ ] Backend API running on `http://localhost:8000`
- [ ] `.env` file created with correct API URL
- [ ] Dependencies installed (`npm install`)
- [ ] Development server started (`npm run dev`)
- [ ] Browser opened to `http://localhost:5173`

---

**Happy Coding! 🎉**

