from django.urls import path
from .views import referral_link, referral_stats

urlpatterns = [
    path('link/', referral_link, name='referral_link'),
    path('stats/', referral_stats, name='referral_stats'),
]

