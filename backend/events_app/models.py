from django.db import models
from auth_app.models import OrganizerProfile


class EventLocation(models.Model):
    city = models.CharField(max_length=255)
    address = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f'{self.city}, {self.address}'


class OnlineInfo(models.Model):
    url = models.URLField()
    platform = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.url


class Event(models.Model):
    FORMAT_CHOICES = [('online', 'Online'), ('offline', 'Offline')]
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]

    organizer = models.ForeignKey(
        OrganizerProfile, on_delete=models.CASCADE, related_name='events'
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    format = models.CharField(max_length=10, choices=FORMAT_CHOICES, default='offline')
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    is_free = models.BooleanField(default=False)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='draft')
    location = models.OneToOneField(
        EventLocation, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='event',
    )
    online_info = models.OneToOneField(
        OnlineInfo, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='event',
    )
    image = models.ImageField(upload_to='events/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_datetime']

    def __str__(self):
        return self.title


class TicketType(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='ticket_types')
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_total = models.PositiveIntegerField()
    quantity_sold = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f'{self.event.title} — {self.name}'
