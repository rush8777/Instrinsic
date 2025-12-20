from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum, Count, Q
from django.contrib.auth import get_user_model
from .models import Referral

User = get_user_model()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def referral_link(request):
    user = request.user
    referral_link = f"https://app.scale.com/ref/{user.referral_code}" if user.referral_code else None
    
    # Calculate stats
    total_referrals = Referral.objects.filter(referrer=user).count()
    total_earned = Referral.objects.filter(referrer=user).aggregate(
        total=Sum('earned_amount')
    )['total'] or 0
    
    return Response({
        'referral_link': referral_link,
        'total_referrals': total_referrals,
        'total_earned': float(total_earned)
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def referral_stats(request):
    user = request.user
    
    stats = Referral.objects.filter(referrer=user).aggregate(
        total_referrals=Count('id'),
        active_referrals=Count('id', filter=Q(status='active')),
        total_earned=Sum('earned_amount')
    )
    
    pending_earnings = Referral.objects.filter(
        referrer=user,
        status='pending'
    ).aggregate(total=Sum('earned_amount'))['total'] or 0
    
    return Response({
        'total_referrals': stats['total_referrals'] or 0,
        'active_referrals': stats['active_referrals'] or 0,
        'total_earned': float(stats['total_earned'] or 0),
        'pending_earnings': float(pending_earnings)
    })

