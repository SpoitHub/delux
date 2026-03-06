from django.urls import path
from .views import (
    DashboardView,
    CrmOrderListView,
    CrmOrderDetailView,
    CrmOrderRefundView,
    CustomerListView,
    CustomerDetailView,
    CustomerNoteCreateView
)

urlpatterns = [
    path('dashboard/', DashboardView.as_view(), name='crm-dashboard'),
    
    path('orders/', CrmOrderListView.as_view(), name='crm-order-list'),
    path('orders/<int:pk>/', CrmOrderDetailView.as_view(), name='crm-order-detail'),
    path('orders/<int:pk>/refund/', CrmOrderRefundView.as_view(), name='crm-order-refund'),
    
    path('customers/', CustomerListView.as_view(), name='crm-customer-list'),
    path('customers/<int:pk>/', CustomerDetailView.as_view(), name='crm-customer-detail'),
    path('customers/<int:userId>/notes/', CustomerNoteCreateView.as_view(), name='crm-customer-notes'),
]
