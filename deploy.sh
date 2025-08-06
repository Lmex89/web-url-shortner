#!/bin/bash

# ============================================
# URL Shortener Docker Deployment Script
# ============================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT="production"
API_URL=""
PORT="3010"
COMPOSE_FILE="docker-compose.prod.yml"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -a, --api-url URL     Set the API URL (required)"
    echo "  -p, --port PORT       Set the port (default: 80)"
    echo "  -e, --env ENV         Set environment (dev|prod, default: prod)"
    echo "  -d, --detach          Run in detached mode"
    echo "  -h, --help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 -a http://192.168.68.53:9000"
    echo "  $0 -a http://api.example.com:9000 -p 3000 -d"
    echo "  $0 -a http://localhost:9000 -e dev"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -a|--api-url)
            API_URL="$2"
            shift 2
            ;;
        -p|--port)
            PORT="$2"
            shift 2
            ;;
        -e|--env)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -d|--detach)
            DETACH="-d"
            shift
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            print_error "Unknown option $1"
            show_usage
            exit 1
            ;;
    esac
done

# Validate required parameters
if [ -z "$API_URL" ]; then
    print_error "API URL is required. Use -a or --api-url to specify it."
    show_usage
    exit 1
fi

# Set compose file based on environment
if [ "$ENVIRONMENT" = "dev" ]; then
    COMPOSE_FILE="docker-compose.yml"
    PORT="3010"
fi

print_status "Starting URL Shortener deployment..."
print_status "Environment: $ENVIRONMENT"
print_status "API URL: $API_URL"
print_status "Port: $PORT"
print_status "Compose file: $COMPOSE_FILE"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "docker-compose is not installed. Please install it and try again."
    exit 1
fi

# Check if compose file exists
if [ ! -f "$COMPOSE_FILE" ]; then
    print_error "Compose file $COMPOSE_FILE not found."
    exit 1
fi

# Export environment variables
export API_URL="$API_URL"
export HOST_PORT="$PORT"

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose -f "$COMPOSE_FILE" down 2>/dev/null || true

# Remove old images (optional)
read -p "Do you want to remove old images to force rebuild? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Removing old images..."
    docker-compose -f "$COMPOSE_FILE" down --rmi all 2>/dev/null || true
fi

# Build and start containers
print_status "Building and starting containers..."
if [ "$ENVIRONMENT" = "dev" ]; then
    # Development mode
    docker-compose -f "$COMPOSE_FILE" up --build $DETACH
else
    # Production mode
    docker-compose -f "$COMPOSE_FILE" up --build $DETACH
fi

# Wait a moment for containers to start
if [ -n "$DETACH" ]; then
    sleep 5
    
    # Check if container is running
    if docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
        print_success "Deployment successful!"
        print_success "Application is running at: http://localhost:$PORT"
        
        # Show container status
        print_status "Container status:"
        docker-compose -f "$COMPOSE_FILE" ps
        
        # Show logs command
        print_status "To view logs, run:"
        echo "  docker-compose -f $COMPOSE_FILE logs -f"
        
        # Show stop command
        print_status "To stop the application, run:"
        echo "  docker-compose -f $COMPOSE_FILE down"
        
    else
        print_error "Deployment failed. Check logs with:"
        echo "  docker-compose -f $COMPOSE_FILE logs"
        exit 1
    fi
else
    print_success "Application started in foreground mode."
    print_status "Press Ctrl+C to stop the application."
fi 