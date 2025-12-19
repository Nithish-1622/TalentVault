from groq import Groq
from typing import List


class SummaryGenerator:
    """Service for generating candidate summaries using GROQ"""

    def __init__(self, api_key: str, model: str = "llama-3.3-70b-versatile"):
        self.client = Groq(api_key=api_key)
        self.model = model

    def generate_summary(
        self, 
        resume_text: str, 
        skills: List[str], 
        experience_years: int
    ) -> str:
        """Generate a concise recruiter-friendly summary using GROQ"""
        
        # Prepare context for GROQ
        context = f"""
Resume Text: {resume_text[:2000]}
Identified Skills: {', '.join(skills[:10])}
Experience: {experience_years} years
"""
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{
                    "role": "system",
                    "content": "You are a professional recruiter assistant. Generate a concise 2-3 sentence summary of the candidate's profile for recruiters. Focus on key strengths, experience level, and core competencies. Be professional and factual."
                }, {
                    "role": "user",
                    "content": context
                }],
                temperature=0.3,
                max_tokens=150
            )
            
            summary = response.choices[0].message.content.strip()
            
            # Ensure summary is concise (max 250 chars)
            if len(summary) > 250:
                summary = summary[:247] + "..."
            
            return summary
            
        except Exception as e:
            print(f"Error generating summary with GROQ: {e}")
            # Fallback to simple summary
            return self._generate_simple_summary(skills, experience_years)
    
    def _generate_simple_summary(self, skills: List[str], experience_years: int) -> str:
        """Fallback simple summary generation"""
        top_skills = skills[:3] if skills else []
        
        if experience_years > 0:
            exp_text = f"{experience_years}+ years" if experience_years >= 10 else f"{experience_years} years"
            summary = f"Experienced professional with {exp_text} of expertise"
        else:
            summary = "Skilled professional"
        
        if top_skills:
            skills_text = ", ".join(top_skills)
            summary += f" in {skills_text}"
        
        summary += "."
        return summary


def get_summary_generator(api_key: str, model: str = "llama-3.3-70b-versatile"):
    """Get summary generator instance"""
    return SummaryGenerator(api_key, model)
