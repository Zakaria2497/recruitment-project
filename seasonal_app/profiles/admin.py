"""
Admin configuration for profiles app
"""
from django.contrib import admin
from .models import (
    PersonalInfo, Education, Course, Experience,
    Language, Skill, WorkPreference, BankInfo,
    Attachment, ProfileCompletion
)


@admin.register(PersonalInfo)
class PersonalInfoAdmin(admin.ModelAdmin):
    """Admin for PersonalInfo model"""
    list_display = ['user', 'first_name', 'family_name', 'id_number', 'city', 'gender', 'is_active']
    list_filter = ['gender', 'nationality', 'is_active', 'created_at']
    search_fields = ['user__email', 'user__username', 'first_name', 'family_name', 'id_number']
    readonly_fields = ['id', 'created_at', 'modified_at']
    raw_id_fields = ['user', 'created_by', 'modified_by']


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    """Admin for Education model"""
    list_display = ['user', 'last_degree', 'major', 'school', 'grad_year', 'is_active']
    list_filter = ['last_degree', 'grad_year', 'is_active']
    search_fields = ['user__email', 'user__username', 'major', 'school']
    readonly_fields = ['id', 'created_at', 'modified_at']
    raw_id_fields = ['user', 'created_by', 'modified_by']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    """Admin for Course model"""
    list_display = ['title', 'user', 'provider', 'completion_date', 'is_active']
    list_filter = ['completion_date', 'is_active', 'created_at']
    search_fields = ['title', 'provider', 'user__email', 'user__username']
    readonly_fields = ['id', 'created_at', 'modified_at']
    raw_id_fields = ['user', 'created_by', 'modified_by']


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    """Admin for Experience model"""
    list_display = ['job_title', 'user', 'employer', 'start_date', 'end_date', 'is_current', 'is_active']
    list_filter = ['is_current', 'is_active', 'start_date', 'end_date']
    search_fields = ['job_title', 'employer', 'user__email', 'user__username']
    readonly_fields = ['id', 'created_at', 'modified_at']
    raw_id_fields = ['user', 'created_by', 'modified_by']


@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    """Admin for Language model"""
    list_display = ['user', 'language', 'proficiency_level', 'is_active']
    list_filter = ['proficiency_level', 'is_active']
    search_fields = ['language', 'user__email', 'user__username']
    readonly_fields = ['id', 'created_at', 'modified_at']
    raw_id_fields = ['user', 'created_by', 'modified_by']


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    """Admin for Skill model"""
    list_display = ['skill_name', 'user', 'is_active']
    list_filter = ['is_active', 'created_at']
    search_fields = ['skill_name', 'user__email', 'user__username']
    readonly_fields = ['id', 'created_at', 'modified_at']
    raw_id_fields = ['user', 'created_by', 'modified_by']


@admin.register(WorkPreference)
class WorkPreferenceAdmin(admin.ModelAdmin):
    """Admin for WorkPreference model"""
    list_display = ['user', 'has_seasonal_experience', 'can_work_weekends', 'is_active']
    list_filter = ['has_seasonal_experience', 'can_work_weekends', 'is_active']
    search_fields = ['user__email', 'user__username']
    readonly_fields = ['id', 'created_at', 'modified_at']
    raw_id_fields = ['user', 'created_by', 'modified_by']


@admin.register(BankInfo)
class BankInfoAdmin(admin.ModelAdmin):
    """Admin for BankInfo model"""
    list_display = ['user', 'bank_name', 'account_holder_name', 'is_active']
    list_filter = ['is_active', 'created_at']
    search_fields = ['bank_name', 'account_holder_name', 'iban', 'user__email', 'user__username']
    readonly_fields = ['id', 'created_at', 'modified_at']
    raw_id_fields = ['user', 'created_by', 'modified_by']


@admin.register(Attachment)
class AttachmentAdmin(admin.ModelAdmin):
    """Admin for Attachment model"""
    list_display = ['user', 'attachment_type', 'original_filename', 'file_size', 'created_at', 'is_active']
    list_filter = ['attachment_type', 'is_active', 'created_at']
    search_fields = ['original_filename', 'user__email', 'user__username']
    readonly_fields = ['id', 'created_at', 'modified_at', 'file_size', 'content_type']
    raw_id_fields = ['user', 'created_by', 'modified_by']


@admin.register(ProfileCompletion)
class ProfileCompletionAdmin(admin.ModelAdmin):
    """Admin for ProfileCompletion model"""
    list_display = ['user', 'overall_completion_percentage', 'is_submitted', 'submitted_at', 'is_active']
    list_filter = ['is_submitted', 'is_active', 'submitted_at']
    search_fields = ['user__email', 'user__username']
    readonly_fields = ['id', 'created_at', 'modified_at', 'overall_completion_percentage']
    raw_id_fields = ['user', 'created_by', 'modified_by']
    
    fieldsets = (
        ('User', {
            'fields': ('user',)
        }),
        ('Completion Status', {
            'fields': (
                'personal_info_complete',
                'education_complete',
                'experience_complete',
                'skills_complete',
                'bank_info_complete',
                'attachments_complete',
                'overall_completion_percentage',
            )
        }),
        ('Submission', {
            'fields': ('is_submitted', 'submitted_at')
        }),
        ('Metadata', {
            'fields': ('id', 'is_active', 'created_at', 'modified_at', 'created_by', 'modified_by')
        }),
    )
