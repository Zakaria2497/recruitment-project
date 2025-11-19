# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Prerequisites Check
```bash
node --version   # Should be 18.0.0 or higher
npm --version    # Should be 9.0.0 or higher
```

### 2. Install & Run
```bash
# Navigate to frontend directory
cd seasonal_app_frontend

# Install dependencies
npm install

# Create environment file
echo "VITE_API_BASE_URL=http://localhost:8000/api" > .env

# Start the app
npm run dev
```

### 3. Open Browser
Visit: **http://localhost:5173**

---

## 📱 How to Use

### Login
1. Enter phone number: `+971501234567`
2. Click **"Send OTP"**
3. Enter 6-digit OTP code
4. Click **"Verify OTP"**

### Complete Profile
1. Click **"Go to Profile"** from Dashboard
2. Fill out 6 steps:
   - **Step 1**: Personal Information
   - **Step 2**: Education
   - **Step 3**: Work Experience
   - **Step 4**: Skills & Languages
   - **Step 5**: Bank Information
   - **Step 6**: Upload Documents & Submit

3. Click **"Save & Continue"** after each step
4. When 80%+ complete, click **"Submit Profile"**

---

## ⚙️ Configuration

### Change API URL
Edit `.env` file:
```env
VITE_API_BASE_URL=http://your-backend-url:port/api
```

### Available Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Check code quality
```

---

## 🐛 Common Issues

**Can't connect to API?**
- Check backend is running on `http://localhost:8000`
- Verify `.env` file has correct URL

**Port 5173 in use?**
- Vite will auto-use next available port
- Or specify: `npm run dev -- --port 3000`

**Module errors?**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Full Documentation
See [USER_GUIDE.md](./USER_GUIDE.md) for complete instructions.

---

## ✅ Node.js Version
**Required**: Node.js 18.0.0 or higher
- Recommended: Node.js 18 LTS or 20 LTS
- Check with: `node --version`
- Download: https://nodejs.org/

