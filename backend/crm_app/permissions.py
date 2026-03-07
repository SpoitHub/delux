from rest_framework import permissions

class IsOrganizer(permissions.BasePermission):
    """
    Allows access only to authenticated users who are organizers.
    Requires that user.is_organizer is True and user has an OrganizerProfile.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_superuser:
            return True
        return bool(
            getattr(request.user, 'is_organizer', False) and
            (hasattr(request.user, 'organizerprofile') or hasattr(request.user, 'organizer_profile'))
        )
