"""
Authentication views using class-based views
"""
import random
import string
from datetime import timedelta
from django.utils import timezone
from django.db import transaction
from rest_framework import status, viewsets, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.cache import cache
from django.contrib.auth import authenticate
from .models import User, OTP
from .serializers import (
    UserRegistrationSerializer,
    UserSerializer,
    UserLoginSerializer
)
from .permissions import IsOwner


class SendOTPView(APIView):
    """
    Send OTP to phone number
    POST /api/auth/send-otp/
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        mobile_number = request.data.get('mobile_number')
        
        if not mobile_number:
            return Response(
                {'error': 'mobile_number is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Rate limiting: Check if OTP was sent recently (within 60 seconds)
        cache_key = f'otp_rate_limit_{mobile_number}'
        if cache.get(cache_key):
            return Response(
                {'error': 'Please wait before requesting a new OTP'},
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )
        
        # Generate 6-digit OTP
        otp_code = ''.join(random.choices(string.digits, k=6))
        
        # In production, send OTP via SMS service here
        # For now, we'll store it in the database
        OTP.objects.filter(
            mobile_number=mobile_number,
            is_verified=False
        ).update(is_verified=True)  # Mark old OTPs as used
        
        otp = OTP.objects.create(
            mobile_number=mobile_number,
            otp_code=otp_code,
            expires_at=timezone.now() + timedelta(minutes=10)
        )
        
        # Set rate limit cache (60 seconds)
        cache.set(cache_key, True, 60)
        print("OTP sent successfully", otp_code)
        # In development, return OTP in response (remove in production)
        return Response({
            'message': 'OTP sent successfully',
            'otp': otp_code,  # Remove this in production
            'expires_in': 600  # seconds
        }, status=status.HTTP_200_OK)


class VerifyOTPView(APIView):
    """
    Verify OTP and return JWT tokens
    POST /api/auth/verify-otp/
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        mobile_number = request.data.get('mobile_number')
        otp_code = request.data.get('otp_code')
        
        if not mobile_number or not otp_code:
            return Response(
                {'error': 'mobile_number and otp_code are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Find valid OTP
        otp = OTP.objects.filter(
            mobile_number=mobile_number,
            otp_code=otp_code,
            is_verified=False,
            expires_at__gt=timezone.now()
        ).order_by('-created_at').first()
        
        if not otp:
            return Response(
                {'error': 'Invalid or expired OTP'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Mark OTP as verified
        otp.is_verified = True
        otp.save()
        
        # Get or create user with this phone number
        user, created = User.objects.get_or_create(
            phone=mobile_number,
            defaults={
                'email': f'{mobile_number}@temp.com',  # Temporary email
                'username': mobile_number,
                'is_phone_verified': True
            }
        )
        
        if not created:
            # Update phone verification status
            user.is_phone_verified = True
            user.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'OTP verified successfully',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }
        }, status=status.HTTP_200_OK)


class RegisterView(APIView):
    """
    User registration
    POST /api/auth/register/
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            
            # Mark phone as verified if provided
            if user.phone:
                user.is_phone_verified = True
                user.save()
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'User registered successfully',
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token)
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    User login
    POST /api/auth/login/
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        user = authenticate(request, username=email, password=password)
        
        if not user:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not user.is_active:
            return Response(
                {'error': 'User account is disabled'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Update last visited
        user.last_visited = timezone.now()
        user.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Login successful',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }
        }, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ModelViewSet):
    """
    User profile management
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    
    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)
    
    def get_object(self):
        return self.request.user
    
    @action(detail=False, methods=['get', 'put', 'patch'])
    def me(self, request):
        """Get or update current user profile"""
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
