"""
Serializers for users app
"""
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, EmailAddress


class UserOrganizationMembershipSerializer(serializers.Serializer):
    """Serializer for user's organization memberships (lightweight)"""
    membership_id = serializers.CharField(source='id')
    organization_id = serializers.CharField(source='organization.id')
    organization_name = serializers.CharField(source='organization.name')
    role = serializers.CharField()
    status = serializers.CharField()
    joined_at = serializers.DateTimeField(allow_null=True)


class EmailAddressSerializer(serializers.ModelSerializer):
    """Serializer for EmailAddress model"""
    
    class Meta:
        model = EmailAddress
        fields = ['id', 'email', 'verified', 'default', 'created_at']
        read_only_fields = ['id', 'verified', 'created_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    phone = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    first_name = serializers.CharField(required=False, max_length=150, allow_blank=True)
    father_name = serializers.CharField(required=False, max_length=150, allow_blank=True)
    grand_name = serializers.CharField(required=False, max_length=150, allow_blank=True)
    family_name = serializers.CharField(required=False, max_length=150, allow_blank=True)
    
    class Meta:
        model = User
        fields = [
            'email',
            'password',
            'phone',
            'first_name',
            'father_name',
            'grand_name',
            'family_name',
            'sign_up_source',
        ]
        extra_kwargs = {
            'email': {'required': True},
        }
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def validate_phone(self, value):
        if value and User.objects.filter(phone=value).exists():
            raise serializers.ValidationError("A user with this phone number already exists.")
        return value
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        email = validated_data.pop('email')
        user = User.objects.create_user(
            username=email,
            email=email,
            **validated_data
        )
        user.set_password(password)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user profile with organization memberships"""
    emails = EmailAddressSerializer(many=True, read_only=True)
    memberships = serializers.SerializerMethodField()
    primary_role = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'phone',
            'first_name', 'father_name', 'grand_name', 'family_name',
            'confirmed', 'is_phone_verified',
            'last_visited', 'sign_up_source', 'is_active', 'created_at', 'modified_at',
            'emails', 'memberships', 'primary_role'
        ]
        read_only_fields = ['id', 'username', 'confirmed', 'is_phone_verified', 
                          'last_visited', 'created_at', 'modified_at', 'emails', 
                          'memberships', 'primary_role']
    
    def get_memberships(self, obj):
        """Get user's approved organization memberships"""
        from profiles.models import OrganizationMembership
        
        memberships = OrganizationMembership.objects.filter(
            user=obj,
            status='approved',
            is_active=True
        ).select_related('organization').order_by('-joined_at')
        
        return UserOrganizationMembershipSerializer(memberships, many=True).data
    
    def get_primary_role(self, obj):
        """Determine user's primary role (highest priority role they have)"""
        from profiles.models import OrganizationMembership
        
        # Role priority (higher = more privileged)
        role_priority = {
            'owner': 7,
            'admin': 6,
            'manager': 5,
            'hr': 4,
            'recruiter': 3,
            'employee': 2,
            'contractor': 1,
        }
        
        memberships = OrganizationMembership.objects.filter(
            user=obj,
            status='approved',
            is_active=True
        ).values_list('role', flat=True)
        
        if not memberships:
            return 'applicant'  # No memberships = regular applicant
        
        # Find highest priority role
        highest_role = max(memberships, key=lambda x: role_priority.get(x, 0))
        return highest_role
    
    def validate_email(self, value):
        user = self.instance
        if user and User.objects.filter(email=value).exclude(pk=user.pk).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def validate_phone(self, value):
        user = self.instance
        if value and User.objects.filter(phone=value).exclude(pk=user.pk).exists():
            raise serializers.ValidationError("A user with this phone number already exists.")
        return value


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

