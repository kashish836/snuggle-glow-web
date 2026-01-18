# 🚀 Quick Start Guide - SnuggleNest

Get your SnuggleNest application running in minutes!

## Option 1: Automatic Start (Windows)

Simply double-click:
- **`start-all.bat`** - Starts both backend and frontend automatically

Or run individually:
- **`start-backend.bat`** - Starts only the backend
- **`start-frontend.bat`** - Starts only the frontend

## Option 2: Manual Start

### Step 1: Start Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
# source venv/bin/activate  # On Mac/Linux
pip install -r requirements.txt
python main.py
```

Backend will run at: **http://localhost:8000**
API Docs at: **http://localhost:8000/docs**

### Step 2: Start Frontend (in a new terminal)

```bash
npm install
npm run dev
```

Frontend will run at: **http://localhost:5173**

## ✅ Verify It's Working

1. **Backend Health Check**: Visit http://localhost:8000/health
   - Should return: `{"status": "healthy"}`

2. **API Documentation**: Visit http://localhost:8000/docs
   - Interactive API docs with Swagger UI

3. **Frontend**: Visit http://localhost:5173
   - Should see the SnuggleNest homepage

## 🧪 Test the Application

1. **Register a User**:
   - Go to http://localhost:5173/auth
   - Click "Sign Up"
   - Enter email and password
   - Click "Create Account"

2. **Login**:
   - Use your credentials to login
   - You'll be redirected to the home page

3. **View Profile**:
   - Click on your profile/Settings
   - View and edit your profile

4. **Test Contact Form**:
   - Go to http://localhost:5173/contact
   - Fill out and submit the form

## 📁 Project Structure

```
snuggle-glow-web/
├── backend/          # FastAPI Python backend
│   ├── app/         # Application code
│   ├── main.py      # Entry point
│   └── requirements.txt
├── src/             # React frontend
│   ├── pages/       # Page components
│   ├── components/  # UI components
│   └── lib/api/     # API client
├── start-all.bat    # Start both services (Windows)
└── .env             # Frontend config
```

## 🔧 Troubleshooting

### Backend Issues

**Port 8000 already in use:**
- Change `PORT=8000` in `backend/.env` to another port
- Update `VITE_API_BASE_URL` in `.env` to match

**Database errors:**
- Delete `backend/snugglenest.db` and restart (will recreate)

**Module not found:**
- Make sure virtual environment is activated
- Run `pip install -r requirements.txt` again

### Frontend Issues

**Port 5173 already in use:**
- Vite will automatically use the next available port
- Check terminal output for the actual port

**API connection errors:**
- Verify backend is running on port 8000
- Check `VITE_API_BASE_URL` in `.env` file
- Check browser console for CORS errors

**CORS errors:**
- Make sure backend `.env` includes your frontend URL in `CORS_ORIGINS`

## 🎯 Next Steps

- Explore the API docs at http://localhost:8000/docs
- Check out the blog, community, and resources pages
- Customize the theme in Settings
- Submit a contact form

## 📚 Documentation

- **Backend API**: See `backend/README.md`
- **Connection Guide**: See `FRONTEND_BACKEND_CONNECTION.md`
- **Connection Summary**: See `CONNECTION_SUMMARY.md`

## 💡 Tips

- Keep both terminals open (backend and frontend)
- Use browser DevTools to see API calls
- Check backend terminal for request logs
- API docs are interactive - try endpoints directly!

Happy coding! 🌙✨
