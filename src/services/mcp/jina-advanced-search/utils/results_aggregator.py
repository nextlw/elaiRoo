"""
Results Aggregator for combining and processing search results.
"""

import asyncio
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
import logging
from datetime import datetime

from .document_manager import DocumentArray, Document

logger = logging.getLogger(__name__)

@dataclass
class AggregationResult:
    """Result of aggregation process."""
    documents: List[Document]
    metadata: Dict[str, Any]
    total_sources: int
    processing_time: float

class ResultsAggregator:
    """Aggregates and processes search results from multiple sources."""

    def __init__(self):
        self.cache: Dict[str, Any] = {}

    async def aggregate_search_results(
        self,
        results_list: List[List[Dict[str, Any]]],
        source_names: Optional[List[str]] = None,
        weights: Optional[List[float]] = None
    ) -> AggregationResult:
        """
        Aggregate search results from multiple sources.

        Args:
            results_list: List of result lists from different sources
            source_names: Names of the sources
            weights: Weights for each source (optional)

        Returns:
            Aggregated results
        """
        start_time = datetime.now()

        if not results_list:
            return AggregationResult(
                documents=[],
                metadata={"sources": [], "aggregated_at": start_time.isoformat()},
                total_sources=0,
                processing_time=0.0
            )

        if source_names is None:
            source_names = [f"source_{i}" for i in range(len(results_list))]

        if weights is None:
            weights = [1.0 / len(results_list)] * len(results_list)

        aggregated_docs = []
        seen_urls = set()

        for i, (results, source, weight) in enumerate(zip(results_list, source_names, weights)):
            for j, result in enumerate(results):
                # Create document
                doc = Document(
                    id=result.get("id", f"{source}_{j}"),
                    content=result.get("content", ""),
                    title=result.get("title", ""),
                    url=result.get("url", ""),
                    score=result.get("score", 0.0) * weight,
                    metadata={
                        **result.get("metadata", {}),
                        "source": source,
                        "source_index": i,
                        "position": j,
                        "weight": weight
                    },
                    modality=result.get("modality", "text")
                )

                # Deduplicate by URL
                if doc.url and doc.url in seen_urls:
                    continue
                if doc.url:
                    seen_urls.add(doc.url)

                aggregated_docs.append(doc)

        # Sort by weighted score
        aggregated_docs.sort(key=lambda x: x.score, reverse=True)

        processing_time = (datetime.now() - start_time).total_seconds()

        return AggregationResult(
            documents=aggregated_docs,
            metadata={
                "sources": source_names,
                "weights": weights,
                "aggregated_at": start_time.isoformat(),
                "deduplication": "url_based",
                "total_results": len(aggregated_docs)
            },
            total_sources=len(results_list),
            processing_time=processing_time
        )

    async def rank_results(
        self,
        documents: List[Document],
        ranking_factors: Dict[str, float]
    ) -> List[Document]:
        """
        Re-rank documents based on multiple factors.

        Args:
            documents: List of documents to rank
            ranking_factors: Factors and their weights

        Returns:
            Re-ranked documents
        """
        for doc in documents:
            combined_score = 0.0

            # Neural relevance (original score)
            neural_score = doc.score
            combined_score += neural_score * ranking_factors.get("neural_relevance", 0.4)

            # Domain authority (mock calculation)
            domain_authority = self._calculate_domain_authority(doc.url)
            combined_score += domain_authority * ranking_factors.get("domain_authority", 0.3)

            # Freshness (mock calculation)
            freshness_score = self._calculate_freshness(doc.metadata.get("publish_date"))
            combined_score += freshness_score * ranking_factors.get("freshness", 0.3)

            # Update document score
            doc.score = combined_score
            doc.metadata["ranking_breakdown"] = {
                "neural_relevance": neural_score,
                "domain_authority": domain_authority,
                "freshness": freshness_score,
                "combined_score": combined_score
            }

        # Sort by new combined score
        return sorted(documents, key=lambda x: x.score, reverse=True)

    def _calculate_domain_authority(self, url: str) -> float:
        """Calculate domain authority score (mock implementation)."""
        if not url:
            return 0.0

        trusted_domains = [
            "wikipedia.org", "github.com", "stackoverflow.com",
            "arxiv.org", "scholar.google.com", "nature.com"
        ]

        for domain in trusted_domains:
            if domain in url:
                return 0.9

        if any(ext in url for ext in [".edu", ".gov", ".org"]):
            return 0.7
        elif any(ext in url for ext in [".com", ".net"]):
            return 0.5

        return 0.3

    def _calculate_freshness(self, publish_date: Optional[str]) -> float:
        """Calculate freshness score based on publish date."""
        if not publish_date:
            return 0.5  # Default middle score

        try:
            pub_date = datetime.fromisoformat(publish_date.replace("Z", "+00:00"))
            now = datetime.now()
            days_old = (now - pub_date).days

            if days_old <= 1:
                return 1.0
            elif days_old <= 7:
                return 0.8
            elif days_old <= 30:
                return 0.6
            elif days_old <= 90:
                return 0.4
            else:
                return 0.2

        except (ValueError, TypeError):
            return 0.5

    def cache_result(self, key: str, result: Any) -> None:
        """Cache aggregation result."""
        self.cache[key] = result

    def get_cached_result(self, key: str) -> Optional[Any]:
        """Get cached result."""
        return self.cache.get(key)

    def clear_cache(self) -> None:
        """Clear all cached results."""
        self.cache.clear()


# Singleton instance
_results_aggregator: Optional[ResultsAggregator] = None

def get_results_aggregator() -> ResultsAggregator:
    """Get or create results aggregator instance."""
    global _results_aggregator
    if _results_aggregator is None:
        _results_aggregator = ResultsAggregator()
    return _results_aggregator
