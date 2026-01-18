# 🚀 Run SnuggleNest Project - Complete Guide

## Quick Start (Easiest Way)

### Windows Users:

**Option 1: Double-click to start**
- Double-click `start-all.bat` - This will start both backend and frontend automatically!

**Option 2: PowerShell script**
- Right-click `start-all.ps1` → "Run with PowerShell"
- This opens two windows (one for backend, one for frontend)

### Mac/Linux Users:

Open terminal and run:
```bash
# Terminal 1 - Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py

# Terminal 2 - Frontend (new terminal)
npm install
npm run dev
```

## Step-by-Step Manual Setup

### 1. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python main.py
```

✅ Backend should now be running at: **http://localhost:8000**
- API Docs: **http://localhost:8000/docs**
- Health Check: **http://localhost:8000/health**

### 2. Frontend Setup

Open a **NEW terminal** (keep backend running):

```bash
# Make sure you're in the project root (not backend folder)
# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

✅ Frontend should now be running at: **http://localhost:5173**

## Verify Everything Works

### 1. Check Backend
Open browser and visit:
- **http://localhost:8000/health** → Should show `{"status": "healthy"}`
- **http://localhost:8000/docs** → Should show interactive API documentation

### 2. Check Frontend
Open browser and visit:
- **http://localhost:5173** → Should show SnuggleNest homepage

### 3. Test Authentication
1. Go to **http://localhost:5173/auth**
2. Click "Sign Up"
3. Enter:
   - Email: `test@example.com`
   - Password: `Test1234!`
   - Display Name: `Test User`
4. Click "Create Account"
5. You should be automatically logged in!

### 4. Test Profile
1. After logging in, go to **Settings** (top right)
2. Try changing the theme (Dark Mode toggle)
3. Go to **Edit Profile** and update your bio

### 5. Test Contact Form
1. Go to **http://localhost:5173/contact**
2. Fill out the contact form
3. Submit - should see success message

## Troubleshooting

### Backend Won't Start

**Error: "Module not found"**
```bash
cd backend
venv\Scripts\activate  # or source venv/bin/activate
pip install -r requirements.txt
```

**Error: "Port 8000 already in use"**
- Change port in `backend/.env`: `PORT=8001`
- Update `VITE_API_BASE_URL` in `.env`: `http://localhost:8001/api/v1`

**Error: "Database locked"**
- Close any database viewers
- Delete `backend/snugglenest.db` and restart (will recreate)

### Frontend Won't Start

**Error: "Port 5173 already in use"**
- Vite will auto-use next available port
- Check terminal for actual port number

**Error: "Cannot connect to backend"**
- Make sure backend is running
- Check `VITE_API_BASE_URL` in `.env` file
- Check browser console for CORS errors

**CORS Errors in Browser**
- Make sure `backend/.env` has: `CORS_ORIGINS=http://localhost:5173`
- Restart backend after changing `.env`

### Authentication Issues

**"Login failed"**
- Check backend terminal for errors
- Verify email/password are correct
- Try registering a new account

**"Token refresh failed"**
- Clear browser localStorage
- Logout and login again

## Project Structure

```
snuggle-glow-web/
├── backend/              # FastAPI Backend
│   ├── app/             # Application code
│   │   ├── api/         # API endpoints
│   │   ├── core/        # Core config
│   │   ├── models/      # Database models
│   │   └── schemas/     # Pydantic schemas
│   ├── main.py          # Entry point
│   ├── requirements.txt # Python dependencies
│   └── .env            # Backend config
│
├── src/                 # React Frontend
│   ├── pages/          # Page components
│   ├── components/     # UI components
│   └── lib/api/        # API client
│
├── .env                # Frontend config
├── start-all.bat       # Windows batch script
├── start-all.ps1       # PowerShell script
└── package.json        # Node dependencies
```

## Environment Variables

### Frontend (.env in root)
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### Backend (backend/.env)
```env
DEBUG=True
HOST=0.0.0.0
PORT=8000
DATABASE_URL=sqlite+aiosqlite:///./snugglenest.db
SECRET_KEY=snugglenest-dev-secret-key-change-in-production-12345
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## What You'll See

### Backend Terminal
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Frontend Terminal
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Browser
- Beautiful SnuggleNest homepage
- Navigation menu
- Pink/pastel color scheme
- Responsive design

## Next Steps

1. ✅ **Explore the API**: Visit http://localhost:8000/docs
2. ✅ **Register & Login**: Test authentication flow
3. ✅ **Update Profile**: Customize your user profile
4. ✅ **Browse Pages**: Check out Blog, Community, Resources
5. ✅ **Submit Contact Form**: Test form submission

## Need Help?

- Check `QUICK_START.md` for quick reference
- Check `FRONTEND_BACKEND_CONNECTION.md` for technical details
- Check backend terminal for error messages
- Check browser console (F12) for frontend errors

## 🎉 You're All Set!

Your SnuggleNest application is now running! Enjoy exploring! 🌙✨

