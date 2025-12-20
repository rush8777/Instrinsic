# PromptIT Backend API

Django REST Framework backend for the PromptIT application.

## Setup Instructions

### 1. Install Dependencies

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Environment Configuration

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` and set:
- `SECRET_KEY`: A secure random key (generate with `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`)
- `DEBUG`: `True` for development, `False` for production
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts

### 3. Database Setup

```bash
# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### 4. Create Initial Data (Optional)

You can create initial pricing plans via Django admin or by running:

```bash
python manage.py shell
```

Then in the shell:
```python
from subscriptions.models import Plan

Plan.objects.create(
    name="Individuals",
    slug="individuals",
    price_monthly=0,
    price_yearly=0,
    features=["Free email alerts", "3-minute checks", "Automatic data enrichment", "10 monitors", "Up to 3 seats"]
)

Plan.objects.create(
    name="Teams",
    slug="teams",
    price_monthly=90,
    price_yearly=756,
    features=["Unlimited phone calls", "30 second checks", "Single-user account", "20 monitors", "Up to 6 seats"]
)

Plan.objects.create(
    name="Organizations",
    slug="organizations",
    price_monthly=120,
    price_yearly=1008,
    features=["Unlimited phone calls", "15 second checks", "Single-user account", "50 monitors", "Up to 10 seats"]
)

Plan.objects.create(
    name="Enterprise",
    slug="enterprise",
    price_monthly=0,
    price_yearly=0,
    features=["Everything in Organizations", "Up to 5 team members", "100 monitors", "15 status pages", "200+ integrations"]
)
```

### 5. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/refresh/` - Refresh access token

### Users
- `GET /api/users/me/` - Get current user profile
- `PATCH /api/users/me/` - Update user profile

### Projects
- `GET /api/projects/` - List user projects
- `POST /api/projects/` - Create new project
- `GET /api/projects/{id}/` - Get project details
- `PATCH /api/projects/{id}/` - Update project
- `DELETE /api/projects/{id}/` - Delete project
- `GET /api/projects/{id}/library/` - Get project library structure

### Subscriptions
- `GET /api/subscriptions/plans/` - Get all pricing plans
- `GET /api/subscriptions/current/` - Get current subscription
- `POST /api/subscriptions/subscribe/` - Subscribe to a plan

### Referrals
- `GET /api/referrals/link/` - Get referral link
- `GET /api/referrals/stats/` - Get referral statistics

## Testing

Test the API with curl:

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "testpass123", "username": "testuser"}'

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "testpass123"}'

# Get user profile (replace TOKEN with access token)
curl -X GET http://localhost:8000/api/users/me/ \
  -H "Authorization: Bearer TOKEN"
```

## Frontend Integration

The frontend should be configured to use `http://localhost:8000/api` as the API base URL.

Create a `.env` file in the frontend root:
```
VITE_API_URL=http://localhost:8000/api
```

## Production Deployment

1. Set `DEBUG=False` in `.env`
2. Set a secure `SECRET_KEY`
3. Configure `ALLOWED_HOSTS` with your domain
4. Use PostgreSQL instead of SQLite
5. Set up static file serving
6. Configure CORS for your frontend domain
7. Use environment variables for sensitive data

## Troubleshooting

### CORS Errors
- Ensure `CORS_ALLOWED_ORIGINS` includes your frontend URL
- Check that `CORS_ALLOW_CREDENTIALS=True`

### Authentication Issues
- Verify JWT tokens are being sent in Authorization header
- Check token expiration settings
- Ensure refresh token is stored and used

### Database Issues
- Run `python manage.py makemigrations` if models changed
- Run `python manage.py migrate` to apply migrations
- Check database file permissions (SQLite)

