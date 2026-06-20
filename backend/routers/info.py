"""
==============================================================
YTGrab Pro – Info Router
==============================================================

File: backend/routers/info.py
Description:
    Handles GET /api/info endpoint.
    Fetches video metadata from YouTube using yt-dlp
    without downloading any files.

Endpoint:
    GET /api/info?url=<youtube_url>

Example:
    GET /api/info?url=https://youtube.com/watch?v=dQw4w9WgXcQ

Response:
    VideoInfoResponse JSON object
==============================================================
"""

import logging
from fastapi import APIRouter, HTTPException, Query
from models.schemas import VideoInfoResponse
from services.ytdlp_service import get_video_info

logger = logging.getLogger("ytgrab.info")

# Create router – all routes defined here get /api prefix from main.py
router = APIRouter()


@router.get(
    "/info",
    response_model=VideoInfoResponse,
    summary="Get Video Information",
    description="""
Fetches complete metadata for a YouTube video without downloading it.

Returns:
- Video title, thumbnail, duration
- Uploader name and statistics
- All available video formats (MP4 at various resolutions)
- All available audio formats (MP3 at various bitrates)

This endpoint is called first to let the user choose their download format.
    """,
)
async def get_info(
    url: str = Query(
        ...,
        description="YouTube video URL (e.g. https://youtube.com/watch?v=dQw4w9WgXcQ)",
        example="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    )
):
    """
    Fetch video information from YouTube.

    This endpoint:
    1. Validates the URL format
    2. Calls yt-dlp to extract metadata (no download)
    3. Processes and categorizes available formats
    4. Returns structured video info

    The response includes both video formats (for MP4 download)
    and audio formats (for MP3 download).
    """
    logger.info(f"Info request for URL: {url}")

    # Basic URL validation before calling yt-dlp
    if not url:
        raise HTTPException(status_code=400, detail="URL parameter is required")

    if "youtube.com" not in url and "youtu.be" not in url:
        raise HTTPException(
            status_code=400,
            detail="Invalid URL. Only YouTube URLs are supported (youtube.com or youtu.be)",
        )

    try:
        # Call the yt-dlp service to get video info
        # This is an async call that runs yt-dlp in a thread pool
        info = await get_video_info(url)
        logger.info(f"Successfully fetched info for: {info.get('title', 'Unknown')}")
        return info

    except ValueError as e:
        # ValueError indicates invalid URL or unavailable video
        logger.warning(f"Video not available: {e}")
        raise HTTPException(status_code=404, detail=str(e))

    except Exception as e:
        # Unexpected error – log full traceback for debugging
        logger.error(f"Failed to fetch video info: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch video information: {str(e)}",
        )
