# SnuggleNest Backend API

A FastAPI-based backend for the SnuggleNest community platform - a supportive space for new mothers.

## Features

- **Authentication & Authorization**: JWT-based authentication with refresh tokens
- **User Profiles**: User management with customizable profiles
- **Blog System**: Create, read, update, and delete blog posts with categories
- **Community Forum**: Discussion threads with replies and categories
- **Contact Form**: Secure contact form submissions with rate limiting
- **Newsletter**: Email subscription management
- **Resources**: Resource library with download tracking
- **Rate Limiting**: Built-in rate limiting for API protection
- **Database**: PostgreSQL with SQLAlchemy ORM (async)

## Tech Stack

- **FastAPI**: Modern, fast web framework
- **SQLAlchemy**: Async ORM for database operations
- **PostgreSQL**: Database (with asyncpg driver)
- **JWT**: Authentication tokens
- **Pydantic**: Data validation
- **Bcrypt**: Password hashing

## Setup Instructions

### Prerequisites

- Python 3.11+
- PostgreSQL 14+
- pip (Python package manager)

### Installation

1. **Clone the repository** (if not already done):
```bash
cd backend
```

2. **Create a virtual environment**:
```bash
python -m venv venv
```

3. **Activate the virtual environment**:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**:
```bash
pip install -r requirements.txt
```

5. **Set up environment variables**:
```bash
cp .env.example .env
```

Edit `.env` and update the following:
- `DATABASE_URL`: Your PostgreSQL connection string
- `SECRET_KEY`: A random secret key for JWT tokens (generate with: `python -c "import secrets; print(secrets.token_urlsafe(32))"`)
- `CORS_ORIGINS`: Add your frontend URLs

6. **Create the database**:
```bash
# Connect to PostgreSQL and create database
createdb snugglenest
# Or using psql:
# psql -U postgres
# CREATE DATABASE snugglenest;
```

7. **Run database migrations** (tables are auto-created on startup):
The application will automatically create tables on first run.

8. **Run the development server**:
```bash
python main.py
# Or using uvicorn directly:
# uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, you can access:
- **Interactive API docs (Swagger UI)**: http://localhost:8000/docs
- **Alternative API docs (ReDoc)**: http://localhost:8000/redoc

## API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login and get access token
- `POST /refresh` - Refresh access token
- `GET /me` - Get current user info

### Users (`/api/v1/users`)
- `GET /profile` - Get current user's profile
- `PUT /profile` - Update user profile
- `DELETE /profile` - Delete user account

### Blog (`/api/v1/blog`)
- `GET /` - List blog posts (with pagination, filtering)
- `GET /{post_id}` - Get a single blog post
- `POST /` - Create a blog post (authenticated)
- `PUT /{post_id}` - Update a blog post (owner only)
- `DELETE /{post_id}` - Delete a blog post (owner only)

### Community (`/api/v1/community`)
- `GET /` - List discussions (with pagination, filtering)
- `GET /{discussion_id}` - Get a discussion with replies
- `POST /` - Create a new discussion (authenticated)
- `PUT /{discussion_id}` - Update a discussion (owner only)
- `DELETE /{discussion_id}` - Delete a discussion (owner only)
- `POST /{discussion_id}/replies` - Reply to a discussion
- `DELETE /replies/{reply_id}` - Delete a reply (owner only)

### Contact (`/api/v1/contact`)
- `POST /message` - Submit contact form
- `POST /newsletter/subscribe` - Subscribe to newsletter
- `POST /newsletter/unsubscribe` - Unsubscribe from newsletter

### Resources (`/api/v1/resources`)
- `GET /` - List resources (with pagination, filtering)
- `GET /{resource_id}` - Get a single resource
- `POST /{resource_id}/download` - Record a resource download
- `POST /` - Create a resource (authenticated)
- `PUT /{resource_id}` - Update a resource (owner only)
- `DELETE /{resource_id}` - Delete a resource (owner only)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Example Request:
```bash
curl -X GET "http://localhost:8000/api/v1/users/profile" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Database Models

- **User**: User accounts with email/password authentication
- **Profile**: User profiles with display name, avatar, bio, preferences
- **BlogPost**: Blog posts with categories, featured status, views
- **Discussion**: Community discussion threads
- **DiscussionReply**: Replies to discussions
- **ContactMessage**: Contact form submissions
- **NewsletterSubscriber**: Newsletter email subscriptions
- **Resource**: Downloadable resources with tracking

## Rate Limiting

Rate limiting is enabled by default. Different endpoints have different limits:
- Login: 5 requests per minute per email
- Contact form: 3 requests per hour per email
- Profile updates: 10 requests per minute per user
- Discussion creation: 5 requests per 5 minutes per user
- Reply creation: 10 requests per minute per user

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Rate limiting on sensitive endpoints
- Input validation with Pydantic
- SQL injection protection via SQLAlchemy ORM
- CORS configuration

## Development

### Running Tests
```bash
pytest
```

### Code Structure
```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/    # API endpoint handlers
│   │       └── router.py     # Main API router
│   ├── core/
│   │   ├── config.py          # Configuration settings
│   │   ├── database.py       # Database setup
│   │   ├── security.py       # Auth & security utilities
│   │   └── rate_limiter.py   # Rate limiting
│   ├── models/               # SQLAlchemy models
│   └── schemas/              # Pydantic schemas
├── main.py                   # Application entry point
├── requirements.txt          # Python dependencies
└── README.md                 # This file
```

## Production Deployment

For production deployment:

1. Set `DEBUG=False` in `.env`
2. Use a strong `SECRET_KEY` (generate with Python secrets module)
3. Use a production database (not localhost)
4. Configure proper CORS origins
5. Use a production ASGI server (e.g., Gunicorn with Uvicorn workers)
6. Set up proper logging
7. Use environment variables for all sensitive data
8. Consider using Redis for rate limiting instead of in-memory
9. Set up SSL/TLS certificates
10. Configure proper database backups

### Example Production Command:
```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## License

This project is part of the SnuggleNest platform.

## Support

For issues or questions, please contact the development team.

