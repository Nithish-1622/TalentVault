from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import router

# Create FastAPI app
app = FastAPI(
    title="TalentVault AI Service",
    description="AI-powered resume intelligence and semantic search",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Internal service - adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(router, prefix="", tags=["AI"])


@app.on_event("startup")
async def startup_event():
    """Startup event"""
    print("=" * 60)
    print("🤖 TalentVault AI Service Starting...")
    print(f"Environment: {settings.environment}")
    print(f"Model: {settings.embedding_model}")
    print("=" * 60)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "TalentVault AI Service",
        "version": "1.0.0",
        "status": "running",
        "endpoints": [
            "/health",
            "/parse-resume",
            "/generate-embeddings",
            "/semantic-search",
            "/generate-summary"
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.environment == "development"
    )
