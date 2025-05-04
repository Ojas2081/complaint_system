from rest_framework import permissions

class AdminOrReadOnly(permissions.IsAdminUser):

    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS or (request.user and request.user.is_staff)

    
class ComplaintUserOrAdminOrReadonly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return (obj.user == request.user) or (request.user.is_company_user)
    