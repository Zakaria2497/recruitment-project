"""
Script to create a test applicant user with application memberships
"""
import os
import django
from django.conf import settings

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'seasonal_app.settings')
django.setup()

from django.contrib.auth import get_user_model
from profiles.models import Organization, OrganizationMembership
from django.utils import timezone

User = get_user_model()

def create_test_applicant():
    print("Creating test applicant user with applications...")

    # Create an Applicant User
    applicant_email = "applicant@test.com"
    applicant_password = "applicant123"
    applicant_phone = "+971501234567"

    applicant_user, created = User.objects.get_or_create(
        email=applicant_email,
        defaults={
            'username': applicant_email,
            'first_name': 'John',
            'father_name': 'Michael',
            'grand_name': 'Robert',
            'family_name': 'Doe',
            'phone': applicant_phone,
            'is_phone_verified': True,
        }
    )
    if created:
        applicant_user.set_password(applicant_password)
        applicant_user.save()
        print(f"✓ Created applicant user: {applicant_user.email}")
        print(f"  Password: {applicant_password}")
    else:
        print(f"✓ Applicant user '{applicant_user.email}' already exists.")
        if not applicant_user.check_password(applicant_password):
            applicant_user.set_password(applicant_password)
            applicant_user.save()
            print(f"  Updated password for existing user.")

    # Get or create organizations to apply to
    org1, _ = Organization.objects.get_or_create(
        name="Test Company",
        defaults={
            'email': 'info@testcompany.com',
            'description': 'A test organization',
            'city': 'Dubai',
            'country': 'UAE',
        }
    )
    
    org2, _ = Organization.objects.get_or_create(
        name="Tech Corp",
        defaults={
            'email': 'hr@techcorp.com',
            'description': 'Technology company',
            'city': 'Abu Dhabi',
            'country': 'UAE',
        }
    )

    # Create memberships with different statuses
    membership1, created1 = OrganizationMembership.objects.get_or_create(
        user=applicant_user,
        organization=org1,
        defaults={
            'role': 'employee',
            'status': 'pending',
            'notes': 'Application submitted, waiting for review',
        }
    )
    if created1:
        print(f"✓ Created PENDING application: {applicant_user.email} → {org1.name}")
    else:
        print(f"✓ Application to {org1.name} already exists (Status: {membership1.status})")

    membership2, created2 = OrganizationMembership.objects.get_or_create(
        user=applicant_user,
        organization=org2,
        defaults={
            'role': 'contractor',
            'status': 'approved',
            'joined_at': timezone.now(),
            'approved_at': timezone.now(),
            'notes': 'Great candidate, approved immediately',
        }
    )
    if created2:
        print(f"✓ Created APPROVED application: {applicant_user.email} → {org2.name}")
    else:
        print(f"✓ Application to {org2.name} already exists (Status: {membership2.status})")

    print("\n" + "="*60)
    print("TEST APPLICANT CREDENTIALS:")
    print("="*60)
    print(f"Email: {applicant_email}")
    print(f"Password: {applicant_password}")
    print(f"Phone: {applicant_phone}")
    print("\nAPPLICATIONS:")
    print(f"- {org1.name}: {membership1.status.upper()}")
    print(f"- {org2.name}: {membership2.status.upper()}")
    print("="*60 + "\n")
    print("Login with these credentials to see the applications dashboard!")
    print("URL: http://localhost:5173/login")

if __name__ == '__main__':
    create_test_applicant()

