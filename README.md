# TalentVault - Resume Repository & Talent Intelligence Platform

<div align="center">

![TalentVault](https://img.shields.io/badge/TalentVault-Resume%20Intelligence-0ea5e9)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-18.x-brightgreen)
![Python](https://img.shields.io/badge/python-3.10+-blue)
![React](https://img.shields.io/badge/react-18.x-61dafb)

**A professional, AI-powered resume repository and talent intelligence platform for recruiters**

[Features](#features) • [Architecture](#architecture) • [Setup](#setup) • [Usage](#usage) • [API Documentation](#api-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Security](#security)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

TalentVault is a production-ready, recruiter-first talent management system that combines traditional applicant tracking with AI-powered resume intelligence. It enables job seekers to apply with minimal friction while providing recruiters with powerful tools to analyze, search, and manage candidates efficiently.

### Key Differentiators

- **AI-Powered Intelligence**: Automatic resume parsing, skill extraction, and semantic search
- **Recruiter-First Design**: Clean, professional UI optimized for recruiter workflows
- **Microservices Architecture**: Scalable separation of concerns between core logic and AI services
- **Minimal Applicant Friction**: 5-field application form with no login required
- **Enterprise-Grade**: Production-ready code with security best practices

---

## ✨ Features

### For Applicants

- **Ultra-Simple Application Form**
  - Only 5 required fields (Name, Email, Phone, Role, Resume)
  - No account creation required
  - Support for PDF and DOCX resumes (max 5MB)
  - Instant submission with AI processing

### For Recruiters

- **Intelligent Dashboard**
  - Real-time candidate statistics
  - Card-based candidate view with key information
  - Advanced filtering by status and role
  - Quick status updates (Applied/Shortlisted/Interviewed/Rejected/Hired)

- **AI-Powered Features**
  - Automatic resume parsing and text extraction
  - Skill identification and tagging
  - Experience estimation
  - Education and certification extraction
  - AI-generated candidate summaries
  - Semantic search with natural language queries

- **Search & Filter**
  - Traditional keyword search
  - AI semantic search (e.g., "Backend developers with Python and FastAPI")
  - Filter by status, role, and date
  - Relevance scoring for search results

- **Candidate Management**
  - Detailed candidate profiles
  - Resume preview and download
  - Status tracking with activity logs
  - Notes and recruiter feedback

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│               Vite + Tailwind CSS + Axios               │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Node.js Backend (Express)                   │
│        Authentication, Business Logic, API               │
└───────┬─────────────────────────────────────────┬───────┘
        │                                         │
        │ Internal REST                           │ Database
        │                                         │ Queries
        ▼                                         ▼
┌──────────────────────────┐      ┌──────────────────────┐
│  Python AI Service       │      │   Supabase           │
│  FastAPI + ML Models     │      │   PostgreSQL +       │
│  - Resume Parsing        │      │   Storage            │
│  - Embeddings            │      └──────────────────────┘
│  - Semantic Search       │
│  - Summary Generation    │
└──────────────────────────┘
```

### Design Principles

1. **Frontend → Node.js ONLY**: Frontend never calls Python directly
2. **Node.js → FastAPI (Internal)**: AI service is internal microservice
3. **Clean Separation**: Core business logic separate from AI intelligence
4. **Scalable**: Each service can be scaled independently

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications

### Backend (Node.js)
- **Express** - Web framework
- **Supabase JS** - Database client
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Helmet** - Security headers
- **Morgan** - Request logging
- **Express Rate Limit** - Rate limiting

### AI Service (Python)
- **FastAPI** - API framework
- **Uvicorn** - ASGI server
- **GROQ** - AI inference API (fast LLM)
- **PyPDF2 / pdfplumber** - PDF parsing
- **python-docx** - DOCX parsing

### Database & Storage
- **Supabase PostgreSQL** - Primary database
- **Supabase Storage** - Resume file storage

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **Python** 3.10 or higher ([Download](https://www.python.org/))
- **npm** or **yarn** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Supabase Account** ([Sign up](https://supabase.com/))

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/TalentVault.git
cd TalentVault
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com/)
2. Go to **SQL Editor** and run the schema from `database/schema.sql`
3. (Optional) Run `database/seed.sql` for sample data
4. Go to **Storage** → Create a bucket named `resumes` (make it public)
5. Copy your **Project URL** and **API Keys** from Settings → API

### 3. Backend Setup (Node.js)

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your Supabase credentials
# SUPABASE_URL=your_supabase_url
# SUPABASE_ANON_KEY=your_anon_key
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
# JWT_SECRET=your_random_secret_key
```

### 4. AI Service Setup (Python)

```bash
cd ai-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your GROQ API key
# Get free API key from: https://console.groq.com
# GROQ_API_KEY=your_groq_api_key_here
```

### 5. Frontend Setup (React)

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env
# VITE_API_URL=http://localhost:5000/api/v1
```

---

## ▶️ Running the Application

You need to run all three services simultaneously. Open **three terminal windows**:

### Terminal 1: Backend (Node.js)

```bash
cd backend
npm run dev
```

Server runs on `http://localhost:5000`

### Terminal 2: AI Service (Python)

```bash
cd ai-service
# Activate venv first (if not already)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Server runs on `http://localhost:8000`

### Terminal 3: Frontend (React)

```bash
cd frontend
npm run dev
```

Application runs on `http://localhost:5173`

---

## 🌐 Usage

### For Applicants

1. Navigate to `http://localhost:5173/apply`
2. Fill in the 5-field application form
3. Upload your resume (PDF or DOCX)
4. Submit application
5. AI processes your resume automatically

### For Recruiters

1. Navigate to `http://localhost:5173/register`
2. Create a recruiter account
3. Login at `http://localhost:5173/login`
4. Access dashboard to view candidates
5. Use AI semantic search: "Backend developers with Python experience"
6. Update candidate status
7. Download resumes

---

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register Recruiter
```http
POST /auth/register
Content-Type: application/json

{
  "email": "recruiter@company.com",
  "password": "Password123!",
  "fullName": "John Doe",
  "companyName": "Tech Corp"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "recruiter@company.com",
  "password": "Password123!"
}

Response:
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "recruiter": { ... }
  }
}
```

### Candidate Endpoints

#### Submit Application (Public)
```http
POST /candidates/apply
Content-Type: multipart/form-data

fullName: John Doe
email: john@email.com
phone: +1-555-0123
jobRoleId: uuid
jobRoleText: Backend Developer
resume: [file]
```

#### Get All Candidates (Protected)
```http
GET /candidates
Authorization: Bearer {token}

Query Parameters:
- status: Applied|Shortlisted|Interviewed|Rejected|Hired
- jobRole: role name
- search: keyword
```

#### Semantic Search (Protected)
```http
POST /candidates/search
Authorization: Bearer {token}
Content-Type: application/json

{
  "query": "Backend developers with Python and FastAPI experience"
}
```

#### Update Status (Protected)
```http
PUT /candidates/:id/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "Shortlisted",
  "notes": "Strong candidate"
}
```

### Job Role Endpoints

#### Get All Job Roles (Public)
```http
GET /job-roles
```

---

## 🗄 Database Schema

### Main Tables

- **recruiters** - Recruiter accounts
- **candidates** - Applicant information
- **job_roles** - Available positions
- **ai_insights** - AI-extracted data
- **applications** - Application tracking
- **activity_log** - Audit trail
- **search_queries** - Search analytics

See `database/schema.sql` for complete schema with indexes and relationships.

---

## 📁 Project Structure

```
TalentVault/
├── backend/                    # Node.js Express API
│   ├── src/
│   │   ├── config/            # Configuration
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Express middleware
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   └── index.js           # Entry point
│   └── package.json
│
├── ai-service/                 # Python FastAPI
│   ├── app/
│   │   ├── api/               # API endpoints
│   │   ├── core/              # Configuration
│   │   ├── models/            # Pydantic models
│   │   ├── services/          # AI services
│   │   └── main.py            # Entry point
│   └── requirements.txt
│
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── database/                   # Database files
│   ├── schema.sql             # Database schema
│   └── seed.sql               # Sample data
│
└── README.md
```

---

## 🔒 Security

- **JWT Authentication** for recruiters
- **Password Hashing** with bcrypt
- **Environment Variables** for secrets
- **File Validation** (type and size)
- **Rate Limiting** on API endpoints
- **CORS Configuration**
- **Helmet.js** security headers
- **Input Validation** with express-validator
- **SQL Injection Prevention** via Supabase client

---

## 🚢 Deployment

### Backend (Node.js)

Deploy to: Heroku, Railway, Render, DigitalOcean, AWS

```bash
# Set environment variables
# Build command: npm install
# Start command: npm start
```

### AI Service (Python)

Deploy to: Railway, Render, Google Cloud Run, AWS Lambda

```bash
# Build command: pip install -r requirements.txt
# Start command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Frontend

Deploy to: Vercel, Netlify, Cloudflare Pages

```bash
# Build command: npm run build
# Output directory: dist
# Environment variables: VITE_API_URL
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**TalentVault Team**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: contact@talentvault.com

---

## 🙏 Acknowledgments

- Supabase for database and storage
- Sentence Transformers for embeddings
- React and Vite teams
- FastAPI community
- All contributors

---

<div align="center">

**Built with ❤️ for modern recruitment**

[⭐ Star this repo](https://github.com/yourusername/TalentVault) if you find it helpful!

</div>