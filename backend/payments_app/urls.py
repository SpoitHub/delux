from django.urls import path
from .views import MockChargeView

urlpatterns = [
    path('mock/charge/', MockChargeView.as_view(), name='mock-charge'),
]
