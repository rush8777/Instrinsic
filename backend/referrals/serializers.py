from rest_framework import serializers
from .models import Referral


class ReferralSerializer(serializers.ModelSerializer):
    class Meta:
        model = Referral
        fields = '__all__'
        read_only_fields = ('referrer', 'created_at', 'updated_at')

