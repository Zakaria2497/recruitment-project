"""
Custom permissions for users app
"""
from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to access it.
    """
    
    def has_object_permission(self, request, view, obj):
        # Check if object has a user attribute
        if hasattr(obj, 'user'):
            return obj.user == request.user
        # If object is User itself
        if hasattr(obj, 'id'):
            return obj.id == request.user.id
        return False

