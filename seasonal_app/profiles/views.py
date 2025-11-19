"""
Profile views using class-based views
"""
from django.utils import timezone
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import (
    PersonalInfo, Education, Course, Experience,
    Language, Skill, BankInfo, Attachment, ProfileCompletion
)
from .serializers import (
    PersonalInfoSerializer, EducationSerializer, CourseSerializer,
    ExperienceSerializer, LanguageSerializer, SkillSerializer,
    BankInfoSerializer, AttachmentSerializer, ProfileCompletionSerializer
)
from .permissions import IsOwner


class PersonalInfoViewSet(viewsets.ModelViewSet):
    """
    PersonalInfo ViewSet
    GET, PUT, PATCH /api/profile/personal-info/
    """
    serializer_class = PersonalInfoSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    
    def get_queryset(self):
        return PersonalInfo.objects.filter(user=self.request.user)
    
    def get_object(self):
        obj, created = PersonalInfo.objects.get_or_create(user=self.request.user)
        return obj
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def update(self, request, *args, **kwargs):
        # Get or create personal info
        personal_info, created = PersonalInfo.objects.get_or_create(
            user=request.user
        )
        kwargs['pk'] = personal_info.id
        return super().update(request, *args, **kwargs)
    
    def partial_update(self, request, *args, **kwargs):
        # Get or create personal info
        personal_info, created = PersonalInfo.objects.get_or_create(
            user=request.user
        )
        kwargs['pk'] = personal_info.id
        return super().partial_update(request, *args, **kwargs)


class EducationViewSet(viewsets.ModelViewSet):
    """
    Education ViewSet
    GET, PUT, PATCH /api/profile/education/
    """
    serializer_class = EducationSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    
    def get_queryset(self):
        return Education.objects.filter(user=self.request.user)
    
    def get_object(self):
        obj, created = Education.objects.get_or_create(user=self.request.user)
        return obj
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def update(self, request, *args, **kwargs):
        education, created = Education.objects.get_or_create(user=request.user)
        kwargs['pk'] = education.id
        return super().update(request, *args, **kwargs)
    
    def partial_update(self, request, *args, **kwargs):
        education, created = Education.objects.get_or_create(user=request.user)
        kwargs['pk'] = education.id
        return super().partial_update(request, *args, **kwargs)


class CourseViewSet(viewsets.ModelViewSet):
    """
    Course ViewSet for multiple courses
    GET, POST, DELETE /api/profile/courses/
    """
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    
    def get_queryset(self):
        return Course.objects.filter(user=self.request.user, is_active=True)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ExperienceViewSet(viewsets.ModelViewSet):
    """
    Experience ViewSet for multiple experiences
    GET, POST, DELETE /api/profile/experiences/
    """
    serializer_class = ExperienceSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    
    def get_queryset(self):
        return Experience.objects.filter(user=self.request.user, is_active=True)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class LanguageViewSet(viewsets.ModelViewSet):
    """
    Language ViewSet for multiple languages
    GET, POST, DELETE /api/profile/languages/
    """
    serializer_class = LanguageSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    
    def get_queryset(self):
        return Language.objects.filter(user=self.request.user, is_active=True)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SkillViewSet(viewsets.ModelViewSet):
    """
    Skill ViewSet for multiple skills
    GET, POST, DELETE /api/profile/skills/
    """
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    
    def get_queryset(self):
        return Skill.objects.filter(user=self.request.user, is_active=True)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BankInfoViewSet(viewsets.ModelViewSet):
    """
    BankInfo ViewSet
    GET, PUT, PATCH /api/profile/bank-info/
    """
    serializer_class = BankInfoSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    
    def get_queryset(self):
        return BankInfo.objects.filter(user=self.request.user)
    
    def get_object(self):
        obj, created = BankInfo.objects.get_or_create(user=self.request.user)
        return obj
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def update(self, request, *args, **kwargs):
        bank_info, created = BankInfo.objects.get_or_create(user=request.user)
        kwargs['pk'] = bank_info.id
        return super().update(request, *args, **kwargs)
    
    def partial_update(self, request, *args, **kwargs):
        bank_info, created = BankInfo.objects.get_or_create(user=request.user)
        kwargs['pk'] = bank_info.id
        return super().partial_update(request, *args, **kwargs)


class AttachmentViewSet(viewsets.ModelViewSet):
    """
    Attachment ViewSet for CV/Resume uploads
    GET, POST, DELETE /api/profile/attachments/
    """
    serializer_class = AttachmentSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    
    def get_queryset(self):
        return Attachment.objects.filter(user=self.request.user, is_active=True)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ProfileCompletionView(generics.RetrieveAPIView):
    """
    Profile Completion View
    GET /api/profile/completion/
    """
    serializer_class = ProfileCompletionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        completion, created = ProfileCompletion.objects.get_or_create(
            user=self.request.user
        )
        # Update completion status
        completion._update_completion_status()
        return completion


class ProfileSubmitView(generics.GenericAPIView):
    """
    Profile Submission View
    POST /api/profile/submit/
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        completion, created = ProfileCompletion.objects.get_or_create(
            user=request.user
        )
        
        # Update completion status before submission
        completion._update_completion_status()
        
        # Check if profile is complete enough (e.g., 80% or more)
        if completion.overall_completion_percentage < 80:
            return Response({
                'error': 'Profile must be at least 80% complete before submission',
                'completion_percentage': completion.overall_completion_percentage
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Submit profile
        completion.is_submitted = True
        completion.submitted_at = timezone.now()
        completion.save()
        
        return Response({
            'message': 'Profile submitted successfully',
            'completion': ProfileCompletionSerializer(completion).data
        }, status=status.HTTP_200_OK)
