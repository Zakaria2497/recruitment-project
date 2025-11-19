"""
User models for authentication and user management
"""
import uuid
import datetime
import pytz
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator
from .mixins import IsActiveMixin

# Sign up source choices
SIGN_UP_SOURCE_CHOICES = [
    ('organic', 'Organic'),
    ('referral', 'Referral'),
    ('social_media', 'Social Media'),
    ('job_portal', 'Job Portal'),
    ('advertisement', 'Advertisement'),
]


class User(AbstractUser, IsActiveMixin):
    """
    Custom User model extending AbstractUser with UUID primary key
    """
    email = models.EmailField(max_length=255, unique=True, db_index=True)
    phone = models.CharField(
        max_length=30,
        validators=[RegexValidator(r'^\+?1?\d{9,15}$', 'Enter a valid phone number.')],
        help_text='Phone number with country code',
        null=True,
        blank=True,
        db_index=True
    )
    created_by = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    modified_by = models.CharField(max_length=50, null=True, blank=True)
    modified_at = models.DateTimeField(auto_now=True, null=True)
    confirmed = models.BooleanField(default=False)
    is_phone_verified = models.BooleanField(default=False)
    last_visited = models.DateTimeField(null=True, blank=True)
    can_trial = models.BooleanField(default=False)
    is_reseller = models.BooleanField(default=False)
    is_stealth = models.BooleanField(default=False)
    sign_up_source = models.CharField(
        max_length=30,
        choices=SIGN_UP_SOURCE_CHOICES,
        default='organic'
    )

    def save(self, *args, **kwargs):
        if self.username is None:
            self.username = self.email
        if self.id:
            self.modified_at = datetime.datetime.now(pytz.utc)
        super(User, self).save(*args, **kwargs)

    def __str__(self):
        return self.username

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["confirmed"]

    class Meta:
        db_table = 'user'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['phone']),
            models.Index(fields=['is_active']),
        ]


class EmailAddress(models.Model):
    """Email addresses associated with users"""
    id = models.UUIDField(default=uuid.uuid4, primary_key=True)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='emails',
        db_index=True
    )
    email = models.EmailField(max_length=256, unique=True, db_index=True)
    verified = models.BooleanField(default=False)
    default = models.BooleanField(default=False)
    is_mock_email = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'emailaddresses'
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['email']),
            models.Index(fields=['verified']),
        ]
        verbose_name_plural = 'Email Addresses'

    def __str__(self):
        return self.email


class OTP(models.Model):
    """OTP model for phone verification"""
    id = models.UUIDField(default=uuid.uuid4, primary_key=True)
    mobile_number = models.CharField(max_length=30, db_index=True)
    otp_code = models.CharField(max_length=6)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    
    def save(self, *args, **kwargs):
        if not self.expires_at:
            from django.utils import timezone
            from datetime import timedelta
            self.expires_at = timezone.now() + timedelta(minutes=10)
        super().save(*args, **kwargs)
    
    class Meta:
        db_table = 'otps'
        indexes = [
            models.Index(fields=['mobile_number']),
            models.Index(fields=['is_verified']),
            models.Index(fields=['created_at']),
        ]
        ordering = ['-created_at']
    
    def __str__(self):
        return f"OTP for {self.mobile_number} - {self.is_verified}"
