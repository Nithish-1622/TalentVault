import re
import io
import requests
from typing import List, Dict, Optional
import PyPDF2
import pdfplumber
from docx import Document


class ResumeParser:
    """Service for parsing resume documents"""

    SKILL_PATTERNS = {
        'programming': [
            'python', 'java', 'javascript', 'typescript', 'c\\+\\+', 'c#', 'ruby', 'php', 
            'go', 'rust', 'swift', 'kotlin', 'scala', 'r', 'matlab'
        ],
        'web': [
            'react', 'vue', 'angular', 'node\\.js', 'express', 'django', 'flask', 
            'fastapi', 'spring', 'asp\\.net', 'html', 'css', 'tailwind', 'bootstrap'
        ],
        'data': [
            'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
            'pandas', 'numpy', 'tensorflow', 'pytorch', 'scikit-learn', 'spark'
        ],
        'cloud': [
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins',
            'gitlab', 'github actions', 'ci/cd'
        ],
        'tools': [
            'git', 'linux', 'bash', 'rest api', 'graphql', 'microservices',
            'agile', 'scrum', 'jira', 'confluence'
        ]
    }

    DEGREE_PATTERNS = [
        r'(bachelor|b\.?s\.?|b\.?a\.?|b\.?tech|b\.?e\.?)',
        r'(master|m\.?s\.?|m\.?a\.?|m\.?tech|mba)',
        r'(ph\.?d\.?|doctorate|doctoral)',
        r'(associate|a\.?s\.?|diploma)'
    ]

    def download_file(self, url: str) -> bytes:
        """Download file from URL"""
        try:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            return response.content
        except Exception as e:
            raise Exception(f"Failed to download file: {str(e)}")

    def extract_text_from_pdf(self, file_content: bytes) -> str:
        """Extract text from PDF file"""
        text = ""
        
        # Try with pdfplumber first (better formatting)
        try:
            with pdfplumber.open(io.BytesIO(file_content)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except:
            # Fallback to PyPDF2
            try:
                pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
                for page in pdf_reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            except Exception as e:
                raise Exception(f"Failed to extract PDF text: {str(e)}")
        
        return text.strip()

    def extract_text_from_docx(self, file_content: bytes) -> str:
        """Extract text from DOCX file"""
        try:
            doc = Document(io.BytesIO(file_content))
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return text.strip()
        except Exception as e:
            raise Exception(f"Failed to extract DOCX text: {str(e)}")

    def extract_text(self, resume_url: str, filename: str) -> str:
        """Extract text from resume file"""
        file_content = self.download_file(resume_url)
        
        if filename.lower().endswith('.pdf'):
            return self.extract_text_from_pdf(file_content)
        elif filename.lower().endswith('.docx'):
            return self.extract_text_from_docx(file_content)
        else:
            raise Exception("Unsupported file format")

    def extract_skills(self, text: str) -> List[str]:
        """Extract skills from resume text"""
        text_lower = text.lower()
        found_skills = set()
        
        for category, skills in self.SKILL_PATTERNS.items():
            for skill in skills:
                pattern = r'\b' + skill + r'\b'
                if re.search(pattern, text_lower, re.IGNORECASE):
                    # Capitalize skill name properly
                    skill_name = skill.replace('\\', '').replace('.', '')
                    found_skills.add(skill_name.title())
        
        return sorted(list(found_skills))

    def extract_education(self, text: str) -> List[Dict]:
        """Extract education information"""
        education = []
        lines = text.split('\n')
        
        for i, line in enumerate(lines):
            line_lower = line.lower()
            
            # Check for degree patterns
            for pattern in self.DEGREE_PATTERNS:
                if re.search(pattern, line_lower):
                    degree_info = {
                        'degree': line.strip(),
                        'institution': '',
                        'field': None,
                        'year': None
                    }
                    
                    # Look for institution in nearby lines
                    if i + 1 < len(lines):
                        degree_info['institution'] = lines[i + 1].strip()
                    
                    # Look for year (4 digits)
                    year_match = re.search(r'\b(19|20)\d{2}\b', line)
                    if year_match:
                        degree_info['year'] = int(year_match.group())
                    
                    education.append(degree_info)
                    break
        
        return education[:3]  # Return max 3 education entries

    def extract_certifications(self, text: str) -> List[Dict]:
        """Extract certifications"""
        certifications = []
        cert_keywords = ['certified', 'certification', 'certificate']
        
        lines = text.split('\n')
        for line in lines:
            line_lower = line.lower()
            if any(keyword in line_lower for keyword in cert_keywords):
                cert_info = {
                    'name': line.strip(),
                    'year': None
                }
                
                # Look for year
                year_match = re.search(r'\b(19|20)\d{2}\b', line)
                if year_match:
                    cert_info['year'] = int(year_match.group())
                
                certifications.append(cert_info)
        
        return certifications[:5]  # Return max 5 certifications

    def estimate_experience(self, text: str) -> int:
        """Estimate years of experience"""
        # Look for explicit experience mentions
        exp_patterns = [
            r'(\d+)\+?\s*years?\s+of\s+experience',
            r'experience\s*:\s*(\d+)\+?\s*years?',
            r'(\d+)\+?\s*years?\s+in',
        ]
        
        years = []
        for pattern in exp_patterns:
            matches = re.findall(pattern, text.lower())
            for match in matches:
                try:
                    years.append(int(match))
                except:
                    pass
        
        if years:
            return max(years)
        
        # Estimate from date ranges
        year_matches = re.findall(r'\b(19|20)\d{2}\b', text)
        if len(year_matches) >= 2:
            years_list = [int(year) for year in year_matches]
            if years_list:
                current_year = 2024
                oldest_year = min(years_list)
                if oldest_year < current_year:
                    return min(current_year - oldest_year, 30)  # Cap at 30 years
        
        return 0

    def extract_languages(self, text: str) -> List[str]:
        """Extract languages"""
        common_languages = [
            'english', 'spanish', 'french', 'german', 'chinese', 'mandarin',
            'hindi', 'arabic', 'portuguese', 'russian', 'japanese', 'korean',
            'italian', 'dutch', 'swedish', 'polish', 'turkish', 'vietnamese'
        ]
        
        text_lower = text.lower()
        found_languages = set()
        
        for lang in common_languages:
            if re.search(r'\b' + lang + r'\b', text_lower):
                found_languages.add(lang.title())
        
        return sorted(list(found_languages))

    def parse_resume(self, resume_url: str, filename: str) -> Dict:
        """Main method to parse resume"""
        # Extract text
        text = self.extract_text(resume_url, filename)
        
        if not text or len(text) < 50:
            raise Exception("Failed to extract meaningful text from resume")
        
        # Extract all information
        skills = self.extract_skills(text)
        education = self.extract_education(text)
        certifications = self.extract_certifications(text)
        experience_years = self.estimate_experience(text)
        languages = self.extract_languages(text)
        
        return {
            'extracted_text': text[:10000],  # Limit text length
            'skills': skills,
            'education': education,
            'certifications': certifications,
            'experience_years': experience_years,
            'languages': languages if languages else ['English']  # Default to English
        }
