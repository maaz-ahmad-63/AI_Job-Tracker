# 🚀 Job Application Tracker - Complete Features Guide

**Last Updated:** April 9, 2026 | **Status:** ✅ Production Ready

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Phase 1: Authentication](#phase-1-authentication)
3. [Phase 2: CRUD Operations](#phase-2-crud-operations)
4. [Phase 3: Kanban Board](#phase-3-kanban-board)
5. [Phase 4: AI Integration](#phase-4-ai-integration)
   - [AI Job Description Parser](#ai-job-description-parser)
   - [AI Resume Suggestions](#ai-resume-suggestions)
6. [Setup & Installation](#setup--installation)
7. [Usage Guide](#usage-guide)
8. [API Reference](#api-reference)
9. [Troubleshooting](#troubleshooting)
10. [Technology Stack](#technology-stack)

---

## Project Overview

A modern **MERN stack** job application tracker with AI-powered features for parsing job descriptions and generating resume bullet points. Organize applications on a Kanban board by status and track your entire job search workflow.

### Key Features ✨
- 🔐 User authentication with JWT
- 📋 Full CRUD operations for applications
- 🎯 Drag-and-drop Kanban board by status
- 🤖 AI-powered job description parsing
- 📝 AI-generated resume bullet suggestions
- 💾 In-memory database (ready for MongoDB)
- 📱 Responsive design
- ✅ Full TypeScript type safety

### Success Metrics
- ✅ Saves hours on form filling (auto-populate from JD)
- ✅ Generates role-specific resume bullets
- ✅ Organized tracking with Kanban board
- ✅ Professional, modern UI
- ✅ Production-ready code

---

## Phase 1: Authentication

### Features
- User registration with validation
- Secure login with JWT tokens
- Password requirements enforcement
- Token persistence in localStorage
- Protected routes and endpoints
- Automatic logout on token expiration

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit

### API Endpoints
```
POST   /api/auth/register     - Create new account
POST   /api/auth/login        - Login and get JWT token
GET    /api/auth/me           - Get current user (protected)
```

### Implementation
- Backend: JWT-based authentication with bcrypt password hashing
- Frontend: Zustand for auth state management, localStorage for token persistence
- Security: Tokens included in all API requests via axios interceptor

### Usage
```typescript
// Register
await authAPI.register({
  email: "user@example.com",
  password: "SecurePass123"
})

// Login
const { token } = await authAPI.login({
  email: "user@example.com",
  password: "SecurePass123"
})

// Auto-included in all future requests
```

---

## Phase 2: CRUD Operations

### Features
- Create new job applications
- Read/view application details
- Update application status and notes
- Delete applications
- Track application status (Applied, Interviewing, Offered, Rejected, Withdrawn)
- View all user's applications with metadata

### Application Data Structure
```typescript
interface Application {
  _id: string
  userId: string
  companyName: string
  position: string
  status: "applied" | "interviewing" | "offered" | "rejected" | "withdrawn"
  appliedDate: Date
  salaryRange?: string
  location?: string
  seniority?: string
  jdLink?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}
```

### API Endpoints
```
POST   /api/applications           - Create new application
GET    /api/applications           - Get all user's applications
GET    /api/applications/:id       - Get specific application
PUT    /api/applications/:id       - Update application
DELETE /api/applications/:id       - Delete application
```

### Status Types
| Status | Color | Meaning |
|--------|-------|---------|
| Applied | Blue | Initial submission sent |
| Interviewing | Amber | In interview process |
| Offered | Purple | Job offer received |
| Rejected | Red | Application rejected |
| Withdrawn | Slate | Withdrawn by user |

### Usage Example
```typescript
// Create application
const app = await applicationsAPI.create({
  companyName: "TechCorp",
  position: "Senior React Developer",
  status: "applied",
  appliedDate: new Date(),
  notes: "Great opportunity!"
})

// Update status
await applicationsAPI.update(appId, {
  status: "interviewing"
})

// Get all applications
const apps = await applicationsAPI.getAll()

// Delete application
await applicationsAPI.delete(appId)
```

---

## Phase 3: Kanban Board

### Features
- Organize applications by status in columns
- Drag-and-drop to update application status
- Professional card design with gradients
- Quick view in detail modal
- Visual status indicators
- Smooth animations
- Responsive layout

### Kanban Columns
1. **Applied** - Initial applications sent
2. **Interviewing** - Active interview process
3. **Offered** - Offers received
4. **Rejected** - Rejections/Withdrawals
5. **Withdrawn** - User withdrawals

### Card Information Displayed
- Company name
- Position title
- Applied date
- Quick action buttons (view, edit, delete)
- Status badge with color coding
- Notes preview (first 2 lines)

### Detail Modal Features
- Full application information
- Status display
- Applied date
- Salary range (if available)
- Job description link
- Notes section
- Metadata (created/updated dates)
- Action buttons (Edit, Delete)
- Resume bullets generator button

### Usage
```
1. Navigate to Dashboard (main page)
2. See Kanban board with 5 status columns
3. Drag cards between columns to update status
4. Click card to open detail modal
5. Click "Edit" to modify application
6. Click "Delete" to remove application
```

### Design
- Purple/pink gradient for primary elements
- Blue/cyan gradient for secondary elements
- Smooth transitions and hover effects
- Icons from lucide-react
- Tailwind CSS styling
- Mobile-responsive layout

---

## Phase 4: AI Integration

### 4.1 AI Job Description Parser

#### Overview
Parse job descriptions to automatically extract company, position, skills, salary, seniority, and location. Form fields auto-populate with extracted data.

#### Requirements ✅
- ✅ User pastes job description and clicks Parse
- ✅ Backend calls OpenAI and returns structured JSON
- ✅ Extract: company name, role, required skills, nice-to-have skills, seniority, location
- ✅ Populate form fields with extracted data
- ✅ Show loading state while processing
- ✅ Handle errors if AI returns unexpected output

#### Extraction Fields
| Field | Type | Example |
|-------|------|---------|
| Company Name | string | "TechCorp" |
| Position | string | "Senior React Developer" |
| Salary Range | string | "$150k - $180k" |
| Seniority Level | string | "Senior" |
| Location | string | "San Francisco, CA" |
| Required Skills | array | ["React", "TypeScript", "Node.js"] |
| Nice-to-Have Skills | array | ["Next.js", "GraphQL"] |
| Key Responsibilities | array | ["Lead team", "Mentor developers"] |
| Summary | string | "Brief job overview" |

#### User Workflow
```
1. Navigate to "Add Application" page
2. Click "Use AI to Parse Job Description" button
3. Paste full job description
4. Click "Parse with AI"
5. Watch loading spinner (2-5 seconds)
6. ✅ Parse complete - see parsed data preview
7. See company, position, level, location
8. Resume bullets auto-generate (see Section 4.2)
9. Click "Use This Data" to confirm
10. Form auto-populates with extracted data
11. User can adjust fields as needed
12. Submit to create application
```

#### Form Fields Auto-Populated
- Company Name ✅
- Position ✅
- Seniority Level ✅
- Location ✅
- Notes (includes skills + summary) ✅

#### Implementation
**Component:** `JDParser.tsx`
- Toggle button to show/hide parser
- Textarea for job description input
- Parse button with loading state
- Success message with parsed data preview
- "Use This Data" button to confirm
- Auto-triggers ResumeBulletsGenerator after parsing

**Backend Service:** `AIService.parseJobDescription()`
- Sends JD to OpenAI GPT-3.5-turbo
- Extracts all fields via prompt engineering
- Returns structured JSON response
- Handles errors gracefully

**API Endpoint:** `POST /api/ai/parse-jd`
```
Request:
{
  "jobDescription": "Full job posting text..."
}

Response:
{
  "companyName": "TechCorp",
  "position": "Senior React Developer",
  "seniority": "Senior",
  "location": "San Francisco, CA",
  "salaryRange": "$150k - $180k",
  "keyResponsibilities": [...],
  "requiredSkills": [...],
  "niceToHaveSkills": [...],
  "summary": "..."
}
```

#### Example
**Input (Job Description):**
```
Senior React Developer - TechCorp
Location: San Francisco, CA (Remote OK)
Salary: $150,000 - $180,000 per year

We're seeking an experienced React Developer with 5+ years of experience 
to lead our frontend development efforts.

Key Responsibilities:
- Lead development of React applications
- Mentor junior developers
- Optimize application performance

Required Skills:
- React (5+ years)
- TypeScript/JavaScript
- Redux or state management
- REST APIs

Nice to Have:
- Next.js experience
- GraphQL knowledge
- AWS experience
```

**Output (Form Populated):**
```
Company Name:      TechCorp
Position:          Senior React Developer
Seniority Level:   Senior
Location:          San Francisco, CA (Remote OK)
Applied Date:      Today
Status:            Applied
Notes:             Key Skills: React, TypeScript, Redux...
                   Nice to Have: Next.js, GraphQL, AWS...
                   Summary: Lead frontend development...
```

#### Error Handling
| Error | Display | Recovery |
|-------|---------|----------|
| No API Key | "Failed to parse..." | Try again, check API key |
| Network Error | "Network error..." | Check connection, retry |
| Invalid JD | "Failed to parse..." | Try different JD text |
| Malformed Response | "Failed to parse..." | Retry or manual entry |

---

### 4.2 AI Resume Suggestions

#### Overview
After parsing, automatically generate 3-5 AI-powered resume bullet points tailored to the role. Each bullet has individual copy buttons.

#### Requirements ✅
- ✅ Generate 3 to 5 resume bullet points after parsing
- ✅ Suggestions are specific to that role (not generic)
- ✅ Each suggestion has a copy button
- ✅ Auto-generates immediately after parsing
- ✅ Can regenerate for alternatives
- ✅ Professional formatting with tips

#### Why Bullets Are Specific (Not Generic)

**Inputs Used for Tailoring:**
- ✅ Position title (Senior, Mid-level, Junior aware)
- ✅ Company name (for authenticity)
- ✅ Key responsibilities (extracted from JD)
- ✅ Required skills (matched to role)

**Result:** Bullets specific to "Senior React Developer at TechCorp" - NOT generic developer bullets.

#### User Workflow
```
Step 1: User parses job description
          ↓
Step 2: ✅ Parsing complete - data preview shown
          ↓
Step 3: [Auto-Starting] Generating Resume Bullets...
        (No click needed - happens automatically)
          ↓
Step 4: [Loading for 3-8 seconds]
          ↓
Step 5: 📝 Resume Bullets Display
        ✓ Led development of microservices...  [Copy]
        ✓ Improved performance by 40%...       [Copy]
        ✓ Mentored 5 junior developers...      [Copy]
        ✓ Architected real-time sync...        [Copy]
        ✓ Implemented 95% test coverage...     [Copy]
        
        ✨ Tips:
        • Start with action verbs
        • Include metrics
        • Focus on business impact
        
        [Copy All] [Regenerate]
          ↓
Step 6: User clicks "Copy" on any bullet
        Shows "[Copied!]" for 2 seconds
        Bullet in clipboard
          ↓
Step 7: User clicks "Use This Data" to close parser
        Returns to form with parsed data
          ↓
Step 8: User pastes bullets into resume
```

#### Copy Options

**Per-Bullet Copy:**
- Click `[Copy]` next to any bullet
- Shows `[Copied!]` for 2 seconds
- Bullet copied to clipboard
- User can paste with Ctrl+V

**Copy All:**
- Click `[Copy All]` at top
- All 5 bullets formatted with bullets (•)
- Shows `[Copied All!]` for 2 seconds
- User can paste as formatted list

**Regenerate:**
- Click `[Regenerate]` button
- New set of bullets generated (3-8 seconds)
- Different suggestions shown
- Try multiple times for different angles

#### Example Bullets Output

**For: Senior React Developer at TechCorp**

```
✓ Led development of microservices architecture serving 10M+ 
  monthly users, improving system scalability by 300%

✓ Improved application performance by 40% through advanced 
  caching strategies and code optimization

✓ Mentored team of 5 junior developers through code reviews 
  and pair programming sessions

✓ Architected real-time data synchronization using WebSockets, 
  reducing latency from 5s to <500ms

✓ Implemented comprehensive automated testing with 95% coverage 
  using Jest and React Testing Library
```

**Tips Provided:**
- Start each bullet with strong action verb (Led, Developed, Improved, etc.)
- Include quantifiable metrics and percentages when possible
- Focus on business impact rather than technical details
- Keep bullets concise (one line each)
- Use industry-specific terminology and keywords

#### Implementation
**Component:** `ResumeBulletsGenerator.tsx`
- Auto-starts generation when `autoGenerate={true}`
- Shows loading spinner while generating
- Displays bullets with per-bullet copy buttons
- "Copy All" button for formatted list
- "Regenerate" button for alternatives
- Tips section below bullets
- Error display with retry option

**Backend Service:** `AIService.generateResumeBullets()`
- Receives: position, company, responsibilities, skills
- Sends tailored prompt to GPT-3.5-turbo
- Generates role-specific bullets
- Returns: bullets array + tips array
- Handles errors gracefully

**API Endpoint:** `POST /api/ai/resume-bullets`
```
Request:
{
  "position": "Senior React Developer",
  "companyName": "TechCorp",
  "responsibilities": ["Led team", "Mentored developers"],
  "skills": ["React", "TypeScript", "Node.js"]
}

Response:
{
  "bullets": [
    "Led development of microservices...",
    "Improved performance by 40%...",
    ...
  ],
  "tips": [
    "Use action verbs...",
    "Include metrics...",
    ...
  ]
}
```

#### Specificity Guarantees

**NOT Generic:**
- ❌ "Developed frontend applications"
- ❌ "Worked with React"
- ❌ "Collaborated with team"

**Specific to Role:**
- ✅ "Led development of React microservices for TechCorp"
- ✅ "Mentored 5 junior developers on TypeScript best practices"
- ✅ "Architected real-time sync with 40% performance improvement"

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- OpenAI API key (for AI features)
- MongoDB (or use in-memory mock for demo)

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd job-application-tracker
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Setup

**Create `.env` file in `server/` directory:**
```env
PORT=5002
OPENAI_API_KEY=sk-your-openai-api-key-here
JWT_SECRET=your-super-secret-jwt-key
MONGO_URI=mongodb://localhost:27017/job-tracker
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Create `.env` file in `client/` directory:**
```env
VITE_API_BASE_URL=http://localhost:5002/api
```

### Step 4: Get OpenAI API Key
1. Visit https://platform.openai.com/account/api-keys
2. Create new secret key
3. Copy the key (save it safely!)
4. Add to `server/.env`

### Step 5: Run Application

**Development Mode (Both servers):**
```bash
npm run dev
```

**Or separately:**
```bash
# Terminal 1 - Backend
npm run dev --workspace=server

# Terminal 2 - Frontend
npm run dev --workspace=client
```

**Build for Production:**
```bash
npm run build

# Run production build
cd server && npm start
```

### Verification
- Backend running: http://localhost:5002 (check console)
- Frontend running: http://localhost:5173
- Both should show in browser DevTools console

---

## Usage Guide

### Complete User Journey

#### 1. Register/Login
```
1. Go to http://localhost:5173
2. Click "Sign Up"
3. Enter email: user@example.com
4. Enter password: SecurePass123 (8 chars, uppercase, lowercase, digit)
5. Click "Sign Up"
6. Or Login with existing credentials
```

#### 2. Parse Job Description & Auto-Populate
```
1. Click "Add Application" button
2. See "Use AI to Parse Job Description"
3. Copy full job description (from LinkedIn, Indeed, etc.)
4. Click to open parser
5. Paste job description
6. Click "Parse with AI"
7. Wait 2-5 seconds (loading spinner)
8. See parsed data: company, position, level, location
9. Watch resume bullets auto-generate (3-8 seconds)
10. See 3-5 tailored bullets with copy buttons
11. Click any [Copy] to copy that bullet to clipboard
12. Click [Copy All] to copy all bullets as list
13. Click [Regenerate] to get different suggestions
14. Click "Use This Data" when done
15. Form auto-populates with parsed data
16. Adjust any fields as needed
17. Set status (Applied, etc.)
18. Click "Create Application"
19. Application appears in Kanban board
```

#### 3. Manage Applications in Kanban
```
1. See Kanban board with 5 columns (Applied, Interviewing, etc.)
2. Each column shows cards for that status
3. Drag card to another column to update status
4. Click card to see full details in modal
5. Modal shows all information + "Generate Resume Bullets" button
6. Click "Edit" to modify application
7. Click "Delete" to remove application
8. Close modal to return to board
```

#### 4. Generate Resume Bullets Anytime
```
On Application Detail Modal:
1. Click "Generate Resume Bullets" button
2. Wait 3-8 seconds (auto-starts generating)
3. See bullets with copy buttons
4. Click [Copy] on any bullet
5. Click [Regenerate] for different suggestions
```

#### 5. Track Your Progress
```
1. See all applications organized by status
2. Move cards between columns as you progress
3. Open detail modal to see full info anytime
4. Quickly identify opportunities at each stage
5. Track which bullets work best for your resume
```

---

## API Reference

### Authentication APIs

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}

Response 201:
{
  "token": "jwt.token.here",
  "user": {
    "_id": "user-id",
    "email": "user@example.com"
  }
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}

Response 200:
{
  "token": "jwt.token.here",
  "user": {
    "_id": "user-id",
    "email": "user@example.com"
  }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer jwt.token.here

Response 200:
{
  "_id": "user-id",
  "email": "user@example.com"
}
```

### Application APIs

#### Create Application
```
POST /api/applications
Authorization: Bearer jwt.token.here
Content-Type: application/json

{
  "companyName": "TechCorp",
  "position": "Senior React Developer",
  "status": "applied",
  "appliedDate": "2026-04-09T00:00:00Z",
  "salaryRange": "$150k - $180k",
  "location": "San Francisco, CA",
  "seniority": "Senior",
  "jdLink": "https://example.com/job",
  "notes": "Great opportunity"
}

Response 201:
{
  "_id": "app-id",
  "userId": "user-id",
  "companyName": "TechCorp",
  ...
}
```

#### Get All Applications
```
GET /api/applications
Authorization: Bearer jwt.token.here

Response 200:
[
  { application object },
  { application object },
  ...
]
```

#### Get Specific Application
```
GET /api/applications/:id
Authorization: Bearer jwt.token.here

Response 200:
{ application object }
```

#### Update Application
```
PUT /api/applications/:id
Authorization: Bearer jwt.token.here
Content-Type: application/json

{
  "status": "interviewing",
  "notes": "Updated notes"
}

Response 200:
{ updated application object }
```

#### Delete Application
```
DELETE /api/applications/:id
Authorization: Bearer jwt.token.here

Response 200:
{ "message": "Application deleted" }
```

### AI APIs

#### Parse Job Description
```
POST /api/ai/parse-jd
Authorization: Bearer jwt.token.here
Content-Type: application/json

{
  "jobDescription": "Full job description text here..."
}

Response 200:
{
  "companyName": "TechCorp",
  "position": "Senior React Developer",
  "seniority": "Senior",
  "location": "San Francisco, CA",
  "salaryRange": "$150k - $180k",
  "keyResponsibilities": [...],
  "requiredSkills": [...],
  "niceToHaveSkills": [...],
  "summary": "..."
}
```

#### Generate Resume Bullets
```
POST /api/ai/resume-bullets
Authorization: Bearer jwt.token.here
Content-Type: application/json

{
  "position": "Senior React Developer",
  "companyName": "TechCorp",
  "responsibilities": ["Led team", "Mentored developers"],
  "skills": ["React", "TypeScript", "Node.js", "Redux"]
}

Response 200:
{
  "bullets": [
    "Led development of microservices...",
    "Improved performance by 40%...",
    ...
  ],
  "tips": [
    "Use action verbs...",
    "Include metrics...",
    ...
  ]
}
```

---

## Troubleshooting

### Backend Issues

#### "OPENAI_API_KEY not set" Warning
**Cause:** API key not in `server/.env`
**Solution:** 
1. Add `OPENAI_API_KEY=sk-...` to `server/.env`
2. Restart server: `npm run dev --workspace=server`
3. Warning should disappear

#### "Failed to parse job description"
**Causes:** API key not set, network error, invalid JD
**Solutions:**
1. Check OpenAI API key is set
2. Verify API key is valid at platform.openai.com
3. Check usage/billing at platform.openai.com/account/billing
4. Try parsing different JD text
5. Check server logs for error details

#### Backend won't start
**Causes:** Port already in use, invalid environment variables
**Solutions:**
1. Kill process on port 5002: `lsof -ti tcp:5002 | xargs kill -9`
2. Check all env variables are set correctly
3. Verify Node.js version: `node --version` (should be 18+)

### Frontend Issues

#### "Cannot GET /api/applications"
**Cause:** Backend not running or wrong API URL
**Solutions:**
1. Ensure backend is running: `npm run dev --workspace=server`
2. Check API URL in `client/.env`: should be `http://localhost:5002/api`
3. Check browser console for exact error

#### Parsing shows empty/wrong data
**Cause:** API key not set or network error
**Solutions:**
1. Check backend logs for error details
2. Verify API key is valid
3. Try parsing again (might be temporary)
4. Try different JD text (current might be too short)

#### Copy button not working
**Cause:** Browser security or clipboard API not available
**Solutions:**
1. Try different browser (Chrome, Firefox, Safari)
2. Ensure site is HTTPS (on production)
3. Check browser console for clipboard errors
4. Manually select and copy text as fallback

#### Form not auto-populating
**Cause:** Parser returned unexpected format
**Solutions:**
1. Check network tab in DevTools
2. See what API returns (should have company, position)
3. Try different JD
4. Enter data manually

### General Issues

#### Ports already in use
```bash
# Kill process on ports 5002, 5173
lsof -ti tcp:5002 | xargs kill -9
lsof -ti tcp:5173 | xargs kill -9
```

#### Node modules issues
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### TypeScript errors after changes
```bash
# Rebuild
npm run build --workspace=client
npm run build --workspace=server
```

---

## Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript 5** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Zustand** - State management (auth)
- **React Router** - Routing
- **lucide-react** - Icons
- **@dnd-kit** - Drag and drop (Kanban)

### Backend
- **Node.js** - Runtime
- **Express 4** - Web framework
- **TypeScript 5** - Type safety
- **MongoDB + Mongoose** - Database (or in-memory mock)
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **OpenAI API** - GPT-3.5-turbo for AI features
- **Axios** - HTTP client

### Deployment Ready
- ✅ TypeScript compilation verified
- ✅ No build errors
- ✅ Error handling complete
- ✅ Graceful fallbacks implemented
- ✅ Environment variables configured
- ✅ CORS properly configured
- ✅ Security best practices

### Performance
| Operation | Time | Cost |
|-----------|------|------|
| Parse JD | 2-5 seconds | ~$0.001 |
| Generate Bullets | 3-8 seconds | ~$0.0008 |
| Copy to Clipboard | <100ms | Free |
| Create Application | <500ms | Free |
| Drag & Drop | Real-time | Free |

---

## Project Status

### ✅ Completed
- Phase 1: User authentication (register, login, JWT)
- Phase 2: Application CRUD (create, read, update, delete)
- Phase 3: Kanban board with drag & drop
- Phase 4: AI integration (parsing + bullets)
- Full TypeScript type safety
- Error handling throughout
- Professional UI design
- Responsive layout
- Comprehensive documentation

### 🚀 Ready for
- Production deployment
- User testing
- Feature extensions
- Database migration to MongoDB
- Additional AI features

### 🔮 Future Enhancements
- Interview question generation
- Cover letter generation
- Skill gap analysis
- Salary tracking and trends
- Email notifications
- Dark mode
- Mobile app (React Native)

---

## Quick Links

- **GitHub:** [Your repo URL]
- **OpenAI API:** https://platform.openai.com/account/api-keys
- **OpenAI Docs:** https://platform.openai.com/docs
- **Tailwind CSS:** https://tailwindcss.com
- **React:** https://react.dev
- **Node.js:** https://nodejs.org

---

## Support

### Getting Help
1. Check this guide's Troubleshooting section
2. Review error messages in browser console (F12) and server logs
3. Verify all environment variables are set correctly
4. Try the example workflows above
5. Restart both servers

### Common Checks
- ✅ `npm install` completed
- ✅ `.env` files created with API keys
- ✅ Backend running on port 5002
- ✅ Frontend running on port 5173
- ✅ OpenAI API key is valid
- ✅ Browser console has no errors

---

**Status:** ✅ Production Ready | **Last Updated:** April 9, 2026

All features tested and working. Ready to deploy and use!
