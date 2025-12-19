# TalentVault - API Reference

## 🌐 Base URLs

### Backend API

| Environment | URL |
|------------|-----|
| **Local Development** | `http://localhost:5000/api/v1` |
| **Production (Render)** | `https://talentvault-backend.onrender.com/api/v1` |

### AI Service

| Environment | URL |
|------------|-----|
| **Local Development** | `http://localhost:8000` |
| **Production (Render)** | `https://talentvault-ai-service.onrender.com` |

### Frontend

| Environment | URL |
|------------|-----|
| **Local Development** | `http://localhost:5173` |
| **Production (Vercel)** | `https://talent-vault-eight.vercel.app` |

## 🔧 Tech Stack

### Backend (Node.js 18+)
- **Express** 4.18.2 - Web framework
- **@supabase/supabase-js** 2.39.1 - Database client
- **jsonwebtoken** 9.0.2 - JWT authentication
- **bcryptjs** 2.4.3 - Password hashing
- **Multer** 1.4.5-lts.1 - File upload
- **Helmet** 7.1.0 - Security headers
- **Morgan** 1.10.0 - Request logging

### AI Service (Python 3.13+)
- **FastAPI** 0.115.6 - Async web framework
- **GROQ** 0.12.0 - LLM inference (llama-3.3-70b-versatile)
- **sentence-transformers** 3.3.1 - Semantic embeddings
- **PyPDF2** 3.0.1 - PDF parsing
- **python-docx** 1.1.2 - DOCX parsing

---

## 🔐 Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

**Token Expiry:** 7 days

---

## 📊 Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Response Format

All responses follow this format:

```json
{
  "success": true|false,
  "message": "Optional message",
  "data": { ... },
  "error": "Error message if success is false"
}
```

---

## Authentication Endpoints

### Register Recruiter

Create a new recruiter account.

**Endpoint:** `POST /auth/register`

**Access:** Public

**Request Body:**
```json
{
  "email": "recruiter@company.com",
  "password": "SecurePassword123",
  "fullName": "John Doe",
  "companyName": "Tech Corp"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Recruiter registered successfully",
  "data": {
    "recruiter": {
      "id": "uuid",
      "email": "recruiter@company.com",
      "fullName": "John Doe",
      "companyName": "Tech Corp",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "token": "jwt_token_here"
  }
}
```

### Login

Authenticate and receive JWT token.

**Endpoint:** `POST /auth/login`

**Access:** Public

**Request Body:**
```json
{
  "email": "recruiter@company.com",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "recruiter": {
      "id": "uuid",
      "email": "recruiter@company.com",
      "fullName": "John Doe",
      "companyName": "Tech Corp"
    },
    "token": "jwt_token_here"
  }
}
```

### Get Profile

Get current recruiter profile.

**Endpoint:** `GET /auth/profile`

**Access:** Private (Recruiter)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "recruiter@company.com",
    "fullName": "John Doe",
    "companyName": "Tech Corp",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## Candidate Endpoints

### Submit Application

Submit a job application with resume.

**Endpoint:** `POST /candidates/apply`

**Access:** Public

**Request:** `multipart/form-data`

**Form Fields:**
- `fullName` (string, required)
- `email` (string, required)
- `phone` (string, required)
- `jobRoleText` (string, required)
- `jobRoleId` (uuid, optional)
- `resume` (file, required) - PDF or DOCX, max 5MB

**Example (Local):**
```bash
curl -X POST http://localhost:5000/api/v1/candidates/apply \
  -F "fullName=Alice Chen" \
  -F "email=alice@email.com" \
  -F "phone=+1-555-0101" \
  -F "jobRoleText=Frontend Developer" \
  -F "resume=@/path/to/resume.pdf"
```

**Example (Production):**
```bash
curl -X POST https://talentvault-backend.onrender.com/api/v1/candidates/apply \
  -F "fullName=Alice Chen" \
  -F "email=alice@email.com" \
  -F "phone=+1-555-0101" \
  -F "jobRoleText=Frontend Developer" \
  -F "resume=@/path/to/resume.pdf"
```

**Response:**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "id": "uuid",
    "full_name": "Alice Chen",
    "email": "alice@email.com",
    "phone": "+1-555-0101",
    "job_role_text": "Frontend Developer",
    "resume_url": "https://...",
    "status": "Applied",
    "applied_at": "2024-01-01T00:00:00Z"
  }
}
```

### Get All Candidates

Get list of all candidates with optional filters.

**Endpoint:** `GET /candidates`

**Access:** Private (Recruiter)

**Query Parameters:**
- `status` (string, optional) - Applied, Shortlisted, Interviewed, Rejected, Hired
- `jobRole` (string, optional) - Filter by job role name
- `search` (string, optional) - Search by name or email

**Example (Local):**
```bash
curl http://localhost:5000/api/v1/candidates?status=Shortlisted&search=alice \
  -H "Authorization: Bearer <token>"
```

**Example (Production):**
```bash
curl https://talentvault-backend.onrender.com/api/v1/candidates?status=Shortlisted&search=alice \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "uuid",
      "full_name": "Alice Chen",
      "email": "alice@email.com",
      "phone": "+1-555-0101",
      "role_name": "Frontend Developer",
      "status": "Shortlisted",
      "summary": "Experienced Frontend Developer with 5 years...",
      "skills": ["React", "JavaScript", "TypeScript"],
      "experience_years": 5,
      "education": [...],
      "applied_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Get Candidate by ID

Get detailed information about a specific candidate.

**Endpoint:** `GET /candidates/:id`

**Access:** Private (Recruiter)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "full_name": "Alice Chen",
    "email": "alice@email.com",
    "phone": "+1-555-0101",
    "role_name": "Frontend Developer",
    "category": "Engineering",
    "resume_url": "https://...",
    "resume_filename": "alice-resume.pdf",
    "status": "Shortlisted",
    "notes": null,
    "summary": "Experienced Frontend Developer...",
    "skills": ["React", "Vue.js", "JavaScript"],
    "experience_years": 5,
    "education": [
      {
        "degree": "Bachelor of Science",
        "field": "Computer Science",
        "institution": "Stanford University",
        "year": 2018
      }
    ],
    "certifications": [],
    "languages": ["English", "Mandarin"],
    "applied_at": "2024-01-01T00:00:00Z"
  }
}
```

### Update Candidate Status

Update the status of a candidate application.

**Endpoint:** `PUT /candidates/:id/status`

**Access:** Private (Recruiter)

**Request Body:**
```json
{
  "status": "Shortlisted",
  "notes": "Strong candidate, schedule interview"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Candidate status updated successfully",
  "data": {
    "id": "uuid",
    "status": "Shortlisted",
    "notes": "Strong candidate, schedule interview",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### Semantic Search

Perform AI-powered semantic search with natural language query.

**Endpoint:** `POST /candidates/search`

**Access:** Private (Recruiter)

**Request Body:**
```json
{
  "query": "Backend developers with Python and FastAPI experience"
}
```

**Response:**
```json
{
  "success": true,
  "query": "Backend developers with Python and FastAPI experience",
  "count": 3,
  "data": [
    {
      "id": "uuid",
      "full_name": "Bob Martinez",
      "email": "bob@email.com",
      "role_name": "Backend Developer",
      "status": "Applied",
      "summary": "Backend specialist with 6 years...",
      "skills": ["Python", "FastAPI", "Node.js"],
      "relevance_score": 0.89,
      "match_reason": "High relevance match based on skills and experience",
      "applied_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Get Statistics

Get candidate statistics by status.

**Endpoint:** `GET /candidates/statistics`

**Access:** Private (Recruiter)

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 50,
    "applied": 20,
    "shortlisted": 15,
    "interviewed": 10,
    "hired": 5
  }
}
```

---

## Job Role Endpoints

### Get All Job Roles

Get list of all available job roles.

**Endpoint:** `GET /job-roles`

**Access:** Public

**Response:**
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "id": "uuid",
      "role_name": "Frontend Developer",
      "category": "Engineering",
      "created_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid",
      "role_name": "Backend Developer",
      "category": "Engineering",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Get Job Role by ID

Get details of a specific job role.

**Endpoint:** `GET /job-roles/:id`

**Access:** Public

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "role_name": "Frontend Developer",
    "category": "Engineering",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Get Categories

Get list of all job role categories.

**Endpoint:** `GET /job-roles/categories`

**Access:** Public

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    "Engineering",
    "Data & Analytics",
    "Product",
    "Design",
    "Management"
  ]
}
```

### Create Job Role

Create a new job role.

**Endpoint:** `POST /job-roles`

**Access:** Private (Recruiter)

**Request Body:**
```json
{
  "roleName": "Senior Backend Engineer",
  "category": "Engineering"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Job role created successfully",
  "data": {
    "id": "uuid",
    "role_name": "Senior Backend Engineer",
    "category": "Engineering",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

## Health Check

### API Health

Check if the API is running.

**Endpoint:** `GET /health`

**Access:** Public

**Response:**
```json
{
  "success": true,
  "message": "TalentVault API is running",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## Error Responses

### Validation Error
```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters long"
    }
  ]
}
```

### Authentication Error
```json
{
  "success": false,
  "error": "No token provided. Access denied."
}
```

### Not Found Error
```json
{
  "success": false,
  "error": "Candidate not found"
}
```

### Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Rate Limiting

- **Window:** 15 minutes
- **Max Requests:** 100 per IP
- **Headers:**
  - `X-RateLimit-Limit`: Max requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Time when limit resets

---

## 📊 Complete Endpoint Reference

### Backend API Endpoints

| Endpoint | Method | Auth | Description | Production URL |
|----------|--------|------|-------------|----------------|
| `/health` | GET | ❌ | Health check | `https://talentvault-backend.onrender.com/api/v1/health` |
| `/auth/register` | POST | ❌ | Register recruiter | `https://talentvault-backend.onrender.com/api/v1/auth/register` |
| `/auth/login` | POST | ❌ | Login recruiter | `https://talentvault-backend.onrender.com/api/v1/auth/login` |
| `/auth/profile` | GET | ✅ | Get profile | `https://talentvault-backend.onrender.com/api/v1/auth/profile` |
| `/candidates/apply` | POST | ❌ | Submit application | `https://talentvault-backend.onrender.com/api/v1/candidates/apply` |
| `/candidates` | GET | ✅ | Get all candidates | `https://talentvault-backend.onrender.com/api/v1/candidates` |
| `/candidates/:id` | GET | ✅ | Get candidate by ID | `https://talentvault-backend.onrender.com/api/v1/candidates/:id` |
| `/candidates/:id/status` | PUT | ✅ | Update status | `https://talentvault-backend.onrender.com/api/v1/candidates/:id/status` |
| `/candidates/search` | POST | ✅ | AI semantic search | `https://talentvault-backend.onrender.com/api/v1/candidates/search` |
| `/candidates/statistics` | GET | ✅ | Get statistics | `https://talentvault-backend.onrender.com/api/v1/candidates/statistics` |
| `/job-roles` | GET | ❌ | Get all roles | `https://talentvault-backend.onrender.com/api/v1/job-roles` |
| `/job-roles/:id` | GET | ❌ | Get role by ID | `https://talentvault-backend.onrender.com/api/v1/job-roles/:id` |
| `/job-roles/categories` | GET | ❌ | Get categories | `https://talentvault-backend.onrender.com/api/v1/job-roles/categories` |
| `/job-roles` | POST | ✅ | Create role | `https://talentvault-backend.onrender.com/api/v1/job-roles` |

### AI Service Endpoints (Internal Use)

| Endpoint | Method | Description | Production URL |
|----------|--------|-------------|----------------|
| `/health` | GET | Health check | `https://talentvault-ai-service.onrender.com/health` |
| `/` | GET | Service info | `https://talentvault-ai-service.onrender.com/` |
| `/parse-resume` | POST | Parse resume (called by backend) | Internal |
| `/generate-summary` | POST | Generate AI summary (called by backend) | Internal |

**Note:** AI Service endpoints are called internally by the backend and not exposed to the frontend.

---

## Notes

1. All timestamps are in ISO 8601 format (UTC)
2. UUIDs are used for all IDs
3. File uploads must be PDF or DOCX, max 5MB
4. Semantic search uses GROQ AI (llama-3.3-70b-versatile model)
5. AI processing happens asynchronously after application submission
6. JWT tokens expire after 7 days
7. Rate limiting: 100 requests per 15 minutes per IP
8. All production endpoints use HTTPS
