# TalentVault - Project Structure

## Overview
TalentVault is a professional Resume Repository & Talent Intelligence Platform designed for recruiters.

## Architecture

```
Frontend (React + Vite + Tailwind)
    ↓
Node.js Backend (Express) ← Primary API Layer
    ↓
Python AI Service (FastAPI) ← Internal Microservice
    ↓
Supabase (PostgreSQL + Storage)
```

## Directory Structure

```
TalentVault/
├── backend/                    # Node.js Express API
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Express middleware
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Utility functions
│   │   └── index.js           # Entry point
│   ├── .env.example
│   └── package.json
│
├── ai-service/                 # Python FastAPI AI Microservice
│   ├── app/
│   │   ├── api/               # API endpoints
│   │   ├── core/              # Core configuration
│   │   ├── models/            # Data models
│   │   ├── services/          # AI services
│   │   └── main.py            # Entry point
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service layer
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Utility functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── .env.example
│   └── package.json
│
├── database/                   # Database schema
│   ├── schema.sql             # Supabase schema
│   └── seed.sql               # Sample data
│
└── README.md                   # Setup instructions
```

## Tech Stack

### Frontend
- React.js (Vite)
- JavaScript (no TypeScript)
- Tailwind CSS
- Axios for API calls

### Backend
- Node.js + Express
- JWT authentication
- Multer for file uploads
- Axios for internal AI service calls

### AI Service
- Python 3.10+
- FastAPI
- PyPDF2 / pdfplumber for PDF parsing
- sentence-transformers for embeddings
- scikit-learn for similarity search

### Database & Storage
- Supabase PostgreSQL
- Supabase Storage for resume files
- pgvector for embeddings (optional)

## Data Flow

### Applicant Flow
1. Applicant fills 5-field form → Frontend
2. Frontend → Node.js Backend
3. Node.js uploads resume to Supabase Storage
4. Node.js → FastAPI for AI parsing
5. FastAPI extracts skills, summary, generates embeddings
6. Node.js stores candidate data + AI insights in Supabase

### Recruiter Search Flow
1. Recruiter enters natural language query → Frontend
2. Frontend → Node.js Backend
3. Node.js → FastAPI for semantic search
4. FastAPI returns ranked candidates with relevance scores
5. Node.js enriches with candidate details
6. Frontend displays ranked results

## Security

- JWT-based authentication for recruiters
- Environment variables for all secrets
- File type validation (PDF/DOCX only)
- File size limits (max 5MB)
- Internal-only AI service (not exposed to internet)
- CORS properly configured

## Key Features

### For Applicants
- Ultra-simple 5-field application form
- No login required
- Resume upload (PDF/DOCX)

### For Recruiters
- Secure authentication
- Candidate dashboard with cards
- Resume preview & download
- AI-generated summaries
- Skill highlights
- Status tracking (Applied/Shortlisted/Interviewed/Rejected/Hired)
- Advanced filtering
- Semantic search with natural language

### AI Capabilities
- Resume text extraction
- Skill identification
- Experience estimation
- Education parsing
- Semantic search with embeddings
- Candidate summary generation
- Relevance scoring
