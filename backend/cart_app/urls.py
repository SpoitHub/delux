from django.urls import path
from .views import CartView, CartItemCreateView, CartItemDetailView, CartClearView

urlpatterns = [
    path('',           CartView.as_view(),           name='cart'),
    path('items/',     CartItemCreateView.as_view(),  name='cart-items'),
    path('items/<int:pk>/', CartItemDetailView.as_view(), name='cart-item-detail'),
    path('clear/',     CartClearView.as_view(),       name='cart-clear'),
]
