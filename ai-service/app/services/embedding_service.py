from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from typing import List, Dict
import hashlib
import json


class EmbeddingService:
    """Service for generating and managing embeddings"""

    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        print(f"Loading embedding model: {model_name}")
        self.model = SentenceTransformer(model_name)
        self.embeddings_cache = {}
        print("Embedding model loaded successfully")

    def generate_embedding(self, text: str) -> np.ndarray:
        """Generate embedding for text"""
        if not text or len(text.strip()) == 0:
            raise ValueError("Text cannot be empty")
        
        # Truncate text if too long
        max_length = 5000
        if len(text) > max_length:
            text = text[:max_length]
        
        embedding = self.model.encode(text, convert_to_numpy=True)
        return embedding

    def generate_embedding_id(self, text: str) -> str:
        """Generate unique ID for embedding"""
        return hashlib.md5(text.encode()).hexdigest()

    def store_embedding(self, candidate_id: str, text: str, embedding: np.ndarray):
        """Store embedding in cache"""
        self.embeddings_cache[candidate_id] = {
            'text': text,
            'embedding': embedding
        }

    def get_embedding(self, candidate_id: str) -> np.ndarray:
        """Get embedding from cache"""
        if candidate_id in self.embeddings_cache:
            return self.embeddings_cache[candidate_id]['embedding']
        return None

    def calculate_similarity(self, embedding1: np.ndarray, embedding2: np.ndarray) -> float:
        """Calculate cosine similarity between two embeddings"""
        # Reshape to 2D arrays
        emb1 = embedding1.reshape(1, -1)
        emb2 = embedding2.reshape(1, -1)
        
        similarity = cosine_similarity(emb1, emb2)[0][0]
        return float(similarity)

    def search_similar(
        self, 
        query: str, 
        candidate_embeddings: Dict[str, np.ndarray],
        top_k: int = 20,
        threshold: float = 0.3
    ) -> List[Dict]:
        """Search for similar candidates based on query"""
        
        # Generate query embedding
        query_embedding = self.generate_embedding(query)
        
        results = []
        
        for candidate_id, candidate_data in candidate_embeddings.items():
            embedding = candidate_data['embedding']
            text = candidate_data.get('text', '')
            
            # Calculate similarity
            similarity = self.calculate_similarity(query_embedding, embedding)
            
            if similarity >= threshold:
                results.append({
                    'candidate_id': candidate_id,
                    'score': similarity,
                    'text_preview': text[:200] if text else ''
                })
        
        # Sort by similarity score (descending)
        results.sort(key=lambda x: x['score'], reverse=True)
        
        # Return top K results
        return results[:top_k]


# Global instance
_embedding_service = None


def get_embedding_service(model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
    """Get or create embedding service instance"""
    global _embedding_service
    if _embedding_service is None:
        _embedding_service = EmbeddingService(model_name)
    return _embedding_service
