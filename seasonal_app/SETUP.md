# Setup Instructions

## Quick Start

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your database credentials and settings
   ```

3. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE seasonal_app_db;
   ```

4. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run development server:**
   ```bash
   python manage.py runserver
   ```

## Project Structure

### Users App (`users/`)
- **User** model: Custom user with UUID primary key, email/phone authentication
- **EmailAddress** model: Multiple emails per user with verification

### Profiles App (`profiles/`)
- **PersonalInfo**: Personal information (1:1 with User)
- **Education**: Educational background (1:1 with User)
- **Course**: Courses/certifications (1:Many with User)
- **Experience**: Work experience (1:Many with User)
- **Language**: Language skills (1:Many with User)
- **Skill**: Technical skills (1:Many with User)
- **WorkPreference**: Work preferences (1:1 with User)
- **BankInfo**: Banking information (1:1 with User)
- **Attachment**: File uploads (1:Many with User)
- **ProfileCompletion**: Profile completion tracking (1:1 with User)

### Applications App (`applications/`)
- Reserved for future job application workflow

## Key Features

✅ UUID primary keys for all models  
✅ Created/Updated tracking mixins  
✅ Proper database indexes  
✅ File upload paths configured  
✅ Django REST Framework with JWT  
✅ CORS configured  
✅ PostgreSQL database  
✅ Environment variable configuration  

## API Endpoints

- JWT Token: `POST /api/auth/token/`
- JWT Refresh: `POST /api/auth/token/refresh/`
- Admin: `http://localhost:8000/admin/`

## Models Summary

All models use:
- `IsActiveMixin`: UUID primary key + is_active flag
- `CreatedByMixin`: created_by, created_at fields
- `UpdatedByMixin`: modified_by, modified_at fields
- Proper `related_name` attributes
- Database indexes on foreign keys and commonly queried fields
- Custom `db_table` names matching original schema

