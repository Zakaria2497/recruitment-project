# API Documentation

## Base URL
```
http://localhost:8000/api/
```

## Authentication

All profile endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## Authentication Endpoints

### 1. Send OTP
**POST** `/api/auth/send-otp/`

Send OTP to phone number for verification.

**Request Body:**
```json
{
  "mobile_number": "+971501234567"
}
```

**Response:**
```json
{
  "message": "OTP sent successfully",
  "otp": "123456",  // Remove in production
  "expires_in": 600
}
```

**Rate Limit:** 1 request per 60 seconds per phone number

---

### 2. Verify OTP
**POST** `/api/auth/verify-otp/`

Verify OTP and get JWT tokens.

**Request Body:**
```json
{
  "mobile_number": "+971501234567",
  "otp_code": "123456"
}
```

**Response:**
```json
{
  "message": "OTP verified successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "phone": "+971501234567",
    ...
  },
  "tokens": {
    "refresh": "refresh_token",
    "access": "access_token"
  }
}
```

---

### 3. User Registration
**POST** `/api/auth/register/`

Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "phone": "+971501234567",
  "first_name": "Ahmed",
  "father_name": "Mohammed",
  "grand_name": "Abdullah",
  "family_name": "Al-Rashid",
  "sign_up_source": "organic"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": { ... },
  "tokens": {
    "refresh": "...",
    "access": "..."
  }
}
```

---

### 4. User Login
**POST** `/api/auth/login/`

Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": { ... },
  "tokens": {
    "refresh": "...",
    "access": "..."
  }
}
```

---

### 5. Refresh Token
**POST** `/api/auth/refresh/`

Get new access token using refresh token.

**Request Body:**
```json
{
  "refresh": "refresh_token_here"
}
```

**Response:**
```json
{
  "access": "new_access_token"
}
```

---

### 6. Get Current User
**GET** `/api/auth/users/me/`

Get current authenticated user profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "user@example.com",
  "phone": "+971501234567",
  ...
}
```

---

## Profile Endpoints

All profile endpoints require authentication.

### 1. Personal Information

#### GET Personal Info
**GET** `/api/profile/personal-info/`

Get current user's personal information.

**Response:**
```json
{
  "id": "uuid",
  "first_name": "Ahmed",
  "father_name": "Mohammed",
  "grand_name": "Abdullah",
  "family_name": "Al-Rashid",
  "gender": "Male",   
  "birthdate": "1995-06-15",
  "nationality": "UAE",
  "id_number": "784199512345678",
  "city": "Dubai",
  "address": "Al Barsha, Dubai, UAE",
  "photo": "/media/photos/2024/01/15/photo.jpg",
  ...
}
```

#### POST Personal Info
**POST** `/api/profile/personal-info/`

Create or update personal information (creates one record per user).

**Request Body (multipart/form-data):**
```json
{
  "first_name": "Ahmed",
  "father_name": "Mohammed",
  "grand_name": "Abdullah",
  "family_name": "Al-Rashid",
  "gender": "Male",
  "birthdate": "1995-06-15",
  "nationality": "UAE",
  "id_number": "784199512345678",
  "city": "Dubai",
  "address": "Al Barsha, Dubai, UAE",
  "photo": <file>
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "first_name": "Ahmed",
  "father_name": "Mohammed",
  "grand_name": "Abdullah",
  "family_name": "Al-Rashid",
  "gender": "Male",
  "birthdate": "1995-06-15",
  "nationality": "UAE",
  "id_number": "784199512345678",
  "city": "Dubai",
  "address": "Al Barsha, Dubai, UAE",
  "photo": "/media/photos/2024/01/15/photo.jpg",
  ...
}
```

#### PUT/PATCH Personal Info
**PUT** `/api/profile/personal-info/`  
**PATCH** `/api/profile/personal-info/`

Update existing personal information.

**Request Body (multipart/form-data):**
```json
{
  "first_name": "Ahmed",
  "father_name": "Mohammed",
  "grand_name": "Abdullah",
  "family_name": "Al-Rashid",
  "gender": "Male",
  "birthdate": "1995-06-15",
  "nationality": "UAE",
  "id_number": "784199512345678",
  "city": "Dubai",
  "address": "Al Barsha, Dubai, UAE",
  "photo": <file>
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "first_name": "Ahmed",
  ...
}
```

**File Validation:**
- Max size: 5MB
- Allowed types: .jpg, .jpeg, .png, .gif

**Note:** All methods (GET/POST/PUT/PATCH) work on the same endpoint without requiring an ID. The system automatically resolves to the authenticated user's record.

---

### 2. Education

#### GET Education
**GET** `/api/profile/education/`

Get list of education records for the current user (returns array).

**Response:**
```json
[
  {
    "id": "uuid",
    "last_degree": "Bachelor",
    "major": "Business Administration",
    "school": "American University of Sharjah",
    "grad_year": 2018,
    "certificates": "/media/education_certificates/...",
    ...
  }
]
```

#### POST Education
**POST** `/api/profile/education/`

Create new education record.

**Request Body (multipart/form-data):**
```json
{
  "last_degree": "Bachelor",
  "major": "Business Administration",
  "school": "American University of Sharjah",
  "grad_year": 2018,
  "certificates": <file>
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "last_degree": "Bachelor",
  "major": "Business Administration",
  "school": "American University of Sharjah",
  "grad_year": 2018,
  "certificates": "/media/education_certificates/...",
  ...
}
```

**Degree Options:** High School, Diploma, Bachelor, Master, PhD

#### PUT/PATCH Education
**PUT** `/api/profile/education/{id}/`  
**PATCH** `/api/profile/education/{id}/`

Update existing education record.

**Request Body (multipart/form-data):**
```json
{
  "last_degree": "Master",
  "major": "Business Administration",
  "school": "American University of Sharjah",
  "grad_year": 2020,
  "certificates": <file>
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "last_degree": "Master",
  ...
}
```

#### DELETE Education
**DELETE** `/api/profile/education/{id}/`

Delete an education record.

**Response (204 No Content)**

---

### 3. Courses

#### List Courses
**GET** `/api/profile/courses/`

Get all courses.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Food Safety Certificate",
    "provider": "Dubai Municipality",
    "completion_date": "2023-01-15",
    "certificate": "/media/course_certificates/...",
    ...
  }
]
```

#### Create Course
**POST** `/api/profile/courses/`

Add a new course.

**Request Body:**
```json
{
  "title": "Food Safety Certificate",
  "provider": "Dubai Municipality",
  "completion_date": "2023-01-15",
  "certificate": <file>
}
```

#### Delete Course
**DELETE** `/api/profile/courses/{id}/`

Delete a course.

---

### 4. Experiences

#### List Experiences
**GET** `/api/profile/experiences/`

Get all work experiences.

**Response:**
```json
[
  {
    "id": "uuid",
    "job_title": "Sales Associate",
    "employer": "Mall of the Emirates",
    "start_date": "2022-11-01",
    "end_date": "2023-01-31",
    "tasks": "Assisted customers, handled cash transactions",
    "is_current": false,
    "certificate": "/media/experience_certificates/...",
    ...
  }
]
```

#### Create Experience
**POST** `/api/profile/experiences/`

Add a new experience.

**Request Body:**
```json
{
  "job_title": "Sales Associate",
  "employer": "Mall of the Emirates",
  "start_date": "2022-11-01",
  "end_date": "2023-01-31",
  "tasks": "Assisted customers, handled cash transactions",
  "is_current": false,
  "certificate": <file>
}
```

#### Delete Experience
**DELETE** `/api/profile/experiences/{id}/`

Delete an experience.

---

### 5. Languages

#### List Languages
**GET** `/api/profile/languages/`

Get all languages.

**Response:**
```json
[
  {
    "id": "uuid",
    "language": "Arabic",
    "proficiency_level": "Excellent",
    ...
  }
]
```

#### Create Language
**POST** `/api/profile/languages/`

Add a new language.

**Request Body:**
```json
{
  "language": "Arabic",
  "proficiency_level": "Excellent"
}
```

**Proficiency Levels:** Basic, Good, Very Good, Excellent

#### Delete Language
**DELETE** `/api/profile/languages/{id}/`

Delete a language.

---

### 6. Skills

#### List Skills
**GET** `/api/profile/skills/`

Get all skills.

**Response:**
```json
[
  {
    "id": "uuid",
    "skill_name": "Customer Service",
    ...
  }
]
```

#### Create Skill
**POST** `/api/profile/skills/`

Add a new skill.

**Request Body:**
```json
{
  "skill_name": "Customer Service"
}
```

#### Delete Skill
**DELETE** `/api/profile/skills/{id}/`

Delete a skill.

---

### 7. Bank Information

#### GET Bank Info
**GET** `/api/profile/bank-info/`

Get list of bank information records for the current user (returns array).

**Response:**
```json
[
  {
    "id": "uuid",
    "bank_name": "Emirates NBD",
    "account_holder_name": "Ahmed Mohammed Abdullah Al-Rashid",
    "iban": "AE070331234567890123456",
    ...
  }
]
```

#### POST Bank Info
**POST** `/api/profile/bank-info/`

Create new bank information record.

**Request Body:**
```json
{
  "bank_name": "Emirates NBD",
  "account_holder_name": "Ahmed Mohammed Abdullah Al-Rashid",
  "iban": "AE070331234567890123456"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "bank_name": "Emirates NBD",
  "account_holder_name": "Ahmed Mohammed Abdullah Al-Rashid",
  "iban": "AE070331234567890123456",
  ...
}
```

#### PUT/PATCH Bank Info
**PUT** `/api/profile/bank-info/{id}/`  
**PATCH** `/api/profile/bank-info/{id}/`

Update existing bank information record.

**Request Body:**
```json
{
  "bank_name": "Emirates NBD",
  "account_holder_name": "Ahmed Mohammed Abdullah Al-Rashid",
  "iban": "AE070331234567890123456"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "bank_name": "Emirates NBD",
  ...
}
```

#### DELETE Bank Info
**DELETE** `/api/profile/bank-info/{id}/`

Delete a bank information record.

**Response (204 No Content)**

**IBAN Validation:** Validates IBAN format (15-34 characters)

---

### 8. Attachments

#### List Attachments
**GET** `/api/profile/attachments/`

Get all attachments (CV/Resume, Cover Letter, Portfolio).

**Response:**
```json
[
  {
    "id": "uuid",
    "attachment_type": "cv_resume",
    "file": "/media/documents/.../resume.pdf",
    "original_filename": "resume.pdf",
    "file_size": 245678,
    "content_type": "application/pdf",
    ...
  }
]
```

#### Upload Attachment
**POST** `/api/profile/attachments/`

Upload a new attachment.

**Request Body (multipart/form-data):**
```
attachment_type: cv_resume
file: <file>
```

**Attachment Types:** cv_resume, cover_letter, portfolio

**File Validation:**
- Max size: 10MB
- Allowed types: .pdf, .doc, .docx

#### Delete Attachment
**DELETE** `/api/profile/attachments/{id}/`

Delete an attachment.

---

### 9. Profile Completion

#### GET Completion Status
**GET** `/api/profile/completion/`

Get profile completion status.

**Response:**
```json
{
  "id": "uuid",
  "personal_info_complete": true,
  "education_complete": true,
  "experience_complete": true,
  "skills_complete": true,
  "bank_info_complete": true,
  "attachments_complete": false,
  "overall_completion_percentage": 83,
  "is_submitted": false,
  "submitted_at": null,
  ...
}
```

---

### 10. Submit Profile

#### POST Submit Profile
**POST** `/api/profile/submit/`

Submit profile for review. Requires at least 80% completion.

**Response:**
```json
{
  "message": "Profile submitted successfully",
  "completion": {
    "overall_completion_percentage": 100,
    "is_submitted": true,
    "submitted_at": "2024-01-15T10:30:00Z",
    ...
  }
}
```

**Error Response (if < 80% complete):**
```json
{
  "error": "Profile must be at least 80% complete before submission",
  "completion_percentage": 67
}
```

---

## Organizations & Memberships

### 11. Organizations

#### GET List Organizations
**GET** `/api/profile/organizations/`

List all active organizations.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Tech Corp",
    "description": "Leading technology company",
    "logo": "http://localhost:8000/media/organization_logos/2024/01/15/logo.png",
    "email": "info@techcorp.com",
    "phone": "+971501234567",
    "website": "https://techcorp.com",
    "address": "123 Business St",
    "city": "Dubai",
    "country": "UAE",
    "registration_number": "REG123456",
    "created_at": "2024-01-15T10:30:00Z",
    "modified_at": "2024-01-15T10:30:00Z",
    "is_active": true
  }
]
```

---

#### POST Create Organization
**POST** `/api/profile/organizations/`

Create a new organization.

**Request Body:**
```json
{
  "name": "Tech Corp",
  "description": "Leading technology company",
  "email": "info@techcorp.com",
  "phone": "+971501234567",
  "website": "https://techcorp.com",
  "address": "123 Business St",
  "city": "Dubai",
  "country": "UAE",
  "registration_number": "REG123456"
}
```

**Note:** For logo upload, use `multipart/form-data`

**Response:** Same as GET single organization (201 Created)

---

#### GET Single Organization
**GET** `/api/profile/organizations/{id}/`

Retrieve a specific organization.

**Response:**
```json
{
  "id": 1,
  "name": "Tech Corp",
  "description": "Leading technology company",
  "logo": "http://localhost:8000/media/organization_logos/2024/01/15/logo.png",
  "email": "info@techcorp.com",
  "phone": "+971501234567",
  "website": "https://techcorp.com",
  "address": "123 Business St",
  "city": "Dubai",
  "country": "UAE",
  "registration_number": "REG123456",
  "created_at": "2024-01-15T10:30:00Z",
  "modified_at": "2024-01-15T10:30:00Z",
  "is_active": true
}
```

---

#### PUT/PATCH Update Organization
**PUT/PATCH** `/api/profile/organizations/{id}/`

Update an organization.

**Request Body:** Same as POST (partial for PATCH)

**Response:** Updated organization (200 OK)

---

#### DELETE Delete Organization
**DELETE** `/api/profile/organizations/{id}/`

Soft delete an organization (sets is_active to false).

**Response:** 204 No Content

---

### 12. Organization Memberships

#### GET List My Memberships
**GET** `/api/profile/my-memberships/`

List current user's organization memberships.

**Response:**
```json
[
  {
    "id": 1,
    "user": 123,
    "user_email": "user@example.com",
    "user_username": "user@example.com",
    "organization": 1,
    "organization_name": "Tech Corp",
    "role": "employee",
    "status": "approved",
    "joined_at": "2024-01-15T10:30:00Z",
    "approved_at": "2024-01-15T10:30:00Z",
    "approved_by": 456,
    "approved_by_email": "admin@techcorp.com",
    "notes": "Approved for seasonal work",
    "created_at": "2024-01-15T10:00:00Z",
    "modified_at": "2024-01-15T10:30:00Z",
    "is_active": true
  }
]
```

---

#### POST Apply for Membership
**POST** `/api/profile/memberships/`

Apply to join an organization (creates pending membership).

**Request Body:**
```json
{
  "organization": 1,
  "role": "employee",
  "notes": "I would like to join as a seasonal employee"
}
```

**Role Options:**
- `owner` - Organization Owner
- `admin` - Administrator
- `manager` - Manager
- `hr` - HR Personnel
- `recruiter` - Recruiter
- `employee` - Employee
- `contractor` - Contractor

**Status Options:**
- `pending` - Awaiting approval (default)
- `approved` - Approved by organization
- `rejected` - Rejected by organization
- `suspended` - Suspended membership

**Response:**
```json
{
  "id": 1,
  "user": 123,
  "user_email": "user@example.com",
  "user_username": "user@example.com",
  "organization": 1,
  "organization_name": "Tech Corp",
  "role": "employee",
  "status": "pending",
  "joined_at": null,
  "approved_at": null,
  "approved_by": null,
  "approved_by_email": null,
  "notes": "I would like to join as a seasonal employee",
  "created_at": "2024-01-15T10:00:00Z",
  "modified_at": "2024-01-15T10:00:00Z",
  "is_active": true
}
```

---

#### GET List Memberships
**GET** `/api/profile/memberships/`

List current user's memberships.

**Response:** Array of membership objects

---

#### GET Single Membership
**GET** `/api/profile/memberships/{id}/`

Retrieve a specific membership.

**Response:** Single membership object

---

#### PUT/PATCH Update Membership
**PUT/PATCH** `/api/profile/memberships/{id}/`

Update a membership (user can update their own pending application).

**Request Body:**
```json
{
  "role": "contractor",
  "notes": "Updated application note"
}
```

**Response:** Updated membership object (200 OK)

---

#### POST Approve/Reject Membership
**POST** `/api/profile/memberships/{id}/approve/`

Approve, reject, or suspend a membership (admin/owner only).

**Request Body:**
```json
{
  "status": "approved",
  "notes": "Approved for seasonal work position"
}
```

**Status Options:** `approved`, `rejected`, `suspended`

**Response:**
```json
{
  "message": "Membership approved successfully",
  "membership": {
    "id": 1,
    "user": 123,
    "organization": 1,
    "role": "employee",
    "status": "approved",
    "joined_at": "2024-01-15T10:30:00Z",
    "approved_at": "2024-01-15T10:30:00Z",
    "approved_by": 456,
    "notes": "Approved for seasonal work position",
    ...
  }
}
```

---

#### GET Organization Members
**GET** `/api/profile/organizations/{org_id}/members/`

List all members of a specific organization.

**Response:** Array of membership objects for the organization

---

#### DELETE Delete Membership
**DELETE** `/api/profile/memberships/{id}/`

Remove/cancel a membership.

**Response:** 204 No Content

---

## Dashboard Endpoints (Admin/Owner/HR)

### 13. Organization Applicants Dashboard

#### GET Pending Applicants (Card View)
**GET** `/api/profile/organizations/{org_id}/applicants/`

List pending applicants with their profile data for dashboard card view.

**Use Case:** Dashboard for Admin/Owner/HR to review pending applications

**Response:**
```json
[
  {
    "membership_id": "uuid",
    "user_id": 123,
    "full_name": "Ahmed Mohammed Al-Rashid",
    "email": "ahmed@example.com",
    "phone": "+971501234567",
    "photo": "http://localhost:8000/media/photos/2024/01/15/photo.jpg",
    "age": 28,
    "city": "Dubai",
    "nationality": "UAE",
    "education": "Bachelor in Computer Science",
    "experience_years": 3.5,
    "role": "employee",
    "status": "pending",
    "applied_at": "2024-01-15T10:00:00Z",
    "notes": "Looking for seasonal work",
    "completion_percentage": 95,
    "is_submitted": true
  }
]
```

---

#### GET Approved Members (Card View)
**GET** `/api/profile/organizations/{org_id}/approved-members/`

List approved members with their profile data.

**Use Case:** View active organization members

**Response:** Same format as applicants endpoint, filtered by `status=approved`

---

#### GET All Applications (Card View)
**GET** `/api/profile/organizations/{org_id}/all-applications/`

List all applications (any status) with profile data.

**Query Parameters:**
- `status` (optional) - Filter by status: `pending`, `approved`, `rejected`, `suspended`

**Examples:**
- `/api/profile/organizations/1/all-applications/` - All applications
- `/api/profile/organizations/1/all-applications/?status=pending` - Only pending
- `/api/profile/organizations/1/all-applications/?status=rejected` - Only rejected

**Response:** Same format as applicants endpoint

---

#### GET Applicant Detail
**GET** `/api/profile/applicants/{membership_id}/`

Get detailed profile information for a specific applicant.

**Use Case:** View full applicant profile before approval

**Response:**
```json
{
  "user_id": 123,
  "email": "ahmed@example.com",
  "phone": "+971501234567",
  "first_name": "Ahmed",
  "father_name": "Mohammed",
  "family_name": "Al-Rashid",
  "gender": "Male",
  "birthdate": "1995-06-15",
  "nationality": "UAE",
  "city": "Dubai",
  "photo": "http://localhost:8000/media/photos/2024/01/15/photo.jpg",
  "last_degree": "Bachelor",
  "major": "Computer Science",
  "experience_years": 3.5,
  "completion_percentage": 95,
  "membership_id": "uuid",
  "role": "employee",
  "status": "pending",
  "applied_at": "2024-01-15T10:00:00Z",
  "notes": "Looking for seasonal work"
}
```

---

### Dashboard Card Data Fields

**Card View includes:**
- `membership_id` - Unique membership ID
- `user_id` - User ID
- `full_name` - Full name from personal info
- `email` - Email address
- `phone` - Phone number
- `photo` - Profile photo URL (null if not uploaded)
- `age` - Calculated age from birthdate (null if not provided)
- `city` - City from personal info
- `nationality` - Nationality
- `education` - Education summary (e.g., "Bachelor in Computer Science")
- `experience_years` - Total years of work experience
- `role` - Applied role
- `status` - Application status
- `applied_at` - Application date
- `notes` - Application notes
- `completion_percentage` - Profile completion (0-100)
- `is_submitted` - Whether profile was submitted

---

#### GET Dashboard Statistics
**GET** `/api/profile/organizations/{org_id}/statistics/`

Get statistics for organization dashboard overview.

**Use Case:** Display stats cards at top of dashboard

**Response:**
```json
{
  "pending_count": 12,
  "approved_count": 45,
  "rejected_count": 8,
  "suspended_count": 0,
  "total_applications": 65,
  "recent_applications_count": 5
}
```

**Fields:**
- `pending_count` - Number of pending applications
- `approved_count` - Number of approved members
- `rejected_count` - Number of rejected applications
- `suspended_count` - Number of suspended memberships
- `total_applications` - Total applications (all statuses)
- `recent_applications_count` - Applications in last 7 days

---

### Dashboard Workflow

1. **Load Dashboard Statistics:**
   ```
   GET /api/profile/organizations/1/statistics/
   ```

2. **View Pending Applicants:**
   ```
   GET /api/profile/organizations/1/applicants/
   ```

3. **Click Card to View Details:**
   ```
   GET /api/profile/applicants/{membership_id}/
   ```

4. **Approve/Reject Application:**
   ```
   POST /api/profile/memberships/{membership_id}/approve/
   {
     "status": "approved",
     "notes": "Approved for seasonal position"
   }
   ```

5. **View Approved Members:**
   ```
   GET /api/profile/organizations/1/approved-members/
   ```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Error message",
  "field_name": ["Field-specific error"]
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 429 Too Many Requests
```json
{
  "error": "Please wait before requesting a new OTP"
}
```

---

## Notes

- All file uploads use multipart/form-data
- All timestamps are in ISO 8601 format (UTC)
- UUIDs are used for all primary keys
- Rate limiting is applied to OTP endpoints
- Profile completion is automatically calculated based on actual data

