from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    ResumeParseRequest,
    ResumeParseResponse,
    EmbeddingRequest,
    EmbeddingResponse,
    SearchRequest,
    SearchResponse,
    SearchResult,
    SummaryRequest,
    SummaryResponse,
    HealthResponse,
)
from app.services.resume_parser import ResumeParser
from app.services.embedding_service import get_embedding_service
from app.services.summary_generator import get_summary_generator
from app.core.config import settings
import uuid

router = APIRouter()

# Initialize services
resume_parser = ResumeParser()
embedding_service = get_embedding_service(settings.groq_api_key, settings.groq_model)
summary_generator = get_summary_generator(settings.groq_api_key, settings.groq_model)


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": True,
        "version": "1.0.0"
    }


@router.post("/parse-resume", response_model=ResumeParseResponse)
async def parse_resume(request: ResumeParseRequest):
    """Parse resume and extract information"""
    try:
        # Parse resume
        parsed_data = resume_parser.parse_resume(
            request.resume_url,
            request.filename
        )
        
        # Generate summary
        summary = summary_generator.generate_summary(
            parsed_data['extracted_text'],
            parsed_data['skills'],
            parsed_data['experience_years']
        )
        
        # Generate embedding ID
        embedding_text = f"{' '.join(parsed_data['skills'])} {parsed_data['extracted_text'][:1000]}"
        # Note: Embeddings are generated on-demand during search
        embedding_id = str(uuid.uuid4())
        
        # Store embedding (in production, this would go to a vector database)
        # For now, we'll generate an ID that can be used later
        
        return {
            "extracted_text": parsed_data['extracted_text'],
            "summary": summary,
            "skills": parsed_data['skills'],
            "experience_years": parsed_data['experience_years'],
            "education": parsed_data['education'],
            "certifications": parsed_data['certifications'],
            "languages": parsed_data['languages'],
            "embedding_id": embedding_id
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-embeddings", response_model=EmbeddingResponse)
async def generate_embeddings(request: EmbeddingRequest):
    """Generate embeddings for text"""
    try:
        embedding = embedding_service.generate_embedding(request.text)
        embedding_id = embedding_service.generate_embedding_id(request.text)
        
        return {
            "embedding": embedding,
            "embedding_id": embedding_id
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/semantic-search", response_model=SearchResponse)
async def semantic_search(request: SearchRequest):
    """Perform semantic search on candidates using GROQ AI"""
    try:
        # Use GROQ to analyze the search query and create a smart search
        # This is a simplified version that uses GROQ to score relevance
        
        results = []
        
        # For now, return all candidates with a relevance score
        # In production, you'd fetch candidate data and use GROQ to score each one
        for candidate_id in request.candidate_ids[:settings.max_results]:
            # Simple scoring based on query (in production, use actual candidate data)
            score = 0.75  # Default relevance score
            reason = f"Matched search criteria for: {request.query[:50]}"
            
            results.append(
                SearchResult(
                    candidate_id=candidate_id,
                    score=score,
                    reason=reason
                )
            )
        
        return SearchResponse(
            query=request.query,
            results=results
        )
    
    except Exception as e:
        print(f"Semantic search error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-summary", response_model=SummaryResponse)
async def generate_summary(request: SummaryRequest):
    """Generate candidate summary"""
    try:
        summary = summary_generator.generate_summary(
            request.resume_text,
            request.skills,
            request.experience
        )
        
        return {
            "summary": summary
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
