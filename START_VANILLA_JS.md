# 🚀 Start SnuggleNest - Vanilla JS Version

## Quick Start

### 1. Start Backend (Terminal 1)
```bash
cd backend
venv\Scripts\activate
python main.py
```
Backend runs on: **http://localhost:8000**

### 2. Start Frontend (Terminal 2)
```bash
cd public
python server.py
```
Frontend runs on: **http://localhost:3000**

### 3. Open Browser
Visit: **http://localhost:3000**

---

## What Changed

✅ **Converted React to HTML/CSS/JavaScript**
✅ **Removed Google login** (no more Supabase errors)
✅ **Kept Python backend** (unchanged)
✅ **Simplified frontend** (no build step needed)

---

## File Structure

```
snuggle-glow-web/
├── backend/           # Python FastAPI (unchanged)
│   └── main.py
├── public/            # NEW: HTML/CSS/JS frontend
│   ├── index.html
│   ├── auth.html
│   ├── settings.html
│   ├── contact.html
│   ├── css/
│   ├── js/
│   └── server.py
└── src/              # OLD: React frontend (can be ignored)
```

---

## Pages Available

- **http://localhost:3000/index.html** - Homepage
- **http://localhost:3000/auth.html** - Login/Signup
- **http://localhost:3000/settings.html** - Settings (requires login)
- **http://localhost:3000/contact.html** - Contact form

---

## Test It

1. Open http://localhost:3000
2. Click "Sign Up" or go to /auth.html
3. Create an account
4. You'll be redirected to homepage
5. Go to Settings to update your profile

---

## Troubleshooting

**Frontend won't start:**
```bash
cd public
python server.py
```

**Backend won't start:**
```bash
cd backend
venv\Scripts\activate
python main.py
```

**Can't connect to backend:**
- Make sure backend is running on port 8000
- Check `public/js/api-client.js` has correct API URL
- Check browser console (F12) for errors

---

## No More Google Login Errors!

The Google login has been completely removed. Users can only:
- Register with email/password
- Login with email/password

No Supabase, no Google OAuth, just simple email/password authentication through your Python backend!

---

## Enjoy! 🌙✨

