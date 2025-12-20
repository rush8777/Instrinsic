# Quick Start Example - Complete Django Implementation
# This file shows a complete working example for the authentication and projects endpoints

# ============================================
# 1. accounts/models.py
# ============================================
"""
from django.contrib.auth.models import AbstractUser
from django.db import models
import secrets

class User(AbstractUser):
    email = models.EmailField(unique=True)
    balance = models.IntegerField(default=0)
    referral_code = models.CharField(max_length=20, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def save(self, *args, **kwargs):
        if not self.referral_code:
            self.referral_code = secrets.token_urlsafe(12)[:12]
        super().save(*args, **kwargs)
"""

# ============================================
# 2. accounts/views.py (Complete Example)
# ============================================
"""
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import (
    UserRegistrationSerializer, 
    UserSerializer, 
    CustomTokenObtainPairSerializer
)

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens
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
"""

# ============================================
# 3. projects/views.py (Complete Example)
# ============================================
"""
from rest_framework import viewsets, status, filters
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
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['get'])
    def library(self, request, pk=None):
        project = self.get_object()
        # Example library structure
        return Response({
            'folders': [
                {
                    'id': 1,
                    'name': 'My Playlists',
                    'items': [
                        {
                            'id': 2,
                            'name': 'Chill Vibes Only',
                            'type': 'playlist'
                        }
                    ]
                }
            ],
            'items': [
                {
                    'id': 3,
                    'name': 'Daily Discover',
                    'type': 'playlist'
                }
            ]
        })
"""

# ============================================
# 4. Frontend Integration Example
# ============================================
"""
// src/pages/Login.tsx - Updated with API call
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.login(email, password);
      if (response.tokens?.access) {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your existing form JSX */}
      {error && <div className="text-red-500">{error}</div>}
      <Button type="submit">Sign In</Button>
    </form>
  );
}
"""

# ============================================
# 5. CreateProjectWizard Integration
# ============================================
"""
// In CreateProjectWizard.tsx - Update handleNext function
const handleNext = async () => {
  if (currentStep < totalSteps - 1) {
    setCurrentStep(currentStep + 1);
  } else {
    // Final step - create project
    try {
      const project = await api.createProject(wizardData);
      console.log("Project created:", project);
      onOpenChange(false);
      setCurrentStep(0);
      setWizardData(initialWizardData);
      // Optionally navigate to project editor
      // navigate(`/editor/${project.id}`);
    } catch (error) {
      console.error("Failed to create project:", error);
      // Show error toast
    }
  }
};
"""

# ============================================
# 6. Dashboard Integration
# ============================================
"""
// In Dashboard.tsx - Fetch projects on mount
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await api.getProjects();
        setProjects(data.results || []);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Use projects state to render JobCard components
  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        projects.map((project) => (
          <JobCard key={project.id} {...project} />
        ))
      )}
    </div>
  );
}
"""

# ============================================
# 7. Testing with curl
# ============================================
"""
# Register a new user
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "testpass123", "username": "testuser"}'

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "testpass123"}'

# Get user profile (replace TOKEN with access token from login)
curl -X GET http://localhost:8000/api/users/me/ \
  -H "Authorization: Bearer TOKEN"

# Create a project (replace TOKEN)
curl -X POST http://localhost:8000/api/projects/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My First Project",
    "description": "A test project",
    "ai_tools": ["v0", "bolt"],
    "target_users": "developers",
    "experience_level": "intermediate",
    "output_type": "full_project"
  }'

# List projects
curl -X GET http://localhost:8000/api/projects/ \
  -H "Authorization: Bearer TOKEN"
"""

