"""
Custom permissions for profiles app
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
        return False

