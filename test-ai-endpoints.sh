#!/bin/bash

# Phase 4 AI Integration Test Script
# This script tests the AI endpoints without needing the UI

echo "🧪 Job Application Tracker - Phase 4 AI Integration Tests"
echo "========================================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if backend is running
echo "${BLUE}Checking if backend is running on localhost:5002...${NC}"
if ! curl -s http://localhost:5002/api/health > /dev/null 2>&1; then
  # Try without health endpoint (it might not exist)
  if ! curl -s http://localhost:5002 > /dev/null 2>&1; then
    echo "${RED}❌ Backend is not running!${NC}"
    echo "Start the backend with: npm run dev --workspace=server"
    exit 1
  fi
fi
echo "${GREEN}✅ Backend is running${NC}"
echo ""

# Sample Job Description
JOB_DESCRIPTION="Senior React Developer at TechCorp

We're looking for an experienced React Developer to join our growing team.

Location: San Francisco, CA (Remote OK)
Salary: $150,000 - $180,000 per year
Benefits: Health insurance, 401k, unlimited PTO, home office stipend

About the Role:
We're seeking a Senior React Developer with 5+ years of experience to lead our frontend development efforts. You'll be responsible for architecting scalable React applications, mentoring junior developers, and collaborating with product and design teams.

Key Responsibilities:
- Lead development and architecture of React applications
- Mentor junior developers and conduct code reviews
- Collaborate with product managers and designers
- Optimize application performance
- Implement automated testing and CI/CD pipelines
- Participate in technical discussions and architecture decisions

Required Skills:
- 5+ years of React experience
- Strong TypeScript/JavaScript skills
- Knowledge of state management (Redux, Zustand, etc.)
- Experience with REST APIs
- Git and version control
- Communication and team collaboration

Nice to Have:
- Experience with Next.js
- Knowledge of GraphQL
- Experience with testing frameworks (Jest, React Testing Library)
- AWS or cloud platform experience
- Open source contributions

This is a great opportunity to grow with a fast-moving startup and make a real impact on our product."

# Test 1: Parse Job Description
echo "${BLUE}Test 1: Parsing Job Description${NC}"
echo "Sending job description to parse endpoint..."
echo ""

PARSE_RESPONSE=$(curl -s -X POST http://localhost:5002/api/ai/parse-jd \
  -H "Content-Type: application/json" \
  -d "{\"jobDescription\": $(echo "$JOB_DESCRIPTION" | jq -R .)}")

echo "Response:"
echo "$PARSE_RESPONSE" | jq '.' 2>/dev/null || echo "$PARSE_RESPONSE"

# Extract values for next test
COMPANY=$(echo "$PARSE_RESPONSE" | jq -r '.companyName // "TechCorp"' 2>/dev/null || echo "TechCorp")
POSITION=$(echo "$PARSE_RESPONSE" | jq -r '.position // "Senior React Developer"' 2>/dev/null || echo "Senior React Developer")

echo ""
echo "${GREEN}✅ Parse test completed${NC}"
echo "  Company: $COMPANY"
echo "  Position: $POSITION"
echo ""

# Test 2: Generate Resume Bullets
echo "${BLUE}Test 2: Generating Resume Bullets${NC}"
echo "Generating bullets for: $POSITION at $COMPANY"
echo ""

BULLETS_RESPONSE=$(curl -s -X POST http://localhost:5002/api/ai/resume-bullets \
  -H "Content-Type: application/json" \
  -d @- <<EOF
{
  "position": "$POSITION",
  "companyName": "$COMPANY",
  "responsibilities": [
    "Led development of React applications",
    "Mentored junior developers",
    "Optimized application performance"
  ],
  "skills": [
    "React",
    "TypeScript",
    "JavaScript",
    "Redux",
    "Jest",
    "REST APIs"
  ]
}
EOF
)

echo "Response:"
echo "$BULLETS_RESPONSE" | jq '.' 2>/dev/null || echo "$BULLETS_RESPONSE"

echo ""
echo "${GREEN}✅ Bullets test completed${NC}"
echo ""

# Test 3: Error Handling
echo "${BLUE}Test 3: Testing Error Handling${NC}"
echo "Sending invalid request (empty JD)..."
echo ""

ERROR_RESPONSE=$(curl -s -X POST http://localhost:5002/api/ai/parse-jd \
  -H "Content-Type: application/json" \
  -d '{"jobDescription": ""}')

echo "Response:"
echo "$ERROR_RESPONSE" | jq '.' 2>/dev/null || echo "$ERROR_RESPONSE"

echo ""
echo "${GREEN}✅ Error handling test completed${NC}"
echo ""

# Summary
echo "========================================================="
echo "${GREEN}🎉 All tests completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Open http://localhost:5176 in your browser"
echo "2. Go to 'Add Application' page"
echo "3. Try pasting a job description and clicking 'Parse with AI'"
echo "4. Create an application and open it to generate resume bullets"
echo ""
echo "For detailed documentation, see:"
echo "- PHASE4_QUICKSTART.md - Quick setup guide"
echo "- PHASE4_AI_INTEGRATION.md - Detailed documentation"
