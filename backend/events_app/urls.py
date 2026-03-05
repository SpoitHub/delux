from django.urls import path
from .views import (
    EventListView, EventDetailView, EventTicketsView,
    CrmEventListCreateView, CrmEventDetailView,
    CrmEventPublishView, CrmEventUnpublishView,
)

# Public: /api/v1/events/
urlpatterns = [
    path('',          EventListView.as_view(),    name='event-list'),
    path('<int:pk>/', EventDetailView.as_view(),  name='event-detail'),
    path('<int:pk>/tickets/', EventTicketsView.as_view(), name='event-tickets'),
]

# CRM: /api/v1/crm/events/  (included separately in config/urls.py)
crm_urlpatterns = [
    path('',               CrmEventListCreateView.as_view(), name='crm-event-list'),
    path('<int:pk>/',      CrmEventDetailView.as_view(),     name='crm-event-detail'),
    path('<int:pk>/publish/',   CrmEventPublishView.as_view(),   name='crm-event-publish'),
    path('<int:pk>/unpublish/', CrmEventUnpublishView.as_view(), name='crm-event-unpublish'),
]
