from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Server
    environment: str = "development"
    host: str = "0.0.0.0"
    port: int = 8000

    # GROQ API Configuration
    groq_api_key: str
    groq_model: str = "llama-3.3-70b-versatile"
    
    # Search Configuration
    similarity_threshold: float = 0.5
    max_results: int = 20

    # Processing
    max_text_length: int = 50000
    chunk_size: int = 512

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()
