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

---

## 📋 Complete Testing Checklist

### Local Environment
- [ ] AI Service health check responds
- [ ] Backend health check responds
- [ ] Can register new recruiter
- [ ] Can login with credentials
- [ ] Can get job roles list (public)
- [ ] Can submit application (public)
- [ ] Can get statistics (authenticated)
- [ ] Can get all candidates (authenticated)
- [ ] Can search candidates (authenticated)
- [ ] Can update candidate status (authenticated)

### Production Environment
- [ ] All services accessible via HTTPS
- [ ] Frontend loads correctly
- [ ] Can submit application from production frontend
- [ ] Can register and login
- [ ] Dashboard loads with data
- [ ] Analytics page shows charts
- [ ] Resume preview works
- [ ] AI search functions correctly

---

## PowerShell Test Script

Save this as `test-endpoints.ps1`:

```powershell
# TalentVault API Test Script
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "TalentVault API Endpoint Tests" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Test AI Service
Write-Host "`n1. Testing AI Service Health..." -ForegroundColor Yellow
try {
    $aiHealth = Invoke-RestMethod -Uri "http://localhost:8000/health" -Method Get
    Write-Host "✓ AI Service Status: $($aiHealth.status)" -ForegroundColor Green
    Write-Host "✓ Model Loaded: $($aiHealth.model_loaded)" -ForegroundColor Green
} catch {
    Write-Host "✗ AI Service Failed: $_" -ForegroundColor Red
}

# Test Backend Health
Write-Host "`n2. Testing Backend Health..." -ForegroundColor Yellow
try {
    $backendHealth = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/health" -Method Get
    Write-Host "✓ Backend Status: $($backendHealth.status)" -ForegroundColor Green
} catch {
    Write-Host "✗ Backend Failed: $_" -ForegroundColor Red
}

# Test Job Roles
Write-Host "`n3. Testing Job Roles Endpoint..." -ForegroundColor Yellow
try {
    $roles = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/job-roles" -Method Get
    Write-Host "✓ Retrieved $($roles.data.Count) job roles" -ForegroundColor Green
} catch {
    Write-Host "✗ Job Roles Failed: $_" -ForegroundColor Red
}

# Test Registration
Write-Host "`n4. Testing Recruiter Registration..." -ForegroundColor Yellow
$registerBody = @{
    fullName = "Test Recruiter $(Get-Date -Format 'HHmmss')"
    email = "test$(Get-Date -Format 'HHmmss')@test.com"
    password = "TestPass123!"
    company = "Test Company"
} | ConvertTo-Json

try {
    $register = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $registerBody
    
    $token = $register.data.token
    Write-Host "✓ Registration successful" -ForegroundColor Green
    Write-Host "✓ Token received" -ForegroundColor Green

    # Test authenticated endpoint
    Write-Host "`n5. Testing Authenticated Endpoint..." -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $stats = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/candidates/statistics" `
        -Method Get `
        -Headers $headers
    
    Write-Host "✓ Statistics retrieved" -ForegroundColor Green
    Write-Host "  Total Candidates: $($stats.data.totalCandidates)" -ForegroundColor Cyan
    
} catch {
    Write-Host "✗ Registration/Auth Failed: $_" -ForegroundColor Red
}

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "Testing Complete!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
```

Run with:
```bash
powershell -ExecutionPolicy Bypass -File test-endpoints.ps1
```

---

## Python Test Script

Save this as `test_endpoints.py`:

```python
import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:5000/api/v1"
AI_URL = "http://localhost:8000"

def test_ai_service():
    """Test AI Service endpoints"""
    print("\n" + "="*50)
    print("Testing AI Service")
    print("="*50)
    
    # Health check
    try:
        response = requests.get(f"{AI_URL}/health")
        print(f"✓ AI Health: {response.json()}")
    except Exception as e:
        print(f"✗ AI Health Failed: {e}")
    
    # Root endpoint
    try:
        response = requests.get(AI_URL)
        print(f"✓ AI Root: {response.json()}")
    except Exception as e:
        print(f"✗ AI Root Failed: {e}")

def test_backend():
    """Test Backend endpoints"""
    print("\n" + "="*50)
    print("Testing Backend API")
    print("="*50)
    
    # Health check
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✓ Backend Health: {response.json()}")
    except Exception as e:
        print(f"✗ Backend Health Failed: {e}")
    
    # Job roles
    try:
        response = requests.get(f"{BASE_URL}/job-roles")
        data = response.json()
        print(f"✓ Job Roles: {len(data['data'])} roles available")
    except Exception as e:
        print(f"✗ Job Roles Failed: {e}")
    
    # Register and login
    timestamp = datetime.now().strftime("%H%M%S")
    register_data = {
        "fullName": f"Test Recruiter {timestamp}",
        "email": f"test{timestamp}@test.com",
        "password": "TestPass123!",
        "company": "Test Company"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
        data = response.json()
        token = data['data']['token']
        print(f"✓ Registration successful")
        
        # Test authenticated endpoint
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/candidates/statistics", headers=headers)
        stats = response.json()
        print(f"✓ Statistics: {stats['data']['totalCandidates']} total candidates")
        
    except Exception as e:
        print(f"✗ Auth Failed: {e}")

if __name__ == "__main__":
    test_ai_service()
    test_backend()
    print("\n" + "="*50)
    print("Testing Complete!")
    print("="*50)
```

Run with:
```bash
python test_endpoints.py
```

---

## Manual Testing Checklist

- [ ] AI Service health check responds
- [ ] Backend health check responds  
- [ ] Can register new recruiter
- [ ] Can login with credentials
- [ ] Can get job roles list
- [ ] Can get candidate statistics (auth required)
- [ ] Can get all candidates (auth required)
- [ ] Can search candidates (auth required)
- [ ] Can update candidate status (auth required)
- [ ] Frontend can connect to backend
- [ ] Application form submission works
- [ ] Resume upload works
- [ ] AI parsing triggers

---

## Common Issues

### Port Already in Use
```bash
# Windows - Kill process on port
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### CORS Errors
- Check AI Service allows backend origin
- Check backend allows frontend origin

### 500 Errors
- Check environment variables
- Check GROQ API key is valid
- Check Supabase credentials
- Check logs in terminal

---

## Success Indicators

✅ AI Service responds to health check  
✅ Backend responds to health check  
✅ Can create recruiter account  
✅ Can authenticate and get token  
✅ Can access protected endpoints with token  
✅ All CRUD operations work  
✅ Search functionality works  

---

Ready to test! 🚀
