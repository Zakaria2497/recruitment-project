"""
Serializers for profiles app
"""
import os
from rest_framework import serializers
from django.core.validators import RegexValidator
from .models import (
    PersonalInfo, Education, Course, Experience,
    Language, Skill, BankInfo, Attachment, ProfileCompletion,
    Organization, OrganizationMembership
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
        """Validate IBAN format - very lenient"""
        if value:
            # Remove spaces and convert to uppercase
            cleaned_value = value.replace(' ', '').replace('-', '').upper()
            
            # Very basic validation - just check it's not empty and has reasonable length
            if len(cleaned_value) < 5:
                raise serializers.ValidationError("IBAN is too short.")
            
            if len(cleaned_value) > 50:
                raise serializers.ValidationError("IBAN is too long.")
            
            # Return cleaned value (without spaces, uppercase)
            return cleaned_value
        
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


class OrganizationSerializer(serializers.ModelSerializer):
    """Serializer for Organization"""
    logo = serializers.FileField(required=False, allow_null=True)
    
    class Meta:
        model = Organization
        fields = [
            'id', 'name', 'description', 'logo', 'email', 'phone',
            'website', 'address', 'city', 'country', 'registration_number',
            'created_at', 'modified_at', 'is_active'
        ]
        read_only_fields = ['id', 'created_at', 'modified_at', 'is_active']
    
    def validate_name(self, value):
        """Validate unique organization name"""
        if not value or not value.strip():
            raise serializers.ValidationError("Organization name is required.")
        
        instance = self.instance
        if Organization.objects.filter(name__iexact=value).exclude(id=instance.id if instance else None).exists():
            raise serializers.ValidationError("Organization with this name already exists.")
        return value.strip()
    
    def validate_logo(self, value):
        """Validate logo file"""
        if value:
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Logo file size cannot exceed 5MB.")
            valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg']
            ext = os.path.splitext(value.name)[1].lower()
            if ext not in valid_extensions:
                raise serializers.ValidationError(f"Invalid file type. Allowed: {', '.join(valid_extensions)}")
        return value


class OrganizationMembershipSerializer(serializers.ModelSerializer):
    """Serializer for OrganizationMembership"""
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    approved_by_email = serializers.EmailField(source='approved_by.email', read_only=True, allow_null=True)
    
    class Meta:
        model = OrganizationMembership
        fields = [
            'id', 'user', 'user_email', 'user_username', 'organization', 'organization_name',
            'role', 'status', 'joined_at', 'approved_at', 'approved_by', 'approved_by_email',
            'notes', 'created_at', 'modified_at', 'is_active'
        ]
        read_only_fields = [
            'id', 'user', 'user_email', 'user_username', 'organization_name',
            'joined_at', 'approved_at', 'approved_by', 'approved_by_email',
            'created_at', 'modified_at', 'is_active'
        ]
    
    def validate(self, attrs):
        """Validate membership"""
        user = self.context['request'].user
        organization = attrs.get('organization')
        
        # Check if membership already exists
        instance = self.instance
        if organization and OrganizationMembership.objects.filter(
            user=user, organization=organization
        ).exclude(id=instance.id if instance else None).exists():
            raise serializers.ValidationError("You already have a membership with this organization.")
        
        return attrs


class OrganizationMembershipApprovalSerializer(serializers.Serializer):
    """Serializer for approving/rejecting memberships"""
    status = serializers.ChoiceField(choices=['approved', 'rejected', 'suspended'])
    notes = serializers.CharField(required=False, allow_blank=True)


class ApplicantProfileSerializer(serializers.Serializer):
    """Serializer for applicant profile data for dashboard card view"""
    user_id = serializers.IntegerField(source='user.id')
    email = serializers.EmailField(source='user.email')
    phone = serializers.CharField(source='user.phone', allow_null=True)
    
    # Personal Info
    first_name = serializers.CharField(source='user.personal_info.first_name', default='')
    father_name = serializers.CharField(source='user.personal_info.father_name', default='')
    family_name = serializers.CharField(source='user.personal_info.family_name', default='')
    gender = serializers.CharField(source='user.personal_info.gender', default='')
    birthdate = serializers.DateField(source='user.personal_info.birthdate', allow_null=True)
    nationality = serializers.CharField(source='user.personal_info.nationality', default='')
    city = serializers.CharField(source='user.personal_info.city', default='')
    photo = serializers.FileField(source='user.personal_info.photo', allow_null=True)
    
    # Education
    last_degree = serializers.CharField(source='user.education.last_degree', default='')
    major = serializers.CharField(source='user.education.major', default='')
    
    # Experience count
    experience_years = serializers.SerializerMethodField()
    
    # Profile completion
    completion_percentage = serializers.IntegerField(source='user.profile_completion.overall_completion_percentage', default=0)
    
    # Membership details
    membership_id = serializers.UUIDField(source='id')
    role = serializers.CharField()
    status = serializers.CharField()
    applied_at = serializers.DateTimeField(source='created_at')
    notes = serializers.CharField(default='')
    
    def get_experience_years(self, obj):
        """Calculate total years of experience"""
        try:
            from dateutil.relativedelta import relativedelta
            from django.utils import timezone
            experiences = obj.user.experiences.filter(is_active=True)
            total_months = 0
            for exp in experiences:
                start = exp.start_date
                end = exp.end_date if exp.end_date else timezone.now().date()
                if start:
                    delta = relativedelta(end, start)
                    total_months += delta.years * 12 + delta.months
            return round(total_months / 12, 1)
        except:
            return 0


class ApplicantCardSerializer(serializers.Serializer):
    """Compact serializer for applicant card view"""
    membership_id = serializers.UUIDField(source='id')
    user_id = serializers.IntegerField(source='user.id')
    
    # Basic info
    full_name = serializers.SerializerMethodField()
    email = serializers.EmailField(source='user.email')
    phone = serializers.CharField(source='user.phone', allow_null=True)
    photo = serializers.SerializerMethodField()
    
    # Key details
    age = serializers.SerializerMethodField()
    city = serializers.SerializerMethodField()
    nationality = serializers.SerializerMethodField()
    education = serializers.SerializerMethodField()
    experience_years = serializers.SerializerMethodField()
    
    # Membership
    role = serializers.CharField()
    status = serializers.CharField()
    applied_at = serializers.DateTimeField(source='created_at')
    notes = serializers.CharField(default='')
    
    # Profile status
    completion_percentage = serializers.SerializerMethodField()
    is_submitted = serializers.SerializerMethodField()
    
    def get_full_name(self, obj):
        """Get full name from personal info"""
        try:
            pi = obj.user.personal_info
            return f"{pi.first_name} {pi.father_name} {pi.family_name}".strip()
        except:
            return obj.user.email.split('@')[0]
    
    def get_photo(self, obj):
        """Get photo URL"""
        try:
            if obj.user.personal_info.photo:
                return obj.user.personal_info.photo.url
        except:
            pass
        return None
    
    def get_age(self, obj):
        """Calculate age from birthdate"""
        try:
            from datetime import date
            birthdate = obj.user.personal_info.birthdate
            if birthdate:
                today = date.today()
                return today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))
        except:
            pass
        return None
    
    def get_city(self, obj):
        """Get city"""
        try:
            return obj.user.personal_info.city
        except:
            return ''
    
    def get_nationality(self, obj):
        """Get nationality"""
        try:
            return obj.user.personal_info.nationality
        except:
            return ''
    
    def get_education(self, obj):
        """Get education summary"""
        try:
            edu = obj.user.education
            return f"{edu.last_degree} in {edu.major}" if edu.major else edu.last_degree
        except:
            return ''
    
    def get_experience_years(self, obj):
        """Calculate total years of experience"""
        try:
            from dateutil.relativedelta import relativedelta
            from django.utils import timezone
            experiences = obj.user.experiences.filter(is_active=True)
            total_months = 0
            for exp in experiences:
                start = exp.start_date
                end = exp.end_date if exp.end_date else timezone.now().date()
                if start:
                    delta = relativedelta(end, start)
                    total_months += delta.years * 12 + delta.months
            return round(total_months / 12, 1)
        except:
            return 0
    
    def get_completion_percentage(self, obj):
        """Get profile completion"""
        try:
            return obj.user.profile_completion.overall_completion_percentage
        except:
            return 0
    
    def get_is_submitted(self, obj):
        """Check if profile is submitted"""
        try:
            return obj.user.profile_completion.is_submitted
        except:
            return False

