# Job Application Tracker

An AI-powered job application tracking system built with MERN stack, featuring a Kanban board for organizing applications and AI-driven parsing of job descriptions.

## Overview

This web application allows users to:
- Track job applications on a Kanban board (Applied, Phone Screen, Interview, Offer, Rejected)
- Parse job descriptions using OpenAI to auto-populate application details
- Generate tailored resume suggestions based on job requirements
- Manage and organize applications with notes and links

## Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **React Router** - Routing
- **TanStack React Query** - Data fetching and caching
- **Axios** - HTTP client
- **Zustand** - State management

### Backend
- **Node.js + Express** - Server framework
- **TypeScript** - Type safety
- **MongoDB + Mongoose** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **OpenAI API** - AI-powered job parsing and resume suggestions

## Project Structure

```
.
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── features/          # Feature-specific components
│   │   ├── pages/             # Page components
│   │   ├── lib/               # Utilities, API, store
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # Entry point
│   └── package.json
│
├── server/                    # Backend Express application
│   ├── src/
│   │   ├── config/            # Configuration (database, env)
│   │   ├── middleware/        # Express middleware
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API routes
│   │   ├── schemas/           # Validation schemas
│   │   ├── services/          # Business logic
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Utility functions
│   │   └── index.ts           # Server entry point
│   └── package.json
│
├── .env                       # Environment variables (not committed)
├── .env.example               # Example environment variables
└── package.json               # Root package.json with workspaces

```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB database (local or Atlas)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd job-application-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   ```env
   # Server
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/job-tracker
   JWT_SECRET=your-secret-key-here
   OPENAI_API_KEY=sk-your-api-key
   CLIENT_URL=http://localhost:5173

   # Client
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

### Running Locally

**Development mode (both server and client):**
```bash
npm run dev
```

**Server only:**
```bash
npm run server
```

**Client only:**
```bash
npm run client
```

**Build:**
```bash
npm run build
```

### Building for Production

```bash
npm run build
```

- Server builds to `server/dist/`
- Client builds to `client/dist/`

To run production build:
```bash
cd server && npm start
```

## Architecture & Design Decisions

### Authentication Flow
- JWT tokens stored in `localStorage` for session persistence
- Tokens automatically included in API requests via interceptor
- Invalid tokens trigger automatic redirect to login page
- Password validation enforces minimum requirements (8 chars, uppercase, lowercase, number)

### Error Handling
- Custom `AppError` class for consistent error responses
- Global error middleware catches and formats errors
- Async route handlers wrapped in error boundary
- MongoDB validation errors transformed to readable messages

### Service Layer
- Business logic isolated in service classes (e.g., `AuthService`)
- Routes delegate to services, keeping handlers thin
- Ready for expansion to support multiple data sources

### State Management
- Zustand for lightweight auth state
- Persisted to localStorage for session recovery
- React Query for server state and caching

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user (requires auth)

### Health Check
- `GET /api/health` - Server health status

## Next Steps - Phase 2: Applications & AI

Recommended implementation order:

1. **Application CRUD Routes** (Phase 3)
   - `POST /api/applications` - Create new application
   - `GET /api/applications` - List user's applications
   - `GET /api/applications/:id` - Get application details
   - `PUT /api/applications/:id` - Update application
   - `DELETE /api/applications/:id` - Delete application

2. **AI Integration Service** (Phase 4)
   - `POST /api/ai/parse-jd` - Parse job description
   - `POST /api/ai/resume-suggestions` - Generate resume bullet points
   - Create `AiService` for OpenAI API calls with error handling

3. **Frontend Components** (Phase 5-6)
   - Kanban board with drag-and-drop
   - Application card component
   - Application detail modal
   - Job description parser UI
   - Resume suggestions display

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit

## Error Responses

All errors follow this format:
```json
{
  "message": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": "Additional context if applicable"
}
```

Common error codes:
- `VALIDATION_ERROR` - Input validation failed
- `INVALID_CREDENTIALS` - Login failed
- `USER_EXISTS` - Email already registered
- `UNAUTHORIZED` - Missing or invalid token
- `NOT_FOUND` - Resource not found
- `INTERNAL_SERVER_ERROR` - Server error

## Environment Variables

See `.env.example` for complete list. Key variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for signing JWTs | `your-secret-key` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `OPENAI_MODEL` | OpenAI model to use | `gpt-4-turbo` |
| `CLIENT_URL` | Frontend URL | `http://localhost:5173` |
| `VITE_API_BASE_URL` | API base URL for frontend | `http://localhost:5000/api` |

## Contributing

1. Create a feature branch from `main`
2. Make changes following TypeScript best practices
3. Avoid `any` type unless absolutely necessary
4. Write meaningful commit messages
5. Push and create a pull request

## Notes for Development

### TypeScript Best Practices
- Leverage strict mode (`"strict": true`)
- Define interfaces for all data structures
- Use types over interfaces for functions
- Avoid `any` - use `unknown` if truly unknown and narrow it

### Security
- Never commit `.env` file (use `.env.example` instead)
- Validate all user inputs on backend
- Use HTTPS in production
- Rotate JWT_SECRET regularly
- Store sensitive data in environment variables

### Database
- MongoDB indexes on frequently queried fields (email, userId)
- Timestamps for audit trails
- Soft deletes may be added in future

## Deployment

The app can be deployed to platforms like Heroku, Railway, Vercel, or AWS. Ensure:
- Environment variables are set in deployment platform
- MongoDB is accessible from server location
- CORS is properly configured
- Build script runs successfully

## License

MIT

## Future Enhancements (Stretch Goals)

- [ ] Streaming AI responses
- [ ] Application statistics dashboard
- [ ] Follow-up reminders with overdue highlights
- [ ] Search and filter Kanban board
- [ ] Export to CSV
- [ ] Dark mode
- [ ] Email notifications
- [ ] Interview preparation guides
- [ ] Salary tracking
- [ ] Multiple file uploads (cover letters, resume versions)
