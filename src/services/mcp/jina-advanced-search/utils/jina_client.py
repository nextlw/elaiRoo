"""
Jina API Client for advanced search operations.
"""

import os
import aiohttp
import asyncio
from typing import Dict, List, Optional, Any, Union
import json
import logging
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class SearchResult:
    """Search result from Jina API."""
    title: str
    url: str
    content: str
    score: float
    metadata: Dict[str, Any]


class JinaAPIClient:
    """Client for interacting with Jina AI APIs."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("JINA_API_KEY")
        if not self.api_key:
            raise ValueError("JINA_API_KEY must be provided or set as environment variable")

        # Jina AI API endpoints corretos
        self.search_url = "https://s.jina.ai"
        self.reader_url = "https://r.jina.ai"
        self.embeddings_url = "https://api.jina.ai/v1/embeddings"
        self.session: Optional[aiohttp.ClientSession] = None

    async def __aenter__(self):
        """Async context manager entry."""
        self.session = aiohttp.ClientSession(
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            },
            timeout=aiohttp.ClientTimeout(total=60)
        )
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        if self.session:
            await self.session.close()

    async def search(
        self,
        query: str,
        max_results: int = 10,
        search_type: str = "web",
        **kwargs
    ) -> List[SearchResult]:
        """
        Perform search using Jina AI.

        Args:
            query: Search query
            max_results: Maximum number of results
            search_type: Type of search (web, academic, news, etc.)
            **kwargs: Additional search parameters

        Returns:
            List of search results
        """
        if not self.session:
            raise RuntimeError("Client not initialized. Use async with statement.")

        # Usar o endpoint de search correto do Jina
        endpoint = f"{self.search_url}"

        # Jina search API usa parâmetros diferentes
        params = {
            "q": query,
            "num": min(max_results, 10)  # Jina limita a 10 resultados
        }

        try:
            async with self.session.get(endpoint, params=params) as response:
                response.raise_for_status()

                # Jina pode retornar text/plain ou JSON
                content_type = response.headers.get('content-type', '').lower()

                if 'application/json' in content_type:
                    # Resposta JSON
                    data = await response.json()
                    results = []
                    if "data" in data:
                        for i, result in enumerate(data["data"][:max_results]):
                            results.append(SearchResult(
                                title=result.get("title", f"Result {i+1}"),
                                url=result.get("url", ""),
                                content=result.get("content", result.get("snippet", "")),
                                score=result.get("score", 1.0 - (i * 0.1)),
                                metadata={
                                    "source": "jina_search",
                                    "rank": i + 1,
                                    **result.get("metadata", {})
                                }
                            ))
                    return results
                else:
                    # Resposta em texto - processar como resultado único
                    text_content = await response.text()

                    # Criar um resultado estruturado a partir do texto
                    return [SearchResult(
                        title=f"Search Results for: {query}",
                        url=f"{endpoint}?q={query}",
                        content=text_content[:2000],  # Limitar conteúdo
                        score=1.0,
                        metadata={
                            "source": "jina_search_text",
                            "content_type": content_type,
                            "query": query,
                            "full_content_length": len(text_content)
                        }
                    )]

        except aiohttp.ClientError as e:
            logger.error(f"Jina API request failed: {e}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error in Jina search: {e}")
            raise

    async def multimodal_search(
        self,
        query: str,
        image_url: Optional[str] = None,
        max_results: int = 10,
        **kwargs
    ) -> List[SearchResult]:
        """
        Perform multimodal search combining text and images.

        Args:
            query: Text query
            image_url: Optional image URL for visual search
            max_results: Maximum number of results
            **kwargs: Additional parameters

        Returns:
            List of multimodal search results
        """
        if not self.session:
            raise RuntimeError("Client not initialized. Use async with statement.")

        # Para multimodal, usar search normal por enquanto
        endpoint = f"{self.search_url}"

        payload = {
            "text_query": query,
            "max_results": max_results,
            **kwargs
        }

        if image_url:
            payload["image_url"] = image_url

        try:
            async with self.session.post(endpoint, json=payload) as response:
                response.raise_for_status()
                data = await response.json()

                return [
                    SearchResult(
                        title=result.get("title", ""),
                        url=result.get("url", ""),
                        content=result.get("content", ""),
                        score=result.get("score", 0.0),
                        metadata={
                            **result.get("metadata", {}),
                            "modality": result.get("modality", "unknown")
                        }
                    )
                    for result in data.get("results", [])
                ]

        except aiohttp.ClientError as e:
            logger.error(f"Jina multimodal API request failed: {e}")
            raise

    async def semantic_search(
        self,
        query: str,
        documents: List[str],
        max_results: int = 10,
        **kwargs
    ) -> List[Dict[str, Any]]:
        """
        Perform semantic search against provided documents.

        Args:
            query: Search query
            documents: List of documents to search
            max_results: Maximum results to return
            **kwargs: Additional parameters

        Returns:
            List of semantic search results
        """
        if not self.session:
            raise RuntimeError("Client not initialized. Use async with statement.")

        # Para busca semântica, usar embeddings API
        endpoint = self.embeddings_url

        payload = {
            "query": query,
            "documents": documents,
            "max_results": max_results,
            **kwargs
        }

        try:
            async with self.session.post(endpoint, json=payload) as response:
                response.raise_for_status()
                data = await response.json()
                return data.get("results", [])

        except aiohttp.ClientError as e:
            logger.error(f"Jina semantic search failed: {e}")
            raise

    async def extract_content(self, url: str) -> Dict[str, Any]:
        """
        Extract content from a URL using Jina's content extraction.

        Args:
            url: URL to extract content from

        Returns:
            Extracted content data
        """
        if not self.session:
            raise RuntimeError("Client not initialized. Use async with statement.")

        # Usar Jina Reader para extração de conteúdo
        endpoint = f"{self.reader_url}/{url}"

        try:
            # Jina Reader usa GET com URL como path
            async with self.session.get(endpoint) as response:
                response.raise_for_status()
                content = await response.text()

                # Retornar formato estruturado
                return {
                    "url": url,
                    "content": content,
                    "extracted_at": "now",
                    "success": True
                }

        except aiohttp.ClientError as e:
            logger.error(f"Jina content extraction failed: {e}")
            raise


# Singleton instance for reuse
_jina_client: Optional[JinaAPIClient] = None

async def get_jina_client() -> JinaAPIClient:
    """Get or create Jina API client instance."""
    global _jina_client
    if _jina_client is None:
        _jina_client = JinaAPIClient()
    return _jina_client
