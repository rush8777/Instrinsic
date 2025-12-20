from django.urls import path
from .views import PlanListView, current_subscription, subscribe

urlpatterns = [
    path('plans/', PlanListView.as_view(), name='plans'),
    path('current/', current_subscription, name='current_subscription'),
    path('subscribe/', subscribe, name='subscribe'),
]

