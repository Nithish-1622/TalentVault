# TalentVault - Quick Start Guide

This guide will help you get TalentVault up and running in under 15 minutes.

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Python 3.10+ installed
- [ ] Supabase account created
- [ ] Git installed

## Step-by-Step Setup

### 1. Supabase Setup (5 minutes)

1. Go to [supabase.com](https://supabase.com/) and create a new project
2. Wait for project to be ready
3. Navigate to **SQL Editor**
4. Copy the entire content from `database/schema.sql`
5. Paste and click **Run**
6. (Optional) Run `database/seed.sql` for sample data
7. Go to **Storage** → Click **New bucket**
   - Name: `resumes`
   - Set to **Public**
8. Go to **Settings** → **API**
   - Copy `Project URL`
   - Copy `anon public` key
   - Copy `service_role` key (keep this secret!)

### 2. Backend Setup (3 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `backend/.env`:
```env
NODE_ENV=development
PORT=5000

# Paste your Supabase credentials
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Generate a random secret (use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your_random_32_char_secret_here

# AI Service
AI_SERVICE_URL=http://localhost:8000

# CORS
CORS_ORIGIN=http://localhost:5173

# Storage
RESUME_BUCKET_NAME=resumes
```

### 3. AI Service Setup (4 minutes)

```bash
# Navigate to ai-service
cd ai-service

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies (this will take a few minutes)
pip install -r requirements.txt

# Create environment file
cp .env.example .env
```

Edit `ai-service/.env` and add your GROQ API key:
```env
ENVIRONMENT=development
HOST=0.0.0.0
PORT=8000

# Get your free GROQ API key from: https://console.groq.com
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

**Note**: GROQ is a fast AI inference service. Get your free API key at https://console.groq.com

### 4. Frontend Setup (2 minutes)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 5. Running Everything (1 minute)

Open **3 terminal windows**:

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
✅ Backend running on http://localhost:5000

#### Terminal 2 - AI Service
```bash
cd ai-service
# Activate venv if not already active
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
✅ AI Service running on http://localhost:8000

#### Terminal 3 - Frontend
```bash
cd frontend
npm run dev
```
✅ Frontend running on http://localhost:5173

## Test the Application

### Test 1: Applicant Flow

1. Open http://localhost:5173/apply
2. Fill in the form:
   - Full Name: Test Candidate
   - Email: test@example.com
   - Phone: +1-555-0123
   - Job Role: Select any
   - Upload a sample resume (PDF or DOCX)
3. Click Submit
4. You should see a success message

### Test 2: Recruiter Flow

1. Open http://localhost:5173/register
2. Create a recruiter account:
   - Email: recruiter@test.com
   - Password: Test12345678
   - Full Name: Test Recruiter
3. You'll be redirected to the dashboard
4. You should see the candidate you just created
5. Click "View Details" to see AI-extracted information
6. Try updating the status

### Test 3: AI Semantic Search

1. In the dashboard, enter a natural language query:
   - "Backend developers with Python experience"
   - "Frontend developers who know React"
2. Click "AI Search"
3. Results should be ranked by relevance

## Troubleshooting

### Issue: Backend won't start

**Error**: "Missing required environment variables"
- **Solution**: Make sure all variables in `.env` are filled

**Error**: "Cannot connect to Supabase"
- **Solution**: Check your Supabase URL and keys are correct

### Issue: AI Service fails to start

**Error**: "No module named 'sentence_transformers'"
- **Solution**: Make sure virtual environment is activated and run `pip install -r requirements.txt`

**Error**: "Model download fails"
- **Solution**: Check your internet connection. The model is 380MB

### Issue: Frontend can't connect to backend

**Error**: CORS or network errors
- **Solution**: Check that backend is running on port 5000
- **Solution**: Verify `VITE_API_URL` in frontend `.env`

### Issue: Resume upload fails

**Error**: "Failed to upload resume"
- **Solution**: Check that you created the `resumes` bucket in Supabase Storage
- **Solution**: Make sure the bucket is set to **Public**

## What's Next?

- Customize the job roles in Supabase
- Configure email notifications (optional)
- Set up analytics (optional)
- Deploy to production (see README.md)

## Getting Help

- Check the main README.md for detailed documentation
- Review the API documentation
- Check logs in terminal windows for error messages

## Success Checklist

- [ ] Backend running on port 5000
- [ ] AI Service running on port 8000
- [ ] Frontend running on port 5173
- [ ] Can submit application
- [ ] Can create recruiter account
- [ ] Can see candidates in dashboard
- [ ] Can perform semantic search
- [ ] Can update candidate status

If all boxes are checked, congratulations! TalentVault is fully operational. 🎉
