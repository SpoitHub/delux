from django.urls import path
from .views import (
    CategoryListView,
    ProductListView,
    ProductDetailView,
    CrmCategoryListCreateView,
    CrmProductListCreateView,
    CrmProductDetailView,
    CrmProductImageView,
)

# Public: /api/v1/products/
urlpatterns = [
    path('',              ProductListView.as_view(),  name='product-list'),
    path('categories/',   CategoryListView.as_view(), name='category-list'),
    path('<int:pk>/',     ProductDetailView.as_view(), name='product-detail'),
]

# CRM: /api/v1/crm/products/  (included separately in config/urls.py)
crm_urlpatterns = [
    path('',                 CrmProductListCreateView.as_view(), name='crm-product-list'),
    path('categories/',      CrmCategoryListCreateView.as_view(), name='crm-category-list'),
    path('<int:pk>/',        CrmProductDetailView.as_view(),     name='crm-product-detail'),
    path('<int:pk>/images/', CrmProductImageView.as_view(),      name='crm-product-images'),
]
