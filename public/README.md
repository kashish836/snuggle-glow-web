# SnuggleNest Frontend - HTML/CSS/JavaScript

This is the vanilla JavaScript version of the SnuggleNest frontend.

## Structure

```
public/
├── index.html          # Homepage
├── auth.html          # Login/Signup page
├── settings.html       # User settings
├── contact.html        # Contact form
├── css/
│   └── styles.css     # Custom styles
├── js/
│   ├── api-client.js  # API client for backend
│   ├── app.js         # Main app utilities
│   ├── auth.js        # Authentication logic
│   ├── settings.js    # Settings page logic
│   └── contact.js     # Contact form logic
└── server.py          # Simple HTTP server
```

## Running the Frontend

### Option 1: Python HTTP Server (Recommended)

```bash
cd public
python server.py
```

Then open: http://localhost:3000

### Option 2: Any Static File Server

You can use any static file server:
- Python: `python -m http.server 3000`
- Node.js: `npx serve .`
- VS Code: Live Server extension

## Configuration

Update the API URL in each HTML file:

```html
<script>
    window.API_BASE_URL = 'http://localhost:8000/api/v1';
</script>
```

## Features

- ✅ No React/TypeScript dependencies
- ✅ Pure HTML/CSS/JavaScript
- ✅ Works with Python backend
- ✅ No Google login (removed)
- ✅ Simple and lightweight

## Pages

- `/index.html` - Homepage
- `/auth.html` - Login/Signup
- `/settings.html` - User settings (requires login)
- `/contact.html` - Contact form

## API Integration

All API calls go through `/js/api-client.js` which connects to the Python FastAPI backend.

