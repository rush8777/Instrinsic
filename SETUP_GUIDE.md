# Complete Setup Guide - PromptIT Full Stack Application

This guide will help you set up both the frontend and backend of the PromptIT application.

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.10 or higher)
- pip (Python package manager)
- Git

## Step 1: Backend Setup

### 1.1 Navigate to Backend Directory

```bash
cd backend
```

### 1.2 Create Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 1.3 Install Dependencies

```bash
pip install -r requirements.txt
```

### 1.4 Configure Environment

Create a `.env` file in the `backend` directory:

```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

Edit `.env` and generate a secret key:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Update `.env`:
```
SECRET_KEY=<your-generated-secret-key>
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### 1.5 Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 1.6 Create Superuser

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin user.

### 1.7 Create Initial Pricing Plans

```bash
python manage.py shell
```

In the Python shell:

```python
from subscriptions.models import Plan

plans_data = [
    {
        "name": "Individuals",
        "slug": "individuals",
        "price_monthly": 0,
        "price_yearly": 0,
        "features": ["Free email alerts", "3-minute checks", "Automatic data enrichment", "10 monitors", "Up to 3 seats"]
    },
    {
        "name": "Teams",
        "slug": "teams",
        "price_monthly": 90,
        "price_yearly": 756,
        "features": ["Unlimited phone calls", "30 second checks", "Single-user account", "20 monitors", "Up to 6 seats"]
    },
    {
        "name": "Organizations",
        "slug": "organizations",
        "price_monthly": 120,
        "price_yearly": 1008,
        "features": ["Unlimited phone calls", "15 second checks", "Single-user account", "50 monitors", "Up to 10 seats"]
    },
    {
        "name": "Enterprise",
        "slug": "enterprise",
        "price_monthly": 0,
        "price_yearly": 0,
        "features": ["Everything in Organizations", "Up to 5 team members", "100 monitors", "15 status pages", "200+ integrations"]
    }
]

for plan_data in plans_data:
    Plan.objects.get_or_create(slug=plan_data["slug"], defaults=plan_data)

print("Pricing plans created successfully!")
exit()
```

### 1.8 Start Backend Server

```bash
python manage.py runserver
```

The backend will run on `http://localhost:8000`

## Step 2: Frontend Setup

### 2.1 Navigate to Project Root

```bash
cd ..
```

### 2.2 Install Dependencies

```bash
npm install
```

### 2.3 Configure Environment

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8000/api
```

### 2.4 Start Frontend Development Server

```bash
npm run dev
```

The frontend will run on `http://localhost:8080` (or the port shown in terminal)

## Step 3: Verify Setup

### 3.1 Test Backend

Open `http://localhost:8000/admin` and login with your superuser credentials.

### 3.2 Test Frontend

1. Open `http://localhost:8080`
2. Click "Sign Up" and create an account
3. You should be redirected to the dashboard
4. Try creating a project using the "Create New Project" button

### 3.3 Test API Endpoints

You can test the API using curl or Postman:

```bash
# Register a user
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "testpass123", "username": "testuser"}'

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "testpass123"}'
```

## Step 4: Development Workflow

### Running Both Servers

You'll need two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate  # or source venv/bin/activate on macOS/Linux
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Making Changes

- **Backend changes**: Restart the Django server
- **Frontend changes**: Vite will hot-reload automatically
- **Database changes**: Run `python manage.py makemigrations` and `python manage.py migrate`

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Change port
python manage.py runserver 8001
```

**Migration errors:**
```bash
# Reset database (WARNING: Deletes all data)
rm backend/db.sqlite3
python manage.py migrate
```

**Module not found:**
```bash
# Ensure virtual environment is activated
# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend Issues

**API connection errors:**
- Check that backend is running on port 8000
- Verify `.env` file has correct `VITE_API_URL`
- Check browser console for CORS errors

**Build errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors

If you see CORS errors in the browser console:

1. Check `backend/backend/settings.py` - ensure your frontend URL is in `CORS_ALLOWED_ORIGINS`
2. Restart the Django server after making changes

## Project Structure

```
ai-landing-kit/
├── backend/                 # Django backend
│   ├── accounts/           # User authentication
│   ├── projects/           # Project management
│   ├── subscriptions/      # Subscription plans
│   ├── referrals/          # Referral system
│   └── manage.py
├── src/                    # React frontend
│   ├── pages/              # Page components
│   ├── components/         # Reusable components
│   └── lib/                # Utilities (API client)
├── package.json            # Frontend dependencies
└── requirements.txt        # Backend dependencies
```

## Next Steps

1. **Customize Models**: Modify models in `backend/*/models.py` to match your needs
2. **Add Features**: Extend API endpoints in `backend/*/views.py`
3. **Update UI**: Modify React components in `src/components/` and `src/pages/`
4. **Add Authentication Guards**: Protect routes that require login
5. **Add Error Handling**: Improve error messages and validation

## Production Deployment

### Backend
- Use PostgreSQL instead of SQLite
- Set `DEBUG=False`
- Configure proper `ALLOWED_HOSTS`
- Use environment variables for secrets
- Set up static file serving
- Configure HTTPS

### Frontend
- Build production bundle: `npm run build`
- Deploy to Vercel, Netlify, or similar
- Update API URL to production backend
- Configure environment variables

## Support

For issues or questions:
1. Check the error messages in browser console and terminal
2. Review Django logs: `python manage.py runserver --verbosity 2`
3. Check API responses in browser Network tab
4. Verify database migrations are applied

