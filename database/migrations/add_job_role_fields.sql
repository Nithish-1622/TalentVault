-- Add requirements and description fields to job_roles table
-- This enables AI-powered job role matching

ALTER TABLE job_roles 
ADD COLUMN IF NOT EXISTS requirements TEXT,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Update existing job roles with typical requirements
UPDATE job_roles SET 
    requirements = 'React, JavaScript, HTML, CSS, TypeScript, Git',
    description = 'Build responsive and interactive user interfaces using modern frontend frameworks and technologies. Work closely with designers and backend developers to create seamless user experiences.'
WHERE role_name = 'Frontend Developer';

UPDATE job_roles SET 
    requirements = 'Node.js, Python, Java, SQL, REST API, Git',
    description = 'Design and implement server-side logic, databases, and APIs. Ensure high performance and responsiveness to requests from the frontend.'
WHERE role_name = 'Backend Developer';

UPDATE job_roles SET 
    requirements = 'React, Node.js, JavaScript, TypeScript, SQL, Git, REST API',
    description = 'Work on both frontend and backend development. Build end-to-end features and maintain full application stack.'
WHERE role_name = 'Full Stack Developer';

UPDATE job_roles SET 
    requirements = 'Docker, Kubernetes, AWS, Azure, Terraform, CI/CD, Linux, Git',
    description = 'Automate and streamline operations and processes. Build and maintain tools for deployment, monitoring, and operations.'
WHERE role_name = 'DevOps Engineer';

UPDATE job_roles SET 
    requirements = 'Python, SQL, Pandas, NumPy, TensorFlow, PyTorch, Machine Learning, Statistics',
    description = 'Analyze large datasets to extract insights and build predictive models. Develop machine learning algorithms and statistical models.'
WHERE role_name = 'Data Scientist';

UPDATE job_roles SET 
    requirements = 'Python, TensorFlow, PyTorch, Scikit-learn, Deep Learning, Neural Networks, Git',
    description = 'Design and develop machine learning models and algorithms. Deploy ML models to production and optimize for performance.'
WHERE role_name = 'Machine Learning Engineer';

UPDATE job_roles SET 
    requirements = 'Product Strategy, Agile, Scrum, User Research, Analytics, Communication',
    description = 'Define product vision and strategy. Work with cross-functional teams to deliver products that customers love.'
WHERE role_name = 'Product Manager';

UPDATE job_roles SET 
    requirements = 'Figma, Sketch, Adobe XD, User Research, Wireframing, Prototyping, Design Systems',
    description = 'Design user interfaces and experiences. Create wireframes, prototypes, and high-fidelity designs.'
WHERE role_name = 'UI/UX Designer';

UPDATE job_roles SET 
    requirements = 'Selenium, Jest, Cypress, Test Automation, Manual Testing, Bug Tracking, Git',
    description = 'Ensure software quality through manual and automated testing. Identify and document bugs and work with developers to resolve issues.'
WHERE role_name = 'QA Engineer';

UPDATE job_roles SET 
    requirements = 'React Native, Swift, Kotlin, iOS, Android, Mobile UI, Git',
    description = 'Develop mobile applications for iOS and Android platforms. Optimize apps for performance and user experience.'
WHERE role_name = 'Mobile Developer';

UPDATE job_roles SET 
    requirements = 'System Design, Microservices, Cloud Architecture, Scalability, Security, Leadership',
    description = 'Design high-level software architecture and technical solutions. Make key technical decisions and mentor development teams.'
WHERE role_name = 'Software Architect';

UPDATE job_roles SET 
    requirements = 'Business Analysis, SQL, Excel, Requirements Gathering, Stakeholder Management',
    description = 'Bridge the gap between business needs and technical solutions. Analyze business processes and recommend improvements.'
WHERE role_name = 'Business Analyst';

UPDATE job_roles SET 
    requirements = 'Project Management, Agile, Scrum, Communication, Risk Management, Leadership',
    description = 'Plan, execute, and oversee projects. Coordinate teams and resources to deliver projects on time and within budget.'
WHERE role_name = 'Project Manager';

UPDATE job_roles SET 
    requirements = 'Technical Writing, Documentation, Markdown, API Documentation, Communication',
    description = 'Create clear and comprehensive technical documentation. Write user guides, API docs, and developer documentation.'
WHERE role_name = 'Technical Writer';

UPDATE job_roles SET 
    requirements = 'AWS, Azure, GCP, Terraform, Kubernetes, Docker, Networking, Security',
    description = 'Design, implement, and manage cloud infrastructure. Optimize cloud resources for cost and performance.'
WHERE role_name = 'Cloud Engineer';
