"""
Document Array Manager for handling Jina DocumentArray operations.
"""

import asyncio
from typing import List, Dict, Any, Optional, Union
from dataclasses import dataclass, field
import json
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

@dataclass
class Document:
    """Represents a single document in the search results."""

    id: str
    content: str
    title: str = ""
    url: str = ""
    score: float = 0.0
    metadata: Dict[str, Any] = field(default_factory=dict)
    timestamp: Optional[datetime] = None
    modality: str = "text"  # text, image, video, audio, multimodal

    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.now()

    def to_dict(self) -> Dict[str, Any]:
        """Convert document to dictionary."""
        return {
            "id": self.id,
            "content": self.content,
            "title": self.title,
            "url": self.url,
            "score": self.score,
            "metadata": self.metadata,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "modality": self.modality
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Document":
        """Create document from dictionary."""
        timestamp = None
        if data.get("timestamp"):
            timestamp = datetime.fromisoformat(data["timestamp"])

        return cls(
            id=data["id"],
            content=data["content"],
            title=data.get("title", ""),
            url=data.get("url", ""),
            score=data.get("score", 0.0),
            metadata=data.get("metadata", {}),
            timestamp=timestamp,
            modality=data.get("modality", "text")
        )


@dataclass
class DocumentArray:
    """Manages a collection of documents with advanced operations."""

    documents: List[Document] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)

    def __len__(self) -> int:
        return len(self.documents)

    def __iter__(self):
        return iter(self.documents)

    def __getitem__(self, index: Union[int, slice]) -> Union[Document, "DocumentArray"]:
        if isinstance(index, slice):
            return DocumentArray(documents=self.documents[index])
        return self.documents[index]

    def append(self, document: Document) -> None:
        """Add a document to the array."""
        self.documents.append(document)

    def extend(self, documents: List[Document]) -> None:
        """Add multiple documents to the array."""
        self.documents.extend(documents)

    def filter_by_score(self, min_score: float) -> "DocumentArray":
        """Filter documents by minimum score."""
        filtered_docs = [doc for doc in self.documents if doc.score >= min_score]
        return DocumentArray(documents=filtered_docs, metadata=self.metadata)

    def filter_by_modality(self, modality: str) -> "DocumentArray":
        """Filter documents by modality type."""
        filtered_docs = [doc for doc in self.documents if doc.modality == modality]
        return DocumentArray(documents=filtered_docs, metadata=self.metadata)

    def sort_by_score(self, descending: bool = True) -> "DocumentArray":
        """Sort documents by score."""
        sorted_docs = sorted(
            self.documents,
            key=lambda x: x.score,
            reverse=descending
        )
        return DocumentArray(documents=sorted_docs, metadata=self.metadata)

    def sort_by_timestamp(self, descending: bool = True) -> "DocumentArray":
        """Sort documents by timestamp."""
        sorted_docs = sorted(
            self.documents,
            key=lambda x: x.timestamp or datetime.min,
            reverse=descending
        )
        return DocumentArray(documents=sorted_docs, metadata=self.metadata)

    def group_by_modality(self) -> Dict[str, "DocumentArray"]:
        """Group documents by modality."""
        groups = {}
        for doc in self.documents:
            if doc.modality not in groups:
                groups[doc.modality] = DocumentArray(metadata=self.metadata)
            groups[doc.modality].append(doc)
        return groups

    def get_top_k(self, k: int) -> "DocumentArray":
        """Get top k documents by score."""
        sorted_array = self.sort_by_score(descending=True)
        return sorted_array[:k]

    def deduplicate(self, key: str = "url") -> "DocumentArray":
        """Remove duplicate documents based on a key."""
        seen = set()
        unique_docs = []

        for doc in self.documents:
            value = getattr(doc, key, None) or doc.metadata.get(key)
            if value and value not in seen:
                seen.add(value)
                unique_docs.append(doc)
            elif not value:
                # Keep documents without the key
                unique_docs.append(doc)

        return DocumentArray(documents=unique_docs, metadata=self.metadata)

    def to_dict(self) -> Dict[str, Any]:
        """Convert document array to dictionary."""
        return {
            "documents": [doc.to_dict() for doc in self.documents],
            "metadata": self.metadata,
            "total_count": len(self.documents)
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "DocumentArray":
        """Create document array from dictionary."""
        documents = [Document.from_dict(doc_data) for doc_data in data.get("documents", [])]
        metadata = data.get("metadata", {})
        return cls(documents=documents, metadata=metadata)

    def to_json(self) -> str:
        """Convert to JSON string."""
        return json.dumps(self.to_dict(), indent=2)

    @classmethod
    def from_json(cls, json_str: str) -> "DocumentArray":
        """Create from JSON string."""
        data = json.loads(json_str)
        return cls.from_dict(data)


class DocumentArrayManager:
    """High-level manager for DocumentArray operations."""

    def __init__(self):
        self.cache: Dict[str, DocumentArray] = {}

    async def create_from_search_results(
        self,
        results: List[Dict[str, Any]],
        source: str = "unknown"
    ) -> DocumentArray:
        """Create DocumentArray from search results."""
        documents = []

        for i, result in enumerate(results):
            doc = Document(
                id=result.get("id", f"{source}_{i}"),
                content=result.get("content", ""),
                title=result.get("title", ""),
                url=result.get("url", ""),
                score=result.get("score", 0.0),
                metadata={
                    **result.get("metadata", {}),
                    "source": source,
                    "position": i
                },
                modality=result.get("modality", "text")
            )
            documents.append(doc)

        doc_array = DocumentArray(
            documents=documents,
            metadata={
                "source": source,
                "created_at": datetime.now().isoformat(),
                "total_results": len(results)
            }
        )

        return doc_array

    async def merge_arrays(self, *arrays: DocumentArray) -> DocumentArray:
        """Merge multiple DocumentArrays."""
        merged_docs = []
        merged_metadata = {"sources": [], "merged_at": datetime.now().isoformat()}

        for array in arrays:
            merged_docs.extend(array.documents)
            if array.metadata.get("source"):
                merged_metadata["sources"].append(array.metadata["source"])

        return DocumentArray(
            documents=merged_docs,
            metadata=merged_metadata
        )

    async def hybrid_rank(
        self,
        arrays: List[DocumentArray],
        weights: Optional[List[float]] = None
    ) -> DocumentArray:
        """Perform hybrid ranking across multiple arrays."""
        if not arrays:
            return DocumentArray()

        if weights is None:
            weights = [1.0 / len(arrays)] * len(arrays)
        elif len(weights) != len(arrays):
            raise ValueError("Number of weights must match number of arrays")

        # Normalize scores and apply weights
        weighted_docs = {}

        for array, weight in zip(arrays, weights):
            if not array.documents:
                continue

            # Normalize scores to 0-1 range
            max_score = max(doc.score for doc in array.documents)
            min_score = min(doc.score for doc in array.documents)
            score_range = max_score - min_score or 1.0

            for doc in array.documents:
                normalized_score = (doc.score - min_score) / score_range
                weighted_score = normalized_score * weight

                doc_key = doc.url or doc.id
                if doc_key in weighted_docs:
                    # Combine scores from multiple sources
                    weighted_docs[doc_key].score += weighted_score
                    weighted_docs[doc_key].metadata["sources"] = list(set(
                        weighted_docs[doc_key].metadata.get("sources", []) +
                        [doc.metadata.get("source", "unknown")]
                    ))
                else:
                    new_doc = Document(
                        id=doc.id,
                        content=doc.content,
                        title=doc.title,
                        url=doc.url,
                        score=weighted_score,
                        metadata={
                            **doc.metadata,
                            "sources": [doc.metadata.get("source", "unknown")]
                        },
                        modality=doc.modality
                    )
                    weighted_docs[doc_key] = new_doc

        # Sort by final weighted score
        final_docs = sorted(
            weighted_docs.values(),
            key=lambda x: x.score,
            reverse=True
        )

        return DocumentArray(
            documents=final_docs,
            metadata={
                "hybrid_ranking": True,
                "weights": weights,
                "source_count": len(arrays),
                "created_at": datetime.now().isoformat()
            }
        )

    def cache_array(self, key: str, array: DocumentArray) -> None:
        """Cache a DocumentArray."""
        self.cache[key] = array

    def get_cached_array(self, key: str) -> Optional[DocumentArray]:
        """Get cached DocumentArray."""
        return self.cache.get(key)

    def clear_cache(self) -> None:
        """Clear all cached arrays."""
        self.cache.clear()


# Singleton instance
_document_manager: Optional[DocumentArrayManager] = None

def get_document_manager() -> DocumentArrayManager:
    """Get or create document manager instance."""
    global _document_manager
    if _document_manager is None:
        _document_manager = DocumentArrayManager()
    return _document_manager
