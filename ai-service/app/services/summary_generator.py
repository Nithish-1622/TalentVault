from typing import List


class SummaryGenerator:
    """Service for generating candidate summaries"""

    def generate_summary(
        self, 
        resume_text: str, 
        skills: List[str], 
        experience_years: int
    ) -> str:
        """Generate a concise recruiter-friendly summary"""
        
        # Extract key information from text
        lines = resume_text.split('\n')
        
        # Find potential job titles or roles
        role_keywords = [
            'developer', 'engineer', 'scientist', 'analyst', 'manager',
            'designer', 'architect', 'consultant', 'specialist', 'lead'
        ]
        
        role = "Professional"
        for line in lines[:10]:  # Check first 10 lines
            line_lower = line.lower()
            for keyword in role_keywords:
                if keyword in line_lower:
                    role = line.strip()
                    break
            if role != "Professional":
                break
        
        # Get top skills (max 5)
        top_skills = skills[:5] if len(skills) > 5 else skills
        
        # Build summary
        summary_parts = []
        
        # Experience and role
        if experience_years > 0:
            exp_text = f"{experience_years}+ years" if experience_years >= 10 else f"{experience_years} years"
            summary_parts.append(f"Experienced professional with {exp_text} of expertise")
        else:
            summary_parts.append("Skilled professional")
        
        # Skills
        if top_skills:
            skills_text = ", ".join(top_skills[:3])
            if len(top_skills) > 3:
                skills_text += f", and {len(top_skills) - 3} more technologies"
            summary_parts.append(f"in {skills_text}")
        
        # Additional context
        context_keywords = {
            'startup': 'startup experience',
            'enterprise': 'enterprise environment',
            'remote': 'remote work',
            'agile': 'agile methodologies',
            'team lead': 'leadership skills',
            'mentoring': 'mentoring experience'
        }
        
        text_lower = resume_text.lower()
        found_contexts = []
        for keyword, description in context_keywords.items():
            if keyword in text_lower:
                found_contexts.append(description)
                if len(found_contexts) >= 2:
                    break
        
        if found_contexts:
            summary_parts.append(f"Strong background in {' and '.join(found_contexts)}")
        
        # Combine parts
        summary = ". ".join(summary_parts) + "."
        
        # Ensure summary is concise (max 200 chars)
        if len(summary) > 200:
            summary = summary[:197] + "..."
        
        return summary


def get_summary_generator():
    """Get summary generator instance"""
    return SummaryGenerator()
