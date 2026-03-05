from django.contrib import admin
from .models import Event, EventLocation, OnlineInfo, TicketType


class TicketTypeInline(admin.TabularInline):
    model = TicketType
    extra = 1


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'organizer', 'format', 'status', 'start_datetime', 'is_free')
    list_filter = ('status', 'format', 'is_free')
    search_fields = ('title', 'description')
    inlines = [TicketTypeInline]


@admin.register(EventLocation)
class EventLocationAdmin(admin.ModelAdmin):
    list_display = ('city', 'address')


@admin.register(OnlineInfo)
class OnlineInfoAdmin(admin.ModelAdmin):
    list_display = ('url', 'platform')


@admin.register(TicketType)
class TicketTypeAdmin(admin.ModelAdmin):
    list_display = ('event', 'name', 'price', 'quantity_total', 'quantity_sold')
