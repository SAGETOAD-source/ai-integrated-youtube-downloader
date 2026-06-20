"""
==============================================================
YTGrab Pro – Pydantic Schemas (Data Models)
==============================================================

File: backend/models/schemas.py
Description:
    All request and response data models using Pydantic v2.
    Pydantic validates incoming JSON and serializes outgoing data.
    FastAPI uses these for automatic OpenAPI documentation.

Why Pydantic?
    - Automatic data validation (wrong types raise HTTP 422)
    - Auto-generates JSON Schema for /docs endpoint
    - Serialization/deserialization of complex types
    - Clear, self-documenting code with type hints
==============================================================
"""

from typing import List, Optional
from pydantic import BaseModel, HttpUrl, validator, Field


# ── Video Format Model ────────────────────────────────────────
class VideoFormat(BaseModel):
    """
    Represents a single downloadable format for a video.
    Returned as part of VideoInfoResponse.
    """
    format_id: str = Field(..., description="yt-dlp internal format identifier")
    ext: str = Field(..., description="File extension: 'mp4', 'webm', 'mp3', 'm4a'")
    quality: str = Field(..., description="Human-readable quality label: '1080p', '720p', '320 kbps'")
    filesize: Optional[int] = Field(None, description="Estimated file size in bytes")
    vcodec: Optional[str] = Field(None, description="Video codec: 'avc1', 'vp9', etc.")
    acodec: Optional[str] = Field(None, description="Audio codec: 'mp4a', 'opus', 'mp3'")
    format_note: Optional[str] = Field(None, description="Human-readable note: 'Full HD', 'SD', etc.")

    class Config:
        # Allow extra fields from yt-dlp without breaking
        extra = "ignore"


# ── Video Info Response ───────────────────────────────────────
class VideoInfoResponse(BaseModel):
    """
    Complete video metadata returned by GET /api/info.
    Contains all the information needed to display the video
    and let the user choose a download format.
    """
    title: str = Field(..., description="Full video title")
    thumbnail: str = Field(..., description="URL to video thumbnail image")
    duration: int = Field(..., description="Video duration in seconds")
    uploader: str = Field(..., description="YouTube channel/uploader name")
    view_count: int = Field(..., description="Total view count")
    upload_date: str = Field(..., description="Upload date as YYYY-MM-DD string")
    description: str = Field("", description="Video description (may be truncated)")
    formats: List[VideoFormat] = Field(..., description="Available MP4 video formats")
    audio_formats: List[VideoFormat] = Field(..., description="Available MP3 audio formats")


# ── Download Request ──────────────────────────────────────────
class DownloadRequest(BaseModel):
    """
    Payload sent by the frontend to POST /api/download.
    Specifies which video to download and in what format/quality.
    """
    url: str = Field(..., description="YouTube video URL")
    format_id: str = Field(..., description="Format ID from VideoFormat.format_id")
    media_type: str = Field(..., description="'mp3' for audio only, 'mp4' for video")
    quality: Optional[str] = Field(None, description="Quality label for display purposes")

    @validator("media_type")
    def validate_media_type(cls, v):
        """Ensures only 'mp3' or 'mp4' are accepted."""
        if v not in ("mp3", "mp4"):
            raise ValueError("media_type must be 'mp3' or 'mp4'")
        return v

    @validator("url")
    def validate_youtube_url(cls, v):
        """Basic YouTube URL validation."""
        if "youtube.com" not in v and "youtu.be" not in v:
            raise ValueError("URL must be a valid YouTube URL")
        return v


# ── Download Response ─────────────────────────────────────────
class DownloadResponse(BaseModel):
    """
    Returned by POST /api/download after successful processing.
    The download_url is a temporary URL valid for FILE_TTL_SECONDS.
    """
    download_url: str = Field(..., description="Relative URL to download the file")
    filename: str = Field(..., description="Suggested filename for the download")
    filesize: int = Field(..., description="Actual file size in bytes")
    media_type: str = Field(..., description="'mp3' or 'mp4'")
    job_id: str = Field(..., description="Unique job identifier for tracking")


# ── AI Analysis Request ───────────────────────────────────────
class AIAnalysisRequest(BaseModel):
    """
    Payload sent to POST /api/ai/analyze.
    The backend fetches video metadata and passes it to GPT-4o.
    """
    url: str = Field(..., description="YouTube video URL to analyze")
    include_transcript: bool = Field(
        False,
        description="If True, fetch and include video transcript in analysis"
    )


# ── AI Analysis Response ──────────────────────────────────────
class AIAnalysisResponse(BaseModel):
    """
    AI-generated insights returned by POST /api/ai/analyze.
    Generated by OpenAI GPT-4o based on video title, description,
    and optionally the video transcript.
    """
    summary: str = Field(..., description="2-3 sentence AI-generated summary")
    recommended_quality: str = Field(..., description="Suggested download quality (e.g. '720p', '320 kbps')")
    tags: List[str] = Field(..., description="AI-generated content tags")
    category: str = Field(..., description="Content category: Music, Education, Gaming, etc.")
    sentiment: str = Field(..., description="Overall sentiment: Positive, Neutral, Negative, etc.")
    key_topics: Optional[List[str]] = Field(None, description="Main topics covered in the video")


# ── Error Response ────────────────────────────────────────────
class ErrorResponse(BaseModel):
    """Standard error response structure."""
    error: str = Field(..., description="Short error type")
    detail: str = Field(..., description="Detailed error message")
    request_id: Optional[str] = Field(None, description="Request ID for debugging")
