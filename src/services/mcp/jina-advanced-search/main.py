#!/usr/bin/env python3
"""
Main entry point for the Jina Advanced Search MCP Server.
Implements advanced internet search capabilities using Jina AI framework.
"""

import asyncio
import json
import logging
import os
import sys
from typing import Any, Dict, List, Optional, Union

from mcp.server import Server
from mcp.types import (
    Resource,
    Tool,
    TextContent,
    ImageContent,
    EmbeddedResource,
    LoggingLevel,
)
import mcp.server.stdio
import mcp.types as types

# Import utils directly
from utils import (
    JinaAPIClient,
    DocumentArrayManager,
    SearchConfigManager,
    ResultsAggregator
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize MCP server
server = Server("jina-advanced-search")

# Global instances
search_config_manager = SearchConfigManager()
document_manager = DocumentArrayManager()
results_aggregator = ResultsAggregator()

def create_jina_client(api_key: Optional[str] = None) -> JinaAPIClient:
    """Create a new Jina API client."""
    return JinaAPIClient(api_key or os.getenv("JINA_API_KEY"))

@server.list_tools()
async def handle_list_tools() -> list[types.Tool]:
    """List available tools."""
    return [
        types.Tool(
            name="advanced_web_search",
            description="Perform advanced web search with Jina AI including content extraction and ranking",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query"
                    },
                    "max_results": {
                        "type": "integer",
                        "description": "Maximum number of results to return",
                        "default": 10
                    },
                    "search_type": {
                        "type": "string",
                        "description": "Type of search to perform",
                        "default": "advanced"
                    },
                    "api_key": {
                        "type": "string",
                        "description": "Optional Jina API key"
                    },
                    "use_reranking": {
                        "type": "boolean",
                        "description": "Whether to apply result reranking",
                        "default": True
                    }
                },
                "required": ["query"]
            }
        ),
        types.Tool(
            name="multimodal_search",
            description="Perform multimodal search combining text and images",
            inputSchema={
                "type": "object",
                "properties": {
                    "text_query": {
                        "type": "string",
                        "description": "Text search query"
                    },
                    "image_url": {
                        "type": "string",
                        "description": "URL of image to search with"
                    },
                    "max_results": {
                        "type": "integer",
                        "description": "Maximum number of results to return",
                        "default": 10
                    },
                    "api_key": {
                        "type": "string",
                        "description": "Optional Jina API key"
                    }
                },
                "required": []
            }
        ),
        types.Tool(
            name="semantic_search",
            description="Perform semantic search against provided documents",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query"
                    },
                    "documents": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "List of documents to search against"
                    },
                    "max_results": {
                        "type": "integer",
                        "description": "Maximum number of results to return",
                        "default": 10
                    },
                    "api_key": {
                        "type": "string",
                        "description": "Optional Jina API key"
                    }
                },
                "required": ["query", "documents"]
            }
        ),
        types.Tool(
            name="extract_content",
            description="Extract content from a URL using Jina's content extraction",
            inputSchema={
                "type": "object",
                "properties": {
                    "url": {
                        "type": "string",
                        "description": "URL to extract content from"
                    },
                    "api_key": {
                        "type": "string",
                        "description": "Optional Jina API key"
                    }
                },
                "required": ["url"]
            }
        ),
        types.Tool(
            name="get_server_info",
            description="Get information about the Jina Advanced Search MCP server",
            inputSchema={
                "type": "object",
                "properties": {},
                "required": []
            }
        )
    ]

@server.call_tool()
async def handle_call_tool(name: str, arguments: dict) -> list[types.TextContent]:
    """Handle tool calls."""
    try:
        if name == "advanced_web_search":
            result = await advanced_web_search(arguments)
        elif name == "multimodal_search":
            result = await multimodal_search(arguments)
        elif name == "semantic_search":
            result = await semantic_search(arguments)
        elif name == "extract_content":
            result = await extract_content(arguments)
        elif name == "get_server_info":
            result = await get_server_info()
        else:
            raise ValueError(f"Unknown tool: {name}")

        return [types.TextContent(type="text", text=json.dumps(result, indent=2))]
    except Exception as e:
        logger.error(f"Error in tool {name}: {str(e)}")
        return [types.TextContent(type="text", text=json.dumps({"error": str(e)}))]

async def advanced_web_search(arguments: dict) -> Dict[str, Any]:
    """
    Perform advanced web search with Jina AI.

    Implements:
    - Basic web search with Jina AI
    - Content extraction and processing
    - Result ranking and aggregation
    """
    try:
        query = arguments["query"]
        max_results = arguments.get("max_results", 10)
        search_type = arguments.get("search_type", "advanced")
        api_key = arguments.get("api_key")
        use_reranking = arguments.get("use_reranking", True)

        logger.info(f"Starting advanced web search for query: {query}")

        # Initialize Jina client
        client = create_jina_client(api_key)

        # Perform basic search using async context manager
        async with client as jina:
            search_results = await jina.search(
                query=query,
                max_results=max_results,
                search_type="web"
            )

            # Convert SearchResult objects to dictionaries
            search_results_dicts = []
            for result in search_results:
                if hasattr(result, 'to_dict'):
                    search_results_dicts.append(result.to_dict())
                elif hasattr(result, '__dict__'):
                    search_results_dicts.append(result.__dict__)
                else:
                    # Manually convert SearchResult to dict
                    search_results_dicts.append({
                        "title": getattr(result, 'title', ''),
                        "url": getattr(result, 'url', ''),
                        "content": getattr(result, 'content', ''),
                        "score": getattr(result, 'score', 0.0),
                        "metadata": getattr(result, 'metadata', {})
                    })

            # Convert to our document format
            doc_array = await document_manager.create_from_search_results(
                search_results_dicts,
                source="jina_search"
            )

            # Apply ranking if enabled
            if use_reranking:
                ranking_factors = {
                    "neural_relevance": 0.4,
                    "domain_authority": 0.3,
                    "freshness": 0.3
                }
                ranked_docs = await results_aggregator.rank_results(
                    doc_array.documents,
                    ranking_factors
                )
            else:
                ranked_docs = doc_array.documents

            # Format results
            formatted_results = {
                "query": query,
                "search_type": "advanced_web_search",
                "total_results": len(ranked_docs),
                "documents": [
                    {
                        "id": doc.id,
                        "title": doc.title,
                        "content": doc.content,
                        "url": doc.url,
                        "score": doc.score,
                        "metadata": doc.metadata,
                        "modality": doc.modality
                    }
                    for doc in ranked_docs[:max_results]
                ]
            }

            logger.info(f"Advanced search completed. Found {len(ranked_docs)} results")
            return formatted_results

    except Exception as e:
        logger.error(f"Error in advanced web search: {str(e)}")
        return {
            "error": str(e),
            "query": arguments.get("query", ""),
            "search_type": "advanced_web_search",
            "total_results": 0
        }

async def multimodal_search(arguments: dict) -> Dict[str, Any]:
    """
    Perform multimodal search combining text and images.

    Implements:
    - Text and image query processing
    - Cross-modal result fusion
    """
    try:
        text_query = arguments.get("text_query")
        image_url = arguments.get("image_url")
        max_results = arguments.get("max_results", 10)
        api_key = arguments.get("api_key")

        logger.info("Starting multimodal search")

        if not text_query and not image_url:
            return {
                "error": "Either text_query or image_url must be provided",
                "search_type": "multimodal",
                "total_results": 0
            }

        client = create_jina_client(api_key)
        results = []

        # Use async context manager for client
        async with client as jina:
            # Text search if provided
            if text_query:
                text_results = await jina.search(
                    query=text_query,
                    max_results=max_results,
                    search_type="web"
                )
                # Convert SearchResult objects to dicts and add modality
                for result in text_results:
                    result_dict = {}
                    if hasattr(result, 'to_dict'):
                        result_dict = result.to_dict()
                    elif hasattr(result, '__dict__'):
                        result_dict = result.__dict__.copy()
                    else:
                        result_dict = {
                            "title": getattr(result, 'title', ''),
                            "url": getattr(result, 'url', ''),
                            "content": getattr(result, 'content', ''),
                            "score": getattr(result, 'score', 0.0),
                            "metadata": getattr(result, 'metadata', {})
                        }
                    result_dict["metadata"] = result_dict.get("metadata", {})
                    result_dict["metadata"]["modality"] = "text"
                    results.append(result_dict)

            # Multimodal search if image provided
            if image_url:
                multimodal_results = await jina.multimodal_search(
                    query=text_query or "",
                    image_url=image_url,
                    max_results=max_results
                )
                # Convert multimodal results to dicts
                for result in multimodal_results:
                    result_dict = {}
                    if hasattr(result, 'to_dict'):
                        result_dict = result.to_dict()
                    elif hasattr(result, '__dict__'):
                        result_dict = result.__dict__.copy()
                    else:
                        result_dict = {
                            "title": getattr(result, 'title', ''),
                            "url": getattr(result, 'url', ''),
                            "content": getattr(result, 'content', ''),
                            "score": getattr(result, 'score', 0.0),
                            "metadata": getattr(result, 'metadata', {})
                        }
                    results.append(result_dict)

        # Convert to document array
        doc_array = await document_manager.create_from_search_results(
            results,
            source="multimodal_search"
        )

        # Group by modality
        modality_groups = doc_array.group_by_modality()

        formatted_results = {
            "search_type": "multimodal",
            "total_results": len(doc_array.documents),
            "text_query": text_query,
            "image_url": image_url,
            "results_by_modality": {},
            "unified_ranking": [
                {
                    "id": doc.id,
                    "title": doc.title,
                    "content": doc.content,
                    "url": doc.url,
                    "score": doc.score,
                    "modality": doc.modality,
                    "metadata": doc.metadata
                }
                for doc in doc_array.get_top_k(max_results).documents
            ]
        }

        # Add modality breakdown
        for modality, docs in modality_groups.items():
            formatted_results["results_by_modality"][modality] = {
                "count": len(docs),
                "top_results": [
                    {
                        "id": doc.id,
                        "title": doc.title,
                        "url": doc.url,
                        "score": doc.score
                    }
                    for doc in docs.get_top_k(5).documents
                ]
            }

        logger.info(f"Multimodal search completed with {len(doc_array)} total results")
        return formatted_results

    except Exception as e:
        logger.error(f"Error in multimodal search: {str(e)}")
        return {
            "error": str(e),
            "search_type": "multimodal",
            "total_results": 0
        }

async def semantic_search(arguments: dict) -> Dict[str, Any]:
    """
    Perform semantic search against provided documents.
    """
    try:
        query = arguments["query"]
        documents = arguments["documents"]
        max_results = arguments.get("max_results", 10)
        api_key = arguments.get("api_key")

        logger.info(f"Starting semantic search for query: {query}")

        client = create_jina_client(api_key)

        async with client as jina:
            results = await jina.semantic_search(
                query=query,
                documents=documents,
                max_results=max_results
            )

        formatted_results = {
            "query": query,
            "search_type": "semantic_search",
            "total_documents_searched": len(documents),
            "total_results": len(results),
            "results": results
        }

        logger.info(f"Semantic search completed with {len(results)} results")
        return formatted_results

    except Exception as e:
        logger.error(f"Error in semantic search: {str(e)}")
        return {
            "error": str(e),
            "query": arguments.get("query", ""),
            "search_type": "semantic_search",
            "total_results": 0
        }

async def extract_content(arguments: dict) -> Dict[str, Any]:
    """
    Extract content from a URL using Jina's content extraction.
    """
    try:
        url = arguments["url"]
        api_key = arguments.get("api_key")

        logger.info(f"Extracting content from URL: {url}")

        client = create_jina_client(api_key)

        async with client as jina:
            content_data = await jina.extract_content(url)

        formatted_result = {
            "url": url,
            "operation": "content_extraction",
            "success": True,
            "content": content_data
        }

        logger.info(f"Content extraction completed for: {url}")
        return formatted_result

    except Exception as e:
        logger.error(f"Error extracting content from {arguments.get('url', '')}: {str(e)}")
        return {
            "error": str(e),
            "url": arguments.get("url", ""),
            "operation": "content_extraction",
            "success": False
        }

async def get_server_info() -> Dict[str, Any]:
    """Get information about the Jina Advanced Search MCP server."""
    try:
        config = search_config_manager.load_config()

        return {
            "server_name": "Jina Advanced Search MCP Server",
            "version": "1.0.0",
            "status": "running",
            "available_tools": [
                "advanced_web_search",
                "multimodal_search",
                "semantic_search",
                "extract_content",
                "get_server_info"
            ],
            "configuration": {
                "jina_api_configured": bool(config.jina_api_key),
                "cache_enabled": config.enable_caching,
                "max_cache_size_mb": config.max_cache_size_mb,
                "log_level": config.log_level
            }
        }
    except Exception as e:
        logger.error(f"Error getting server info: {str(e)}")
        return {
            "error": str(e),
            "server_name": "Jina Advanced Search MCP Server",
            "status": "error"
        }

async def main():
    """Main entry point for the Jina Advanced Search MCP Server."""
    logger.info("Starting Jina Advanced Search MCP Server...")

    # Check for required environment variables
    if not os.getenv("JINA_API_KEY"):
        logger.warning("JINA_API_KEY not found in environment variables. API key must be provided in requests.")

    try:
        # Run the server using stdio transport
        async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
            await server.run(
                read_stream,
                write_stream,
                server.create_initialization_options()
            )

    except Exception as e:
        logger.error(f"Error running server: {str(e)}")
        sys.exit(1)

def run_server():
    """Run the Jina Advanced Search MCP Server."""
    asyncio.run(main())

if __name__ == "__main__":
    run_server()
