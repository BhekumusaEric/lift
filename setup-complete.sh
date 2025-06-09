#!/bin/bash

# ==============================================
# LiftLink Complete Platform Setup Script
# ==============================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Emojis
ROCKET="🚀"
CHECK="✅"
CROSS="❌"
WARNING="⚠️"
INFO="ℹ️"
GEAR="⚙️"
PACKAGE="📦"
DATABASE="🗄️"
DOCKER="🐳"

echo -e "${BLUE}${ROCKET} Welcome to LiftLink Complete Platform Setup${NC}"
echo -e "${BLUE}===============================================${NC}"
echo ""

# Function to print colored output
print_status() {
    echo -e "${GREEN}${CHECK} $1${NC}"
}

print_error() {
    echo -e "${RED}${CROSS} $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}${WARNING} $1${NC}"
}

print_info() {
    echo -e "${CYAN}${INFO} $1${NC}"
}

print_step() {
    echo -e "${PURPLE}${GEAR} $1${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Node.js version
check_node_version() {
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2)
        REQUIRED_VERSION="18.0.0"
        
        if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
            print_status "Node.js version $NODE_VERSION is compatible"
            return 0
        else
            print_error "Node.js version $NODE_VERSION is too old. Required: $REQUIRED_VERSION+"
            return 1
        fi
    else
        print_error "Node.js is not installed"
        return 1
    fi
}

# Function to install dependencies
install_dependencies() {
    print_step "Installing root dependencies..."
    npm install
    
    print_step "Installing frontend dependencies..."
    cd liftlink-frontend && npm install && cd ..
    
    print_step "Installing backend dependencies..."
    cd liftlink-backend && npm install && cd ..
    
    # Create other service directories and basic files
    services=("liftlink-admin" "liftlink-realtime" "liftlink-payments" "liftlink-geolocation" "liftlink-notifications")
    
    for service in "${services[@]}"; do
        if [ ! -d "$service" ]; then
            print_step "Creating $service directory..."
            mkdir -p "$service/src"
        fi
        
        if [ ! -f "$service/package.json" ]; then
            print_step "Creating $service package.json..."
            cat > "$service/package.json" << EOF
{
  "name": "$service",
  "version": "1.0.0",
  "description": "LiftLink $service service",
  "main": "dist/index.js",
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "typescript": "^5.3.3"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.4",
    "nodemon": "^3.0.2",
    "ts-node": "^10.9.1"
  }
}
EOF
        fi
        
        if [ ! -f "$service/src/index.ts" ]; then
            print_step "Creating $service entry point..."
            cat > "$service/src/index.ts" << EOF
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: '$service',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(\`🚀 $service running on port \${PORT}\`);
});
EOF
        fi
        
        print_step "Installing $service dependencies..."
        cd "$service" && npm install && cd ..
    done
}

# Function to setup environment variables
setup_environment() {
    print_step "Setting up environment variables..."
    
    if [ ! -f ".env" ]; then
        cp .env.example .env
        print_status "Created .env file from template"
        print_warning "Please update .env file with your actual configuration values"
    else
        print_info ".env file already exists"
    fi
}

# Function to create necessary directories
create_directories() {
    print_step "Creating project directories..."
    
    directories=(
        "logs"
        "uploads"
        "database/migrations"
        "database/seeds"
        "docs/api"
        "docs/architecture"
        "testing/unit"
        "testing/integration"
        "testing/e2e"
        "deployment/docker"
        "deployment/kubernetes"
        "tools/scripts"
    )
    
    for dir in "${directories[@]}"; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            print_status "Created directory: $dir"
        fi
    done
}

# Function to setup database
setup_database() {
    print_step "Setting up database..."
    
    if command_exists docker && command_exists docker-compose; then
        print_info "Starting PostgreSQL and Redis with Docker..."
        docker-compose up -d postgres redis
        
        # Wait for database to be ready
        print_info "Waiting for database to be ready..."
        sleep 10
        
        # Run database migrations
        print_step "Running database migrations..."
        cd liftlink-backend
        npx prisma generate
        npx prisma migrate dev --name init
        cd ..
        
        print_status "Database setup completed"
    else
        print_warning "Docker not found. Please install PostgreSQL and Redis manually"
        print_info "PostgreSQL: https://www.postgresql.org/download/"
        print_info "Redis: https://redis.io/download"
    fi
}

# Function to generate documentation
generate_docs() {
    print_step "Generating documentation..."
    
    if [ ! -f "docs/GETTING_STARTED.md" ]; then
        cat > "docs/GETTING_STARTED.md" << EOF
# Getting Started with LiftLink

## Prerequisites
- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- Docker (optional)

## Quick Start
1. Clone the repository
2. Run \`./setup-complete.sh\`
3. Update environment variables in \`.env\`
4. Run \`npm run dev\` to start development servers

## Services
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Admin Dashboard: http://localhost:3006

For detailed documentation, see the docs/ directory.
EOF
        print_status "Created getting started documentation"
    fi
}

# Main setup function
main() {
    echo -e "${BLUE}Starting LiftLink Complete Platform Setup...${NC}"
    echo ""
    
    # Check prerequisites
    print_step "Checking prerequisites..."
    
    if ! check_node_version; then
        print_error "Please install Node.js 18+ and try again"
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "Please install npm and try again"
        exit 1
    fi
    
    # Create directories
    create_directories
    
    # Setup environment
    setup_environment
    
    # Install dependencies
    install_dependencies
    
    # Setup database
    setup_database
    
    # Generate documentation
    generate_docs
    
    echo ""
    echo -e "${GREEN}${ROCKET} LiftLink Complete Platform Setup Complete!${NC}"
    echo -e "${GREEN}=============================================${NC}"
    echo ""
    echo -e "${CYAN}Next Steps:${NC}"
    echo -e "${YELLOW}1.${NC} Update environment variables in .env file"
    echo -e "${YELLOW}2.${NC} Configure your API keys (Google Maps, Stripe, etc.)"
    echo -e "${YELLOW}3.${NC} Run 'npm run dev' to start development servers"
    echo -e "${YELLOW}4.${NC} Visit http://localhost:3000 to see your app"
    echo ""
    echo -e "${CYAN}Available Commands:${NC}"
    echo -e "${YELLOW}npm run dev${NC}        - Start frontend and backend"
    echo -e "${YELLOW}npm run dev:all${NC}    - Start all services"
    echo -e "${YELLOW}npm run build${NC}      - Build for production"
    echo -e "${YELLOW}npm run test${NC}       - Run tests"
    echo -e "${YELLOW}docker-compose up${NC}  - Start with Docker"
    echo ""
    echo -e "${GREEN}Happy coding! 🚗💨${NC}"
}

# Run main function
main "$@"
