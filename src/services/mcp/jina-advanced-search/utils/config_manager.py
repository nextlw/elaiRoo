"""
Configuration Manager for Jina Advanced Search MCP Server.
"""

import os
import json
from typing import Dict, Any, Optional, List
from dataclasses import dataclass, field, asdict
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

@dataclass
class AdvancedSearchConfig:
    """Configuration for advanced web search."""
    max_results: int = 20
    enable_content_extraction: bool = True
    include_images: bool = False
    include_videos: bool = False
    language: str = "en"
    region: str = "global"
    safe_search: str = "moderate"  # strict, moderate, off
    time_range: Optional[str] = None  # day, week, month, year
    custom_filters: Dict[str, Any] = field(default_factory=dict)

@dataclass
class DeepSearchConfig:
    """Configuration for deep search operations."""
    max_depth: int = 3
    follow_redirects: bool = True
    extract_links: bool = True
    analyze_content: bool = True
    max_pages_per_domain: int = 10
    respect_robots_txt: bool = True
    crawl_delay: float = 1.0
    timeout_seconds: int = 30
    user_agent: str = "Jina-Advanced-Search/1.0"

@dataclass
class MultimodalSearchConfig:
    """Configuration for multimodal search."""
    enable_image_search: bool = True
    enable_video_search: bool = True
    enable_audio_search: bool = False
    max_file_size_mb: int = 50
    supported_formats: List[str] = field(default_factory=lambda: [
        "jpg", "jpeg", "png", "gif", "webp", "mp4", "avi", "mov", "mp3", "wav"
    ])
    similarity_threshold: float = 0.7

@dataclass
class TemporalSearchConfig:
    """Configuration for temporal search analysis."""
    enable_trend_analysis: bool = True
    time_granularity: str = "day"  # hour, day, week, month
    lookback_period: str = "30d"  # 1d, 7d, 30d, 90d, 1y
    detect_patterns: bool = True
    include_forecasting: bool = False

@dataclass
class HybridRankingConfig:
    """Configuration for hybrid ranking."""
    neural_weight: float = 0.4
    authority_weight: float = 0.3
    freshness_weight: float = 0.2
    relevance_weight: float = 0.1
    custom_factors: Dict[str, float] = field(default_factory=dict)
    normalize_scores: bool = True
    boost_trusted_domains: bool = True
    trusted_domains: List[str] = field(default_factory=lambda: [
        "wikipedia.org", "github.com", "stackoverflow.com", "arxiv.org"
    ])

@dataclass
class JinaAdvancedSearchConfig:
    """Main configuration for Jina Advanced Search MCP Server."""

    # API Configuration
    jina_api_key: Optional[str] = None
    openai_api_key: Optional[str] = None
    api_timeout: int = 60
    max_retries: int = 3
    rate_limit_requests_per_minute: int = 100

    # Search Configurations
    advanced_search: AdvancedSearchConfig = field(default_factory=AdvancedSearchConfig)
    deep_search: DeepSearchConfig = field(default_factory=DeepSearchConfig)
    multimodal_search: MultimodalSearchConfig = field(default_factory=MultimodalSearchConfig)
    temporal_search: TemporalSearchConfig = field(default_factory=TemporalSearchConfig)
    hybrid_ranking: HybridRankingConfig = field(default_factory=HybridRankingConfig)

    # Caching
    enable_caching: bool = True
    cache_ttl_minutes: int = 60
    max_cache_size_mb: int = 500

    # Logging
    log_level: str = "INFO"
    log_requests: bool = True
    log_responses: bool = False

    def __post_init__(self):
        """Post-initialization to load from environment."""
        if not self.jina_api_key:
            self.jina_api_key = os.getenv("JINA_API_KEY")
        if not self.openai_api_key:
            self.openai_api_key = os.getenv("OPENAI_API_KEY")

class SearchConfigManager:
    """Manager for search configuration with validation and persistence."""

    def __init__(self, config_path: Optional[str] = None):
        self.config_path = config_path or self._get_default_config_path()
        self._config: Optional[JinaAdvancedSearchConfig] = None

    def _get_default_config_path(self) -> str:
        """Get default configuration file path."""
        config_dir = Path.home() / ".jina-advanced-search"
        config_dir.mkdir(exist_ok=True)
        return str(config_dir / "config.json")

    def load_config(self) -> JinaAdvancedSearchConfig:
        """Load configuration from file or create default."""
        if self._config is not None:
            return self._config

        try:
            if os.path.exists(self.config_path):
                with open(self.config_path, 'r') as f:
                    config_dict = json.load(f)
                self._config = self._dict_to_config(config_dict)
                logger.info(f"Loaded configuration from {self.config_path}")
            else:
                self._config = JinaAdvancedSearchConfig()
                self.save_config()
                logger.info("Created default configuration")

        except Exception as e:
            logger.error(f"Error loading config: {e}")
            self._config = JinaAdvancedSearchConfig()

        return self._config

    def save_config(self) -> None:
        """Save current configuration to file."""
        if self._config is None:
            return

        try:
            config_dict = self._config_to_dict(self._config)
            os.makedirs(os.path.dirname(self.config_path), exist_ok=True)

            with open(self.config_path, 'w') as f:
                json.dump(config_dict, f, indent=2)
            logger.info(f"Saved configuration to {self.config_path}")

        except Exception as e:
            logger.error(f"Error saving config: {e}")

    def update_config(self, updates: Dict[str, Any]) -> None:
        """Update configuration with new values."""
        config = self.load_config()

        # Update nested configurations
        for key, value in updates.items():
            if hasattr(config, key):
                if isinstance(value, dict) and hasattr(getattr(config, key), '__dict__'):
                    # Update nested dataclass
                    nested_config = getattr(config, key)
                    for nested_key, nested_value in value.items():
                        if hasattr(nested_config, nested_key):
                            setattr(nested_config, nested_key, nested_value)
                else:
                    setattr(config, key, value)

        self.save_config()

    def get_search_config(self, search_type: str) -> Any:
        """Get configuration for specific search type."""
        config = self.load_config()
        search_configs = {
            "advanced": config.advanced_search,
            "deep": config.deep_search,
            "multimodal": config.multimodal_search,
            "temporal": config.temporal_search,
            "hybrid_ranking": config.hybrid_ranking
        }
        return search_configs.get(search_type)

    def validate_config(self) -> List[str]:
        """Validate configuration and return list of issues."""
        issues = []
        config = self.load_config()

        # Check API keys
        if not config.jina_api_key:
            issues.append("JINA_API_KEY is not set")

        # Validate numeric ranges
        if config.api_timeout <= 0:
            issues.append("api_timeout must be positive")

        if config.max_retries < 0:
            issues.append("max_retries cannot be negative")

        if config.rate_limit_requests_per_minute <= 0:
            issues.append("rate_limit_requests_per_minute must be positive")

        # Validate search configurations
        if config.advanced_search.max_results <= 0:
            issues.append("advanced_search.max_results must be positive")

        if config.deep_search.max_depth <= 0:
            issues.append("deep_search.max_depth must be positive")

        if not (0.0 <= config.multimodal_search.similarity_threshold <= 1.0):
            issues.append("multimodal_search.similarity_threshold must be between 0 and 1")

        # Validate hybrid ranking weights
        weights = [
            config.hybrid_ranking.neural_weight,
            config.hybrid_ranking.authority_weight,
            config.hybrid_ranking.freshness_weight,
            config.hybrid_ranking.relevance_weight
        ]

        if abs(sum(weights) - 1.0) > 0.01:
            issues.append("hybrid_ranking weights should sum to 1.0")

        for weight in weights:
            if not (0.0 <= weight <= 1.0):
                issues.append("hybrid_ranking weights must be between 0 and 1")

        return issues

    def _config_to_dict(self, config: JinaAdvancedSearchConfig) -> Dict[str, Any]:
        """Convert config object to dictionary."""
        return asdict(config)

    def _dict_to_config(self, config_dict: Dict[str, Any]) -> JinaAdvancedSearchConfig:
        """Convert dictionary to config object."""
        # Handle nested configurations
        nested_configs = {
            'advanced_search': AdvancedSearchConfig,
            'deep_search': DeepSearchConfig,
            'multimodal_search': MultimodalSearchConfig,
            'temporal_search': TemporalSearchConfig,
            'hybrid_ranking': HybridRankingConfig
        }

        for key, config_class in nested_configs.items():
            if key in config_dict and isinstance(config_dict[key], dict):
                config_dict[key] = config_class(**config_dict[key])

        return JinaAdvancedSearchConfig(**config_dict)

    def reset_to_defaults(self) -> None:
        """Reset configuration to defaults."""
        self._config = JinaAdvancedSearchConfig()
        self.save_config()
        logger.info("Configuration reset to defaults")

    def export_config(self, export_path: str) -> None:
        """Export configuration to specified path."""
        config = self.load_config()
        config_dict = self._config_to_dict(config)

        with open(export_path, 'w') as f:
            json.dump(config_dict, f, indent=2)
        logger.info(f"Configuration exported to {export_path}")

    def import_config(self, import_path: str) -> None:
        """Import configuration from specified path."""
        with open(import_path, 'r') as f:
            config_dict = json.load(f)

        self._config = self._dict_to_config(config_dict)
        self.save_config()
        logger.info(f"Configuration imported from {import_path}")


# Singleton instance
_config_manager: Optional[SearchConfigManager] = None

def get_config_manager() -> SearchConfigManager:
    """Get or create configuration manager instance."""
    global _config_manager
    if _config_manager is None:
        _config_manager = SearchConfigManager()
    return _config_manager

def get_config() -> JinaAdvancedSearchConfig:
    """Get current configuration."""
    return get_config_manager().load_config()
