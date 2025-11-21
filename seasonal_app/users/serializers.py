"""
Serializers for users app
"""
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, EmailAddress


class EmailAddressSerializer(serializers.ModelSerializer):
    """Serializer for EmailAddress model"""
    
    class Meta:
        model = EmailAddress
        fields = ['id', 'email', 'verified', 'default', 'created_at']
        read_only_fields = ['id', 'verified', 'created_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    phone = serializers.CharField(required=True)
    first_name = serializers.CharField(required=True, max_length=150)
    father_name = serializers.CharField(required=True, max_length=150)
    grand_name = serializers.CharField(required=True, max_length=150)
    family_name = serializers.CharField(required=True, max_length=150)
    
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
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        email = validated_data.get('email')
        user = User.objects.create_user(
            username=email,
            email=email,
            **validated_data
        )
        user.set_password(password)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user profile"""
    emails = EmailAddressSerializer(many=True, read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'phone',
            'first_name', 'father_name', 'grand_name', 'family_name',
            'confirmed', 'is_phone_verified',
            'last_visited', 'sign_up_source', 'is_active', 'created_at', 'modified_at',
            'emails'
        ]
        read_only_fields = ['id', 'username', 'confirmed', 'is_phone_verified', 
                          'last_visited', 'created_at', 'modified_at', 'emails']
    
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

