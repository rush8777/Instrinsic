"""
URL configuration for backend project.
"""
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

