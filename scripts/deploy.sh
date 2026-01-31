#!/bin/bash

# SME Certification Portal - Deployment Script
# Usage: ./scripts/deploy.sh [command]
# Commands: start, stop, restart, logs, build, migrate

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.docker exists
check_env() {
    if [ ! -f ".env.docker" ]; then
        echo -e "${YELLOW}Warning: .env.docker file not found!${NC}"
        echo "Please create .env.docker from .env.docker.example"
        echo "  cp .env.docker.example .env.docker"
        echo "  # Edit .env.docker with your production values"
        exit 1
    fi
}

# Build containers
build() {
    echo -e "${GREEN}Building Docker containers...${NC}"
    docker-compose --env-file .env.docker build
    echo -e "${GREEN}Build complete!${NC}"
}

# Start services
start() {
    check_env
    echo -e "${GREEN}Starting SME Certification Portal...${NC}"
    docker-compose --env-file .env.docker up -d
    echo -e "${GREEN}Services started!${NC}"
    echo ""
    echo "Frontend: http://localhost:3000"
    echo "Backend:  http://localhost:5001"
    echo "Health:   http://localhost:5001/health"
}

# Stop services
stop() {
    echo -e "${YELLOW}Stopping SME Certification Portal...${NC}"
    docker-compose down
    echo -e "${GREEN}Services stopped!${NC}"
}

# Restart services
restart() {
    stop
    start
}

# View logs
logs() {
    docker-compose logs -f
}

# Run database migrations
migrate() {
    check_env
    echo -e "${GREEN}Running database migrations...${NC}"
    docker-compose --env-file .env.docker exec server npx prisma migrate deploy
    echo -e "${GREEN}Migrations complete!${NC}"
}

# Seed database
seed() {
    check_env
    echo -e "${GREEN}Seeding database...${NC}"
    docker-compose --env-file .env.docker exec server npx prisma db seed
    echo -e "${GREEN}Seed complete!${NC}"
}

# Show status
status() {
    echo -e "${GREEN}Container Status:${NC}"
    docker-compose ps
}

# Main command handler
case "$1" in
    build)
        build
        ;;
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs
        ;;
    migrate)
        migrate
        ;;
    seed)
        seed
        ;;
    status)
        status
        ;;
    *)
        echo "SME Certification Portal - Deployment Script"
        echo ""
        echo "Usage: $0 {build|start|stop|restart|logs|migrate|seed|status}"
        echo ""
        echo "Commands:"
        echo "  build    - Build Docker containers"
        echo "  start    - Start all services"
        echo "  stop     - Stop all services"
        echo "  restart  - Restart all services"
        echo "  logs     - View container logs"
        echo "  migrate  - Run database migrations"
        echo "  seed     - Seed database with initial data"
        echo "  status   - Show container status"
        exit 1
        ;;
esac
