"""
Shared mixins for user-related models
"""
import uuid
from django.db import models


class IsActiveMixin(models.Model):
    """Base mixin for UUID primary key and active status"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class CreatedByMixin(models.Model):
    """Mixin for tracking creation metadata"""
    created_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="%(app_label)s_%(class)s_created"
    )
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    class Meta:
        abstract = True


class UpdatedByMixin(models.Model):
    """Mixin for tracking update metadata"""
    modified_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="%(app_label)s_%(class)s_updated"
    )
    modified_at = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        abstract = True

