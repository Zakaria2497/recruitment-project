# Docker Setup Guide

This project uses Docker Compose to run both the Django backend and Vite frontend together.

## Prerequisites

- Docker (version 20.10+)
- Docker Compose (version 2.0+)

## Quick Start

1. **Build and start all services:**

   ```bash
   docker-compose up --build
   ```

2. **Access the applications:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - Django Admin: http://localhost:8000/admin

## Services

The Docker Compose setup includes:

- **db**: PostgreSQL 15 database
- **backend**: Django REST API (port 8000)
- **frontend**: Vite React app (port 5173)

## Useful Commands

### Start services in detached mode:

```bash
docker-compose up -d
```

### Stop all services:

```bash
docker-compose down
```

### Stop and remove volumes (including database):

```bash
docker-compose down -v
```

### View logs:

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Rebuild specific service:

```bash
docker-compose up --build backend
docker-compose up --build frontend
```

### Run Django management commands:

```bash
# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Make migrations
docker-compose exec backend python manage.py makemigrations

# Apply migrations
docker-compose exec backend python manage.py migrate

# Collect static files
docker-compose exec backend python manage.py collectstatic
```

### Access container shell:

```bash
# Backend
docker-compose exec backend bash

# Frontend
docker-compose exec frontend sh

# Database
docker-compose exec db psql -U seasonal_user -d seasonal_app_db
```

### Install new dependencies:

```bash
# Backend (Python)
docker-compose exec backend pip install package-name
docker-compose exec backend pip freeze > requirements.txt

# Frontend (Node)
docker-compose exec frontend pnpm add package-name
```

## Environment Variables

The default configuration uses these environment variables (defined in docker-compose.yml):

### Backend:

- `SECRET_KEY`: Django secret key
- `DEBUG`: Debug mode (True/False)
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `DB_HOST`: Database host (service name)
- `DB_PORT`: Database port

### Frontend:

- `VITE_API_URL`: Backend API URL

**Note:** For production, create a `.env` file and update these values accordingly.

## Troubleshooting

### Port already in use:

If ports 5173, 8000, or 5432 are already in use, modify the port mappings in `docker-compose.yml`:

```yaml
ports:
  - "NEW_PORT:CONTAINER_PORT"
```

### Database connection issues:

Ensure the database service is healthy before the backend starts. The compose file includes health checks.

### Frontend not accessible:

Make sure the Vite dev server is running with `--host 0.0.0.0` to bind to all interfaces.

### Changes not reflecting:

The volumes are mounted, so changes should reflect automatically. If not, try rebuilding:

```bash
docker-compose up --build
```

## Production Deployment

For production:

1. Set `DEBUG=False` in backend environment
2. Use strong `SECRET_KEY` and database passwords
3. Configure proper `ALLOWED_HOSTS`
4. Use environment variables from `.env` file
5. Consider using a reverse proxy (nginx)
6. Build frontend for production:
   ```dockerfile
   # Modify frontend Dockerfile
   RUN pnpm build
   CMD ["pnpm", "preview"]
   ```

## Data Persistence

PostgreSQL data is persisted in a Docker volume named `postgres_data`. To backup:

```bash
docker-compose exec db pg_dump -U seasonal_user seasonal_app_db > backup.sql
```

To restore:

```bash
docker-compose exec -T db psql -U seasonal_user seasonal_app_db < backup.sql
```
