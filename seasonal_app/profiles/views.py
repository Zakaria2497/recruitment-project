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
    Language, Skill, BankInfo, Attachment, ProfileCompletion,
    Organization, OrganizationMembership
)
from .serializers import (
    PersonalInfoSerializer, EducationSerializer, CourseSerializer,
    ExperienceSerializer, LanguageSerializer, SkillSerializer,
    BankInfoSerializer, AttachmentSerializer, ProfileCompletionSerializer,
    OrganizationSerializer, OrganizationMembershipSerializer,
    OrganizationMembershipApprovalSerializer, ApplicantCardSerializer,
    ApplicantProfileSerializer
)
from .permissions import IsOwner


class PersonalInfoViewSet(viewsets.ModelViewSet):
    """
    PersonalInfo ViewSet
    Exposes GET/POST/PATCH/PUT via a custom route so clients don't need the ID.
    """
    serializer_class = PersonalInfoSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        return PersonalInfo.objects.filter(user=self.request.user)

    def get_object(self):
        obj, _ = PersonalInfo.objects.get_or_create(user=self.request.user)
        return obj

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        import logging
        logger = logging.getLogger(__name__)
        
        print("\n" + "="*80)
        print("=== BACKEND: PersonalInfoViewSet.create called ===")
        print(f"BACKEND - User: {request.user}")
        print(f"BACKEND - request.data: {request.data}")
        print(f"BACKEND - request.data type: {type(request.data)}")
        print(f"BACKEND - request.data keys: {list(request.data.keys()) if hasattr(request.data, 'keys') else 'N/A'}")
        print(f"BACKEND - request.FILES: {request.FILES}")
        print(f"BACKEND - request.POST: {request.POST}")
        print(f"BACKEND - request.method: {request.method}")
        print(f"BACKEND - Content-Type: {request.content_type}")
        print("="*80 + "\n")
        
        logger.info("=== BACKEND: PersonalInfoViewSet.create called ===")
        logger.info(f"BACKEND - User: {request.user}")
        logger.info(f"BACKEND - request.data: {request.data}")
        logger.info(f"BACKEND - request.data type: {type(request.data)}")
        logger.info(f"BACKEND - request.data keys: {list(request.data.keys()) if hasattr(request.data, 'keys') else 'N/A'}")
        logger.info(f"BACKEND - request.FILES: {request.FILES}")
        logger.info(f"BACKEND - request.POST: {request.POST}")
        logger.info(f"BACKEND - Content-Type: {request.content_type}")
        
        # ensure single personal info per user
        instance = PersonalInfo.objects.filter(user=request.user).first()
        
        print(f"BACKEND - Existing instance found: {instance is not None}")
        logger.info(f"BACKEND - Existing instance found: {instance is not None}")
        
        if instance:
            print(f"BACKEND - Updating existing instance with ID: {instance.id}")
            logger.info(f"BACKEND - Updating existing instance with ID: {instance.id}")
            serializer = self.get_serializer(instance, data=request.data)
            print(f"BACKEND - Serializer created, validating...")
            logger.info(f"BACKEND - Serializer created, validating...")
            serializer.is_valid(raise_exception=True)
            print(f"BACKEND - Validation passed, validated_data: {serializer.validated_data}")
            logger.info(f"BACKEND - Validation passed, validated_data: {serializer.validated_data}")
            serializer.save(user=request.user)
            print(f"BACKEND - Instance saved successfully (updated)")
            logger.info(f"BACKEND - Instance saved successfully (updated)")
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        print(f"BACKEND - Creating new instance")
        logger.info(f"BACKEND - Creating new instance")
        return super().create(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        kwargs['pk'] = self.get_object().pk
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        kwargs['pk'] = self.get_object().pk
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        kwargs['pk'] = self.get_object().pk
        return super().partial_update(request, *args, **kwargs)


class EducationViewSet(viewsets.ModelViewSet):
    """
    Education ViewSet
    GET, POST /api/profile/education/ - List and Create
    POST /api/profile/education/{id}/ - Update
    DELETE /api/profile/education/{id}/ - Delete
    """
    serializer_class = EducationSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    
    def get_queryset(self):
        return Education.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        print(f"BACKEND - Creating new education for user: {self.request.user}")
        serializer.save(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        import logging
        logger = logging.getLogger(__name__)
        
        print("\n" + "="*80)
        print("=== BACKEND: EducationViewSet.create called ===")
        print(f"BACKEND - User: {request.user}")
        print(f"BACKEND - request.data: {request.data}")
        print("="*80 + "\n")
        
        # Check if education record already exists for this user (unique constraint)
        instance = Education.objects.filter(user=request.user).first()
        
        print(f"BACKEND - Existing instance found: {instance is not None}")
        logger.info(f"BACKEND - Existing instance found: {instance is not None}")
        
        if instance:
            print(f"BACKEND - Updating existing education with ID: {instance.id}")
            logger.info(f"BACKEND - Updating existing education with ID: {instance.id}")
            serializer = self.get_serializer(instance, data=request.data)
            serializer.is_valid(raise_exception=True)
            print(f"BACKEND - Validation passed, validated_data: {serializer.validated_data}")
            serializer.save(user=request.user)
            print(f"BACKEND - Education saved successfully (updated)")
            logger.info(f"BACKEND - Education saved successfully (updated)")
            
            # Update completion status
            from .models import ProfileCompletion
            completion, _ = ProfileCompletion.objects.get_or_create(user=request.user)
            completion._update_completion_status()
            print(f"BACKEND - Completion updated: education_complete={completion.education_complete}")
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        print(f"BACKEND - Creating new education record")
        logger.info(f"BACKEND - Creating new education record")
        # Default create returns 201
        response = super().create(request, *args, **kwargs)
        
        # Update completion status after creating
        from .models import ProfileCompletion
        completion, _ = ProfileCompletion.objects.get_or_create(user=request.user)
        completion._update_completion_status()
        print(f"BACKEND - Completion updated: education_complete={completion.education_complete}")
        
        return response
    
    def update(self, request, *args, **kwargs):
        print("\n" + "="*80)
        print(f"=== BACKEND: EducationViewSet.update called with ID: {kwargs.get('pk')} ===")
        print(f"BACKEND - request.data: {request.data}")
        print("="*80 + "\n")
        
        # Update returns 200
        response = super().update(request, *args, **kwargs)
        
        # Update completion status after updating
        from .models import ProfileCompletion
        completion, _ = ProfileCompletion.objects.get_or_create(user=request.user)
        completion._update_completion_status()
        print(f"BACKEND - Completion updated: education_complete={completion.education_complete}")
        
        return response


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
    GET, POST /api/profile/bank-info/ - List and Create
    POST /api/profile/bank-info/{id}/ - Update
    DELETE /api/profile/bank-info/{id}/ - Delete
    """
    serializer_class = BankInfoSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    
    def get_queryset(self):
        return BankInfo.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        print(f"BACKEND - Creating new bank info for user: {self.request.user}")
        serializer.save(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        import logging
        logger = logging.getLogger(__name__)
        
        print("\n" + "="*80)
        print("=== BACKEND: BankInfoViewSet.create called ===")
        print(f"BACKEND - User: {request.user}")
        print(f"BACKEND - request.data: {request.data}")
        print("="*80 + "\n")
        
        # Check if bank info record already exists for this user (unique constraint)
        instance = BankInfo.objects.filter(user=request.user).first()
        
        print(f"BACKEND - Existing instance found: {instance is not None}")
        logger.info(f"BACKEND - Existing instance found: {instance is not None}")
        
        if instance:
            print(f"BACKEND - Updating existing bank info with ID: {instance.id}")
            logger.info(f"BACKEND - Updating existing bank info with ID: {instance.id}")
            serializer = self.get_serializer(instance, data=request.data)
            serializer.is_valid(raise_exception=True)
            print(f"BACKEND - Validation passed, validated_data: {serializer.validated_data}")
            serializer.save(user=request.user)
            print(f"BACKEND - Bank info saved successfully (updated)")
            logger.info(f"BACKEND - Bank info saved successfully (updated)")
            
            # Update completion status
            from .models import ProfileCompletion
            completion, _ = ProfileCompletion.objects.get_or_create(user=request.user)
            completion._update_completion_status()
            print(f"BACKEND - Completion updated: bank_info_complete={completion.bank_info_complete}")
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        print(f"BACKEND - Creating new bank info record")
        logger.info(f"BACKEND - Creating new bank info record")
        
        try:
            # Default create returns 201
            response = super().create(request, *args, **kwargs)
            
            # Update completion status after creating
            from .models import ProfileCompletion
            completion, _ = ProfileCompletion.objects.get_or_create(user=request.user)
            completion._update_completion_status()
            print(f"BACKEND - Completion updated: bank_info_complete={completion.bank_info_complete}")
            
            return response
        except Exception as e:
            print(f"BACKEND - BankInfo creation error: {e}")
            print(f"BACKEND - Error type: {type(e).__name__}")
            if hasattr(e, 'detail'):
                print(f"BACKEND - Error detail: {e.detail}")
            raise
    
    def update(self, request, *args, **kwargs):
        print("\n" + "="*80)
        print(f"=== BACKEND: BankInfoViewSet.update called with ID: {kwargs.get('pk')} ===")
        print(f"BACKEND - request.data: {request.data}")
        print("="*80 + "\n")
        
        # Update returns 200
        response = super().update(request, *args, **kwargs)
        
        # Update completion status after updating
        from .models import ProfileCompletion
        completion, _ = ProfileCompletion.objects.get_or_create(user=request.user)
        completion._update_completion_status()
        print(f"BACKEND - Completion updated: bank_info_complete={completion.bank_info_complete}")
        
        return response


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


class OrganizationViewSet(viewsets.ModelViewSet):
    """
    Organization ViewSet
    GET /api/profile/organizations/ - List all organizations
    POST /api/profile/organizations/ - Create organization
    GET /api/profile/organizations/{id}/ - Retrieve organization
    PUT/PATCH /api/profile/organizations/{id}/ - Update organization
    DELETE /api/profile/organizations/{id}/ - Delete organization
    """
    serializer_class = OrganizationSerializer
    permission_classes = [IsAuthenticated]
    queryset = Organization.objects.filter(is_active=True)
    
    def get_queryset(self):
        return Organization.objects.filter(is_active=True).order_by('name')


class OrganizationMembershipViewSet(viewsets.ModelViewSet):
    """
    OrganizationMembership ViewSet
    GET /api/profile/memberships/ - List user's memberships
    POST /api/profile/memberships/ - Apply for membership
    GET /api/profile/memberships/{id}/ - Retrieve membership
    PUT/PATCH /api/profile/memberships/{id}/ - Update membership
    DELETE /api/profile/memberships/{id}/ - Delete membership
    """
    serializer_class = OrganizationMembershipSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return OrganizationMembership.objects.filter(user=user, is_active=True)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'], url_path='approve')
    def approve_membership(self, request, pk=None):
        """Approve a membership (admin/owner only)"""
        membership = self.get_object()
        serializer = OrganizationMembershipApprovalSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        membership.status = serializer.validated_data['status']
        membership.notes = serializer.validated_data.get('notes', membership.notes)
        
        if serializer.validated_data['status'] == 'approved':
            membership.approved_by = request.user
            membership.approved_at = timezone.now()
            membership.joined_at = timezone.now()
        
        membership.save()
        
        return Response({
            'message': f'Membership {serializer.validated_data["status"]} successfully',
            'membership': OrganizationMembershipSerializer(membership).data
        }, status=status.HTTP_200_OK)


class MyOrganizationMembershipsView(generics.ListAPIView):
    """
    View to list current user's memberships
    GET /api/profile/my-memberships/
    """
    serializer_class = OrganizationMembershipSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return OrganizationMembership.objects.filter(
            user=self.request.user,
            is_active=True
        ).select_related('organization', 'approved_by')


class OrganizationMembersView(generics.ListAPIView):
    """
    View to list members of an organization
    GET /api/profile/organizations/{org_id}/members/
    """
    serializer_class = OrganizationMembershipSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        org_id = self.kwargs.get('org_id')
        return OrganizationMembership.objects.filter(
            organization_id=org_id,
            is_active=True
        ).select_related('user', 'organization', 'approved_by')


class OrganizationApplicantsView(generics.ListAPIView):
    """
    View to list pending applicants for an organization (Dashboard)
    GET /api/profile/organizations/{org_id}/applicants/
    Returns applicants with status=pending with their profile data
    """
    serializer_class = ApplicantCardSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        org_id = self.kwargs.get('org_id')
        return OrganizationMembership.objects.filter(
            organization_id=org_id,
            status='pending',
            is_active=True
        ).select_related(
            'user',
            'user__personal_info',
            'user__education',
            'user__profile_completion'
        ).prefetch_related(
            'user__experiences'
        ).order_by('-created_at')


class OrganizationApprovedMembersView(generics.ListAPIView):
    """
    View to list approved members with profile data (Dashboard)
    GET /api/profile/organizations/{org_id}/approved-members/
    Returns approved members with their profile data
    """
    serializer_class = ApplicantCardSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        org_id = self.kwargs.get('org_id')
        return OrganizationMembership.objects.filter(
            organization_id=org_id,
            status='approved',
            is_active=True
        ).select_related(
            'user',
            'user__personal_info',
            'user__education',
            'user__profile_completion'
        ).prefetch_related(
            'user__experiences'
        ).order_by('-joined_at')


class OrganizationAllApplicationsView(generics.ListAPIView):
    """
    View to list all applications for an organization (Dashboard)
    GET /api/profile/organizations/{org_id}/all-applications/
    Returns all applications (pending, approved, rejected, suspended) with profile data
    Supports filtering by status via query param: ?status=pending
    """
    serializer_class = ApplicantCardSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        org_id = self.kwargs.get('org_id')
        status_filter = self.request.query_params.get('status', None)
        
        queryset = OrganizationMembership.objects.filter(
            organization_id=org_id,
            is_active=True
        ).select_related(
            'user',
            'user__personal_info',
            'user__education',
            'user__profile_completion'
        ).prefetch_related(
            'user__experiences'
        )
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset.order_by('-created_at')


class ApplicantDetailView(generics.RetrieveAPIView):
    """
    View to get detailed applicant profile
    GET /api/profile/applicants/{membership_id}/
    Returns full profile data for a specific applicant
    """
    serializer_class = ApplicantProfileSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'
    
    def get_queryset(self):
        return OrganizationMembership.objects.filter(
            is_active=True
        ).select_related(
            'user',
            'user__personal_info',
            'user__education',
            'user__profile_completion'
        ).prefetch_related(
            'user__experiences',
            'user__courses',
            'user__languages',
            'user__skills'
        )


class OrganizationDashboardStatsView(generics.GenericAPIView):
    """
    View to get organization dashboard statistics
    GET /api/profile/organizations/{org_id}/statistics/
    Returns counts of applications by status
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, org_id):
        from datetime import timedelta
        from django.db.models import Count, Q
        
        # Get all memberships for this organization
        memberships = OrganizationMembership.objects.filter(
            organization_id=org_id,
            is_active=True
        )
        
        # Count by status
        stats = memberships.aggregate(
            pending_count=Count('id', filter=Q(status='pending')),
            approved_count=Count('id', filter=Q(status='approved')),
            rejected_count=Count('id', filter=Q(status='rejected')),
            suspended_count=Count('id', filter=Q(status='suspended')),
            total_applications=Count('id')
        )
        
        # Recent applications (last 7 days)
        seven_days_ago = timezone.now() - timedelta(days=7)
        recent_count = memberships.filter(created_at__gte=seven_days_ago).count()
        stats['recent_applications_count'] = recent_count
        
        return Response(stats, status=status.HTTP_200_OK)
