"""
==============================================================
YTGrab Pro – Download Router
==============================================================

File: backend/routers/download.py
Description:
    Handles POST /api/download endpoint.
    Downloads and converts YouTube videos using yt-dlp + FFmpeg.
    Returns a temporary download URL.

Endpoint:
    POST /api/download

Request Body:
    {
        "url": "https://youtube.com/watch?v=...",
        "format_id": "137",
        "media_type": "mp4",
        "quality": "1080p"
    }

Response:
    {
        "download_url": "/files/abc123.mp4",
        "filename": "video-title.mp4",
        "filesize": 45000000,
        "media_type": "mp4",
        "job_id": "abc123"
    }
==============================================================
"""

import logging
import re
import uuid

from fastapi import APIRouter, HTTPException, BackgroundTasks
from models.schemas import DownloadRequest, DownloadResponse
from services.ytdlp_service import download_video, get_video_info

logger = logging.getLogger("ytgrab.download")

router = APIRouter()


def sanitize_for_filename(text: str) -> str:
    """Remove filesystem-unsafe characters from a string."""
    return re.sub(r"[^\w\s\-]", "", text).strip().replace(" ", "-")[:60]


@router.post(
    "/download",
    response_model=DownloadResponse,
    summary="Download Video",
    description="""
Download a YouTube video or audio file.

For **MP4**: Downloads the video at the specified resolution, merges with
best available audio using FFmpeg.

For **MP3**: Downloads best quality audio, converts to MP3 at the specified
bitrate using FFmpeg.

The returned `download_url` is valid for 1 hour. After that the file
is automatically deleted from the server.
    """,
)
async def download(
    request: DownloadRequest,
    background_tasks: BackgroundTasks,
):
    """
    Process a download request.

    Steps:
    1. Validate the request parameters
    2. Generate a unique job ID for this download
    3. Call yt-dlp service to download/convert the file
    4. Return the temporary download URL
    5. Schedule background logging (could be extended for analytics)
    """
    logger.info(
        f"Download request: url={request.url} | format={request.format_id} | type={request.media_type}"
    )

    # Validate URL
    if not request.url or ("youtube.com" not in request.url and "youtu.be" not in request.url):
        raise HTTPException(
            status_code=400,
            detail="Invalid YouTube URL provided",
        )

    # Generate unique job ID – used as filename to avoid collisions
    # UUID4 is random, so no two downloads get the same filename
    job_id = str(uuid.uuid4()).replace("-", "")[:16]

    try:
        # Fetch video title for filename generation
        # We do a quick info fetch to get the title
        try:
            info = await get_video_info(request.url)
            title = sanitize_for_filename(info.get("title", "video"))
        except Exception:
            title = "ytgrab-download"  # Fallback filename

        # Download and convert the file
        # This is the main operation – may take 30-120 seconds
        result = await download_video(
            url=request.url,
            format_id=request.format_id,
            media_type=request.media_type,
            job_id=job_id,
        )

        # Build the filename for download
        ext = request.media_type
        filename = f"{title}-{job_id[:6]}.{ext}"

        # The download URL points to the static file server
        # The file is served by: app.mount("/files", StaticFiles(...))
        download_url = f"/files/{result['filename']}"

        logger.info(f"Download complete: {filename} ({result['filesize']} bytes)")

        # Add background task for logging/analytics
        # In production this could write to a database
        background_tasks.add_task(
            log_download,
            url=request.url,
            media_type=request.media_type,
            quality=request.quality,
            filesize=result["filesize"],
        )

        return DownloadResponse(
            download_url=download_url,
            filename=filename,
            filesize=result["filesize"],
            media_type=request.media_type,
            job_id=job_id,
        )

    except FileNotFoundError as e:
        logger.error(f"File not found after download: {e}")
        raise HTTPException(status_code=500, detail="Download processing failed")

    except Exception as e:
        logger.error(f"Download failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Download failed: {str(e)}. Make sure yt-dlp and FFmpeg are installed.",
        )


async def log_download(url: str, media_type: str, quality: str | None, filesize: int):
    """
    Background task to log download analytics.
    In production, this would write to a database (PostgreSQL, MongoDB, etc.)
    """
    logger.info(
        f"[ANALYTICS] Download logged: type={media_type} quality={quality} size={filesize}b"
    )
