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
    ProfileSubmitView
)

router = DefaultRouter()
router.register(r'personal-info', PersonalInfoViewSet, basename='personal-info')
router.register(r'education', EducationViewSet, basename='education')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'experiences', ExperienceViewSet, basename='experience')
router.register(r'languages', LanguageViewSet, basename='language')
router.register(r'skills', SkillViewSet, basename='skill')
router.register(r'bank-info', BankInfoViewSet, basename='bank-info')
router.register(r'attachments', AttachmentViewSet, basename='attachment')

urlpatterns = [
    path('completion/', ProfileCompletionView.as_view(), name='profile-completion'),
    path('submit/', ProfileSubmitView.as_view(), name='profile-submit'),
    path('', include(router.urls)),
]

