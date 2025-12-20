from django.contrib import admin
from .models import Referral


@admin.register(Referral)
class ReferralAdmin(admin.ModelAdmin):
    list_display = ('referrer', 'referred_user', 'referral_code', 'status', 'earned_amount', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('referrer__email', 'referred_user__email', 'referral_code')

