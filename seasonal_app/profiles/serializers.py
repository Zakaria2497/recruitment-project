"""
Serializers for profiles app
"""
import os
from rest_framework import serializers
from django.core.validators import RegexValidator
from .models import (
    PersonalInfo, Education, Course, Experience,
    Language, Skill, BankInfo, Attachment, ProfileCompletion
)


class PersonalInfoSerializer(serializers.ModelSerializer):
    """Serializer for PersonalInfo with file upload handling"""
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    photo = serializers.FileField(required=False, allow_null=True)
    
    class Meta:
        model = PersonalInfo
        fields = [
            'id', 'user', 'first_name', 'father_name', 'grand_name', 'family_name',
            'gender', 'birthdate', 'nationality', 'id_number', 'city', 'address', 'photo',
            'created_at', 'modified_at', 'is_active'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'modified_at', 'is_active']
    
    def validate_id_number(self, value):
        """Validate unique ID number"""
        user = self.context['request'].user
        if PersonalInfo.objects.filter(id_number=value).exclude(user=user).exists():
            raise serializers.ValidationError("This ID number is already registered.")
        return value
    
    def validate_photo(self, value):
        """Validate photo file"""
        if value:
            # Check file size (max 5MB)
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Photo file size cannot exceed 5MB.")
            # Check file extension
            valid_extensions = ['.jpg', '.jpeg', '.png', '.gif']
            ext = os.path.splitext(value.name)[1].lower()
            if ext not in valid_extensions:
                raise serializers.ValidationError(f"Invalid file type. Allowed: {', '.join(valid_extensions)}")
        return value


class EducationSerializer(serializers.ModelSerializer):
    """Serializer for Education with certificate file handling"""
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    certificates = serializers.FileField(required=False, allow_null=True)
    
    class Meta:
        model = Education
        fields = [
            'id', 'user', 'last_degree', 'major', 'school', 'grad_year', 'certificates',
            'created_at', 'modified_at', 'is_active'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'modified_at', 'is_active']
    
    def validate_certificates(self, value):
        """Validate certificate file"""
        if value:
            # Check file size (max 10MB)
            if value.size > 10 * 1024 * 1024:
                raise serializers.ValidationError("Certificate file size cannot exceed 10MB.")
            # Check file extension
            valid_extensions = ['.pdf', '.jpg', '.jpeg', '.png']
            ext = os.path.splitext(value.name)[1].lower()
            if ext not in valid_extensions:
                raise serializers.ValidationError(f"Invalid file type. Allowed: {', '.join(valid_extensions)}")
        return value


class CourseSerializer(serializers.ModelSerializer):
    """Serializer for Course with certificate handling"""
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    certificate = serializers.FileField(required=False, allow_null=True)
    
    class Meta:
        model = Course
        fields = [
            'id', 'user', 'title', 'provider', 'completion_date', 'certificate',
            'created_at', 'modified_at', 'is_active'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'modified_at', 'is_active']
    
    def validate_title(self, value):
        """Validate title is provided"""
        if not value or not value.strip():
            raise serializers.ValidationError("Course title is required.")
        return value.strip()
    
    def validate_certificate(self, value):
        """Validate certificate file"""
        if value:
            if value.size > 10 * 1024 * 1024:
                raise serializers.ValidationError("Certificate file size cannot exceed 10MB.")
            valid_extensions = ['.pdf', '.jpg', '.jpeg', '.png']
            ext = os.path.splitext(value.name)[1].lower()
            if ext not in valid_extensions:
                raise serializers.ValidationError(f"Invalid file type. Allowed: {', '.join(valid_extensions)}")
        return value


class ExperienceSerializer(serializers.ModelSerializer):
    """Serializer for Experience"""
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    certificate = serializers.FileField(required=False, allow_null=True)
    
    class Meta:
        model = Experience
        fields = [
            'id', 'user', 'job_title', 'employer', 'start_date', 'end_date',
            'tasks', 'is_current', 'certificate',
            'created_at', 'modified_at', 'is_active'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'modified_at', 'is_active']
    
    def validate(self, attrs):
        """Validate experience dates"""
        start_date = attrs.get('start_date')
        end_date = attrs.get('end_date')
        is_current = attrs.get('is_current', False)
        
        if start_date and end_date and not is_current:
            if end_date < start_date:
                raise serializers.ValidationError("End date cannot be before start date.")
        if is_current and end_date:
            raise serializers.ValidationError("Current position should not have an end date.")
        
        return attrs
    
    def validate_job_title(self, value):
        """Validate job title"""
        if not value or not value.strip():
            raise serializers.ValidationError("Job title is required.")
        return value.strip()
    
    def validate_certificate(self, value):
        """Validate certificate file"""
        if value:
            if value.size > 10 * 1024 * 1024:
                raise serializers.ValidationError("Certificate file size cannot exceed 10MB.")
            valid_extensions = ['.pdf', '.jpg', '.jpeg', '.png']
            ext = os.path.splitext(value.name)[1].lower()
            if ext not in valid_extensions:
                raise serializers.ValidationError(f"Invalid file type. Allowed: {', '.join(valid_extensions)}")
        return value


class LanguageSerializer(serializers.ModelSerializer):
    """Serializer for Language"""
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = Language
        fields = [
            'id', 'user', 'language', 'proficiency_level',
            'created_at', 'modified_at', 'is_active'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'modified_at', 'is_active']
    
    def validate_language(self, value):
        """Validate unique language per user"""
        user = self.context['request'].user
        language = value.strip()
        
        # Check if language already exists for this user (excluding current instance)
        instance = self.instance
        if Language.objects.filter(user=user, language__iexact=language).exclude(id=instance.id if instance else None).exists():
            raise serializers.ValidationError("This language is already added to your profile.")
        return language
    
    def validate(self, attrs):
        """Validate proficiency level"""
        if not attrs.get('proficiency_level'):
            raise serializers.ValidationError({"proficiency_level": "Proficiency level is required."})
        return attrs


class SkillSerializer(serializers.ModelSerializer):
    """Serializer for Skill"""
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = Skill
        fields = [
            'id', 'user', 'skill_name',
            'created_at', 'modified_at', 'is_active'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'modified_at', 'is_active']
    
    def validate_skill_name(self, value):
        """Validate unique skill per user"""
        user = self.context['request'].user
        skill_name = value.strip()
        
        # Check if skill already exists for this user (excluding current instance)
        instance = self.instance
        if Skill.objects.filter(user=user, skill_name__iexact=skill_name).exclude(id=instance.id if instance else None).exists():
            raise serializers.ValidationError("This skill is already added to your profile.")
        return skill_name


class BankInfoSerializer(serializers.ModelSerializer):
    """Serializer for BankInfo with IBAN validation"""
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = BankInfo
        fields = [
            'id', 'user', 'bank_name', 'account_holder_name', 'iban',
            'created_at', 'modified_at', 'is_active'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'modified_at', 'is_active']
    
    def validate_iban(self, value):
        """Validate IBAN format"""
        if value:
            value = value.replace(' ', '').upper()
            # IBAN validation regex
            iban_validator = RegexValidator(
                r'^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$',
                'Enter a valid IBAN.'
            )
            iban_validator(value)
            if len(value) < 15 or len(value) > 34:
                raise serializers.ValidationError("IBAN must be between 15 and 34 characters.")
        return value


class AttachmentSerializer(serializers.ModelSerializer):
    """Serializer for Attachment (CV/Resume uploads)"""
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    file = serializers.FileField(required=True)
    original_filename = serializers.CharField(read_only=True)
    file_size = serializers.IntegerField(read_only=True)
    content_type = serializers.CharField(read_only=True)
    
    class Meta:
        model = Attachment
        fields = [
            'id', 'user', 'attachment_type', 'file', 'original_filename',
            'file_size', 'content_type', 'created_at', 'modified_at', 'is_active'
        ]
        read_only_fields = ['id', 'user', 'original_filename', 'file_size', 
                          'content_type', 'created_at', 'modified_at', 'is_active']
    
    def validate_file(self, value):
        """Validate file upload"""
        if value:
            # Check file size (max 10MB)
            if value.size > 10 * 1024 * 1024:
                raise serializers.ValidationError("File size cannot exceed 10MB.")
            
            # Check file extension
            valid_extensions = ['.pdf', '.doc', '.docx']
            ext = os.path.splitext(value.name)[1].lower()
            if ext not in valid_extensions:
                raise serializers.ValidationError(f"Invalid file type. Allowed: {', '.join(valid_extensions)}")
        
        return value
    
    def create(self, validated_data):
        """Override create to set file metadata"""
        file = validated_data['file']
        attachment = Attachment.objects.create(
            user=self.context['request'].user,
            attachment_type=validated_data.get('attachment_type', 'cv_resume'),
            file=file,
            original_filename=file.name,
            file_size=file.size,
            content_type=file.content_type or 'application/octet-stream'
        )
        return attachment


class ProfileCompletionSerializer(serializers.ModelSerializer):
    """Serializer for ProfileCompletion (read-only)"""
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = ProfileCompletion
        fields = [
            'id', 'user', 'personal_info_complete', 'education_complete',
            'experience_complete', 'skills_complete', 'bank_info_complete',
            'attachments_complete', 'overall_completion_percentage',
            'is_submitted', 'submitted_at',
            'created_at', 'modified_at', 'is_active'
        ]
        read_only_fields = [
            'id', 'user', 'personal_info_complete', 'education_complete',
            'experience_complete', 'skills_complete', 'bank_info_complete',
            'attachments_complete', 'overall_completion_percentage',
            'is_submitted', 'submitted_at',
            'created_at', 'modified_at', 'is_active'
        ]

