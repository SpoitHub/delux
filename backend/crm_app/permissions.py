from rest_framework import permissions

class IsOrganizer(permissions.BasePermission):
    """
    Allows access only to authenticated users who are organizers.
    Requires that user.is_organizer is True and user has an OrganizerProfile.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            getattr(request.user, 'is_organizer', False) and
            hasattr(request.user, 'organizerprofile')
        )
