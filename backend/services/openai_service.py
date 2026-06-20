"""
==============================================================
YTGrab Pro – OpenAI Service (AI Analysis)
==============================================================

File: backend/services/openai_service.py
Description:
    Integrates with OpenAI's GPT-4o model to provide intelligent
    analysis of YouTube videos based on their metadata.

    This service:
    1. Receives video metadata (title, description, uploader, etc.)
    2. Sends a structured prompt to GPT-4o
    3. Parses the JSON response
    4. Returns structured AI insights

Setup:
    Set OPENAI_API_KEY environment variable before running:
    export OPENAI_API_KEY="sk-your-key-here"

    Or add to .env file:
    OPENAI_API_KEY=sk-your-key-here

Cost:
    GPT-4o pricing: ~$0.005 per analysis request
    GPT-4o-mini: ~$0.0003 per request (cheaper alternative)
==============================================================
"""

import json
import logging
import os
from typing import Dict, Any, Optional

logger = logging.getLogger("ytgrab.openai")


async def analyze_video_with_ai(video_info: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyze a YouTube video using OpenAI GPT-4o.

    Takes video metadata and returns AI-generated insights including:
    - A concise summary of the video content
    - Recommended download quality based on content type
    - Content tags for categorization
    - Content category (Music, Education, Gaming, etc.)
    - Sentiment analysis (Positive, Neutral, Negative)
    - Key topics covered

    Args:
        video_info: Dictionary from get_video_info() containing
                   title, description, uploader, view_count, etc.

    Returns:
        Dictionary with AI analysis results

    Raises:
        ImportError: If openai package is not installed
        ValueError: If OPENAI_API_KEY is not set
        Exception: For API errors
    """
    try:
        from openai import AsyncOpenAI
    except ImportError:
        logger.error("openai package not installed. Run: pip install openai")
        return _fallback_analysis(video_info)

    # Check for API key
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        logger.warning("OPENAI_API_KEY not set. Using fallback analysis.")
        return _fallback_analysis(video_info)

    # Initialize the async OpenAI client
    client = AsyncOpenAI(api_key=api_key)

    # Build the analysis prompt
    # We give GPT-4o structured information and ask for JSON output
    title = video_info.get("title", "Unknown")
    description = (video_info.get("description") or "")[:300]  # Limit length
    uploader = video_info.get("uploader", "Unknown")
    view_count = video_info.get("view_count", 0)
    duration = video_info.get("duration", 0)

    # Format duration for the prompt
    duration_str = f"{duration // 60}m {duration % 60}s" if duration else "Unknown"

    # System prompt: defines GPT's role and output format
    system_prompt = """You are an expert video content analyst for a YouTube downloader application.
Analyze the provided video metadata and return a JSON object with the following fields:
{
  "summary": "2-3 sentences describing what this video is about",
  "recommended_quality": "Best quality for this content type (e.g. '1080p' for music videos, '720p' for tutorials, '320 kbps' for podcasts)",
  "tags": ["array", "of", "5-8", "relevant", "tags"],
  "category": "One of: Music, Education, Gaming, Entertainment, News, Sports, Technology, Comedy, Film, Other",
  "sentiment": "One of: Very Positive, Positive & Energetic, Neutral, Mixed, Negative",
  "key_topics": ["array", "of", "2-4", "main", "topics"]
}
Always return valid JSON only. No markdown, no explanations outside the JSON."""

    # User prompt: the actual video data to analyze
    user_prompt = f"""Analyze this YouTube video:

Title: {title}
Channel: {uploader}
Duration: {duration_str}
Views: {view_count:,}
Description: {description}

Provide your analysis as a JSON object."""

    logger.info(f"Sending AI analysis request for: {title}")

    try:
        # Make the API call to GPT-4o
        response = await client.chat.completions.create(
            model="gpt-4o",              # Use GPT-4o (most capable)
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},  # Force JSON output
            max_tokens=500,              # Limit response length
            temperature=0.3,            # Low temperature = more consistent/factual
        )

        # Extract and parse the JSON response
        content = response.choices[0].message.content
        analysis = json.loads(content)

        logger.info(f"AI analysis complete. Category: {analysis.get('category')}")
        return analysis

    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse GPT response as JSON: {e}")
        return _fallback_analysis(video_info)
    except Exception as e:
        logger.error(f"OpenAI API error: {e}")
        return _fallback_analysis(video_info)


def _fallback_analysis(video_info: Dict[str, Any]) -> Dict[str, Any]:
    """
    Rule-based fallback analysis when OpenAI is unavailable.
    Uses heuristics based on title and description keywords
    to provide basic analysis without the API.

    This ensures the app still works when OPENAI_API_KEY is not set.
    """
    title = video_info.get("title", "").lower()
    description = (video_info.get("description") or "").lower()
    duration = video_info.get("duration", 0)

    # Simple keyword-based category detection
    categories = {
        "Music": ["music", "song", "album", "official", "mv", "audio", "ft.", "remix"],
        "Gaming": ["game", "gaming", "playthrough", "gameplay", "speedrun", "minecraft"],
        "Education": ["tutorial", "learn", "how to", "course", "lesson", "explained"],
        "Comedy": ["funny", "comedy", "meme", "prank", "fail", "compilation"],
        "Technology": ["tech", "review", "programming", "code", "software", "hardware"],
        "Sports": ["sport", "football", "basketball", "highlights", "match"],
    }

    detected_category = "Entertainment"
    for cat, keywords in categories.items():
        if any(kw in title or kw in description for kw in keywords):
            detected_category = cat
            break

    # Recommend quality based on content type
    quality_map = {
        "Music": "1080p",       # Music videos benefit from HD
        "Education": "720p",    # Tutorials: HD is fine
        "Gaming": "1080p",      # Gaming needs high resolution
        "Sports": "1080p",      # Sports: high resolution
        "Comedy": "720p",       # Comedy: HD is enough
        "Technology": "720p",   # Tech reviews: HD
    }
    recommended = quality_map.get(detected_category, "720p")

    # For short videos that might be music-only
    if duration and duration < 600:  # Under 10 minutes
        if detected_category == "Music":
            recommended = "320 kbps"  # Suggest MP3 for music

    # Generate basic tags from title words
    stop_words = {"the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by"}
    title_words = [w for w in title.split() if len(w) > 3 and w not in stop_words]
    tags = list(set(title_words[:6]))

    return {
        "summary": f"This video is from the channel '{video_info.get('uploader', 'Unknown')}'. {detected_category} content with {video_info.get('view_count', 0):,} views.",
        "recommended_quality": recommended,
        "tags": tags or [detected_category.lower(), "video", "youtube"],
        "category": detected_category,
        "sentiment": "Positive",
        "key_topics": [detected_category, video_info.get("uploader", "Content"), "YouTube"],
    }
