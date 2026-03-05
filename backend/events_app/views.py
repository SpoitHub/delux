from django.db.models import Q
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Event, TicketType
from .serializers import EventSerializer, EventWriteSerializer, TicketTypeSerializer


# ─── Permissions ──────────────────────────────────────────────────────────────

class IsOrganizer(IsAuthenticated):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        if not request.user.is_organizer:
            return False
        # Auto-create profile if missing (e.g. set via admin without UI)
        from auth_app.models import OrganizerProfile
        OrganizerProfile.objects.get_or_create(user=request.user)
        # Refresh the cached relation
        if hasattr(request.user, '_organizer_profile_cache'):
            del request.user._organizer_profile_cache
        try:
            _ = request.user.organizer_profile
            return True
        except Exception:
            return False


# ─── Helpers ──────────────────────────────────────────────────────────────────

def _apply_filters(qs, params):
    search = params.get('search')
    fmt = params.get('format')
    is_free = params.get('is_free')
    city = params.get('city')
    date_from = params.get('date_from')
    date_to = params.get('date_to')

    if search:
        qs = qs.filter(Q(title__icontains=search) | Q(description__icontains=search))
    if fmt in ('online', 'offline'):
        qs = qs.filter(format=fmt)
    if is_free is not None:
        qs = qs.filter(is_free=(is_free.lower() == 'true'))
    if city:
        qs = qs.filter(location__city__icontains=city)
    if date_from:
        qs = qs.filter(start_datetime__date__gte=date_from)
    if date_to:
        qs = qs.filter(start_datetime__date__lte=date_to)
    return qs


# ─── Public Views ─────────────────────────────────────────────────────────────

class EventListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        from rest_framework.pagination import PageNumberPagination
        qs = Event.objects.filter(status='published').select_related(
            'location', 'online_info', 'organizer'
        ).prefetch_related('ticket_types')
        qs = _apply_filters(qs, request.query_params)

        paginator = PageNumberPagination()
        paginator.page_size = 12
        page = paginator.paginate_queryset(qs, request)
        serializer = EventSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)


class EventDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            event = Event.objects.select_related(
                'location', 'online_info', 'organizer'
            ).prefetch_related('ticket_types').get(pk=pk, status='published')
        except Event.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(EventSerializer(event, context={'request': request}).data)


class EventTicketsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            event = Event.objects.get(pk=pk, status='published')
        except Event.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        tickets = TicketType.objects.filter(event=event)
        return Response(TicketTypeSerializer(tickets, many=True).data)


# ─── CRM Views ────────────────────────────────────────────────────────────────

class CrmEventListCreateView(APIView):
    permission_classes = [IsOrganizer]

    def get(self, request):
        qs = Event.objects.filter(
            organizer=request.user.organizer_profile
        ).select_related('location', 'online_info', 'organizer').prefetch_related('ticket_types')
        serializer = EventSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        serializer = EventWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        event = serializer.save(organizer=request.user.organizer_profile)
        return Response(
            EventSerializer(event, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )


class CrmEventDetailView(APIView):
    permission_classes = [IsOrganizer]

    def _get_event(self, request, pk):
        try:
            return Event.objects.select_related(
                'location', 'online_info', 'organizer'
            ).prefetch_related('ticket_types').get(
                pk=pk, organizer=request.user.organizer_profile
            )
        except Event.DoesNotExist:
            return None

    def get(self, request, pk):
        event = self._get_event(request, pk)
        if not event:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(EventSerializer(event, context={'request': request}).data)

    def patch(self, request, pk):
        event = self._get_event(request, pk)
        if not event:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = EventWriteSerializer(event, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        event = serializer.save()
        return Response(EventSerializer(event, context={'request': request}).data)

    def delete(self, request, pk):
        event = self._get_event(request, pk)
        if not event:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CrmEventPublishView(APIView):
    permission_classes = [IsOrganizer]

    def post(self, request, pk):
        try:
            event = Event.objects.get(pk=pk, organizer=request.user.organizer_profile)
        except Event.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        event.status = 'published'
        event.save(update_fields=['status'])
        return Response({'status': 'published'})


class CrmEventUnpublishView(APIView):
    permission_classes = [IsOrganizer]

    def post(self, request, pk):
        try:
            event = Event.objects.get(pk=pk, organizer=request.user.organizer_profile)
        except Event.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        event.status = 'draft'
        event.save(update_fields=['status'])
        return Response({'status': 'draft'})
