"""
URL configuration for profiles app
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PersonalInfoViewSet,
    EducationViewSet,
    CourseViewSet,
    ExperienceViewSet,
    LanguageViewSet,
    SkillViewSet,
    BankInfoViewSet,
    AttachmentViewSet,
    ProfileCompletionView,
    ProfileSubmitView,
    OrganizationViewSet,
    OrganizationMembershipViewSet,
    MyOrganizationMembershipsView,
    OrganizationMembersView,
    OrganizationApplicantsView,
    OrganizationApprovedMembersView,
    OrganizationAllApplicationsView,
    ApplicantDetailView,
    OrganizationDashboardStatsView
)

router = DefaultRouter()
router.register(r'education', EducationViewSet, basename='education')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'experiences', ExperienceViewSet, basename='experience')
router.register(r'languages', LanguageViewSet, basename='language')
router.register(r'skills', SkillViewSet, basename='skill')
router.register(r'bank-info', BankInfoViewSet, basename='bank-info')
router.register(r'attachments', AttachmentViewSet, basename='attachment')
router.register(r'organizations', OrganizationViewSet, basename='organization')
router.register(r'memberships', OrganizationMembershipViewSet, basename='membership')

personal_info_view = PersonalInfoViewSet.as_view({
    'get': 'retrieve',
    'post': 'create',
    'put': 'update',
    'patch': 'partial_update',
})

urlpatterns = [
    path('personal-info/', personal_info_view, name='personal-info'),
    path('completion/', ProfileCompletionView.as_view(), name='profile-completion'),
    path('submit/', ProfileSubmitView.as_view(), name='profile-submit'),
    path('my-memberships/', MyOrganizationMembershipsView.as_view(), name='my-memberships'),
    path('organizations/<uuid:org_id>/members/', OrganizationMembersView.as_view(), name='organization-members'),
    path('organizations/<uuid:org_id>/applicants/', OrganizationApplicantsView.as_view(), name='organization-applicants'),
    path('organizations/<uuid:org_id>/approved-members/', OrganizationApprovedMembersView.as_view(), name='organization-approved-members'),
    path('organizations/<uuid:org_id>/all-applications/', OrganizationAllApplicationsView.as_view(), name='organization-all-applications'),
    path('organizations/<uuid:org_id>/statistics/', OrganizationDashboardStatsView.as_view(), name='organization-statistics'),
    path('applicants/<uuid:pk>/', ApplicantDetailView.as_view(), name='applicant-detail'),
    path('', include(router.urls)),
]

