from groq import Groq
from typing import List, Dict
import hashlib
import json
import re


class EmbeddingService:
    """Service for generating embeddings and search using GROQ"""

    def __init__(self, api_key: str, model: str = "llama-3.3-70b-versatile"):
        print(f"Initializing GROQ client with model: {model}")
        self.client = Groq(api_key=api_key)
        self.model = model
        self.embeddings_cache = {}
        print("GROQ client initialized successfully")

    def generate_embedding(self, text: str) -> List[str]:
        """Generate embedding representation using GROQ"""
        if not text or len(text.strip()) == 0:
            raise ValueError("Text cannot be empty")
        
        # Truncate text if too long
        max_length = 5000
        if len(text) > max_length:
            text = text[:max_length]
        
        # Use GROQ to extract key features as a structured embedding
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{
                    "role": "system",
                    "content": "Extract key skills, technologies, and experience from the resume. Return ONLY a JSON array of strings."
                }, {
                    "role": "user",
                    "content": f"Resume text:\n{text}"
                }],
                temperature=0.1,
                max_tokens=500
            )
            
            # Parse the response to get features
            content = response.choices[0].message.content
            # Try to extract JSON array from the response
            json_match = re.search(r'\[.*\]', content, re.DOTALL)
            if json_match:
                features = json.loads(json_match.group())
            else:
                features = []
            
            return features
        except Exception as e:
            print(f"Error generating embedding: {e}")
            return []

    def generate_embedding_id(self, text: str) -> str:
        """Generate unique ID for embedding"""
        return hashlib.md5(text.encode()).hexdigest()

    def store_embedding(self, candidate_id: str, text: str, embedding: List[str]):
        """Store embedding in cache"""
        self.embeddings_cache[candidate_id] = {
            'text': text,
            'embedding': embedding
        }

    def get_embedding(self, candidate_id: str) -> List[str]:
        """Get embedding from cache"""
        if candidate_id in self.embeddings_cache:
            return self.embeddings_cache[candidate_id]['embedding']
        return []

    def calculate_similarity(self, features1: List[str], features2: List[str]) -> float:
        """Calculate similarity between two feature sets"""
        if not features1 or not features2:
            return 0.0
        
        # Convert to lowercase sets for comparison
        set1 = set(str(f).lower() for f in features1)
        set2 = set(str(f).lower() for f in features2)
        
        # Jaccard similarity
        intersection = len(set1 & set2)
        union = len(set1 | set2)
        
        if union == 0:
            return 0.0
        
        return intersection / union

    def search_similar(
        self, 
        query: str, 
        candidate_embeddings: Dict[str, Dict],
        top_k: int = 20,
        threshold: float = 0.3
    ) -> List[Dict]:
        """Search for similar candidates based on query using GROQ"""
        
        # Use GROQ to understand the search query
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{
                    "role": "system",
                    "content": "Extract key requirements from the search query. Return ONLY a JSON array of strings representing skills, technologies, or requirements."
                }, {
                    "role": "user",
                    "content": f"Search query: {query}"
                }],
                temperature=0.1,
                max_tokens=300
            )
            
            content = response.choices[0].message.content
            json_match = re.search(r'\[.*\]', content, re.DOTALL)
            if json_match:
                query_features = json.loads(json_match.group())
            else:
                query_features = []
        except Exception as e:
            print(f"Error processing query: {e}")
            query_features = query.lower().split()
        
        results = []
        
        for candidate_id, candidate_data in candidate_embeddings.items():
            embedding = candidate_data['embedding']
            text = candidate_data.get('text', '')
            
            # Calculate similarity
            similarity = self.calculate_similarity(query_features, embedding)
            
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


def get_embedding_service(api_key: str, model: str = "llama-3.3-70b-versatile"):
    """Get or create embedding service instance"""
    global _embedding_service
    if _embedding_service is None:
        _embedding_service = EmbeddingService(api_key, model)
    return _embedding_service
