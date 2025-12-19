# TalentVault - Developer Guide

## Development Workflow

### Adding a New Feature

1. **Backend API**
   - Add service in `backend/src/services/`
   - Add controller in `backend/src/controllers/`
   - Add route in `backend/src/routes/`
   - Test with Postman or curl

2. **Frontend**
   - Add service call in `frontend/src/services/`
   - Create/update component in `frontend/src/components/` or `frontend/src/pages/`
   - Style with Tailwind CSS

3. **Database**
   - Add migration SQL in `database/`
   - Update schema documentation

### Code Style

#### JavaScript (Backend & Frontend)
- Use ES6+ features
- Use async/await for promises
- Use meaningful variable names
- Add comments for complex logic
- Follow existing patterns

#### Python (AI Service)
- Follow PEP 8
- Use type hints
- Document functions with docstrings
- Keep services modular

### Environment Variables

#### Backend
```env
NODE_ENV=development|production
PORT=5000
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
JWT_EXPIRES_IN=7d
AI_SERVICE_URL=http://localhost:8000
AI_SERVICE_TIMEOUT=30000
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document
CORS_ORIGIN=http://localhost:5173
RESUME_BUCKET_NAME=resumes
```

#### AI Service
```env
ENVIRONMENT=development|production
HOST=0.0.0.0
PORT=8000
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
SIMILARITY_THRESHOLD=0.5
MAX_RESULTS=20
MAX_TEXT_LENGTH=50000
CHUNK_SIZE=512
```

#### Frontend
```env
VITE_API_URL=http://localhost:5000/api/v1
```

## Testing

### Manual Testing

#### Test Applicant Flow
```bash
# Using curl
curl -X POST http://localhost:5000/api/v1/candidates/apply \
  -F "fullName=Test User" \
  -F "email=test@example.com" \
  -F "phone=+1-555-0123" \
  -F "jobRoleText=Developer" \
  -F "resume=@/path/to/resume.pdf"
```

#### Test Recruiter Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"recruiter@test.com","password":"Test123456"}'
```

#### Test Semantic Search
```bash
curl -X POST http://localhost:5000/api/v1/candidates/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"query":"Backend developers with Python"}'
```

### Database Queries for Testing

```sql
-- Check candidates
SELECT * FROM candidates ORDER BY created_at DESC LIMIT 10;

-- Check AI insights
SELECT c.full_name, ai.skills, ai.summary 
FROM candidates c 
JOIN ai_insights ai ON c.id = ai.candidate_id;

-- Check statistics
SELECT status, COUNT(*) as count FROM candidates GROUP BY status;
```

## Architecture Deep Dive

### Request Flow

#### Applicant Submission
1. User fills form → Frontend
2. Frontend creates FormData with resume file
3. POST to `/api/v1/candidates/apply`
4. Backend validates file (type, size)
5. Backend uploads to Supabase Storage
6. Backend creates candidate record
7. Backend calls AI Service (async, non-blocking)
8. AI Service downloads resume from storage
9. AI Service parses PDF/DOCX
10. AI Service extracts skills, education, etc.
11. AI Service generates summary
12. AI Service creates embeddings
13. AI Service returns parsed data
14. Backend stores in `ai_insights` table
15. Frontend shows success message

#### Semantic Search
1. Recruiter enters natural language query
2. Frontend sends query to backend
3. Backend forwards to AI Service
4. AI Service generates query embedding
5. AI Service compares with candidate embeddings
6. AI Service returns ranked candidates
7. Backend enriches with full candidate data
8. Frontend displays ranked results

### Database Design

#### Key Relationships
- `candidates` ← 1:1 → `ai_insights`
- `candidates` ← N:1 → `job_roles`
- `candidates` ← 1:N → `applications`
- `recruiters` ← 1:N → `applications`
- `recruiters` ← 1:N → `search_queries`

#### Indexes
- Primary keys (UUID) on all tables
- Email indexes for fast lookup
- Status indexes for filtering
- Created_at indexes for sorting
- GIN indexes on JSONB columns (skills, education)

### AI Service Details

#### Models Used
- **sentence-transformers/all-MiniLM-L6-v2**: Lightweight embedding model (380MB)
- **Alternative**: all-mpnet-base-v2 (420MB, more accurate)

#### Resume Parsing Strategy
1. Download resume from URL
2. Detect file type (PDF/DOCX)
3. Extract text with appropriate library
4. Clean and normalize text
5. Apply regex patterns for:
   - Skills (using predefined keyword lists)
   - Education (degree patterns)
   - Experience (year mentions, date ranges)
   - Languages (common language names)
6. Generate summary based on extracted data

#### Embedding Generation
- Text is truncated to 5000 chars max
- Embeddings are 384-dimensional vectors
- Stored as arrays (could use pgvector for production)
- Similarity calculated with cosine distance

## Performance Optimization

### Backend
- Use connection pooling with Supabase
- Implement Redis caching for frequent queries
- Add pagination for large result sets
- Optimize database indexes

### AI Service
- Cache embeddings in memory or Redis
- Use batch processing for multiple resumes
- Consider GPU acceleration for large scale
- Implement async workers for processing

### Frontend
- Lazy load components
- Implement virtual scrolling for large lists
- Optimize images and assets
- Use React.memo for expensive components

## Security Best Practices

1. **Never commit `.env` files**
2. **Use strong JWT secrets** (32+ random chars)
3. **Validate all inputs** on backend
4. **Sanitize file uploads**
5. **Rate limit API endpoints**
6. **Use HTTPS in production**
7. **Keep dependencies updated**
8. **Implement RBAC** for multiple recruiter roles
9. **Log security events**
10. **Regular security audits**

## Deployment Checklist

### Pre-Deployment
- [ ] All environment variables configured
- [ ] Database migrations run
- [ ] Storage buckets created
- [ ] CORS configured for production domain
- [ ] Rate limits adjusted for production
- [ ] Logs configured
- [ ] Error tracking setup (Sentry, etc.)

### Backend Deployment
- [ ] Set NODE_ENV=production
- [ ] Configure production database URL
- [ ] Set up SSL/TLS
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up process manager (PM2)
- [ ] Configure health checks
- [ ] Set up monitoring

### AI Service Deployment
- [ ] Pre-download ML models in container
- [ ] Configure appropriate instance size (2GB+ RAM)
- [ ] Set up health checks
- [ ] Configure timeouts for long operations
- [ ] Monitor memory usage

### Frontend Deployment
- [ ] Build with `npm run build`
- [ ] Configure production API URL
- [ ] Set up CDN for static assets
- [ ] Configure caching headers
- [ ] Set up analytics
- [ ] Configure error boundaries

## Common Issues and Solutions

### Issue: Slow Resume Processing
**Solution**: Implement queue system (Bull, RabbitMQ) for async processing

### Issue: Large Database
**Solution**: Implement archiving for old applications, add pagination

### Issue: High Memory Usage (AI Service)
**Solution**: Use smaller embedding model or implement model caching

### Issue: Slow Search
**Solution**: Use pgvector extension for efficient vector search

## Future Enhancements

- [ ] Email notifications for applicants
- [ ] Calendar integration for interviews
- [ ] Bulk candidate import
- [ ] Advanced analytics dashboard
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Video resume support
- [ ] Integration with LinkedIn
- [ ] Automated screening questions
- [ ] Candidate ranking algorithms

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Sentence Transformers](https://www.sbert.net/)

## Support

For issues or questions:
1. Check this documentation
2. Review GitHub issues
3. Contact the development team
4. Open a new issue with details

## License

MIT License - See LICENSE file for details
