# Frontend-Backend Connection Summary

## ✅ Completed Integration

The frontend has been successfully connected to the FastAPI backend. Here's what was implemented:

### 1. API Client Infrastructure
- **`src/lib/api/client.ts`**: Centralized API client with:
  - Automatic token management (storage in localStorage)
  - Automatic token refresh on 401 errors
  - Request/response handling
  - Error formatting

### 2. API Service Modules
- **`src/lib/api/auth.ts`**: Authentication functions (register, login, getCurrentUser, logout)
- **`src/lib/api/profile.ts`**: Profile management functions (get, update, delete)
- **`src/lib/api/contact.ts`**: Contact form and newsletter functions

### 3. Updated Components
- **`src/hooks/useAuth.tsx`**: Now uses backend API instead of Supabase
- **`src/pages/Settings.tsx`**: Fetches and updates profile via backend API
- **`src/pages/ProfileEditor.tsx`**: Uses backend API for profile CRUD
- **`src/pages/Contact.tsx`**: Submits contact form and newsletter via backend API

## 🔧 Configuration Required

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### Backend CORS Setup

Ensure your backend `.env` includes:

```env
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://127.0.0.1:5173
```

## 🚀 How to Run

1. **Start Backend**:
   ```bash
   cd backend
   python main.py
   ```
   Backend runs on `http://localhost:8000`

2. **Start Frontend**:
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173` (or your Vite port)

## 📋 API Endpoints Used

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Token refresh
- `GET /api/v1/auth/me` - Get current user

### Profile
- `GET /api/v1/users/profile` - Get profile
- `PUT /api/v1/users/profile` - Update profile
- `DELETE /api/v1/users/profile` - Delete account

### Contact
- `POST /api/v1/contact/message` - Submit contact form
- `POST /api/v1/contact/newsletter/subscribe` - Newsletter subscription
- `POST /api/v1/contact/newsletter/unsubscribe` - Newsletter unsubscribe

## 🔐 Authentication Flow

1. User logs in → Backend returns JWT tokens
2. Tokens stored in localStorage
3. All API requests include `Authorization: Bearer <token>`
4. On 401 → Automatic token refresh
5. On refresh failure → User logged out

## ⚠️ Notes

- **Google Sign-In**: The Auth page still has Supabase import for Google sign-in. This feature would need backend implementation if you want to use it.
- **Token Storage**: Tokens are stored in localStorage. For production, consider more secure storage options.
- **Error Handling**: All API errors are caught and displayed via toast notifications.

## 🧪 Testing

1. Register a new user at `/auth`
2. Login with credentials
3. Check `/settings` - profile should load from backend
4. Update theme preference - should save to backend
5. Submit contact form at `/contact` - should reach backend

## 📚 Documentation

See `FRONTEND_BACKEND_CONNECTION.md` for detailed documentation.

