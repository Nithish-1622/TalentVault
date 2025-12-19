from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class ResumeParseRequest(BaseModel):
    resume_url: str = Field(..., description="URL of the resume file")
    filename: str = Field(..., description="Original filename")


class Education(BaseModel):
    degree: str
    field: Optional[str] = None
    institution: str
    year: Optional[int] = None


class Certification(BaseModel):
    name: str
    year: Optional[int] = None


class ResumeParseResponse(BaseModel):
    extracted_text: str
    summary: str
    skills: List[str]
    experience_years: int
    education: List[Education]
    certifications: List[Certification]
    languages: List[str]
    embedding_id: Optional[str] = None


class EmbeddingRequest(BaseModel):
    text: str = Field(..., description="Text to generate embeddings for")


class EmbeddingResponse(BaseModel):
    embedding: List[float]
    embedding_id: str


class SearchRequest(BaseModel):
    query: str = Field(..., description="Natural language search query")
    candidate_ids: List[str] = Field(default_factory=list, description="List of candidate IDs to search")


class SearchResult(BaseModel):
    candidate_id: str
    score: float
    reason: str


class SearchResponse(BaseModel):
    query: str
    results: List[SearchResult]


class SummaryRequest(BaseModel):
    resume_text: str
    skills: List[str]
    experience: int


class SummaryResponse(BaseModel):
    summary: str


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    version: str
