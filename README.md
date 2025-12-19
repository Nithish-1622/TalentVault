# 🎯 TalentVault - AI-Powered Recruitment Platform

<div align="center">

![TalentVault](https://img.shields.io/badge/TalentVault-AI%20Recruitment-0ea5e9?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Node](https://img.shields.io/badge/node-18.x-brightgreen?style=for-the-badge&logo=node.js)
![Python](https://img.shields.io/badge/python-3.13-blue?style=for-the-badge&logo=python)
![React](https://img.shields.io/badge/react-18.x-61dafb?style=for-the-badge&logo=react)

**Enterprise-grade talent intelligence platform powered by AI**

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-talent--vault--eight.vercel.app-success?style=for-the-badge)](https://talent-vault-eight.vercel.app/)

[Features](#-key-features) • [Architecture](#-architecture) • [Quick Start](#-quick-start) • [API Docs](#-api-documentation) • [Deployment](#-deployment)

</div>

---

### 🌐 Live Production URLs

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | https://talent-vault-eight.vercel.app | ✅ Active |
| **Backend API** | https://talentvault-backend.onrender.com | ✅ Active |
| **AI Service** | https://talentvault-ai-service.onrender.com | ✅ Active |

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Running the App](#-running-the-application)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Project Structure](#-project-structure)
- [Security](#-security-features)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**TalentVault** is a production-ready, enterprise-grade recruitment platform that revolutionizes talent acquisition through AI-powered resume intelligence. Built with modern microservices architecture, it provides recruiters with comprehensive tools for candidate management, intelligent search, and data-driven hiring decisions.

### 🌟 What Makes TalentVault Different

- **🤖 AI-First Approach**: GROQ-powered resume parsing, skill extraction (100+ skills), and semantic search
- **📊 Advanced Analytics**: Real-time hiring funnel metrics with Recharts visualizations  
- **🎨 Modern UX**: Professional, calm interface with Lottie animations and responsive design
- **🔍 Intelligent Matching**: AI-powered job role matching based on skills and experience  
- **📄 Resume Intelligence**: Automatic extraction of skills, education, certifications, and languages
- **⚡ Zero-Friction Application**: 5-field form for candidates, no account required
- **🏗️ Scalable Architecture**: Microservices design with independent scaling capabilities

---

## ✨ Key Features

### 🎨 Comprehensive Dashboard

#### **Sidebar Navigation**
- 7 intuitive sections: Overview, Candidates, Applications, Job Roles, AI Search, Analytics, Settings
- Collapsible sidebar for desktop, drawer mode for mobile  
- Color-coded navigation with smooth animations

#### **Overview Dashboard**
- Real-time statistics cards (Total, Applied, Shortlisted, Interviewed, Hired)
- Trend indicators with percentage changes  
- Recent applications feed (top 5 latest)
- Quick action buttons

#### **Advanced Analytics with Recharts**
- 📊 **Hiring Funnel Visualization** (BarChart) - Track conversion rates at each stage
- 🥧 **Status Distribution** (PieChart) - Pipeline breakdown by status  
- 📈 **Applications Timeline** (LineChart) - Monitor application trends over time
- 📉 **Top Skills Analysis** (BarChart) - Identify in-demand skills from candidates
- Real-time key metrics with conversion rate calculations

### 🤖 AI-Powered Intelligence

#### **Comprehensive Resume Processing**
- ✅ **100+ Tech Skills** - Automatic extraction (React, Python, AWS, Docker, Kubernetes, etc.)
- ✅ **Education Parsing** - Degrees, institutions, graduation years  
- ✅ **Certifications** - Professional certifications with dates
- ✅ **Experience Calculation** - Auto-estimate years of experience  
- ✅ **Language Detection** - 18+ spoken languages identified
- ✅ **Full Text Extraction** - PDF and DOCX file support

#### **AI Job Role Matching**
- 🎯 **Match Score Algorithm** - 0-100% compatibility rating based on skills
- 🎨 **Visual Progress Bars** - Color-coded match levels (green/yellow/red)  
- ✅ **Matching Skills** - Green badges for skills that match role requirements
- ❌ **Skills Gap Analysis** - Red badges highlighting missing requirements  
- 🏆 **Top 3 Recommendations** - Best role matches displayed per candidate

#### **Semantic Search**
- Natural language queries: *"Backend developers with Python and FastAPI"*
- AI-powered relevance scoring with GROQ embeddings  
- 5 pre-built example queries for user guidance
- Results ranked by match percentage

### 👥 Enhanced Candidate Management

#### **Candidates Page Features**
- 📋 **Table View** with bulk selection checkboxes
- 🔍 **Advanced Filters** - Experience range, skills, date ranges  
- 📤 **Bulk Actions** - Mass status updates, export to CSV
- 👁️ **Resume Preview Modal** - In-app PDF viewer with download button

#### **Candidate Detail Modal**
- **Contact Information** - Email, phone, status, application date
- **Resume Preview** - Embedded PDF viewer or DOCX text fallback  
- **Skills Display** - All extracted skills with purple badges
- **Education History** - Degrees, institutions, graduation years  
- **Certifications** - Professional credentials with dates
- **Languages** - Blue badges for spoken languages  
- **AI Summary** - Auto-generated candidate overview
- **Job Role Matches** - Top 3 matches with scores and skills comparison

### 🎯 Job Role Management

- **Full CRUD Operations** - Create, Read, Update, Delete job roles
- **Modal Forms** - Add/edit roles with validation  
- **15 Pre-loaded Roles** - Frontend, Backend, DevOps, Data Science, ML Engineer, etc.
- **Role Requirements** - Comma-separated skills per role  
- **Role Descriptions** - Detailed job descriptions for matching

### 🎨 Applicant Experience

- **5-Field Application Form** - Name, Email, Phone, Role, Resume upload
- **No Login Required** - Zero friction application process  
- **Lottie Animations** - Engaging visual experience on Apply page
- **File Upload** - PDF/DOCX support with 5MB max size  
- **Instant AI Processing** - Resume analyzed immediately upon submission

---

## 🏗 Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    Frontend (Vercel)                           │
│     React 18 + Vite + Tailwind + Recharts + Lottie           │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────────┐   │
│  │   Apply Page │ │ Auth Pages   │ │  Dashboard Portal  │   │
│  │  (Public)    │ │ (Public)     │ │   (Protected)      │   │
│  └──────────────┘ └──────────────┘ └────────────────────┘   │
└─────────────────────────────┬──────────────────────────────────┘
                              │ HTTPS/REST
                              │ JWT Auth
                              ▼
┌────────────────────────────────────────────────────────────────┐
│              Node.js Backend API (Render)                      │
│                     Express + Supabase                         │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────────┐   │
│  │     Auth     │ │  Candidates  │ │    Job Roles       │   │
│  │   Service    │ │   Service    │ │     Service        │   │
│  └──────────────┘ └──────────────┘ └────────────────────┘   │
└───────┬──────────────────────────────────────────┬────────────┘
        │ Internal REST                            │ SQL Queries
        │ (Resume Processing)                      │
        ▼                                          ▼
┌──────────────────────────┐      ┌────────────────────────────┐
│  Python AI Service       │      │      Supabase Cloud        │
│  (Render - FastAPI)      │      │                            │
│                          │      │  ┌──────────────────────┐ │
│  ┌────────────────────┐ │      │  │  PostgreSQL Database │ │
│  │  Resume Parser     │ │      │  │  - recruiters        │ │
│  │  - PDF/DOCX        │ │      │  │  - candidates        │ │
│  │  - Skills (100+)   │ │      │  │  - ai_insights       │ │
│  │  - Education       │ │      │  │  - job_roles         │ │
│  │  - Certifications  │ │      │  │  - activity_log      │ │
│  └────────────────────┘ │      │  └──────────────────────┘ │
│                          │      │                            │
│  ┌────────────────────┐ │      │  ┌──────────────────────┐ │
│  │  GROQ AI (LLM)     │ │      │  │  Storage (S3-like)   │ │
│  │  - llama-3.3-70b   │ │      │  │  - Resume files      │ │
│  │  - Summaries       │ │      │  │  - PDF/DOCX          │ │
│  └────────────────────┘ │      │  └──────────────────────┘ │
│                          │      │                            │
│  ┌────────────────────┐ │      └────────────────────────────┘
│  │  Semantic Search   │ │
│  │  - Embeddings      │ │
│  │  - Transformers    │ │
│  └────────────────────┘ │
└──────────────────────────┘
```

### 🎯 Design Principles

| Principle | Implementation |
|-----------|----------------|
| **🔒 Security First** | JWT auth, bcrypt hashing, rate limiting, CORS, Helmet.js |
| **🎨 Separation of Concerns** | Frontend → Backend → AI Service (never direct) |
| **📈 Scalability** | Independent microservices, horizontal scaling ready |
| **⚡ Performance** | CDN (Vercel), caching, optimized queries, lazy loading |
| **🧪 Maintainability** | Clean code, modular architecture, comprehensive error handling |

---

## 🛠 Tech Stack

### Frontend (React + Vite)

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Framework | 18.2.0 |
| **Vite** | Build Tool & Dev Server | 5.0.8 |
| **Tailwind CSS** | Utility-First Styling | 3.4.0 |
| **React Router DOM** | Client-Side Routing | 6.21.1 |
| **Axios** | HTTP Client | 1.6.5 |
| **Recharts** | Data Visualization & Charts | 2.10.3 |
| **Lucide React** | Icon Library | 0.303.0 |
| **React Hot Toast** | Toast Notifications | 2.4.1 |
| **@lottiefiles/dotlottie-react** | Lottie Animations | 0.11.6 |

### Backend (Node.js + Express)

| Technology | Purpose | Version |
|------------|---------|---------|
| **Express** | Web Framework | 4.18.2 |
| **@supabase/supabase-js** | Database Client | 2.39.1 |
| **jsonwebtoken** | JWT Authentication | 9.0.2 |
| **bcryptjs** | Password Hashing | 2.4.3 |
| **Multer** | File Upload Handling | 1.4.5-lts.1 |
| **Helmet** | Security Headers | 7.1.0 |
| **Morgan** | HTTP Request Logging | 1.10.0 |
| **express-validator** | Input Validation | 7.0.1 |
| **dotenv** | Environment Variables | 16.3.1 |
| **cors** | Cross-Origin Requests | 2.8.5 |

### AI Service (Python + FastAPI)

| Technology | Purpose | Version |
|------------|---------|---------|
| **FastAPI** | Async Web Framework | 0.115.6 |
| **Uvicorn** | ASGI Server | 0.34.0 |
| **Pydantic** | Data Validation | 2.10.5 |
| **python-multipart** | File Upload Support | 0.0.20 |
| **PyPDF2** | PDF Text Extraction | 3.0.1 |
| **python-docx** | DOCX Text Extraction | 1.1.2 |
| **GROQ** | LLM Inference API (llama-3.3-70b) | 0.12.0 |
| **sentence-transformers** | Semantic Embeddings | 3.3.1 |

### Infrastructure

| Service | Purpose |
|---------|---------|
| **Supabase** | PostgreSQL Database + Storage |
| **Vercel** | Frontend Hosting & CDN |
| **Render** | Backend & AI Service Hosting |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x+ ([Download](https://nodejs.org/))
- **Python** 3.13+ ([Download](https://www.python.org/))
- **Git** ([Download](https://git-scm.com/))
- **Accounts**: [Supabase](https://supabase.com/) (free), [GROQ API](https://console.groq.com/) (free)

---

## 🔧 Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Nithish-1622/TalentVault.git
cd TalentVault
```

### 2️⃣ Database Setup (Supabase)

1. Create project at [supabase.com](https://supabase.com/)
2. Go to **SQL Editor** → Run `database/schema.sql`
3. (Optional) Run `database/seed.sql` for sample data
4. **Storage** → Create bucket `resumes` (public)
5. **Settings** → **API** → Copy credentials

### 3️⃣ Backend Setup

```bash
cd backend
npm install

# Create .env file
cat > .env << 'EOF'
NODE_ENV=development
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_random_secret_key_here
AI_SERVICE_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:5173
EOF

# Generate strong JWT secret (optional)
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4️⃣ AI Service Setup

```bash
cd ../ai-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << 'EOF'
ENVIRONMENT=development
PORT=8000
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
EOF

# Get free GROQ API key from: https://console.groq.com
```

### 5️⃣ Frontend Setup

```bash
cd ../frontend
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api/v1" > .env
```

---

## ▶️ Running the Application

Open **three terminals**:

### Terminal 1: Backend

```bash
cd backend
npm run dev
# → http://localhost:5000
```

### Terminal 2: AI Service

```bash
cd ai-service
# Activate venv first (if not already)
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
# → http://localhost:8000
```

### Terminal 3: Frontend

```bash
cd frontend
npm run dev
# → http://localhost:5173
```

**🎉 Visit**: http://localhost:5173

---

## 🎮 Usage Guide

### 👤 For Applicants

1. Visit `/apply`
2. Fill 5 fields: Name, Email, Phone, Role, Resume
3. Upload PDF/DOCX (max 5MB)
4. Submit → AI processes resume in background

### 👔 For Recruiters

**First Time:**
1. `/register` → Create account
2. `/login` → Access dashboard

**Dashboard Features:**
- **Overview** - Real-time statistics, recent candidates
- **Candidates** - Table view, bulk actions, resume preview
- **AI Search** - Natural language queries
- **Analytics** - Hiring funnel, charts, metrics
- **Job Roles** - CRUD operations for positions

---

## 📚 API Documentation

### 🔗 Base URLs

- **Local**: `http://localhost:5000/api/v1`
- **Production**: `https://talentvault-backend.onrender.com/api/v1`

### 🔐 Authentication

All protected endpoints require JWT token:

```http
Authorization: Bearer <token>
```

### 📋 Endpoints Overview

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/register` | POST | ❌ | Create recruiter account |
| `/auth/login` | POST | ❌ | Login and get JWT token |
| `/auth/profile` | GET | ✅ | Get recruiter profile |
| `/candidates/apply` | POST | ❌ | Submit application (public) |
| `/candidates` | GET | ✅ | Get all candidates |
| `/candidates/:id` | GET | ✅ | Get candidate details |
| `/candidates/:id/status` | PUT | ✅ | Update status |
| `/candidates/search` | POST | ✅ | AI semantic search |
| `/candidates/statistics` | GET | ✅ | Get statistics |
| `/job-roles` | GET | ❌ | Get all job roles |
| `/job-roles/:id` | GET | ❌ | Get job role details |
| `/health` | GET | ❌ | Health check |

### 📝 Example Requests

#### Register Recruiter

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "recruiter@company.com",
    "password": "Password123!",
    "fullName": "John Doe",
    "companyName": "Tech Corp"
  }'
```

#### Submit Application

```bash
curl -X POST http://localhost:5000/api/v1/candidates/apply \
  -F "fullName=Jane Smith" \
  -F "email=jane@email.com" \
  -F "phone=+1-555-0123" \
  -F "jobRoleText=Backend Developer" \
  -F "resume=@resume.pdf"
```

#### AI Semantic Search

```bash
curl -X POST http://localhost:5000/api/v1/candidates/search \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"query": "Backend developers with Python and FastAPI"}'
```

---

## 🗄 Database Schema

### Main Tables Overview

| Table | Records | Purpose |
|-------|---------|---------|
| **recruiters** | Auth data | Recruiter accounts, auth tokens |
| **candidates** | Core data | Applicant profiles, resumes |
| **ai_insights** | AI data | Skills, education, certifications, experience |
| **job_roles** | 15+ roles | Available positions with requirements |
| **applications** | Tracking | Application status history |
| **activity_log** | Audit | All system activities |
| **search_queries** | Analytics | Search patterns and trends |

### Views

- **candidate_dashboard** - Joins candidates + ai_insights for recruiter view

See [`database/schema.sql`](database/schema.sql) for complete schema.

---

## 📁 Project Structure

```
TalentVault/
├── 🎨 frontend/                      # React 18 + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx           # Dashboard navigation
│   │   │   ├── DashboardLayout.jsx   # Layout wrapper
│   │   │   ├── StatusBadge.jsx       # Status indicators
│   │   │   └── Loader.jsx            # Loading states
│   │   ├── pages/
│   │   │   ├── ApplyPage.jsx         # Public application form
│   │   │   ├── LoginPage.jsx         # Recruiter login
│   │   │   ├── RegisterPage.jsx      # Recruiter registration
│   │   │   ├── OverviewPage.jsx      # Dashboard home
│   │   │   ├── CandidatesPage.jsx    # Candidate management + preview
│   │   │   ├── AnalyticsPage.jsx     # Charts & metrics
│   │   │   ├── AISearchPage.jsx      # Semantic search
│   │   │   ├── JobRolesPage.jsx      # Job CRUD
│   │   │   └── SettingsPage.jsx      # Settings
│   │   ├── services/
│   │   │   ├── api.js                # Axios instance
│   │   │   ├── authService.js        # Authentication
│   │   │   ├── candidateService.js   # Candidate APIs
│   │   │   └── jobRoleService.js     # Job role APIs
│   │   ├── utils/
│   │   │   └── jobMatcher.js         # AI job matching logic
│   │   └── App.jsx                   # Routes
│   └── package.json
│
├── 🟢 backend/                       # Node.js Express API
│   ├── src/
│   │   ├── config/
│   │   │   ├── index.js              # Environment config
│   │   │   └── supabase.js           # DB client
│   │   ├── controllers/
│   │   │   ├── authController.js     # Auth handlers
│   │   │   ├── candidateController.js
│   │   │   └── jobRoleController.js
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT verification
│   │   │   ├── upload.js             # Multer config
│   │   │   └── validators.js         # Input validation
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── candidateRoutes.js
│   │   │   └── jobRoleRoutes.js
│   │   ├── services/
│   │   │   ├── authService.js        # Business logic
│   │   │   ├── candidateService.js
│   │   │   └── jobRoleService.js
│   │   └── index.js                  # Entry point
│   └── package.json
│
├── 🐍 ai-service/                    # Python FastAPI
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints/
│   │   │   │   ├── resume.py         # Resume parsing
│   │   │   │   └── search.py         # Semantic search
│   │   ├── core/
│   │   │   ├── config.py             # Settings
│   │   │   └── constants.py          # Skill lists
│   │   ├── models/
│   │   │   └── schemas.py            # Pydantic models
│   │   ├── services/
│   │   │   ├── resume_parser.py      # PDF/DOCX extraction
│   │   │   ├── skill_extractor.py    # AI skill detection
│   │   │   └── semantic_search.py    # Embeddings
│   │   └── main.py                   # Entry point
│   └── requirements.txt
│
├── 🗄️ database/                      # Database files
│   ├── schema.sql                    # PostgreSQL schema
│   ├── seed.sql                      # Sample data
│   └── migrations/
│       └── add_job_role_fields.sql   # Role requirements
│
├── DEPLOYMENT_GUIDE.md               # Deployment steps
└── README.md                         # This file
```

---

## 🔒 Security Features

| Feature | Implementation | Status |
|---------|----------------|--------|
| **Authentication** | JWT tokens (7-day expiry) | ✅ |
| **Password Security** | bcrypt hashing (10 rounds) | ✅ |
| **Authorization** | Role-based access control | ✅ |
| **Rate Limiting** | 100 req/15min per IP | ✅ |
| **CORS** | Whitelist origins only | ✅ |
| **Input Validation** | express-validator | ✅ |
| **SQL Injection** | Parameterized queries (Supabase) | ✅ |
| **XSS Protection** | Helmet.js headers | ✅ |
| **File Upload** | Type + size validation (5MB max) | ✅ |
| **Environment Vars** | .env files (never committed) | ✅ |

---

## 🚀 Deployment

### Current Production Setup

| Service | Platform | URL |
|---------|----------|-----|
| **Frontend** | Vercel | https://talent-vault-eight.vercel.app |
| **Backend** | Render | https://talentvault-backend.onrender.com |
| **AI Service** | Render | https://talentvault-ai-service.onrender.com |

### Quick Deploy Instructions

#### Frontend (Vercel)

1. Import GitHub repo to [Vercel](https://vercel.com/)
2. Set root directory: `frontend`
3. Framework preset: `Vite`
4. Add environment variable:
   ```
   VITE_API_URL=https://talentvault-backend.onrender.com/api/v1
   ```
5. Click **Deploy**

#### Backend (Render)

1. New Web Service → Connect GitHub repo
2. Root directory: `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables:
   ```
   NODE_ENV=production
   SUPABASE_URL=<your_supabase_url>
   SUPABASE_ANON_KEY=<your_anon_key>
   SUPABASE_SERVICE_ROLE_KEY=<your_service_key>
   JWT_SECRET=<random_secret_32+_chars>
   AI_SERVICE_URL=https://talentvault-ai-service.onrender.com
   CORS_ORIGIN=https://talent-vault-eight.vercel.app
   ```

#### AI Service (Render)

1. New Web Service → Connect GitHub repo
2. Root directory: `ai-service`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   ```
   ENVIRONMENT=production
   GROQ_API_KEY=<your_groq_api_key>
   GROQ_MODEL=llama-3.3-70b-versatile
   ```

See [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 🤝 Contributing

Contributions are welcome! Follow these steps:

1. **Fork** the repository
2. **Create** feature branch: `git checkout -b feature/AmazingFeature`
3. **Commit** changes: `git commit -m 'Add AmazingFeature'`
4. **Push** to branch: `git push origin feature/AmazingFeature`
5. **Open** Pull Request

### Development Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Keep commits atomic and descriptive

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) for details.

---

## 👨‍💻 Author

**Nithish**

- 🐙 GitHub: [@Nithish-1622](https://github.com/Nithish-1622)
- 🌐 Live Demo: [talent-vault-eight.vercel.app](https://talent-vault-eight.vercel.app)
- 📧 Contact: [GitHub Issues](https://github.com/Nithish-1622/TalentVault/issues)

---

## 🙏 Acknowledgments

- **Supabase** - Database & storage infrastructure
- **GROQ** - Lightning-fast LLM inference  
- **Vercel** - Frontend hosting & CDN
- **Render** - Backend & AI service hosting
- **Recharts** - Beautiful data visualizations
- **Sentence Transformers** - Semantic embeddings
- **FastAPI** & **React** communities

---

## 📊 Project Stats

![GitHub Stars](https://img.shields.io/github/stars/Nithish-1622/TalentVault?style=social)
![GitHub Forks](https://img.shields.io/github/forks/Nithish-1622/TalentVault?style=social)
![GitHub Issues](https://img.shields.io/github/issues/Nithish-1622/TalentVault)
![GitHub License](https://img.shields.io/github/license/Nithish-1622/TalentVault)

---

<div align="center">

### 🌟 Built with ❤️ for Modern Recruitment

**Production-Ready • AI-Powered • Enterprise-Grade**

[![Deploy on Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/Nithish-1622/TalentVault)
[![Deploy on Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

[⭐ Star this repo](https://github.com/Nithish-1622/TalentVault) • [🐛 Report Bug](https://github.com/Nithish-1622/TalentVault/issues) • [💡 Request Feature](https://github.com/Nithish-1622/TalentVault/issues)

---

**© 2025 TalentVault. All rights reserved.**

*Transforming recruitment through AI* 🚀

</div>
