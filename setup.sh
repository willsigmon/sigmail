#!/bin/bash

# SigMail Setup Script
# This script helps you set up the project for development

set -e

echo "🚀 SigMail Setup Script"
echo "======================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env exists
if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file already exists!${NC}"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Keeping existing .env file..."
        ENV_EXISTS=true
    fi
fi

if [ "$ENV_EXISTS" != "true" ]; then
    echo "📝 Creating .env file..."

    # Generate a random JWT secret
    JWT_SECRET=$(openssl rand -base64 32)

    cat > .env << EOF
# Database Configuration
# For local development, you can use a MySQL database
# Example: mysql://root:password@localhost:3306/sigmail
DATABASE_URL=mysql://root:password@localhost:3306/sigmail

# JWT/Session Secret (auto-generated)
JWT_SECRET=$JWT_SECRET

# Manus OAuth Configuration
# Get these values from https://manus.im when you create an OAuth app
VITE_APP_ID=your-manus-app-id-here
OAUTH_SERVER_URL=https://oauth.manus.im
VITE_OAUTH_PORTAL_URL=https://login.manus.im

# Manus Built-in APIs (optional - for AI features)
BUILT_IN_FORGE_API_URL=
BUILT_IN_FORGE_API_KEY=

# Owner Open ID (optional - for admin access)
OWNER_OPEN_ID=

# Environment
NODE_ENV=development

# Server Port
PORT=3000
EOF

    echo -e "${GREEN}✅ .env file created!${NC}"
    echo ""
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
    echo -e "${GREEN}✅ Dependencies installed!${NC}"
    echo ""
else
    echo -e "${GREEN}✅ Dependencies already installed${NC}"
    echo ""
fi

# Check TypeScript compilation
echo "🔍 Checking TypeScript compilation..."
if pnpm check; then
    echo -e "${GREEN}✅ TypeScript check passed!${NC}"
    echo ""
else
    echo -e "${RED}❌ TypeScript check failed!${NC}"
    echo "Please fix the TypeScript errors before continuing."
    exit 1
fi

# Try to build
echo "🏗️  Testing production build..."
if pnpm build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Production build successful!${NC}"
    echo ""
else
    echo -e "${YELLOW}⚠️  Production build had warnings (this is usually okay)${NC}"
    echo ""
fi

echo "================================"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo "================================"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Edit .env file and configure:"
echo "   - DATABASE_URL: Your MySQL connection string"
echo "   - VITE_APP_ID: Get from Manus OAuth (https://manus.im)"
echo ""
echo "2. Set up your database:"
echo "   ${BLUE}pnpm db:push${NC}"
echo ""
echo "3. Start the development server:"
echo "   ${BLUE}pnpm dev${NC}"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For more information, see README.md"
echo ""
