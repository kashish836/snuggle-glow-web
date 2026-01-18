# 📁 SnuggleNest Project Structure

## 🗂️ Complete Directory Structure

```
snuggle-glow-web/
│
├── 📁 backend/                    # Python FastAPI Backend
│   ├── 📁 app/
│   │   ├── 📁 api/
│   │   │   └── 📁 v1/
│   │   │       ├── 📁 endpoints/  # API endpoint handlers
│   │   │       │   ├── auth.py           # Basic auth (login/register)
│   │   │       │   ├── auth_enhanced.py  # Enhanced auth (reset/verify)
│   │   │       │   ├── users.py          # User management
│   │   │       │   ├── blog.py           # Blog posts
│   │   │       │   ├── community.py      # Discussions
│   │   │       │   ├── contact.py        # Contact form
│   │   │       │   └── resources.py     # Resources
│   │   │       └── router.py             # Main API router
│   │   │
│   │   ├── 📁 core/               # Core functionality
│   │   │   ├── config.py          # Configuration settings
│   │   │   ├── database.py        # Database setup
│   │   │   ├── security.py       # Auth & password hashing
│   │   │   ├── rate_limiter.py    # Rate limiting
│   │   │   └── email.py           # Email utilities
│   │   │
│   │   ├── 📁 models/              # Database models (SQLAlchemy)
│   │   │   ├── user.py            # User & Profile models
│   │   │   ├── blog.py            # Blog post model
│   │   │   ├── community.py       # Discussion models
│   │   │   ├── contact.py        # Contact models
│   │   │   └── resource.py       # Resource model
│   │   │
│   │   └── 📁 schemas/             # Pydantic schemas
│   │       ├── user.py            # User schemas
│   │       ├── blog.py            # Blog schemas
│   │       ├── community.py       # Community schemas
│   │       ├── contact.py        # Contact schemas
│   │       └── resource.py       # Resource schemas
│   │
│   ├── main.py                     # Application entry point
│   ├── requirements.txt            # Python dependencies
│   ├── .env                        # Environment variables
│   └── README.md                   # Backend documentation
│
├── 📁 public/                      # Frontend (HTML/CSS/JS)
│   ├── 📁 css/
│   │   └── styles.css              # Custom styles
│   │
│   ├── 📁 js/
│   │   ├── api-client.js          # API client
│   │   ├── app.js                 # Main app utilities
│   │   ├── auth.js                # Authentication logic
│   │   ├── auth-enhanced.js       # Enhanced auth features
│   │   ├── settings.js            # Settings page logic
│   │   ├── contact.js             # Contact form logic
│   │   ├── profile-edit.js        # Profile editor
│   │   └── loading.js             # Loading utilities
│   │
│   ├── index.html                  # Homepage
│   ├── auth.html                   # Login/Signup
│   ├── forgot-password.html       # Password reset request
│   ├── reset-password.html         # Password reset form
│   ├── verify-email.html          # Email verification
│   ├── settings.html               # User settings
│   ├── profile-edit.html          # Profile editor
│   ├── contact.html               # Contact form
│   ├── blog.html                  # Blog page
│   ├── community.html             # Community page
│   ├── resources.html             # Resources page
│   ├── server.py                  # Simple HTTP server
│   └── README.md                  # Frontend documentation
│
├── 📁 src/                         # OLD React frontend (can be ignored)
│   └── ...                         # React/TypeScript files
│
├── 📄 START_EVERYTHING.bat         # Start both services
├── 📄 start-vanilla.bat           # Alternative start script
├── 📄 PRODUCTION_GUIDE.md         # Production deployment guide
├── 📄 UPDATE_MAINTENANCE_GUIDE.md # Update & maintenance guide
├── 📄 USER_EXPERIENCE_GUIDE.md    # UX & auth guide
├── 📄 PROJECT_STRUCTURE.md        # This file
└── 📄 README.md                   # Main project README
```

---

## 🔍 File Purpose Guide

### Backend Files

#### `backend/main.py`
- FastAPI application entry point
- Sets up CORS, routes, lifespan events
- Runs the server

#### `backend/app/core/config.py`
- All configuration settings
- Environment variables
- Database, security, CORS settings

#### `backend/app/core/database.py`
- Database connection setup
- Session management
- SQLAlchemy configuration

#### `backend/app/core/security.py`
- Password hashing/verification
- JWT token creation
- Authentication dependencies

#### `backend/app/core/rate_limiter.py`
- Rate limiting implementation
- Prevents abuse
- Configurable limits

#### `backend/app/core/email.py`
- Email sending utilities
- Verification emails
- Password reset emails

#### `backend/app/models/*.py`
- Database table definitions
- SQLAlchemy models
- Relationships

#### `backend/app/schemas/*.py`
- Request/response validation
- Pydantic models
- Data serialization

#### `backend/app/api/v1/endpoints/*.py`
- API endpoint handlers
- Business logic
- Request processing

### Frontend Files

#### `public/index.html`
- Homepage
- Main landing page
- Navigation

#### `public/auth.html`
- Login/Signup page
- Authentication forms
- Toggle between login/signup

#### `public/settings.html`
- User settings page
- Theme preferences
- Notification settings

#### `public/js/api-client.js`
- HTTP client for backend
- Token management
- Request/response handling

#### `public/js/app.js`
- Common utilities
- Navigation updates
- Toast notifications

#### `public/js/auth.js`
- Authentication logic
- Form handling
- User session management

---

## 🔄 Data Flow

### User Registration

```
Frontend (auth.html)
  ↓ User fills form
  ↓ Submit to /auth/register
Backend (auth.py)
  ↓ Validate data
  ↓ Hash password
  ↓ Create user in database
  ↓ Create profile
  ↓ Send verification email
  ↓ Return user data
Frontend
  ↓ Auto-login
  ↓ Store tokens
  ↓ Redirect to homepage
```

### User Login

```
Frontend (auth.html)
  ↓ User enters credentials
  ↓ Submit to /auth/login
Backend (auth.py)
  ↓ Verify credentials
  ↓ Check account status
  ↓ Generate tokens
  ↓ Return tokens
Frontend
  ↓ Store tokens
  ↓ Fetch user info
  ↓ Update navigation
  ↓ Redirect to homepage
```

### Profile Update

```
Frontend (settings.html)
  ↓ User changes settings
  ↓ Submit to /users/profile (PUT)
Backend (users.py)
  ↓ Verify authentication
  ↓ Validate data
  ↓ Update database
  ↓ Return updated profile
Frontend
  ↓ Update UI
  ↓ Show success message
```

---

## 🗄️ Database Schema

### Users Table
- id (UUID)
- email (String, unique)
- hashed_password (String)
- is_active (Boolean)
- is_verified (Boolean)
- verification_token (String, nullable)
- password_reset_token (String, nullable)
- created_at, updated_at

### Profiles Table
- id (UUID)
- user_id (UUID, foreign key)
- display_name (String, nullable)
- avatar_url (String, nullable)
- bio (Text, nullable)
- theme_preference (String)
- notifications_enabled (Boolean)
- created_at, updated_at

### Other Tables
- blog_posts
- discussions
- discussion_replies
- contact_messages
- newsletter_subscribers
- resources

---

## 🔐 Security Structure

### Authentication Flow
1. User submits credentials
2. Backend validates
3. Backend generates JWT tokens
4. Frontend stores tokens
5. Frontend includes token in requests
6. Backend validates token
7. Backend processes request

### Token Management
- Access token: Short-lived (30 min)
- Refresh token: Long-lived (7 days)
- Stored in localStorage
- Auto-refresh on 401

---

## 📦 Dependencies

### Backend (requirements.txt)
- FastAPI: Web framework
- SQLAlchemy: ORM
- Pydantic: Validation
- python-jose: JWT
- passlib: Password hashing
- aiosqlite: Async SQLite

### Frontend
- Tailwind CSS (CDN): Styling
- Vanilla JavaScript: No framework
- Fetch API: HTTP requests

---

## 🚀 Deployment Structure

### Development
```
Backend: localhost:8000
Frontend: localhost:3000
Database: SQLite (local file)
```

### Production
```
Backend: api.yourdomain.com
Frontend: yourdomain.com
Database: PostgreSQL (cloud)
```

---

## 📝 Adding New Features

### Backend Feature
1. Create model in `models/`
2. Create schema in `schemas/`
3. Create endpoint in `endpoints/`
4. Add route in `router.py`
5. Test with API docs

### Frontend Feature
1. Create HTML page
2. Create JavaScript file
3. Add navigation link
4. Connect to API
5. Test functionality

---

## 🔍 Finding Things

### Need to change authentication?
→ `backend/app/api/v1/endpoints/auth.py`

### Need to change database?
→ `backend/app/models/`

### Need to change API response?
→ `backend/app/schemas/`

### Need to change frontend page?
→ `public/*.html`

### Need to change styling?
→ `public/css/styles.css`

### Need to change API calls?
→ `public/js/api-client.js`

---

## ✅ Best Practices

1. **Keep structure organized**
   - Models in models/
   - Endpoints in endpoints/
   - Schemas in schemas/

2. **Follow naming conventions**
   - Files: snake_case.py
   - Classes: PascalCase
   - Functions: snake_case

3. **Separate concerns**
   - Business logic in endpoints
   - Data models in models/
   - Validation in schemas/

4. **Document changes**
   - Update README
   - Add comments
   - Update API docs

---

**This structure makes it easy to find and update anything!** 🎯

