from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Plan, Subscription
from .serializers import PlanSerializer, SubscriptionSerializer
from datetime import date, timedelta


class PlanListView(generics.ListAPIView):
    queryset = Plan.objects.filter(is_active=True)
    serializer_class = PlanSerializer
    permission_classes = [AllowAny]


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_subscription(request):
    try:
        subscription = request.user.subscription
        serializer = SubscriptionSerializer(subscription)
        return Response(serializer.data)
    except Subscription.DoesNotExist:
        return Response({'message': 'No active subscription'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def subscribe(request):
    plan_id = request.data.get('plan_id')
    billing_period = request.data.get('billing_period', 'monthly')
    
    try:
        plan = Plan.objects.get(id=plan_id, is_active=True)
    except Plan.DoesNotExist:
        return Response({'error': 'Plan not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Create or update subscription
    subscription, created = Subscription.objects.get_or_create(
        user=request.user,
        defaults={
            'plan': plan,
            'billing_period': billing_period,
            'status': 'active',
            'next_billing_date': date.today() + timedelta(days=30 if billing_period == 'monthly' else 365)
        }
    )
    
    if not created:
        subscription.plan = plan
        subscription.billing_period = billing_period
        subscription.status = 'active'
        subscription.next_billing_date = date.today() + timedelta(days=30 if billing_period == 'monthly' else 365)
        subscription.save()
    
    serializer = SubscriptionSerializer(subscription)
    return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

