# ⚡ Quick Reference Guide - SnuggleNest

## 🚀 Start Project

```bash
# Easiest way:
START_EVERYTHING.bat

# Or manually:
# Terminal 1
cd backend && venv\Scripts\activate && python main.py

# Terminal 2  
cd public && python -m http.server 3000
```

**Open:** http://localhost:3000

---

## 📁 Key Files & Locations

### Backend
- **Config:** `backend/app/core/config.py`
- **Database:** `backend/app/core/database.py`
- **Auth:** `backend/app/api/v1/endpoints/auth.py`
- **Models:** `backend/app/models/`
- **Schemas:** `backend/app/schemas/`

### Frontend
- **Homepage:** `public/index.html`
- **Auth:** `public/auth.html`
- **Settings:** `public/settings.html`
- **API Client:** `public/js/api-client.js`
- **Styles:** `public/css/styles.css`

---

## 🔧 Common Updates

### Add New Page
1. Create `public/new-page.html`
2. Add link in navigation
3. Create `public/js/new-page.js` (if needed)

### Add API Endpoint
1. Create `backend/app/api/v1/endpoints/new.py`
2. Add to `backend/app/api/v1/router.py`
3. Test at http://localhost:8000/docs

### Update Database
1. Modify model in `backend/app/models/`
2. Update schema in `backend/app/schemas/`
3. Restart backend (tables auto-create)

---

## 🔐 Authentication Endpoints

- `POST /api/v1/auth/register` - Register
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/request-password-reset` - Request reset
- `POST /api/v1/auth/reset-password` - Reset password
- `POST /api/v1/auth/verify-email` - Verify email
- `GET /api/v1/auth/me` - Get current user

---

## 📝 Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL=sqlite+aiosqlite:///./snugglenest.db
SECRET_KEY=your-secret-key
CORS_ORIGINS=http://localhost:3000
```

### Frontend (in HTML files)
```html
<script>
    window.API_BASE_URL = 'http://localhost:8000/api/v1';
</script>
```

---

## 🐛 Quick Fixes

### Backend won't start
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Frontend won't start
```bash
cd public
python -m http.server 3000
```

### Can't connect
- Check both are running
- Check ports (8000, 3000)
- Check `.env` files
- Clear browser cache

---

## 📚 Full Documentation

- **Production:** `PRODUCTION_GUIDE.md`
- **Updates:** `UPDATE_MAINTENANCE_GUIDE.md`
- **Structure:** `PROJECT_STRUCTURE.md`
- **UX:** `USER_EXPERIENCE_GUIDE.md`
- **Startup:** `STARTUP_READY.md`

---

**Keep this handy for quick lookups!** 📌

