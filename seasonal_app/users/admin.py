"""
Admin configuration for users app
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, EmailAddress, OTP


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Custom admin for User model"""
    list_display = ['email', 'username', 'phone', 'confirmed', 'is_phone_verified', 'is_active', 'created_at']
    list_filter = ['confirmed', 'is_phone_verified', 'is_active', 'sign_up_source', 'created_at']
    search_fields = ['email', 'username', 'phone']
    readonly_fields = ['id', 'created_at', 'modified_at']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('phone', 'confirmed', 'is_phone_verified', 'last_visited', 
                      'can_trial', 'is_reseller', 'is_stealth', 'sign_up_source')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'modified_at', 'created_by', 'modified_by')
        }),
    )


@admin.register(EmailAddress)
class EmailAddressAdmin(admin.ModelAdmin):
    """Admin for EmailAddress model"""
    list_display = ['email', 'user', 'verified', 'default', 'is_mock_email', 'created_at']
    list_filter = ['verified', 'default', 'is_mock_email', 'created_at']
    search_fields = ['email', 'user__email', 'user__username']
    readonly_fields = ['id', 'created_at', 'updated_at']
    raw_id_fields = ['user']


@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    """Admin for OTP model"""
    list_display = ['mobile_number', 'otp_code', 'is_verified', 'created_at', 'expires_at']
    list_filter = ['is_verified', 'created_at']
    search_fields = ['mobile_number', 'otp_code']
    readonly_fields = ['id', 'created_at', 'expires_at']
    ordering = ['-created_at']
