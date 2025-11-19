# Seasonal Hiring Platform - Recruitment App

A Django-based recruitment platform for seasonal hiring with complete user profile management.

## Project Structure

```
seasonal_app/
├── users/          # Authentication and user management
├── profiles/       # Applicant profile data
├── applications/   # Job applications workflow
└── seasonal_app/   # Project configuration
```

## Features

- **User Management**: Custom User model with UUID primary keys, email/phone authentication
- **Profile Management**: Complete applicant profiles with personal info, education, experience, skills, languages, and bank information
- **File Attachments**: Support for profile photos, ID copies, and certificates
- **Profile Completion Tracking**: Automated completion percentage calculation
- **REST API**: Django REST Framework with JWT authentication
- **CORS Support**: Configured for frontend integration

## Technology Stack

- Django 4.2+
- Django REST Framework
- Simple JWT for authentication
- PostgreSQL database
- Django CORS Headers

## Installation

1. **Clone the repository and navigate to the project directory**

2. **Create a virtual environment** (recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   - Copy `env.example` to `.env`
   - Update the values in `.env` file with your configuration

5. **Set up PostgreSQL database**:
   - Create a PostgreSQL database
   - Update database credentials in `.env` file

6. **Run migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Create a superuser**:
   ```bash
   python manage.py createsuperuser
   ```

8. **Run the development server**:
   ```bash
   python manage.py runserver
   ```

## Apps Overview

### Users App

- **User**: Custom user model extending AbstractUser with UUID primary key
- **EmailAddress**: Multiple email addresses per user with verification status

### Profiles App

- **PersonalInfo**: Personal information (name, gender, birthdate, nationality, ID number)
- **Education**: Educational background (degree, major, school, graduation year)
- **Course**: Courses and certifications (1:Many relationship)
- **Experience**: Work experience history (1:Many relationship)
- **Language**: Language skills with proficiency levels (1:Many relationship)
- **Skill**: Technical skills (1:Many relationship)
- **WorkPreference**: Work preferences (weekends, seasonal experience)
- **BankInfo**: Banking information for payments
- **Attachment**: File uploads (photos, ID copies, certificates)
- **ProfileCompletion**: Tracks profile completion status and percentage

### Applications App

- Reserved for future job application workflow implementation

## API Endpoints

- JWT Token endpoints: `/api/auth/token/`, `/api/auth/token/refresh/`

## Database Models

All models use:
- UUID primary keys (via IsActiveMixin)
- Created/Updated tracking mixins
- Proper database indexes
- Related names for reverse relationships

## File Uploads

Attachments are stored in `media/attachments/{year}/{month}/{day}/` directory structure.

## Environment Variables

See `env.example` for all available environment variables.

## Development

The project is configured with:
- Django REST Framework for API development
- JWT authentication
- CORS enabled for localhost development
- PostgreSQL database
- Media file serving in development mode

## License

This project is part of a seasonal hiring platform.

