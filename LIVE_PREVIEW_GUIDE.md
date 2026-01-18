# 🎬 Live Preview Guide - SnuggleNest

## 🚀 Quick Start (3 Steps)

### Step 1: Start Backend
Double-click: **`start-backend.bat`**
- OR run: `cd backend && venv\Scripts\activate && python main.py`
- Wait for: "Uvicorn running on http://0.0.0.0:8000"

### Step 2: Start Frontend  
Double-click: **`start-frontend.bat`**
- OR run: `npm run dev`
- Wait for: "Local: http://localhost:5173/"

### Step 3: Open Browser
Visit: **http://localhost:5173**

---

## 📸 What You'll See

### 1. Homepage (http://localhost:5173)
```
┌─────────────────────────────────────────┐
│  🌙 SnuggleNest Navigation Bar          │
├─────────────────────────────────────────┤
│                                         │
│     👶 Welcome to SnuggleNest          │
│     Where Little Hearts Grow &          │
│     Mamas Glow                          │
│                                         │
│  [Explore Baby Tips] [Join Community]  │
│                                         │
│  📊 Stats: 150+ Tips | 2,500+ Mamas   │
│                                         │
│  Featured Tips:                         │
│  • First Week Sleep Schedule           │
│  • Breastfeeding Basics                │
│  • Postpartum Self-Care                │
│                                         │
│  💬 Mama Love Stories (Testimonials)   │
│                                         │
└─────────────────────────────────────────┘
```

### 2. Authentication Page (http://localhost:5173/auth)
```
┌─────────────────────────────────────────┐
│  Login / Sign Up Form                   │
│                                         │
│  Email: [________________]             │
│  Password: [____________]               │
│                                         │
│  [Login] or [Sign Up]                  │
│                                         │
│  ✨ Beautiful pink/pastel theme        │
└─────────────────────────────────────────┘
```

### 3. Settings Page (After Login)
```
┌─────────────────────────────────────────┐
│  ⚙️ Settings                            │
│                                         │
│  👤 Profile                             │
│  Display Name: Test User                │
│  Email: test@example.com               │
│                                         │
│  🎨 Theme Settings                     │
│  Dark Mode: [Toggle Switch]            │
│                                         │
│  🔔 Notifications                       │
│  Email Updates: [Toggle Switch]        │
│                                         │
└─────────────────────────────────────────┘
```

### 4. API Documentation (http://localhost:8000/docs)
```
┌─────────────────────────────────────────┐
│  Swagger UI - Interactive API Docs      │
│                                         │
│  📚 Available Endpoints:                │
│  • POST /api/v1/auth/register          │
│  • POST /api/v1/auth/login              │
│  • GET  /api/v1/users/profile          │
│  • PUT  /api/v1/users/profile           │
│  • POST /api/v1/contact/message         │
│                                         │
│  [Try it out] buttons for each endpoint │
└─────────────────────────────────────────┘
```

---

## 🧪 Test Checklist

### ✅ Backend Tests
- [ ] Visit http://localhost:8000/health → See `{"status": "healthy"}`
- [ ] Visit http://localhost:8000/docs → See Swagger UI
- [ ] Visit http://localhost:8000 → See welcome message

### ✅ Frontend Tests
- [ ] Visit http://localhost:5173 → See homepage
- [ ] Click "Auth" → See login/signup form
- [ ] Register new account → Success!
- [ ] Login → Redirected to homepage
- [ ] Click Settings → See profile
- [ ] Toggle Dark Mode → Theme changes
- [ ] Go to Contact → Fill form → Submit → Success!

### ✅ API Tests (via /docs)
- [ ] POST /auth/register → Create user
- [ ] POST /auth/login → Get tokens
- [ ] GET /auth/me → Get user info (with token)
- [ ] GET /users/profile → Get profile
- [ ] PUT /users/profile → Update profile

---

## 🎨 Visual Features

### Color Scheme
- **Primary Pink**: `#ec4899` (pink-500)
- **Lavender**: `#a78bfa` (purple-400)
- **Mint**: `#6ee7b7` (green-300)
- **Baby Blue**: `#93c5fd` (blue-300)
- **Soft Backgrounds**: Pink-50, White, Lavender gradients

### UI Elements
- ✨ Smooth animations (floating hearts, stars)
- 🎯 Rounded corners (baby-card style)
- 💕 Gentle hover effects
- 📱 Fully responsive (mobile-friendly)
- 🌙 Dark mode support

### Pages Available
1. **Home** (`/`) - Welcome page with stats
2. **Blog** (`/blog`) - Baby tips and articles
3. **Resources** (`/resources`) - Downloadable resources
4. **Community** (`/community`) - Discussion forum
5. **Contact** (`/contact`) - Contact form
6. **Auth** (`/auth`) - Login/Signup
7. **Settings** (`/settings`) - User settings
8. **Profile Editor** (`/profile/edit`) - Edit profile

---

## 🔍 Debugging Tips

### Check Backend Logs
Look for:
```
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Check Frontend Console (F12)
- Network tab → See API calls
- Console tab → See any errors
- Application tab → See localStorage tokens

### Common Issues

**"Cannot GET /"**
- Backend not running → Start backend

**"Network Error"**
- Backend not running → Start backend
- Wrong API URL → Check `.env` file

**"401 Unauthorized"**
- Token expired → Login again
- No token → Login first

**"CORS Error"**
- Backend CORS not configured → Check `backend/.env`
- Wrong origin → Add your frontend URL to CORS_ORIGINS

---

## 📱 Mobile Preview

The app is fully responsive! To test:
1. Open browser DevTools (F12)
2. Click device toggle icon
3. Select mobile device (iPhone, iPad, etc.)
4. Refresh page
5. See mobile-optimized layout!

---

## 🎯 Expected Behavior

### Registration Flow
1. Go to `/auth`
2. Click "Sign Up"
3. Fill form → Submit
4. ✅ Auto-logged in
5. ✅ Redirected to homepage
6. ✅ See user menu in navigation

### Profile Update Flow
1. Login
2. Go to Settings
3. Toggle Dark Mode
4. ✅ Theme changes immediately
5. ✅ Saved to backend
6. ✅ Persists on refresh

### Contact Form Flow
1. Go to Contact page
2. Fill form
3. Submit
4. ✅ Success toast appears
5. ✅ Form resets
6. ✅ Message saved in backend

---

## 🌐 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | Main application |
| Backend API | http://localhost:8000 | API server |
| API Docs | http://localhost:8000/docs | Swagger UI |
| Health Check | http://localhost:8000/health | Backend status |

---

## ✨ Enjoy Your Live Preview!

Everything should be working now. Explore the beautiful SnuggleNest interface! 🌙💕

