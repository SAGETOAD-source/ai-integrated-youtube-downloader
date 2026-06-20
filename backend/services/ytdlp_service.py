"""
==============================================================
YTGrab Pro – yt-dlp Service
==============================================================

File: backend/services/ytdlp_service.py
Description:
    Wrapper around the yt-dlp library.
    Handles video info extraction and file downloading.

    yt-dlp is a feature-rich command-line audio/video downloader.
    It's a fork of youtube-dl with additional features and fixes.

Key functions:
    get_video_info()  – Extract metadata without downloading
    download_video()  – Download and convert the video/audio
==============================================================
"""

import asyncio
import logging
import os
import re
import uuid
from pathlib import Path
from typing import Any, Dict, List

import yt_dlp

logger = logging.getLogger("ytgrab.ytdlp")

# Directory where downloaded files are saved
DOWNLOADS_DIR = Path("downloads")


def sanitize_filename(title: str) -> str:
    """
    Remove characters that are unsafe for filenames.
    Keeps letters, numbers, spaces, hyphens, and underscores.

    Example:
        "Rick Astley: Never Gonna Give You Up! (Official)" 
        → "Rick Astley Never Gonna Give You Up Official"
    """
    # Remove characters that aren't alphanumeric, spaces, or hyphens
    sanitized = re.sub(r"[^\w\s\-]", "", title)
    # Replace multiple spaces with a single space
    sanitized = re.sub(r"\s+", " ", sanitized).strip()
    # Limit filename length to 100 characters
    return sanitized[:100]


def format_quality_label(fmt: Dict[str, Any]) -> str:
    """
    Convert yt-dlp format dict to a human-readable quality label.

    For video formats: returns '1080p', '720p', etc.
    For audio formats: returns '320 kbps', '128 kbps', etc.
    """
    # Video formats have height property
    if fmt.get("height"):
        return f"{fmt['height']}p"
    # Audio formats use audio bitrate
    if fmt.get("abr"):
        return f"{int(fmt['abr'])} kbps"
    # Fallback to format note
    return fmt.get("format_note", "Unknown")


def extract_video_formats(formats: List[Dict]) -> tuple[List[Dict], List[Dict]]:
    """
    Filter and categorize yt-dlp format list into video and audio.

    yt-dlp returns many formats; we filter for:
    - Video formats: have video codec and height (resolution)
    - Audio formats: audio-only, converted to MP3 options

    Returns:
        (video_formats, audio_formats) – lists of cleaned format dicts
    """
    video_formats = []
    seen_heights = set()

    for fmt in formats:
        # Skip formats without video codec or height
        if not fmt.get("height") or fmt.get("vcodec") == "none":
            continue
        # Skip duplicate heights (keep best one)
        height = fmt["height"]
        if height in seen_heights:
            continue
        seen_heights.add(height)

        quality_notes = {
            1080: "Full HD",
            720:  "HD",
            480:  "SD",
            360:  "Low",
            240:  "Very Low",
            144:  "Minimum",
        }

        video_formats.append({
            "format_id": fmt["format_id"],
            "ext": "mp4",
            "quality": f"{height}p",
            "filesize": fmt.get("filesize") or fmt.get("filesize_approx"),
            "vcodec": fmt.get("vcodec", "avc1"),
            "acodec": fmt.get("acodec"),
            "format_note": quality_notes.get(height, fmt.get("format_note", "")),
        })

    # Sort video formats by quality (highest first)
    video_formats.sort(key=lambda f: int(f["quality"].replace("p", "")), reverse=True)

    # Create fixed set of MP3 quality options
    # We use yt-dlp's 'bestaudio' and post-process to specific bitrates
    audio_formats = [
        {
            "format_id": "bestaudio-mp3-320",
            "ext": "mp3",
            "quality": "320 kbps",
            "filesize": None,  # Calculated after conversion
            "acodec": "mp3",
            "format_note": "High Quality",
        },
        {
            "format_id": "bestaudio-mp3-256",
            "ext": "mp3",
            "quality": "256 kbps",
            "filesize": None,
            "acodec": "mp3",
            "format_note": "Standard",
        },
        {
            "format_id": "bestaudio-mp3-192",
            "ext": "mp3",
            "quality": "192 kbps",
            "filesize": None,
            "acodec": "mp3",
            "format_note": "Medium",
        },
        {
            "format_id": "bestaudio-mp3-128",
            "ext": "mp3",
            "quality": "128 kbps",
            "filesize": None,
            "acodec": "mp3",
            "format_note": "Compact",
        },
    ]

    return video_formats, audio_formats


async def get_video_info(url: str) -> Dict[str, Any]:
    """
    Extract video metadata from YouTube without downloading.

    Uses yt_dlp.YoutubeDL with download=False to only fetch info.
    Runs in a thread executor to avoid blocking the async event loop.

    Args:
        url: YouTube video URL

    Returns:
        Dictionary with video metadata (title, formats, thumbnail, etc.)

    Raises:
        ValueError: If the URL is invalid or video is unavailable
        Exception: For network errors or yt-dlp errors
    """
    logger.info(f"Fetching video info for: {url}")

    # yt-dlp options for info extraction only
    ydl_opts = {
        "quiet": True,              # Suppress stdout output
        "no_warnings": True,        # Suppress warning messages
        "extract_flat": False,      # Extract full info (not just playlist)
        "youtube_include_dash_manifest": False,  # Skip DASH manifests (faster)
    }

    def _extract():
        """
        Synchronous inner function that calls yt-dlp.
        This runs in a thread pool via asyncio.to_thread().
        """
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            try:
                # extract_info with download=False fetches metadata only
                info = ydl.extract_info(url, download=False)
                return info
            except yt_dlp.utils.DownloadError as e:
                raise ValueError(f"Could not fetch video: {e}")

    # Run the synchronous yt-dlp call in a thread pool
    # This prevents blocking the FastAPI async event loop
    info = await asyncio.to_thread(_extract)

    if not info:
        raise ValueError("No video information found")

    # Extract and categorize formats
    raw_formats = info.get("formats", [])
    video_formats, audio_formats = extract_video_formats(raw_formats)

    # Format the upload date (yt-dlp returns YYYYMMDD)
    raw_date = info.get("upload_date", "")
    if raw_date and len(raw_date) == 8:
        upload_date = f"{raw_date[:4]}-{raw_date[4:6]}-{raw_date[6:]}"
    else:
        upload_date = raw_date or "Unknown"

    # Build and return the clean response dict
    return {
        "title": info.get("title", "Unknown Title"),
        "thumbnail": info.get("thumbnail", ""),
        "duration": info.get("duration", 0),
        "uploader": info.get("uploader", "Unknown"),
        "view_count": info.get("view_count", 0),
        "upload_date": upload_date,
        "description": (info.get("description") or "")[:500],  # Truncate long descriptions
        "formats": video_formats,
        "audio_formats": audio_formats,
    }


async def download_video(
    url: str,
    format_id: str,
    media_type: str,
    job_id: str,
) -> Dict[str, Any]:
    """
    Download a YouTube video in the specified format.

    For MP4: Downloads video+audio streams, merges with FFmpeg.
    For MP3: Downloads best audio, converts to MP3 with FFmpeg.

    Args:
        url:        YouTube video URL
        format_id:  yt-dlp format ID (from get_video_info)
        media_type: 'mp3' or 'mp4'
        job_id:     Unique job identifier for the output filename

    Returns:
        Dict with 'filepath', 'filename', 'filesize'

    Raises:
        Exception: If download or conversion fails
    """
    logger.info(f"Starting download: {url} | format={format_id} | type={media_type}")

    # Build output path: downloads/<job_id>.<ext>
    output_path = DOWNLOADS_DIR / f"{job_id}.%(ext)s"

    if media_type == "mp3":
        # ── MP3 Download Configuration ────────────────────────
        # Extract the bitrate from format_id (e.g. "bestaudio-mp3-320" → "320")
        bitrate = "192"  # default
        if "-" in format_id:
            parts = format_id.split("-")
            if len(parts) >= 3 and parts[-1].isdigit():
                bitrate = parts[-1]

        ydl_opts = {
            "format": "bestaudio/best",     # Download best available audio
            "outtmpl": str(output_path),    # Output file path template
            "quiet": True,
            "no_warnings": True,
            # Post-processor: convert audio to MP3 using FFmpeg
            "postprocessors": [
                {
                    "key": "FFmpegExtractAudio",   # Use FFmpeg for extraction
                    "preferredcodec": "mp3",        # Output codec: MP3
                    "preferredquality": bitrate,    # Bitrate: 128/192/256/320
                }
            ],
        }
    else:
        # ── MP4 Download Configuration ────────────────────────
        ydl_opts = {
            # Download best video at specified height + best audio, merge to MP4
            # format string tells yt-dlp: "take this video format + best audio"
            "format": f"{format_id}+bestaudio/best[ext=mp4]/best",
            "outtmpl": str(output_path),
            "quiet": True,
            "no_warnings": True,
            # Merge video+audio streams using FFmpeg
            "postprocessors": [
                {
                    "key": "FFmpegVideoConvertor",  # Convert/merge with FFmpeg
                    "preferedformat": "mp4",         # Ensure MP4 output
                }
            ],
            "merge_output_format": "mp4",  # Force MP4 container
        }

    def _download():
        """Synchronous download function (runs in thread pool)."""
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # download=True actually downloads the file
            ydl.download([url])

    # Run download in thread pool (yt-dlp is synchronous)
    await asyncio.to_thread(_download)

    # Find the downloaded file
    # yt-dlp uses %(ext)s in the template, so we search for the job_id
    downloaded_file = None
    for f in DOWNLOADS_DIR.iterdir():
        if f.stem == job_id:
            downloaded_file = f
            break

    if not downloaded_file or not downloaded_file.exists():
        raise FileNotFoundError(f"Download completed but file not found for job {job_id}")

    filesize = downloaded_file.stat().st_size
    logger.info(f"Download complete: {downloaded_file.name} ({filesize} bytes)")

    return {
        "filepath": str(downloaded_file),
        "filename": downloaded_file.name,
        "filesize": filesize,
    }
