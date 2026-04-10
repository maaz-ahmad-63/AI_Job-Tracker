#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   Job Application Tracker - Development Server Starter${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo -e "${RED}❌ Error: package.json not found. Make sure you're in the project root.${NC}"
  exit 1
fi

# Check if node_modules exist
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}📦 Installing dependencies...${NC}"
  npm install
fi

echo -e "${YELLOW}ℹ️  Starting servers...${NC}"
echo ""
echo -e "${GREEN}Backend Server:${NC} http://localhost:5000"
echo -e "${GREEN}Frontend:${NC}        http://localhost:5173"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"
echo ""

# Start both servers in parallel
npm run dev
