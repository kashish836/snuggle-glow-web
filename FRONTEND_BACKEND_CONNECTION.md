# Frontend-Backend Connection Guide

This guide explains how the frontend (React/TypeScript) is connected to the backend (FastAPI/Python).

## Architecture Overview

The frontend communicates with the backend through a centralized API client that handles:
- HTTP requests to the FastAPI backend
- JWT token management (storage, refresh)
- Automatic token refresh on 401 errors
- Error handling

## Setup Instructions

### 1. Backend Setup

First, ensure your backend is running:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your database URL and secret key
python main.py
```

The backend should be running at `http://localhost:8000`

### 2. Frontend Setup

1. **Set environment variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

3. **Start the frontend**:
   ```bash
   npm run dev
   ```

## API Client Structure

### Core Files

- **`src/lib/api/client.ts`**: Main API client with token management
- **`src/lib/api/auth.ts`**: Authentication API functions
- **`src/lib/api/profile.ts`**: Profile API functions
- **`src/lib/api/contact.ts`**: Contact form and newsletter API functions

### How It Works

1. **Token Storage**: Access and refresh tokens are stored in `localStorage`
2. **Automatic Refresh**: When an API call returns 401, the client automatically tries to refresh the token
3. **Request Interception**: All requests automatically include the Bearer token in the Authorization header

## Updated Components

The following components have been updated to use the backend API:

1. **`src/hooks/useAuth.tsx`**: Authentication hook
   - Uses backend login/register endpoints
   - Manages user state and tokens

2. **`src/pages/Settings.tsx`**: Settings page
   - Fetches profile from backend
   - Updates theme and notification preferences via API

3. **`src/pages/ProfileEditor.tsx`**: Profile editor
   - Fetches and updates profile via backend API

4. **`src/pages/Contact.tsx`**: Contact form
   - Submits contact messages to backend
   - Handles newsletter subscriptions via API

## API Endpoints Used

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user info

### Profile
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `DELETE /api/v1/users/profile` - Delete user account

### Contact
- `POST /api/v1/contact/message` - Submit contact form
- `POST /api/v1/contact/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/v1/contact/newsletter/unsubscribe` - Unsubscribe from newsletter

## Authentication Flow

1. User logs in → `POST /auth/login`
2. Backend returns access_token and refresh_token
3. Tokens stored in localStorage
4. All subsequent requests include `Authorization: Bearer <access_token>`
5. On 401 error → Automatically refresh token using refresh_token
6. If refresh fails → Clear tokens and redirect to login

## Error Handling

The API client handles errors consistently:
- Network errors are caught and formatted
- API errors include `detail` message from backend
- 401 errors trigger automatic token refresh
- Failed refresh clears tokens and logs user out

## CORS Configuration

Ensure your backend `.env` includes the frontend URL in `CORS_ORIGINS`:

```env
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://127.0.0.1:5173
```

## Testing the Connection

1. **Start both servers**:
   - Backend: `http://localhost:8000`
   - Frontend: `http://localhost:5173` (or your Vite port)

2. **Test authentication**:
   - Go to `/auth` page
   - Register a new user
   - Login with credentials
   - Check browser DevTools → Application → Local Storage for tokens

3. **Test profile**:
   - Go to `/settings` page
   - Update theme preference
   - Check Network tab to see API calls

4. **Test contact form**:
   - Go to `/contact` page
   - Submit the form
   - Check backend logs for the message

## Troubleshooting

### CORS Errors
- Ensure backend CORS_ORIGINS includes your frontend URL
- Check backend is running and accessible

### 401 Unauthorized
- Check tokens exist in localStorage
- Verify backend SECRET_KEY matches
- Check token expiration (default: 30 minutes)

### Connection Refused
- Verify backend is running on port 8000
- Check VITE_API_BASE_URL matches backend URL
- Ensure no firewall blocking the connection

### Token Refresh Fails
- Check refresh_token exists in localStorage
- Verify backend refresh endpoint is working
- Check backend logs for errors

## Next Steps

To add more API integrations:

1. Create new API function file in `src/lib/api/`
2. Use `apiClient.get/post/put/delete()` methods
3. Import and use in your components

Example:
```typescript
// src/lib/api/blog.ts
import { apiClient } from './client';

export async function getBlogPosts() {
  return apiClient.get('/blog');
}
```

## Production Deployment

For production:

1. Update `VITE_API_BASE_URL` to production backend URL
2. Ensure backend CORS_ORIGINS includes production frontend URL
3. Use HTTPS for both frontend and backend
4. Consider using environment-specific config files

