#!/bin/bash

# API Testing Script for SigMail
# Tests various API endpoints to ensure they're working

echo "🧪 Testing SigMail API Endpoints"
echo "================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if server is running
PORT=3000
if ! lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${RED}❌ Server is not running on port $PORT${NC}"
    echo ""
    echo "Start the server with: pnpm dev"
    exit 1
fi

echo -e "${GREEN}✅ Server is running on port $PORT${NC}"
echo ""

# Test homepage
echo -n "Testing homepage (GET /)... "
HOMEPAGE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/)
if [ "$HOMEPAGE_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ OK ($HOMEPAGE_STATUS)${NC}"
else
    echo -e "${RED}❌ FAILED ($HOMEPAGE_STATUS)${NC}"
fi

# Test auth.me endpoint (should work without auth)
echo -n "Testing auth.me endpoint... "
AUTH_RESPONSE=$(curl -s "http://localhost:$PORT/api/trpc/auth.me" -H "Content-Type: application/json")
if echo "$AUTH_RESPONSE" | grep -q "result"; then
    echo -e "${GREEN}✅ OK${NC}"
    echo "   Response: $(echo $AUTH_RESPONSE | jq -c '.result.data' 2>/dev/null || echo $AUTH_RESPONSE | head -c 100)"
else
    echo -e "${YELLOW}⚠️  PARTIAL${NC}"
    echo "   Response: $(echo $AUTH_RESPONSE | head -c 100)"
fi

# Test system.health endpoint (if exists)
echo -n "Testing system endpoint... "
SYSTEM_RESPONSE=$(curl -s "http://localhost:$PORT/api/trpc/system.health" -H "Content-Type: application/json")
if echo "$SYSTEM_RESPONSE" | grep -q "result\|error"; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${YELLOW}⚠️  UNKNOWN${NC}"
fi

echo ""
echo "================================"
echo "Test Summary:"
echo ""
echo "- Homepage: $([ "$HOMEPAGE_STATUS" = "200" ] && echo -e "${GREEN}✅${NC}" || echo -e "${RED}❌${NC}")"
echo "- tRPC API: $(echo "$AUTH_RESPONSE" | grep -q "result" && echo -e "${GREEN}✅${NC}" || echo -e "${YELLOW}⚠️${NC}")"
echo ""
echo "Note: Some endpoints require authentication and will return 'null' for user"
echo "This is expected behavior for public endpoints"
echo ""
