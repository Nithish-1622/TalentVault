-- TalentVault Database Schema
-- Supabase PostgreSQL Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- RECRUITERS TABLE
-- ============================================
CREATE TABLE recruiters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_recruiters_email ON recruiters(email);
CREATE INDEX idx_recruiters_created_at ON recruiters(created_at DESC);

-- ============================================
-- JOB ROLES TABLE
-- ============================================
CREATE TABLE job_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_name VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_job_roles_name ON job_roles(role_name);
CREATE INDEX idx_job_roles_category ON job_roles(category);

-- Insert common job roles
INSERT INTO job_roles (role_name, category) VALUES
    ('Frontend Developer', 'Engineering'),
    ('Backend Developer', 'Engineering'),
    ('Full Stack Developer', 'Engineering'),
    ('DevOps Engineer', 'Engineering'),
    ('Data Scientist', 'Data & Analytics'),
    ('Machine Learning Engineer', 'Data & Analytics'),
    ('Product Manager', 'Product'),
    ('UI/UX Designer', 'Design'),
    ('QA Engineer', 'Engineering'),
    ('Mobile Developer', 'Engineering'),
    ('Software Architect', 'Engineering'),
    ('Business Analyst', 'Business'),
    ('Project Manager', 'Management'),
    ('Technical Writer', 'Documentation'),
    ('Cloud Engineer', 'Engineering');

-- ============================================
-- CANDIDATES TABLE
-- ============================================
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    job_role_id UUID REFERENCES job_roles(id) ON DELETE SET NULL,
    job_role_text VARCHAR(255),
    resume_url TEXT NOT NULL,
    resume_filename VARCHAR(500) NOT NULL,
    resume_file_size INTEGER,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'Applied',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_candidates_email ON candidates(email);
CREATE INDEX idx_candidates_job_role_id ON candidates(job_role_id);
CREATE INDEX idx_candidates_status ON candidates(status);
CREATE INDEX idx_candidates_applied_at ON candidates(applied_at DESC);
CREATE INDEX idx_candidates_created_at ON candidates(created_at DESC);

-- ============================================
-- AI INSIGHTS TABLE
-- ============================================
CREATE TABLE ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID UNIQUE REFERENCES candidates(id) ON DELETE CASCADE,
    extracted_text TEXT,
    summary TEXT,
    skills JSONB DEFAULT '[]'::jsonb,
    experience_years INTEGER,
    education JSONB DEFAULT '[]'::jsonb,
    certifications JSONB DEFAULT '[]'::jsonb,
    languages JSONB DEFAULT '[]'::jsonb,
    embedding_id VARCHAR(255),
    parsed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_insights_candidate_id ON ai_insights(candidate_id);
CREATE INDEX idx_ai_insights_skills ON ai_insights USING GIN(skills);
CREATE INDEX idx_ai_insights_education ON ai_insights USING GIN(education);

-- ============================================
-- APPLICATIONS TABLE (for tracking)
-- ============================================
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    job_role_id UUID REFERENCES job_roles(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'Applied',
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    recruiter_id UUID REFERENCES recruiters(id) ON DELETE SET NULL,
    recruiter_notes TEXT,
    status_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX idx_applications_job_role_id ON applications(job_role_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_recruiter_id ON applications(recruiter_id);
CREATE INDEX idx_applications_applied_at ON applications(applied_at DESC);

-- ============================================
-- SEARCH QUERIES TABLE (for analytics)
-- ============================================
CREATE TABLE search_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recruiter_id UUID REFERENCES recruiters(id) ON DELETE SET NULL,
    query_text TEXT NOT NULL,
    results_count INTEGER DEFAULT 0,
    search_type VARCHAR(50) DEFAULT 'semantic',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_search_queries_recruiter_id ON search_queries(recruiter_id);
CREATE INDEX idx_search_queries_created_at ON search_queries(created_at DESC);

-- ============================================
-- ACTIVITY LOG TABLE
-- ============================================
CREATE TABLE activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recruiter_id UUID REFERENCES recruiters(id) ON DELETE SET NULL,
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    action_type VARCHAR(100) NOT NULL,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activity_log_recruiter_id ON activity_log(recruiter_id);
CREATE INDEX idx_activity_log_candidate_id ON activity_log(candidate_id);
CREATE INDEX idx_activity_log_action_type ON activity_log(action_type);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at DESC);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all relevant tables
CREATE TRIGGER update_recruiters_updated_at BEFORE UPDATE ON recruiters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_insights_updated_at BEFORE UPDATE ON ai_insights
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VIEWS
-- ============================================

-- View for candidate dashboard with AI insights
CREATE OR REPLACE VIEW candidate_dashboard AS
SELECT 
    c.id,
    c.full_name,
    c.email,
    c.phone,
    c.job_role_text,
    jr.role_name,
    jr.category,
    c.resume_url,
    c.resume_filename,
    c.applied_at,
    c.status,
    c.notes,
    ai.summary,
    ai.skills,
    ai.experience_years,
    ai.education,
    ai.certifications,
    ai.languages,
    c.created_at,
    c.updated_at
FROM candidates c
LEFT JOIN job_roles jr ON c.job_role_id = jr.id
LEFT JOIN ai_insights ai ON c.id = ai.candidate_id;

-- ============================================
-- ROW LEVEL SECURITY (Optional - for multi-tenancy)
-- ============================================

-- Enable RLS on sensitive tables (uncomment if needed)
-- ALTER TABLE recruiters ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE recruiters IS 'Stores recruiter accounts with authentication details';
COMMENT ON TABLE job_roles IS 'Predefined job roles and categories';
COMMENT ON TABLE candidates IS 'Main candidate information and resume details';
COMMENT ON TABLE ai_insights IS 'AI-extracted information from resumes';
COMMENT ON TABLE applications IS 'Tracks application lifecycle and status changes';
COMMENT ON TABLE search_queries IS 'Logs recruiter search queries for analytics';
COMMENT ON TABLE activity_log IS 'Audit trail of all recruiter actions';
