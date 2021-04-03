from rest_framework import permissions


class LivePermissions(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        if view.action == "create":
            return True

        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request (GET, HEAD, or OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True

        # User must be object instance owner or staff for other actions
        return obj.owner == request.user or request.user.is_staff


class IsAdminUserOrReadOnly(permissions.IsAdminUser):
    def has_permission(self, request, view):
        is_admin = super(IsAdminUserOrReadOnly, self).has_permission(request, view)

        return request.method in permissions.SAFE_METHODS or is_admin

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request (GET, HEAD, or OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True

        # User must be object instance owner or staff for other actions
        return request.user.is_staff
