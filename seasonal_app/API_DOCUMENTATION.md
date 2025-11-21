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

#### PUT/PATCH Personal Info
**PUT** `/api/profile/personal-info/`  
**PATCH** `/api/profile/personal-info/`

Update personal information.

**Request Body:**
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

**File Validation:**
- Max size: 5MB
- Allowed types: .jpg, .jpeg, .png, .gif

---

### 2. Education

#### GET Education
**GET** `/api/profile/education/`

Get education information.

**Response:**
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

#### PUT/PATCH Education
**PUT** `/api/profile/education/`  
**PATCH** `/api/profile/education/`

Update education information.

**Request Body:**
```json
{
  "last_degree": "Bachelor",
  "major": "Business Administration",
  "school": "American University of Sharjah",
  "grad_year": 2018,
  "certificates": <file>
}
```

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

Get bank information.

**Response:**
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
**PUT** `/api/profile/bank-info/`  
**PATCH** `/api/profile/bank-info/`

Update bank information.

**Request Body:**
```json
{
  "bank_name": "Emirates NBD",
  "account_holder_name": "Ahmed Mohammed Abdullah Al-Rashid",
  "iban": "AE070331234567890123456"
}
```

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

