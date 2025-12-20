from rest_framework import serializers
from .models import Plan, Subscription


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = '__all__'


class SubscriptionSerializer(serializers.ModelSerializer):
    plan = PlanSerializer(read_only=True)
    plan_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Subscription
        fields = ('id', 'plan', 'plan_id', 'billing_period', 'status', 'next_billing_date', 'created_at')
        read_only_fields = ('id', 'status', 'created_at')

