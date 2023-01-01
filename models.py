"""
Django models for Seasonal Hiring Platform
Normalized database schema for user onboarding and profile management

Attachment Structure:
- PersonalInfo.photo: Profile photo (single file)
- Education.certificates: General education certificates (multiple files via form processing)
- Course.certificate: Individual course certificate (per course)
- Experience.certificate: Individual experience certificate (per experience) 
- Attachment: Main document attachments (CV/Resume, Cover Letter, Portfolio)
"""

import uuid
import datetime
import pytz
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator

# Sign up source choices
SIGN_UP_SOURCE_CHOICES = [
    ('organic', 'Organic'),
    ('referral', 'Referral'),
    ('social_media', 'Social Media'),
    ('job_portal', 'Job Portal'),
    ('advertisement', 'Advertisement'),
    ('web_app', 'web_app'),
]


class IsActiveMixin(models.Model):
    """Base mixin for UUID primary key and active status"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class CreatedByMixin(models.Model):
    """Mixin for tracking creation metadata"""
    created_by = models.ForeignKey(
        'User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="%(app_label)s_%(class)s_created"
    )
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    class Meta:
        abstract = True


class UpdatedByMixin(models.Model):
    """Mixin for tracking update metadata"""
    modified_by = models.ForeignKey(
        'User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="%(app_label)s_%(class)s_updated"
    )
    modified_at = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        abstract = True


class User(AbstractUser, IsActiveMixin):
    """
    Custom User model extending AbstractUser with your project's pattern
    """
    email = models.EmailField(max_length=255, unique=True)
    phone = models.CharField(
        max_length=30, 
        validators=[RegexValidator(r'^\+?1?\d{9,15}$', 'Enter a valid phone number.')],
        help_text='Phone number with country code',
        null=True,
        blank=True
    )
    created_by = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    modified_by = models.CharField(max_length=50, null=True, blank=True)
    modified_at = models.DateTimeField(auto_now=True, null=True)
    confirmed = models.BooleanField(default=False)
    is_phone_verified = models.BooleanField(default=False)
    last_visited = models.DateTimeField(null=True, blank=True)
    can_trial = models.BooleanField(default=False)
    is_reseller = models.BooleanField(default=False)
    is_stealth = models.BooleanField(default=False)
    sign_up_source = models.CharField(
        max_length=30, 
        choices=SIGN_UP_SOURCE_CHOICES, 
        default='organic'
    )

    def save(self, *args, **kwargs):
        if self.username is None:
            self.username = self.email
        if self.id:
            self.modified_at = datetime.datetime.now(pytz.utc)

        super(User, self).save(*args, **kwargs)

    def __str__(self):
        return self.username

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["confirmed"]

    class Meta:
        db_table = 'user'


class EmailAddress(models.Model):
    """Email addresses associated with users"""
    id = models.UUIDField(default=uuid.uuid4, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='emails')
    email = models.EmailField(max_length=256, unique=True)
    verified = models.BooleanField(default=False)
    default = models.BooleanField(default=False)
    is_mock_email = models.BooleanField(default=False)

    class Meta:
        db_table = 'emailaddresses'
        indexes = [
            models.Index(fields=['user', ])
        ]

    def __str__(self):
        return self.email


class PersonalInfo(CreatedByMixin, UpdatedByMixin, IsActiveMixin):
    """
    Personal information linked to User (1:1)
    """
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'), 
        ('Other', 'Other'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='personal_info', db_index=True)
    first_name = models.CharField(max_length=128)
    father_name = models.CharField(max_length=128)
    grand_name = models.CharField(max_length=128)
    family_name = models.CharField(max_length=128)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)
    birthdate = models.DateField(null=True, blank=True)
    nationality = models.CharField(max_length=100, blank=True)
    id_number = models.CharField(max_length=50, unique=True)  # ID/Residency number
    city = models.CharField(max_length=100, blank=True)
    address = models.TextField(blank=True)
    # Profile photo attachment
    photo = models.FileField(upload_to='photos/%Y/%m/%d/', null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.id:
            self.modified_at = datetime.datetime.now(pytz.utc)
        super(PersonalInfo, self).save(*args, **kwargs)

    class Meta:
        db_table = 'personal_info'

    def __str__(self):
        return f"{self.first_name} {self.family_name}"


class Education(CreatedByMixin, UpdatedByMixin, IsActiveMixin):
    """
    Education information linked to User (1:1)
    """
    DEGREE_CHOICES = [
        ('High School', 'High School'),
        ('Diploma', 'Diploma'),
        ('Bachelor', 'Bachelor'),
        ('Master', 'Master'),
        ('PhD', 'PhD'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='education', db_index=True)
    last_degree = models.CharField(max_length=20, choices=DEGREE_CHOICES, blank=True)
    major = models.CharField(max_length=100, blank=True)
    school = models.CharField(max_length=100, blank=True)
    grad_year = models.PositiveIntegerField(null=True, blank=True)
    # Education certificate attachments
    certificates = models.FileField(upload_to='education_certificates/%Y/%m/%d/', null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.id:
            self.modified_at = datetime.datetime.now(pytz.utc)
        super(Education, self).save(*args, **kwargs)

    class Meta:
        db_table = 'education'

    def __str__(self):
        return f"{self.user.username} - {self.last_degree}"


class Course(CreatedByMixin, UpdatedByMixin, IsActiveMixin):
    """
    Courses/Certifications (1:Many with User)
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courses', db_index=True)
    title = models.CharField(max_length=200)
    provider = models.CharField(max_length=100, blank=True)
    completion_date = models.DateField(null=True, blank=True)
    # Course certificate attachment
    certificate = models.FileField(upload_to='course_certificates/%Y/%m/%d/', null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.id:
            self.modified_at = datetime.datetime.now(pytz.utc)
        super(Course, self).save(*args, **kwargs)

    class Meta:
        db_table = 'courses'
        ordering = ['-completion_date']

    def __str__(self):
        return f"{self.title} - {self.user.username}"


class Experience(CreatedByMixin, UpdatedByMixin, IsActiveMixin):
    """
    Work experience (1:Many with User)
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='experiences', db_index=True)
    job_title = models.CharField(max_length=100)
    employer = models.CharField(max_length=100)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    tasks = models.TextField(blank=True)
    is_current = models.BooleanField(default=False)
    # Experience certificate attachment
    certificate = models.FileField(upload_to='experience_certificates/%Y/%m/%d/', null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.id:
            self.modified_at = datetime.datetime.now(pytz.utc)
        super(Experience, self).save(*args, **kwargs)

    class Meta:
        db_table = 'experiences'
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.job_title} at {self.employer} - {self.user.username}"


class Language(CreatedByMixin, UpdatedByMixin, IsActiveMixin):
    """
    Language skills (1:Many with User)
    """
    PROFICIENCY_LEVELS = [
        ('Basic', 'Basic'),
        ('Good', 'Good'),
        ('Very Good', 'Very Good'),
        ('Excellent', 'Excellent'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='languages', db_index=True)
    language = models.CharField(max_length=50)
    proficiency_level = models.CharField(max_length=20, choices=PROFICIENCY_LEVELS)

    def save(self, *args, **kwargs):
        if self.id:
            self.modified_at = datetime.datetime.now(pytz.utc)
        super(Language, self).save(*args, **kwargs)

    class Meta:
        db_table = 'languages'
        unique_together = ['user', 'language']

    def __str__(self):
        return f"{self.language} ({self.proficiency_level}) - {self.user.username}"


class Skill(CreatedByMixin, UpdatedByMixin, IsActiveMixin):
    """
    Technical skills (1:Many with User)
    Normalized from comma-separated skills field
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='skills', db_index=True)
    skill_name = models.CharField(max_length=100)

    def save(self, *args, **kwargs):
        if self.id:
            self.modified_at = datetime.datetime.now(pytz.utc)
        super(Skill, self).save(*args, **kwargs)

    class Meta:
        db_table = 'skills'
        unique_together = ['user', 'skill_name']

    def __str__(self):
        return f"{self.skill_name} - {self.user.username}"


class WorkPreference(CreatedByMixin, UpdatedByMixin, IsActiveMixin):
    """
    Work preferences (1:1 with User)
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='work_preference', db_index=True)
    has_seasonal_experience = models.BooleanField(default=False)
    can_work_weekends = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.id:
            self.modified_at = datetime.datetime.now(pytz.utc)
        super(WorkPreference, self).save(*args, **kwargs)

    class Meta:
        db_table = 'work_preferences'

    def __str__(self):
        return f"Work preferences - {self.user.username}"


class BankInfo(CreatedByMixin, UpdatedByMixin, IsActiveMixin):
    """
    Banking information (1:1 with User)
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='bank_info', db_index=True)
    bank_name = models.CharField(max_length=100, blank=True)
    account_holder_name = models.CharField(max_length=100, blank=True)
    iban = models.CharField(
        max_length=34,
        validators=[RegexValidator(r'^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$', 
                                 'Enter a valid IBAN.')],
        blank=True
    )

    def save(self, *args, **kwargs):
        if self.id:
            self.modified_at = datetime.datetime.now(pytz.utc)
        super(BankInfo, self).save(*args, **kwargs)

    class Meta:
        db_table = 'bank_info'

    def __str__(self):
        return f"Bank info - {self.user.username}"


class Attachment(CreatedByMixin, UpdatedByMixin, IsActiveMixin):
    """
    CV/Resume attachments (1:Many with User)
    Main document attachments - primarily for CV/Resume
    """
    ATTACHMENT_TYPES = [
        ('cv_resume', 'CV/Resume'),
        ('cover_letter', 'Cover Letter'),
        ('portfolio', 'Portfolio'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attachments', db_index=True)
    attachment_type = models.CharField(max_length=20, choices=ATTACHMENT_TYPES, default='cv_resume')
    file = models.FileField(upload_to='documents/%Y/%m/%d/')
    original_filename = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField()  # in bytes
    content_type = models.CharField(max_length=100)

    def save(self, *args, **kwargs):
        if self.id:
            self.modified_at = datetime.datetime.now(pytz.utc)
        super(Attachment, self).save(*args, **kwargs)

    class Meta:
        db_table = 'attachments'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_attachment_type_display()} - {self.user.username}"



class ProfileCompletion(CreatedByMixin, UpdatedByMixin, IsActiveMixin):
    """
    Track profile completion status (1:1 with User)
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile_completion', db_index=True)
    personal_info_complete = models.BooleanField(default=False)
    education_complete = models.BooleanField(default=False)
    experience_complete = models.BooleanField(default=False)
    skills_complete = models.BooleanField(default=False)
    bank_info_complete = models.BooleanField(default=False)
    attachments_complete = models.BooleanField(default=False)
    overall_completion_percentage = models.PositiveSmallIntegerField(default=0)
    is_submitted = models.BooleanField(default=False)
    submitted_at = models.DateTimeField(null=True, blank=True)

    def calculate_completion_percentage(self):
        """Calculate overall completion percentage"""
        fields = [
            self.personal_info_complete,
            self.education_complete,
            self.experience_complete,
            self.skills_complete,
            self.bank_info_complete,
            self.attachments_complete,
        ]
        completed = sum(fields)
        total = len(fields)
        return int((completed / total) * 100)

    def save(self, *args, **kwargs):
        if self.id:
            self.modified_at = datetime.datetime.now(pytz.utc)
        self.overall_completion_percentage = self.calculate_completion_percentage()
        super(ProfileCompletion, self).save(*args, **kwargs)

    def __str__(self):
        return f"Profile completion ({self.overall_completion_percentage}%) - {self.user.username}"