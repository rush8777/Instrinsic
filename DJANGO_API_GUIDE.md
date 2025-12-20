# Django API Endpoints Guide for PromptIT Frontend

## Overview
Based on your frontend analysis, this guide outlines all the Django API endpoints needed to support your React application.

## Project Structure
```
backend/
├── manage.py
├── requirements.txt
├── backend/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── accounts/
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   └── permissions.py
├── projects/
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   └── urls.py
├── subscriptions/
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   └── urls.py
└── referrals/
    ├── models.py
    ├── views.py
    ├── serializers.py
    └── urls.py
```

## Installation & Setup

### 1. Create Django Project
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Django and dependencies
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers python-dotenv
pip freeze > requirements.txt
```

### 2. Initialize Django Project
```bash
django-admin startproject backend .
cd backend
python manage.py startapp accounts
python manage.py startapp projects
python manage.py startapp subscriptions
python manage.py startapp referrals
```

### 3. Update settings.py
```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'accounts',
    'projects',
    'subscriptions',
    'referrals',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# CORS Settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8080",  # Your Vite dev server
    "http://127.0.0.1:8080",
]

CORS_ALLOW_CREDENTIALS = True

# REST Framework Settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

# JWT Settings
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
}
```

## API Endpoints

### 1. Authentication Endpoints (`/api/auth/`)

#### POST `/api/auth/register/`
**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```
**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com"
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

#### POST `/api/auth/login/`
**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```
**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "balance": 0
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

#### POST `/api/auth/refresh/`
**Request:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```
**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### POST `/api/auth/password-reset/`
**Request:**
```json
{
  "email": "user@example.com"
}
```

#### POST `/api/auth/password-reset-confirm/`
**Request:**
```json
{
  "token": "reset-token",
  "password": "newpassword123"
}
```

#### POST `/api/auth/oauth/google/`
**Request:**
```json
{
  "access_token": "google-oauth-token"
}
```

### 2. User Endpoints (`/api/users/`)

#### GET `/api/users/me/`
**Headers:** `Authorization: Bearer <access_token>`
**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "balance": 0,
  "referral_link": "https://app.scale.com/ref/abc123xyz",
  "subscription": {
    "plan": "free",
    "status": "active"
  }
}
```

#### PATCH `/api/users/me/`
**Request:**
```json
{
  "first_name": "John",
  "last_name": "Doe"
}
```

### 3. Projects Endpoints (`/api/projects/`)

#### GET `/api/projects/`
**Query Params:** `?search=term&page=1`
**Response:**
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "My Project",
      "description": "Project description",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "ai_tools": ["v0", "bolt"],
      "status": "active"
    }
  ]
}
```

#### POST `/api/projects/`
**Request:**
```json
{
  "name": "New Project",
  "description": "Project description",
  "ai_tools": ["v0", "bolt"],
  "target_users": "developers",
  "experience_level": "intermediate",
  "output_type": "full_project",
  "expected_outputs": {
    "code": true,
    "explanation": true,
    "file_structure": true,
    "comments": false
  },
  "frontend_framework": "React",
  "styling": "Tailwind CSS",
  "backend_framework": "Node.js",
  "database": "PostgreSQL",
  "language": "TypeScript"
}
```
**Response:**
```json
{
  "id": 1,
  "name": "New Project",
  "description": "Project description",
  "created_at": "2024-01-01T00:00:00Z",
  ...
}
```

#### GET `/api/projects/{id}/`
**Response:**
```json
{
  "id": 1,
  "name": "My Project",
  "description": "Full project details",
  "content": "...",
  "library_structure": {
    "folders": [...],
    "files": [...]
  },
  ...
}
```

#### PATCH `/api/projects/{id}/`
**Request:**
```json
{
  "name": "Updated Name",
  "content": "Updated content"
}
```

#### DELETE `/api/projects/{id}/`

#### GET `/api/projects/{id}/library/`
**Response:**
```json
{
  "folders": [
    {
      "id": 1,
      "name": "My Playlists",
      "items": [
        {
          "id": 2,
          "name": "Chill Vibes Only",
          "type": "playlist"
        }
      ]
    }
  ],
  "items": [
    {
      "id": 3,
      "name": "Daily Discover",
      "type": "playlist"
    }
  ]
}
```

### 4. Subscriptions Endpoints (`/api/subscriptions/`)

#### GET `/api/subscriptions/plans/`
**Response:**
```json
{
  "plans": [
    {
      "id": 1,
      "name": "Individuals",
      "slug": "individuals",
      "price_monthly": 0,
      "price_yearly": 0,
      "features": [
        "Free email alerts",
        "3-minute checks",
        "Automatic data enrichment",
        "10 monitors",
        "Up to 3 seats"
      ]
    },
    {
      "id": 2,
      "name": "Teams",
      "slug": "teams",
      "price_monthly": 90,
      "price_yearly": 756,
      "features": [...]
    }
  ]
}
```

#### POST `/api/subscriptions/subscribe/`
**Request:**
```json
{
  "plan_id": 2,
  "billing_period": "monthly"
}
```

#### GET `/api/subscriptions/current/`
**Response:**
```json
{
  "plan": {
    "id": 2,
    "name": "Teams",
    "slug": "teams"
  },
  "billing_period": "monthly",
  "status": "active",
  "next_billing_date": "2024-02-01"
}
```

### 5. Referrals Endpoints (`/api/referrals/`)

#### GET `/api/referrals/link/`
**Response:**
```json
{
  "referral_link": "https://app.scale.com/ref/abc123xyz",
  "total_referrals": 5,
  "total_earned": 50
}
```

#### GET `/api/referrals/stats/`
**Response:**
```json
{
  "total_referrals": 5,
  "active_referrals": 3,
  "total_earned": 50,
  "pending_earnings": 10
}
```

## Models

### accounts/models.py
```python
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    balance = models.IntegerField(default=0)
    referral_code = models.CharField(max_length=20, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
```

### projects/models.py
```python
from django.db import models
from django.conf import settings

class Project(models.Model):
    AI_TOOLS = [
        ('v0', 'v0'),
        ('bolt', 'Bolt'),
        ('replit', 'Replit'),
        ('chatgpt', 'ChatGPT'),
        ('claude', 'Claude'),
    ]
    
    TARGET_USERS = [
        ('students', 'Students'),
        ('developers', 'Developers'),
        ('business', 'Business Users'),
        ('general', 'General Users'),
    ]
    
    EXPERIENCE_LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    
    OUTPUT_TYPES = [
        ('single_component', 'Single Component'),
        ('page', 'Page'),
        ('multi_page_app', 'Multi-Page App'),
        ('api_only', 'API Only'),
        ('full_project', 'Full Project'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=300)
    ai_tools = models.JSONField(default=list)
    target_users = models.CharField(max_length=20, choices=TARGET_USERS, blank=True)
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_LEVELS, blank=True)
    output_type = models.CharField(max_length=20, choices=OUTPUT_TYPES, blank=True)
    expected_outputs = models.JSONField(default=dict)
    frontend_framework = models.CharField(max_length=50, blank=True)
    styling = models.CharField(max_length=50, blank=True)
    backend_framework = models.CharField(max_length=50, blank=True)
    database = models.CharField(max_length=50, blank=True)
    language = models.CharField(max_length=50, blank=True)
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
```

### subscriptions/models.py
```python
from django.db import models
from django.conf import settings

class Plan(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    price_monthly = models.DecimalField(max_digits=10, decimal_places=2)
    price_yearly = models.DecimalField(max_digits=10, decimal_places=2)
    features = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    
class Subscription(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    plan = models.ForeignKey(Plan, on_delete=models.PROTECT)
    billing_period = models.CharField(max_length=10, choices=[('monthly', 'Monthly'), ('yearly', 'Yearly')])
    status = models.CharField(max_length=20, choices=[
        ('active', 'Active'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired')
    ], default='active')
    next_billing_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

### referrals/models.py
```python
from django.db import models
from django.conf import settings

class Referral(models.Model):
    referrer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='referrals_made')
    referred_user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='referral')
    referral_code = models.CharField(max_length=20)
    earned_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('active', 'Active'),
        ('completed', 'Completed')
    ], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
```

## Serializers

### accounts/serializers.py
```python
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'username')
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UserSerializer(serializers.ModelSerializer):
    referral_link = serializers.SerializerMethodField()
    subscription = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'balance', 'referral_link', 'subscription')
        read_only_fields = ('id', 'balance', 'referral_link')
    
    def get_referral_link(self, obj):
        return f"https://app.scale.com/ref/{obj.referral_code}"
    
    def get_subscription(self, obj):
        subscription = getattr(obj, 'subscription', None)
        if subscription:
            return {
                'plan': subscription.plan.slug,
                'status': subscription.status
            }
        return None

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        return token
```

### projects/serializers.py
```python
from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class ProjectListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('id', 'name', 'description', 'created_at', 'updated_at', 'ai_tools', 'status')
```

## Views

### accounts/views.py
```python
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import UserRegistrationSerializer, UserSerializer, CustomTokenObtainPairSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate referral code
        import secrets
        user.referral_code = secrets.token_urlsafe(12)[:12]
        user.save()
        
        # Generate tokens
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            }
        }, status=status.HTTP_201_CREATED)

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            user = User.objects.get(email=request.data['email'])
            response.data['user'] = UserSerializer(user).data
        return response

@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    if request.method == 'GET':
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    elif request.method == 'PATCH':
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

### projects/views.py
```python
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Project
from .serializers import ProjectSerializer, ProjectListSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name', 'description']
    
    def get_queryset(self):
        return Project.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectSerializer
    
    @action(detail=True, methods=['get'])
    def library(self, request, pk=None):
        project = self.get_object()
        # Return library structure for the project
        return Response({
            'folders': [],
            'items': []
        })
```

## URL Configuration

### backend/urls.py
```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/users/', include('accounts.urls')),
    path('api/projects/', include('projects.urls')),
    path('api/subscriptions/', include('subscriptions.urls')),
    path('api/referrals/', include('referrals.urls')),
]
```

### accounts/urls.py
```python
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, LoginView, user_profile

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', user_profile, name='user_profile'),
]
```

### projects/urls.py
```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet

router = DefaultRouter()
router.register(r'', ProjectViewSet, basename='project')

urlpatterns = [
    path('', include(router.urls)),
]
```

## Frontend Integration

### Create API Client (src/lib/api.ts)
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('access_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('access_token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Auth
  async register(email: string, password: string) {
    return this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async login(email: string, password: string) {
    const data = await this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.tokens?.access) {
      this.setToken(data.tokens.access);
    }
    return data;
  }

  // Projects
  async getProjects(search?: string) {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.request(`/projects/${params}`);
  }

  async createProject(projectData: any) {
    return this.request('/projects/', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async getProject(id: number) {
    return this.request(`/projects/${id}/`);
  }

  async updateProject(id: number, data: any) {
    return this.request(`/projects/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: number) {
    return this.request(`/projects/${id}/`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
```

## Next Steps

1. **Run Migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

2. **Create Superuser:**
   ```bash
   python manage.py createsuperuser
   ```

3. **Run Development Server:**
   ```bash
   python manage.py runserver
   ```

4. **Update Frontend:**
   - Add the API client to your frontend
   - Connect login/signup forms to API
   - Connect project creation wizard to API
   - Connect dashboard to fetch projects

5. **Add Environment Variables:**
   Create `.env` file:
   ```
   SECRET_KEY=your-secret-key
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   ```

## Additional Features to Consider

- Email verification
- File uploads for project assets
- Real-time updates with WebSockets
- Rate limiting
- API documentation with drf-spectacular
- Unit tests
- CI/CD pipeline

