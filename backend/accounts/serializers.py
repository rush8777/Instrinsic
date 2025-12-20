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
        fields = ('id', 'email', 'username', 'balance', 'referral_link', 'subscription', 'first_name', 'last_name')
        read_only_fields = ('id', 'balance', 'referral_link')
    
    def get_referral_link(self, obj):
        if obj.referral_code:
            return f"https://app.scale.com/ref/{obj.referral_code}"
        return None
    
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

