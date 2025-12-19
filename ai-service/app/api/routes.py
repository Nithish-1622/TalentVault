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
embedding_service = get_embedding_service(settings.embedding_model)
summary_generator = get_summary_generator()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": embedding_service.model is not None,
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
        
        # Generate embedding
        embedding_text = f"{' '.join(parsed_data['skills'])} {parsed_data['extracted_text'][:1000]}"
        embedding = embedding_service.generate_embedding(embedding_text)
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
            "embedding": embedding.tolist(),
            "embedding_id": embedding_id
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/semantic-search", response_model=SearchResponse)
async def semantic_search(request: SearchRequest):
    """Perform semantic search on candidates"""
    try:
        # In a production system, candidate embeddings would be fetched from a vector database
        # For this implementation, we'll use the cached embeddings
        
        candidate_embeddings = {}
        
        # Get embeddings for each candidate
        # Note: In production, these would be pre-computed and stored
        for candidate_id in request.candidate_ids:
            cached = embedding_service.get_embedding(candidate_id)
            if cached:
                candidate_embeddings[candidate_id] = {
                    'embedding': cached,
                    'text': ''
                }
        
        # If no cached embeddings, return empty results
        if not candidate_embeddings:
            # For demo purposes, generate dummy results with relevance scoring
            # In production, this would query a vector database
            results = []
            
            # Generate query embedding for comparison
            query_lower = request.query.lower()
            
            # Simple keyword matching as fallback
            for candidate_id in request.candidate_ids[:settings.max_results]:
                # In production, calculate actual similarity
                # For now, assign random relevance based on query
                score = 0.7  # Default score
                
                reason = f"Relevant match based on query: {request.query[:50]}"
                
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
        
        # Perform similarity search
        search_results = embedding_service.search_similar(
            request.query,
            candidate_embeddings,
            top_k=settings.max_results,
            threshold=settings.similarity_threshold
        )
        
        # Format results
        results = []
        for result in search_results:
            reason = f"Similarity score: {result['score']:.2f}"
            if result['text_preview']:
                reason += f" - {result['text_preview']}"
            
            results.append(
                SearchResult(
                    candidate_id=result['candidate_id'],
                    score=result['score'],
                    reason=reason
                )
            )
        
        return SearchResponse(
            query=request.query,
            results=results
        )
    
    except Exception as e:
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
