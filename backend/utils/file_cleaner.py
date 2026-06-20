"""
==============================================================
YTGrab Pro – File Cleanup Utility
==============================================================

File: backend/utils/file_cleaner.py
Description:
    Background async task that automatically deletes old
    downloaded files from the downloads/ directory.

    Files older than FILE_TTL_SECONDS are deleted to prevent
    disk space exhaustion on the server.

Why this is important:
    Each download creates a file that can be 10MB–1GB+.
    Without cleanup, the disk would fill up quickly.
    The TTL approach ensures files are available long enough
    to download, but don't accumulate indefinitely.

How it works:
    1. Runs as a background asyncio task (started in main.py)
    2. Scans the downloads/ directory every 5 minutes
    3. Deletes files older than FILE_TTL_SECONDS (default: 1 hour)
    4. Logs each deletion for monitoring
==============================================================
"""

import asyncio
import logging
import time
from pathlib import Path

logger = logging.getLogger("ytgrab.cleaner")


async def schedule_file_cleanup(downloads_dir: Path, ttl_seconds: int = 3600):
    """
    Infinite loop background task for file cleanup.

    Runs every 5 minutes, deletes files older than ttl_seconds.
    Designed to run as an asyncio task:

        task = asyncio.create_task(
            schedule_file_cleanup(Path("downloads"), 3600)
        )

    Args:
        downloads_dir: Path to the downloads directory
        ttl_seconds:   How old files must be before deletion (default: 1 hour)
    """
    CHECK_INTERVAL = 300  # Check every 5 minutes (300 seconds)

    logger.info(
        f"File cleaner started | dir={downloads_dir} | TTL={ttl_seconds}s | "
        f"check_interval={CHECK_INTERVAL}s"
    )

    while True:
        try:
            # Wait before first check (don't delete files immediately on startup)
            await asyncio.sleep(CHECK_INTERVAL)

            # Run the cleanup
            deleted_count = await cleanup_old_files(downloads_dir, ttl_seconds)

            if deleted_count > 0:
                logger.info(f"🗑️  Cleaned up {deleted_count} expired file(s)")

        except asyncio.CancelledError:
            # Task was cancelled (server shutting down) – exit cleanly
            logger.info("File cleaner task cancelled – shutting down")
            break

        except Exception as e:
            # Don't crash the cleanup loop on errors
            # Log and continue to next cycle
            logger.error(f"File cleanup error: {e}", exc_info=True)


async def cleanup_old_files(downloads_dir: Path, ttl_seconds: int) -> int:
    """
    Delete files older than ttl_seconds from downloads_dir.

    This is an async function but file operations are synchronous.
    For a high-traffic server, consider using aiofiles for true async I/O.

    Args:
        downloads_dir: Directory to scan
        ttl_seconds:   Maximum file age in seconds

    Returns:
        Number of files deleted
    """
    if not downloads_dir.exists():
        return 0

    deleted_count = 0
    current_time = time.time()

    for file_path in downloads_dir.iterdir():
        # Skip directories – only delete files
        if not file_path.is_file():
            continue

        try:
            # Get file modification time
            # mtime = time when file was last modified (creation time approximation)
            file_mtime = file_path.stat().st_mtime
            file_age_seconds = current_time - file_mtime

            if file_age_seconds > ttl_seconds:
                file_path.unlink()  # Delete the file
                deleted_count += 1
                logger.debug(
                    f"Deleted expired file: {file_path.name} "
                    f"(age: {file_age_seconds:.0f}s)"
                )

        except PermissionError:
            logger.warning(f"Permission denied when deleting {file_path.name}")
        except FileNotFoundError:
            # File was already deleted (race condition) – ignore
            pass
        except Exception as e:
            logger.error(f"Error deleting {file_path.name}: {e}")

    return deleted_count


async def cleanup_specific_file(file_path: Path, delay_seconds: int = 3600):
    """
    Delete a specific file after a delay.
    Used after serving a download to clean it up after TTL.

    Args:
        file_path:     Path to the file to delete
        delay_seconds: How long to wait before deleting (default: 1 hour)

    Usage:
        # In a route handler:
        background_tasks.add_task(cleanup_specific_file, file_path, 3600)
    """
    await asyncio.sleep(delay_seconds)

    if file_path.exists():
        try:
            file_path.unlink()
            logger.info(f"Deleted file after TTL: {file_path.name}")
        except Exception as e:
            logger.error(f"Failed to delete {file_path.name}: {e}")
