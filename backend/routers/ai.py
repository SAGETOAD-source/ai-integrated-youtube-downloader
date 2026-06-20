"""
==============================================================
YTGrab Pro – AI Analysis Router
==============================================================

File: backend/routers/ai.py
Description:
    Handles POST /api/ai/analyze endpoint.
    Combines yt-dlp metadata extraction with OpenAI GPT-4o
    analysis to provide intelligent video insights.

Endpoint:
    POST /api/ai/analyze

This is the AI integration that makes YTGrab Pro unique:
- Fetches video metadata with yt-dlp
- Sends metadata to OpenAI GPT-4o
- Returns structured AI insights:
  * Smart summary
  * Recommended download quality
  * Content tags
  * Category detection
  * Sentiment analysis
==============================================================
"""

import logging
from fastapi import APIRouter, HTTPException
from models.schemas import AIAnalysisRequest, AIAnalysisResponse
from services.ytdlp_service import get_video_info
from services.openai_service import analyze_video_with_ai

logger = logging.getLogger("ytgrab.ai")

router = APIRouter()


@router.post(
    "/ai/analyze",
    response_model=AIAnalysisResponse,
    summary="AI Video Analysis",
    description="""
Analyze a YouTube video using OpenAI GPT-4o.

This endpoint:
1. Fetches video metadata using yt-dlp (title, description, stats)
2. Sends the metadata to GPT-4o with a structured prompt
3. Returns AI-generated insights

**Requires OPENAI_API_KEY environment variable.**
If not set, returns rule-based fallback analysis.

Use cases:
- Smart quality recommendation (e.g., "This podcast would be best as MP3 at 192kbps")
- Content categorization for organization
- Quick summary to verify you're downloading the right video
    """,
)
async def analyze(request: AIAnalysisRequest):
    """
    AI-powered video analysis endpoint.

    Workflow:
    1. Validate the YouTube URL
    2. Fetch video metadata (yt-dlp)
    3. Send to OpenAI for analysis (GPT-4o)
    4. Return structured insights

    Falls back to rule-based analysis if OpenAI is unavailable.
    """
    logger.info(f"AI analysis request for: {request.url}")

    # Validate URL
    if not request.url or ("youtube.com" not in request.url and "youtu.be" not in request.url):
        raise HTTPException(
            status_code=400,
            detail="Invalid YouTube URL. Must be a youtube.com or youtu.be URL.",
        )

    try:
        # Step 1: Fetch video metadata with yt-dlp
        # This gives us title, description, uploader, view_count, etc.
        logger.info("Step 1: Fetching video metadata...")
        video_info = await get_video_info(request.url)

        # Step 2: Analyze with OpenAI GPT-4o
        # The openai_service handles the API call and JSON parsing
        logger.info("Step 2: Running AI analysis with GPT-4o...")
        analysis = await analyze_video_with_ai(video_info)

        # Step 3: Build and validate the response
        # Pydantic will validate the structure automatically
        logger.info(f"AI analysis complete: category={analysis.get('category')}")

        return AIAnalysisResponse(
            summary=analysis.get("summary", "No summary available"),
            recommended_quality=analysis.get("recommended_quality", "720p"),
            tags=analysis.get("tags", []),
            category=analysis.get("category", "Entertainment"),
            sentiment=analysis.get("sentiment", "Neutral"),
            key_topics=analysis.get("key_topics"),
        )

    except ValueError as e:
        logger.warning(f"Video not accessible: {e}")
        raise HTTPException(status_code=404, detail=str(e))

    except Exception as e:
        logger.error(f"AI analysis failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {str(e)}",
        )
