# Frontend Analysis & Django API Requirements Summary

## Frontend Overview
Your application is **PromptIT** - an AI-powered project management platform built with:
- **Frontend**: React + TypeScript + Vite
- **UI Library**: shadcn-ui + Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router

## Key Features Identified

### 1. **Authentication System**
- Email/Password login and signup
- OAuth integration (Google, Slack, Apple)
- Password reset functionality
- JWT token-based authentication

### 2. **User Dashboard**
- User profile with balance/credits display
- Referral system with unique referral links
- Project listing and management
- Quick action cards

### 3. **Project Management**
- Multi-step project creation wizard
- Project editor with library/tree structure
- Project search functionality
- Project CRUD operations

### 4. **Subscription System**
- Multiple pricing tiers (Free, Teams, Organizations, Enterprise)
- Monthly/Yearly billing options
- Feature-based plans

## Required API Endpoints

### Authentication (`/api/auth/`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/register/` | User registration |
| POST | `/login/` | User login |
| POST | `/refresh/` | Refresh access token |
| POST | `/password-reset/` | Request password reset |
| POST | `/password-reset-confirm/` | Confirm password reset |
| POST | `/oauth/google/` | Google OAuth login |

### User Management (`/api/users/`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/me/` | Get current user profile |
| PATCH | `/me/` | Update user profile |

### Projects (`/api/projects/`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | List all user projects |
| POST | `/` | Create new project |
| GET | `/{id}/` | Get project details |
| PATCH | `/{id}/` | Update project |
| DELETE | `/{id}/` | Delete project |
| GET | `/{id}/library/` | Get project library structure |

### Subscriptions (`/api/subscriptions/`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/plans/` | Get all pricing plans |
| POST | `/subscribe/` | Subscribe to a plan |
| GET | `/current/` | Get current subscription |

### Referrals (`/api/referrals/`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/link/` | Get referral link |
| GET | `/stats/` | Get referral statistics |

## Data Models Required

### User Model
```python
- id (auto)
- email (unique)
- username
- password (hashed)
- balance (integer, default: 0)
- referral_code (unique)
- created_at
- updated_at
```

### Project Model
```python
- id (auto)
- user (ForeignKey)
- name
- description (max 300 chars)
- ai_tools (JSON array)
- target_users (choice field)
- experience_level (choice field)
- output_type (choice field)
- expected_outputs (JSON object)
- frontend_framework
- styling
- backend_framework
- database
- language
- content (Text field for project content)
- created_at
- updated_at
```

### Subscription Model
```python
- id (auto)
- user (OneToOne)
- plan (ForeignKey to Plan)
- billing_period (monthly/yearly)
- status (active/cancelled/expired)
- next_billing_date
- created_at
```

### Plan Model
```python
- id (auto)
- name
- slug (unique)
- price_monthly
- price_yearly
- features (JSON array)
- is_active
```

### Referral Model
```python
- id (auto)
- referrer (ForeignKey)
- referred_user (OneToOne)
- referral_code
- earned_amount
- status (pending/active/completed)
- created_at
```

## Frontend Integration Points

### 1. Login Page (`src/pages/Login.tsx`)
**Needs**: `POST /api/auth/login/`
- Email and password input
- OAuth buttons (Google, Slack, Apple)
- Redirect to dashboard on success

### 2. Sign Up Page (`src/pages/SignUp.tsx`)
**Needs**: `POST /api/auth/register/`
- Email input
- OAuth signup options
- Redirect to dashboard on success

### 3. Dashboard (`src/pages/Dashboard.tsx`)
**Needs**:
- `GET /api/users/me/` - User profile and balance
- `GET /api/projects/` - List of projects
- `GET /api/referrals/link/` - Referral link
- `POST /api/projects/` - Create project (from wizard)

### 4. Create Project Wizard (`src/components/scale/CreateProjectWizard.tsx`)
**Needs**: `POST /api/projects/`
- Collects project configuration
- Creates project on final step
- Data structure matches Project model

### 5. Project Editor (`src/pages/ProjectEditor.tsx`)
**Needs**:
- `GET /api/projects/{id}/` - Project details
- `GET /api/projects/{id}/library/` - Library structure
- `PATCH /api/projects/{id}/` - Save project content

### 6. Pricing Page (`src/pages/PricingPage.tsx`)
**Needs**:
- `GET /api/subscriptions/plans/` - Pricing plans
- `POST /api/subscriptions/subscribe/` - Subscribe to plan

## Implementation Priority

### Phase 1: Core Authentication (Week 1)
1. ✅ User registration
2. ✅ User login
3. ✅ JWT token management
4. ✅ User profile endpoint

### Phase 2: Project Management (Week 2)
1. ✅ Project CRUD operations
2. ✅ Project creation wizard integration
3. ✅ Project listing on dashboard
4. ✅ Project search

### Phase 3: Additional Features (Week 3)
1. ✅ Subscription system
2. ✅ Referral system
3. ✅ OAuth integration
4. ✅ Password reset

## Security Considerations

1. **JWT Tokens**: Use short-lived access tokens (1 hour) with refresh tokens (7 days)
2. **CORS**: Configure CORS to only allow your frontend domain
3. **Password Hashing**: Django's default password hashing is secure
4. **Rate Limiting**: Implement rate limiting on auth endpoints
5. **Input Validation**: Validate all inputs on both frontend and backend
6. **SQL Injection**: Django ORM protects against SQL injection
7. **XSS**: Sanitize user inputs, especially project content

## Testing Strategy

### Backend Testing
- Unit tests for models
- API endpoint tests
- Authentication flow tests
- Permission tests

### Frontend Testing
- API integration tests
- Form validation tests
- Error handling tests

### Integration Testing
- End-to-end user flows
- OAuth flow testing
- Payment/subscription flow

## Deployment Checklist

### Backend
- [ ] Set up PostgreSQL database
- [ ] Configure environment variables
- [ ] Set up static file serving
- [ ] Configure CORS for production domain
- [ ] Set up SSL/HTTPS
- [ ] Configure email service for password reset
- [ ] Set up logging and monitoring

### Frontend
- [ ] Update API base URL for production
- [ ] Configure environment variables
- [ ] Build production bundle
- [ ] Set up CDN for static assets
- [ ] Configure routing for SPA

## Next Steps

1. **Read the full guide**: See `DJANGO_API_GUIDE.md` for complete implementation
2. **Check examples**: See `QUICK_START_EXAMPLE.py` for code snippets
3. **Set up Django project**: Follow installation steps in the guide
4. **Start with authentication**: Implement login/register first
5. **Test with frontend**: Connect your React app to the API
6. **Iterate**: Add features one by one

## Resources

- [Django REST Framework Documentation](https://www.django-rest-framework.org/)
- [JWT Authentication](https://django-rest-framework-simplejwt.readthedocs.io/)
- [CORS Headers](https://pypi.org/project/django-cors-headers/)
- [React Query Documentation](https://tanstack.com/query/latest)

## Support

If you encounter issues:
1. Check Django logs: `python manage.py runserver --verbosity 2`
2. Check browser console for API errors
3. Verify CORS settings
4. Check JWT token expiration
5. Verify database migrations are applied

