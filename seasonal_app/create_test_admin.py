"""
Script to create test admin user with organization membership
Run: python manage.py shell < create_test_admin.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'seasonal_app.settings')
django.setup()

from users.models import User
from profiles.models import Organization, OrganizationMembership

# Create or get organization
org, created = Organization.objects.get_or_create(
    name="Test Company",
    defaults={
        'description': 'Test organization for development',
        'email': 'info@testcompany.com',
        'phone': '+971501234567',
        'city': 'Dubai',
        'country': 'UAE',
    }
)

if created:
    print(f"✓ Created organization: {org.name} (ID: {org.id})")
else:
    print(f"✓ Organization exists: {org.name} (ID: {org.id})")

# Create admin user
admin_email = "admin@testcompany.com"
admin_user, created = User.objects.get_or_create(
    email=admin_email,
    defaults={
        'username': admin_email,
        'first_name': 'Admin',
        'father_name': 'Test',
        'grand_name': 'User',
        'family_name': 'Account',
        'phone': '+971507777777',
        'is_phone_verified': True,
    }
)

if created:
    admin_user.set_password('admin123')
    admin_user.save()
    print(f"✓ Created admin user: {admin_email}")
    print(f"  Password: admin123")
else:
    print(f"✓ Admin user exists: {admin_email}")

# Create membership
membership, created = OrganizationMembership.objects.get_or_create(
    user=admin_user,
    organization=org,
    defaults={
        'role': 'admin',
        'status': 'approved',
    }
)

if created:
    print(f"✓ Created membership: {admin_user.email} → {org.name} (admin)")
else:
    membership.status = 'approved'
    membership.save()
    print(f"✓ Membership exists and approved: {admin_user.email} → {org.name}")

print("\n" + "="*60)
print("TEST CREDENTIALS:")
print("="*60)
print(f"Email: {admin_email}")
print(f"Password: admin123")
print(f"Role: admin")
print(f"Organization ID: {org.id}")
print(f"Organization Name: {org.name}")
print("="*60)
print("\nYou can now login with these credentials!")

