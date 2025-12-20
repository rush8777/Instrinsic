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
            # Generate unique referral code
            while True:
                code = secrets.token_urlsafe(12)[:12]
                if not User.objects.filter(referral_code=code).exists():
                    self.referral_code = code
                    break
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.email

