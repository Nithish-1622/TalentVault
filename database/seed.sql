-- TalentVault Sample Data
-- This file contains sample data for development and testing

-- ============================================
-- SAMPLE RECRUITERS
-- ============================================
-- Password for all: "Password123!" (hashed with bcrypt)
-- Note: Use actual bcrypt hashing in production

INSERT INTO recruiters (email, password_hash, full_name, company_name) VALUES
    ('recruiter@talentvault.com', '$2b$10$YourHashedPasswordHere', 'Sarah Johnson', 'TalentVault Inc.'),
    ('john.doe@techcorp.com', '$2b$10$YourHashedPasswordHere', 'John Doe', 'Tech Corp'),
    ('jane.smith@startup.io', '$2b$10$YourHashedPasswordHere', 'Jane Smith', 'StartupIO');

-- ============================================
-- SAMPLE CANDIDATES
-- ============================================

-- Sample candidate 1: Frontend Developer
INSERT INTO candidates (
    full_name, 
    email, 
    phone, 
    job_role_id, 
    job_role_text,
    resume_url, 
    resume_filename,
    resume_file_size,
    status
) VALUES (
    'Alice Chen',
    'alice.chen@email.com',
    '+1-555-0101',
    (SELECT id FROM job_roles WHERE role_name = 'Frontend Developer'),
    'Frontend Developer',
    'https://example.com/resumes/alice-chen-resume.pdf',
    'alice-chen-resume.pdf',
    245678,
    'Shortlisted'
);

-- Sample candidate 2: Backend Developer
INSERT INTO candidates (
    full_name, 
    email, 
    phone, 
    job_role_id, 
    job_role_text,
    resume_url, 
    resume_filename,
    resume_file_size,
    status
) VALUES (
    'Bob Martinez',
    'bob.martinez@email.com',
    '+1-555-0102',
    (SELECT id FROM job_roles WHERE role_name = 'Backend Developer'),
    'Backend Developer',
    'https://example.com/resumes/bob-martinez-resume.pdf',
    'bob-martinez-resume.pdf',
    198234,
    'Applied'
);

-- Sample candidate 3: Full Stack Developer
INSERT INTO candidates (
    full_name, 
    email, 
    phone, 
    job_role_id, 
    job_role_text,
    resume_url, 
    resume_filename,
    resume_file_size,
    status
) VALUES (
    'Carlos Rodriguez',
    'carlos.rodriguez@email.com',
    '+1-555-0103',
    (SELECT id FROM job_roles WHERE role_name = 'Full Stack Developer'),
    'Full Stack Developer',
    'https://example.com/resumes/carlos-rodriguez-resume.pdf',
    'carlos-rodriguez-resume.pdf',
    312456,
    'Interviewed'
);

-- Sample candidate 4: Data Scientist
INSERT INTO candidates (
    full_name, 
    email, 
    phone, 
    job_role_id, 
    job_role_text,
    resume_url, 
    resume_filename,
    resume_file_size,
    status
) VALUES (
    'Diana Patel',
    'diana.patel@email.com',
    '+1-555-0104',
    (SELECT id FROM job_roles WHERE role_name = 'Data Scientist'),
    'Data Scientist',
    'https://example.com/resumes/diana-patel-resume.pdf',
    'diana-patel-resume.pdf',
    276543,
    'Applied'
);

-- Sample candidate 5: DevOps Engineer
INSERT INTO candidates (
    full_name, 
    email, 
    phone, 
    job_role_id, 
    job_role_text,
    resume_url, 
    resume_filename,
    resume_file_size,
    status
) VALUES (
    'Ethan Kim',
    'ethan.kim@email.com',
    '+1-555-0105',
    (SELECT id FROM job_roles WHERE role_name = 'DevOps Engineer'),
    'DevOps Engineer',
    'https://example.com/resumes/ethan-kim-resume.pdf',
    'ethan-kim-resume.pdf',
    298765,
    'Hired'
);

-- ============================================
-- SAMPLE AI INSIGHTS
-- ============================================

-- AI Insights for Alice Chen (Frontend Developer)
INSERT INTO ai_insights (
    candidate_id,
    extracted_text,
    summary,
    skills,
    experience_years,
    education,
    certifications,
    languages
) VALUES (
    (SELECT id FROM candidates WHERE email = 'alice.chen@email.com'),
    'Sample extracted text from resume...',
    'Experienced Frontend Developer with 5 years of expertise in React, Vue.js, and modern JavaScript. Strong focus on UI/UX and responsive design. Previously worked at top tech companies.',
    '["React", "Vue.js", "JavaScript", "TypeScript", "Tailwind CSS", "HTML5", "CSS3", "Webpack", "Git", "Figma"]'::jsonb,
    5,
    '[{"degree": "Bachelor of Science", "field": "Computer Science", "institution": "Stanford University", "year": 2018}]'::jsonb,
    '[{"name": "AWS Certified Developer", "year": 2022}]'::jsonb,
    '["English", "Mandarin"]'::jsonb
);

-- AI Insights for Bob Martinez (Backend Developer)
INSERT INTO ai_insights (
    candidate_id,
    extracted_text,
    summary,
    skills,
    experience_years,
    education,
    certifications,
    languages
) VALUES (
    (SELECT id FROM candidates WHERE email = 'bob.martinez@email.com'),
    'Sample extracted text from resume...',
    'Backend specialist with 6 years of experience in Node.js, Python, and microservices architecture. Expert in designing scalable APIs and database optimization.',
    '["Node.js", "Python", "FastAPI", "Express", "PostgreSQL", "MongoDB", "Docker", "Kubernetes", "Redis", "AWS"]'::jsonb,
    6,
    '[{"degree": "Master of Science", "field": "Software Engineering", "institution": "MIT", "year": 2017}]'::jsonb,
    '[{"name": "Kubernetes Administrator", "year": 2021}, {"name": "AWS Solutions Architect", "year": 2020}]'::jsonb,
    '["English", "Spanish"]'::jsonb
);

-- AI Insights for Carlos Rodriguez (Full Stack Developer)
INSERT INTO ai_insights (
    candidate_id,
    extracted_text,
    summary,
    skills,
    experience_years,
    education,
    certifications,
    languages
) VALUES (
    (SELECT id FROM candidates WHERE email = 'carlos.rodriguez@email.com'),
    'Sample extracted text from resume...',
    'Versatile Full Stack Developer with 4 years building end-to-end web applications. Proficient in React, Node.js, and cloud deployment. Strong problem-solving skills.',
    '["React", "Node.js", "Express", "MongoDB", "PostgreSQL", "JavaScript", "TypeScript", "Git", "Docker", "AWS", "Tailwind CSS"]'::jsonb,
    4,
    '[{"degree": "Bachelor of Engineering", "field": "Computer Engineering", "institution": "UC Berkeley", "year": 2019}]'::jsonb,
    '[]'::jsonb,
    '["English", "Spanish", "Portuguese"]'::jsonb
);

-- AI Insights for Diana Patel (Data Scientist)
INSERT INTO ai_insights (
    candidate_id,
    extracted_text,
    summary,
    skills,
    experience_years,
    education,
    certifications,
    languages
) VALUES (
    (SELECT id FROM candidates WHERE email = 'diana.patel@email.com'),
    'Sample extracted text from resume...',
    'Data Scientist with 7 years of experience in machine learning, statistical analysis, and predictive modeling. Expert in Python, R, and big data technologies.',
    '["Python", "R", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "SQL", "Tableau", "Apache Spark", "Machine Learning", "Deep Learning"]'::jsonb,
    7,
    '[{"degree": "PhD", "field": "Statistics", "institution": "Carnegie Mellon University", "year": 2016}]'::jsonb,
    '[{"name": "Google Cloud Professional Data Engineer", "year": 2022}]'::jsonb,
    '["English", "Hindi", "Gujarati"]'::jsonb
);

-- AI Insights for Ethan Kim (DevOps Engineer)
INSERT INTO ai_insights (
    candidate_id,
    extracted_text,
    summary,
    skills,
    experience_years,
    education,
    certifications,
    languages
) VALUES (
    (SELECT id FROM candidates WHERE email = 'ethan.kim@email.com'),
    'Sample extracted text from resume...',
    'Senior DevOps Engineer with 8 years managing cloud infrastructure and CI/CD pipelines. Specialist in Kubernetes, AWS, and infrastructure automation.',
    '["Kubernetes", "Docker", "AWS", "Terraform", "Jenkins", "GitLab CI", "Python", "Bash", "Ansible", "Prometheus", "Grafana", "Linux"]'::jsonb,
    8,
    '[{"degree": "Bachelor of Science", "field": "Information Systems", "institution": "Georgia Tech", "year": 2015}]'::jsonb,
    '[{"name": "Certified Kubernetes Administrator", "year": 2021}, {"name": "AWS DevOps Engineer Professional", "year": 2020}]'::jsonb,
    '["English", "Korean"]'::jsonb
);

-- ============================================
-- SAMPLE APPLICATIONS
-- ============================================

INSERT INTO applications (candidate_id, job_role_id, status, recruiter_id) 
SELECT 
    c.id,
    c.job_role_id,
    c.status,
    (SELECT id FROM recruiters LIMIT 1)
FROM candidates c;

-- ============================================
-- SAMPLE SEARCH QUERIES
-- ============================================

INSERT INTO search_queries (recruiter_id, query_text, results_count, search_type) VALUES
    ((SELECT id FROM recruiters LIMIT 1), 'Backend developers with Python and FastAPI experience', 3, 'semantic'),
    ((SELECT id FROM recruiters LIMIT 1), 'Frontend React developers', 5, 'semantic'),
    ((SELECT id FROM recruiters LIMIT 1), 'Machine learning engineers', 2, 'semantic');

-- ============================================
-- SAMPLE ACTIVITY LOG
-- ============================================

INSERT INTO activity_log (recruiter_id, candidate_id, action_type, description) VALUES
    (
        (SELECT id FROM recruiters LIMIT 1),
        (SELECT id FROM candidates WHERE email = 'alice.chen@email.com'),
        'status_change',
        'Changed status from Applied to Shortlisted'
    ),
    (
        (SELECT id FROM recruiters LIMIT 1),
        (SELECT id FROM candidates WHERE email = 'ethan.kim@email.com'),
        'status_change',
        'Changed status from Interviewed to Hired'
    );
