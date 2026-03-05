from django.db.models.signals import post_save
from django.dispatch import receiver


@receiver(post_save, sender='auth_app.User')
def create_organizer_profile(sender, instance, **kwargs):
    """Auto-create OrganizerProfile when is_organizer is set to True."""
    if instance.is_organizer:
        from .models import OrganizerProfile
        OrganizerProfile.objects.get_or_create(user=instance)
