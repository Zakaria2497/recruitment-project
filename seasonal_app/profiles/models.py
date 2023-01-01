"""
Profile models for applicant profile data
"""
import datetime
import pytz
import os
from django.db import models
from django.core.validators import RegexValidator
from users.mixins import IsActiveMixin, CreatedByMixin, UpdatedByMixin


def attachment_upload_path(instance, filename):
    """Generate upload path for attachments"""
    # Format: attachments/{year}/{month}/{day}/{filename}
    date_path = datetime.date.today().strftime('%Y/%m/%d')
    return os.path.join('attachments', date_path, filename)


class PersonalInfo(CreatedByMixin, UpdatedByMixin, IsActiveMixin):
    """
    Personal information linked to User (1:1)
    """
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]

    user = models.OneToOneField(
        'users.User',
        on_delete=models.CASCADE,
        related_name='personal_info',
        db_index=True
    )
    first_name = models.CharField(max_length=128)
    father_name = models.CharField(max_length=128)
    grand_name = models.CharField(max_length=128)
    family_name = models.CharField(max_length=128)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)
    birthdate = models.DateField(null=True, blank=True)
    nationality = models.CharField(max_length=100, blank=True)
    id_number = models.CharField(max_length=50, unique=True, db_index=True)  # ID/Residency number
    city = models.CharField(max_length=100, blank=True)
    address = models.TextField(blank=True)
    photo = models.FileField(upload_to='photos/%Y/%m/%d/', null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.id:
            self.modified_at = datetime.datetime.now(pytz.utc)
        super(PersonalInfo, self).save(*args, **kwargs)

    class Meta:
        db_table = 'personal_info'
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['id_number']),
        ]
        verbose_name_plural = 'Personal Info'

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

    user = models.OneToOneField(
        'users.User',
        on_delete=models.CASCADE,
        related_name='education',
        db_index=True
    )
    last_degree = models.CharField(max_length=20, choices=DEGREE_CHOICES, blank=True)
    major = models.CharField(max_length=100, blank=True)
    school = models.CharField(max_length=100, blank=True)
    grad_year = models.PositiveIntegerField(null=True, blank=True)
    certificates = models.FileField(upload_to='education_certificates/%Y/%m/%d/', null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.id:
            self.modified_at = datetime.datetime.now(pytz.utc)
        super(Education, self).save(*args, **kwargs)

    class Meta:
        db_table = 'education'
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['last_degree']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.last_degree}"


class Course(CreatedByMixin, UpdatedByMixin, IsActiveMixin):
    """
    Courses/Certifications (1:Many with User)
    """
    user = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='courses',
        db_index=True
    )
    title = models.CharField(max_length=200)
    provider = models.CharField(max_length=100, blank=True)
    completion_date = models.DateField(null=True, blank=True)
    certificate = models.FileField(upload_to='course_certificates/%Y/%m/%d/', null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.id:
            self.modified_at = datetime.datetime.now(pytz.utc)
        super(Course, self).save(*args, **kwargs)

    class Meta:
        db_table = 'courses'
        ordering = ['-completion_date']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['completion_date']),
        ]

    def __str__(self):
        return f"{self.title} - {self.user.username}"


class Experience(CreatedByMixin, UpdatedByMixin, IsActiveMixin):
    """
    Work experience (1:Many with User)
    """
    user = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='experiences',
        db_index=True
    )
    job_title = models.CharField(max_length=100)
    employer = models.CharField(max_length=100)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    tasks = models.TextField(blank=True)
    is_current = models.BooleanField(default=False)
    certificate = models.FileField(upload_to='experience_certificates/%Y/%m/%d/', null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.id:
            self.modified_at = datetime.datetime.now(pytz.utc)
        super(Experience, self).save(*args, **kwargs)

    class Meta:
        db_table = 'experiences'
        ordering = ['-start_date']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['start_date']),
            models.Index(fields=['is_current']),
        ]

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

    user = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='languages',
        db_index=True
    )
    language = models.CharField(max_length=50)
    proficiency_level = models.CharField(max_length=20, choices=PROFICIENCY_LEVELS)

    def save(self, *args, **kwargs):
        if self.id:
            self.modified_at = datetime.datetime.now(pytz.utc)
        super(Language, self).save(*args, **kwargs)

    class Meta:
        db_table = 'languages'
        unique_together = ['user', 'language']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['language']),
        ]

    def __str__(self):
        return f"{self.language} ({self.proficiency_level}) - {self.user.username}"


class Skill(CreatedByMixin, UpdatedByMixin, IsActiveMixin):
    """
    Technical skills (1:Many with User)
    Normalized from comma-separated skills field
    """
    user = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='skills',
        db_index=True
    )
    skill_name = models.CharField(max_length=100)

    def save(self, *args, **kwargs):
        if self.id:
            self.modified_at = datetime.datetime.now(pytz.utc)
        super(Skill, self).save(*args, **kwargs)

    class Meta:
        db_table = 'skills'
        unique_together = ['user', 'skill_name']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['skill_name']),
        ]

    def __str__(self):
        return f"{self.skill_name} - {self.user.username}"


class WorkPreference(CreatedByMixin, UpdatedByMixin, IsActiveMixin):
    """
    Work preferences (1:1 with User)
    """
    user = models.OneToOneField(
        'users.User',
        on_delete=models.CASCADE,
        related_name='work_preference',
        db_index=True
    )
    has_seasonal_experience = models.BooleanField(default=False)
    can_work_weekends = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.id:
            self.modified_at = datetime.datetime.now(pytz.utc)
        super(WorkPreference, self).save(*args, **kwargs)

    class Meta:
        db_table = 'work_preferences'
        indexes = [
            models.Index(fields=['user']),
        ]

    def __str__(self):
        return f"Work preferences - {self.user.username}"


class BankInfo(CreatedByMixin, UpdatedByMixin, IsActiveMixin):
    """
    Banking information (1:1 with User)
    """
    user = models.OneToOneField(
        'users.User',
        on_delete=models.CASCADE,
        related_name='bank_info',
        db_index=True
    )
    bank_name = models.CharField(max_length=100, blank=True)
    account_holder_name = models.CharField(max_length=100, blank=True)
    iban = models.CharField(
        max_length=50,
        blank=True,
        help_text='International Bank Account Number'
    )

    def save(self, *args, **kwargs):
        if self.id:
            self.modified_at = datetime.datetime.now(pytz.utc)
        super(BankInfo, self).save(*args, **kwargs)

    class Meta:
        db_table = 'bank_info'
        indexes = [
            models.Index(fields=['user']),
        ]

    def __str__(self):
        return f"Bank info - {self.user.username}"


# class Attachment(CreatedByMixin, UpdatedByMixin, IsActiveMixin):
#     """
#     File attachments (1:Many with User)
#     """
#     ATTACHMENT_TYPES = [
#         ('photo', 'Profile Photo'),
#         ('id_copy', 'ID Copy'),
#         ('certificate', 'Certificate'),
#     ]

#     user = models.ForeignKey(
#         'users.User',
#         on_delete=models.CASCADE,
#         related_name='attachments',
#         db_index=True
#     )
#     attachment_type = models.CharField(max_length=20, choices=ATTACHMENT_TYPES)
#     file = models.FileField(upload_to=attachment_upload_path)
#     original_filename = models.CharField(max_length=255)
#     file_size = models.PositiveIntegerField()  # in bytes
#     content_type = models.CharField(max_length=100)

#     def save(self, *args, **kwargs):
#         if self.id:
#             self.modified_at = datetime.datetime.now(pytz.utc)
#         super(Attachment, self).save(*args, **kwargs)

#     class Meta:
#         db_table = 'attachments'
#         ordering = ['-created_at']
#         indexes = [
#             models.Index(fields=['user']),
#             models.Index(fields=['attachment_type']),
#             models.Index(fields=['created_at']),
#         ]

#     def __str__(self):
#         return f"{self.attachment_type} - {self.user.username}"


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
    
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='attachments', db_index=True)
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
    user = models.OneToOneField(
        'users.User',
        on_delete=models.CASCADE,
        related_name='profile_completion',
        db_index=True
    )
    personal_info_complete = models.BooleanField(default=False)
    education_complete = models.BooleanField(default=False)
    experience_complete = models.BooleanField(default=False)
    skills_complete = models.BooleanField(default=False)
    bank_info_complete = models.BooleanField(default=False)
    attachments_complete = models.BooleanField(default=False)
    overall_completion_percentage = models.PositiveSmallIntegerField(default=0)
    is_submitted = models.BooleanField(default=False)
    submitted_at = models.DateTimeField(null=True, blank=True)

    def _check_personal_info_complete(self):
        """Check if personal info is complete"""
        try:
            info = self.user.personal_info
            return bool(info.first_name and info.family_name and info.id_number)
        except PersonalInfo.DoesNotExist:
            return False
    
    def _check_education_complete(self):
        """Check if education is complete"""
        try:
            edu = self.user.education
            return bool(edu.last_degree)
        except Education.DoesNotExist:
            return False
    
    def _check_experience_complete(self):
        """Check if at least one experience exists"""
        return self.user.experiences.filter(is_active=True).exists()
    
    def _check_skills_complete(self):
        """Check if skills are complete (at least one skill or language)"""
        has_skills = self.user.skills.filter(is_active=True).exists()
        has_languages = self.user.languages.filter(is_active=True).exists()
        return has_skills or has_languages
    
    def _check_bank_info_complete(self):
        """Check if bank info is complete"""
        try:
            bank = self.user.bank_info
            return bool(bank.iban)
        except BankInfo.DoesNotExist:
            return False
    
    def _check_attachments_complete(self):
        """Check if at least one attachment exists"""
        return self.user.attachments.filter(is_active=True).exists()
    
    def _update_completion_status(self):
        """Update all completion flags based on actual data"""
        self.personal_info_complete = self._check_personal_info_complete()
        self.education_complete = self._check_education_complete()
        self.experience_complete = self._check_experience_complete()
        self.skills_complete = self._check_skills_complete()
        self.bank_info_complete = self._check_bank_info_complete()
        self.attachments_complete = self._check_attachments_complete()
        self.save()
    
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

    class Meta:
        db_table = 'profile_completion'
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['is_submitted']),
            models.Index(fields=['overall_completion_percentage']),
        ]

    def __str__(self):
        return f"Profile completion ({self.overall_completion_percentage}%) - {self.user.username}"


class Organization(CreatedByMixin, UpdatedByMixin, IsActiveMixin):
    """
    Organization model to represent companies/employers
    Users who are approved become members of an organization
    """
    name = models.CharField(max_length=255, unique=True, db_index=True)
    description = models.TextField(blank=True)
    logo = models.FileField(upload_to='organization_logos/%Y/%m/%d/', null=True, blank=True)
    email = models.EmailField(max_length=255, blank=True)
    phone = models.CharField(
        max_length=30,
        validators=[RegexValidator(r'^\+?1?\d{9,15}$', 'Enter a valid phone number.')],
        blank=True
    )
    website = models.URLField(max_length=255, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    registration_number = models.CharField(max_length=100, blank=True, help_text='Company registration number')
    
    def save(self, *args, **kwargs):
        if self.id:
            self.modified_at = datetime.datetime.now(pytz.utc)
        super(Organization, self).save(*args, **kwargs)

    class Meta:
        db_table = 'organizations'
        ordering = ['name']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return self.name


class OrganizationMembership(CreatedByMixin, UpdatedByMixin, IsActiveMixin):
    """
    Membership model linking users to organizations with roles
    Users apply for jobs and upon approval become members
    """
    ROLE_CHOICES = [
        ('owner', 'Owner'),
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('hr', 'HR'),
        ('recruiter', 'Recruiter'),
        ('employee', 'Employee'),
        ('contractor', 'Contractor'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('suspended', 'Suspended'),
    ]
    
    user = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='organization_memberships',
        db_index=True
    )
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name='memberships',
        db_index=True
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='employee')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    joined_at = models.DateTimeField(null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_memberships'
    )
    notes = models.TextField(blank=True, help_text='Internal notes about this membership')
    
    def save(self, *args, **kwargs):
        # Auto-set joined_at when status changes to approved
        if self.status == 'approved' and not self.joined_at:
            self.joined_at = datetime.datetime.now(pytz.utc)
            if not self.approved_at:
                self.approved_at = datetime.datetime.now(pytz.utc)
        
        if self.id:
            self.modified_at = datetime.datetime.now(pytz.utc)
        super(OrganizationMembership, self).save(*args, **kwargs)

    class Meta:
        db_table = 'organization_memberships'
        unique_together = ['user', 'organization']
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['organization']),
            models.Index(fields=['role']),
            models.Index(fields=['status']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.organization.name} ({self.role})"
