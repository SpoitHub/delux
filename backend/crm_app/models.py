from django.db import models
from django.conf import settings
from auth_app.models import OrganizerProfile

class CustomerNote(models.Model):
    organizer = models.ForeignKey(OrganizerProfile, on_delete=models.CASCADE, related_name='customer_notes')
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='organizer_notes')
    note_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Note by {self.organizer.company_name} for User {self.customer.email}"
