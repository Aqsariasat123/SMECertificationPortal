# SME Certification Portal - Deployment Guide

## Overview

This guide covers deploying the SME Certification Portal using Docker.

## Prerequisites

- Docker & Docker Compose installed
- Domain name configured (for production)
- SSL certificate (recommended for production)

## Quick Start (Development)

```bash
# Clone the repository
git clone <repository-url>
cd SMECertificationPortal

# Copy environment files
cp .env.docker.example .env.docker

# Edit .env.docker with your values
# Important: Change JWT_SECRET and DB_PASSWORD!

# Start all services
./scripts/deploy.sh start
```

## Production Deployment

### 1. Configure Environment

```bash
# Copy the example file
cp .env.docker.example .env.docker

# Edit with production values
nano .env.docker
```

**Required environment variables:**

| Variable | Description |
|----------|-------------|
| `DB_USER` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password (use strong password!) |
| `DB_NAME` | Database name |
| `JWT_SECRET` | Secret key for JWT tokens (min 32 chars) |
| `SMTP_HOST` | Email SMTP host |
| `SMTP_PORT` | Email SMTP port |
| `SMTP_USER` | Email SMTP username |
| `SMTP_PASS` | Email SMTP password |
| `EMAIL_FROM` | From email address |
| `FRONTEND_URL` | Your frontend domain (e.g., https://app.example.com) |
| `NEXT_PUBLIC_API_URL` | Your API URL (e.g., https://api.example.com/api) |

### 2. Build and Start

```bash
# Build containers
./scripts/deploy.sh build

# Start services
./scripts/deploy.sh start

# Run database migrations
./scripts/deploy.sh migrate

# (Optional) Seed with initial data
./scripts/deploy.sh seed
```

### 3. Verify Deployment

```bash
# Check status
./scripts/deploy.sh status

# Check health
curl http://localhost:5001/health

# View logs
./scripts/deploy.sh logs
```

## Available Commands

| Command | Description |
|---------|-------------|
| `./scripts/deploy.sh build` | Build Docker containers |
| `./scripts/deploy.sh start` | Start all services |
| `./scripts/deploy.sh stop` | Stop all services |
| `./scripts/deploy.sh restart` | Restart all services |
| `./scripts/deploy.sh logs` | View container logs |
| `./scripts/deploy.sh migrate` | Run database migrations |
| `./scripts/deploy.sh seed` | Seed database |
| `./scripts/deploy.sh status` | Show container status |

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     Load Balancer                         │
│                   (nginx/traefik)                        │
└─────────────────────┬────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
┌───────────────┐           ┌───────────────┐
│    Client     │           │    Server     │
│  (Next.js)    │◄─────────►│  (Express)    │
│  Port: 3000   │           │  Port: 5001   │
└───────────────┘           └───────┬───────┘
                                    │
                                    ▼
                            ┌───────────────┐
                            │  PostgreSQL   │
                            │  Port: 5432   │
                            └───────────────┘
```

## Ports

| Service | Port | Description |
|---------|------|-------------|
| Client | 3000 | Next.js frontend |
| Server | 5001 | Express API |
| Database | 5432 | PostgreSQL |

## SSL/HTTPS Setup

For production, use a reverse proxy (nginx, traefik, caddy) with SSL:

### Using Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 443 ssl;
    server_name api.your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # API
    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Backup & Restore

### Backup Database

```bash
docker-compose exec db pg_dump -U sme_user sme_certification_db > backup.sql
```

### Restore Database

```bash
cat backup.sql | docker-compose exec -T db psql -U sme_user sme_certification_db
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs server
docker-compose logs client
docker-compose logs db
```

### Database connection issues

```bash
# Verify database is running
docker-compose exec db psql -U sme_user -d sme_certification_db -c "SELECT 1"
```

### Clear and rebuild

```bash
./scripts/deploy.sh stop
docker-compose down -v  # Warning: removes data volumes
./scripts/deploy.sh build
./scripts/deploy.sh start
```

## Security Checklist

- [ ] Changed default JWT_SECRET
- [ ] Changed default DB_PASSWORD
- [ ] SSL/HTTPS enabled
- [ ] Firewall configured (only expose 80/443)
- [ ] Regular backups configured
- [ ] Monitoring set up
