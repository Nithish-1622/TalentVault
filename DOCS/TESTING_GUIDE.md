# TalentVault - API Testing Guide

This document provides comprehensive testing commands for all TalentVault API endpoints across local and production environments.

## 🌐 Environment URLs

### Local Development
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api/v1
- **AI Service:** http://localhost:8000

### Production
- **Frontend:** https://talent-vault-eight.vercel.app
- **Backend API:** https://talentvault-backend.onrender.com/api/v1
- **AI Service:** https://talentvault-ai-service.onrender.com

---

## 🛠 Tech Stack

### Backend
- Express 4.18.2, Supabase 2.39.1, JWT 9.0.2, bcryptjs 2.4.3

### AI Service  
- FastAPI 0.115.6, GROQ 0.12.0 (llama-3.3-70b), sentence-transformers 3.3.1

---

## Prerequisites

### Local Testing
1. Backend running on http://localhost:5000
2. AI Service running on http://localhost:8000
3. Frontend running on http://localhost:5173

### Production Testing
1. Services deployed and running
2. Valid API credentials
3. curl or Postman installed

---

## 🧪 Backend API Endpoints Testing

### 1. Health Check

#### Local
```bash
curl http://localhost:5000/api/v1/health
```

#### Production
```bash
curl https://talentvault-backend.onrender.com/api/v1/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "TalentVault API is running",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

### 2. Register Recruiter

#### Local
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Recruiter",
    "email": "recruiter@test.com",
    "password": "TestPass123!",
    "companyName": "Test Company"
  }'
```

#### Production
```bash
curl -X POST https://talentvault-backend.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Recruiter",
    "email": "recruiter@test.com",
    "password": "TestPass123!",
    "companyName": "Test Company"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Recruiter registered successfully",
  "data": {
    "recruiter": {
      "id": "uuid",
      "email": "recruiter@test.com",
      "fullName": "Test Recruiter",
      "companyName": "Test Company"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Save the token for authenticated requests!**

---

### 3. Login Recruiter

#### Local
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "recruiter@test.com",
    "password": "TestPass123!"
  }'
```

#### Production
```bash
curl -X POST https://talentvault-backend.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "recruiter@test.com",
    "password": "TestPass123!"
  }'
```

---

### 4. Get Job Roles (Public - No Auth Required)

#### Local
```bash
curl http://localhost:5000/api/v1/job-roles
```

#### Production
```bash
curl https://talentvault-backend.onrender.com/api/v1/job-roles
```

**Expected Response:**
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "id": "uuid",
      "role_name": "Frontend Developer",
      "category": "Engineering",
      "requirements": "React, JavaScript, TypeScript, HTML, CSS"
    }
  ]
}
```

---

### 5. Submit Application (Public - No Auth Required)

#### Local
```bash
curl -X POST http://localhost:5000/api/v1/candidates/apply \
  -F "fullName=Alice Chen" \
  -F "email=alice@example.com" \
  -F "phone=+1-555-0101" \
  -F "jobRoleText=Backend Developer" \
  -F "resume=@/path/to/resume.pdf"
```

#### Production
```bash
curl -X POST https://talentvault-backend.onrender.com/api/v1/candidates/apply \
  -F "fullName=Alice Chen" \
  -F "email=alice@example.com" \
  -F "phone=+1-555-0101" \
  -F "jobRoleText=Backend Developer" \
  -F "resume=@/path/to/resume.pdf"
```

**Note:** Replace `/path/to/resume.pdf` with actual file path

---

### 6. Get Candidate Statistics (Authenticated)

#### Local
```bash
curl http://localhost:5000/api/v1/candidates/statistics \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Production
```bash
curl https://talentvault-backend.onrender.com/api/v1/candidates/statistics \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
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

### 7. Get All Candidates (Authenticated)

#### Local
```bash
curl http://localhost:5000/api/v1/candidates \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Production
```bash
curl https://talentvault-backend.onrender.com/api/v1/candidates \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 8. Semantic Search (Authenticated)

#### Local
```bash
curl -X POST http://localhost:5000/api/v1/candidates/search \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Backend developers with Python and FastAPI experience"
  }'
```

#### Production
```bash
curl -X POST https://talentvault-backend.onrender.com/api/v1/candidates/search \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Backend developers with Python and FastAPI experience"
  }'
```

---

### 9. Update Candidate Status (Authenticated)

#### Local
```bash
curl -X PUT http://localhost:5000/api/v1/candidates/CANDIDATE_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Shortlisted",
    "notes": "Strong candidate for interview"
  }'
```

#### Production
```bash
curl -X PUT https://talentvault-backend.onrender.com/api/v1/candidates/CANDIDATE_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Shortlisted",
    "notes": "Strong candidate for interview"
  }'
```

**Note:** Replace `CANDIDATE_ID` with actual UUID

---

## 🤖 AI Service Endpoints Testing

### 1. Health Check

#### Local
```bash
curl http://localhost:8000/health
```

#### Production
```bash
curl https://talentvault-ai-service.onrender.com/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "service": "TalentVault AI Service",
  "version": "1.0.0"
}
```

---

### 2. Root Endpoint

#### Local
```bash
curl http://localhost:8000/
```

#### Production
```bash
curl https://talentvault-ai-service.onrender.com/
```

**Expected Response:**
```json
{
  "service": "TalentVault AI Service",
  "version": "1.0.0",
  "status": "running",
  "groq_model": "llama-3.3-70b-versatile",
  "endpoints": [
    "/health",
    "/parse-resume",
    "/generate-summary"
  ]
}
```

**Note:** AI Service endpoints are called internally by the backend, not directly by frontend.











