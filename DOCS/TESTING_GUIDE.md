# API Endpoint Testing Script

This document provides curl commands to test all TalentVault API endpoints.

## Prerequisites

1. Backend running on http://localhost:5000
2. AI Service running on http://localhost:8000
3. Frontend running on http://localhost:5173

---

## AI Service Endpoints (Port 8000)

### 1. Health Check
```bash
curl http://localhost:8000/health
```

Expected Response:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "version": "1.0.0"
}
```

### 2. Root Endpoint
```bash
curl http://localhost:8000/
```

Expected Response:
```json
{
  "service": "TalentVault AI Service",
  "version": "1.0.0",
  "status": "running",
  "endpoints": [
    "/health",
    "/parse-resume",
    "/generate-embeddings",
    "/semantic-search",
    "/generate-summary"
  ]
}
```

---

## Backend Endpoints (Port 5000)

### 1. Health Check
```bash
curl http://localhost:5000/api/v1/health
```

### 2. Register Recruiter
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Recruiter",
    "email": "recruiter@test.com",
    "password": "TestPass123!",
    "company": "Test Company"
  }'
```

Save the `token` from the response.

### 3. Login Recruiter
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "recruiter@test.com",
    "password": "TestPass123!"
  }'
```

Save the `token` for authenticated requests.

### 4. Get Job Roles (Public)
```bash
curl http://localhost:5000/api/v1/job-roles
```

### 5. Get Candidate Statistics (Authenticated)
```bash
curl http://localhost:5000/api/v1/candidates/statistics \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Get All Candidates (Authenticated)
```bash
curl http://localhost:5000/api/v1/candidates \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 7. Search Candidates (Authenticated)
```bash
curl -X POST http://localhost:5000/api/v1/candidates/search \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "React developer with 3 years experience"
  }'
```

### 8. Update Candidate Status (Authenticated)
```bash
curl -X PUT http://localhost:5000/api/v1/candidates/CANDIDATE_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Shortlisted",
    "notes": "Good candidate for interview"
  }'
```

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
