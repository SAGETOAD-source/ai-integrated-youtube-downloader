"""
==============================================================
YTGrab Pro – FastAPI Backend
==============================================================

File: backend/main.py
Author: YTGrab Pro Team
Description:
    Main FastAPI application entry point.
    Registers all routers, middleware, and startup events.

Architecture:
    main.py          ← You are here (app entry point)
    ├── routers/
    │   ├── info.py       ← GET /api/info (video metadata)
    │   ├── download.py   ← POST /api/download (file download)
    │   └── ai.py         ← POST /api/ai/analyze (AI insights)
    ├── services/
    │   ├── ytdlp.py      ← yt-dlp wrapper service
    │   ├── ffmpeg.py     ← FFmpeg conversion service
    │   └── openai_svc.py ← OpenAI GPT-4o service
    ├── models/
    │   └── schemas.py    ← Pydantic request/response models
    └── utils/
        └── file_cleaner.py ← Auto-delete temp files

How to run:
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000

API Docs (auto-generated):
    http://localhost:8000/docs   (Swagger UI)
    http://localhost:8000/redoc  (ReDoc)
==============================================================
"""

# ── Standard library imports ──────────────────────────────────
import asyncio
import logging
import os
import uuid
from contextlib import asynccontextmanager
from pathlib import Path

# ── Third-party imports ───────────────────────────────────────
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

# ── Local application imports ─────────────────────────────────
from routers import info, download, ai
from utils.file_cleaner import schedule_file_cleanup

# ── Logging configuration ─────────────────────────────────────
# Sets up structured logging to both console and file.
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("ytgrab")

# ── Constants ─────────────────────────────────────────────────
DOWNLOADS_DIR = Path("downloads")          # Temp storage for processed files
DOWNLOADS_DIR.mkdir(exist_ok=True)         # Create directory if it doesn't exist
FILE_TTL_SECONDS = 3600                     # Auto-delete files after 1 hour


def get_allowed_origins() -> list[str]:
    """Read comma-separated frontend origins from the environment."""
    configured_origins = os.getenv("FRONTEND_ORIGINS", "")
    default_origins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ]
    extra_origins = [
        origin.strip()
        for origin in configured_origins.split(",")
        if origin.strip()
    ]
    return [*default_origins, *extra_origins]


# ── Lifespan context manager ──────────────────────────────────
# Runs setup code on startup and cleanup code on shutdown.
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI lifespan event handler.
    On startup: start background file cleanup task.
    On shutdown: cancel the cleanup task gracefully.
    """
    logger.info("🚀 YTGrab Pro API starting up...")

    # Start background task to auto-delete old downloaded files
    cleanup_task = asyncio.create_task(
        schedule_file_cleanup(DOWNLOADS_DIR, FILE_TTL_SECONDS)
    )
    logger.info(f"🧹 File cleanup task started (TTL: {FILE_TTL_SECONDS}s)")

    yield  # ← Application runs here

    # Shutdown: cancel background tasks
    logger.info("🛑 YTGrab Pro API shutting down...")
    cleanup_task.cancel()
    try:
        await cleanup_task
    except asyncio.CancelledError:
        pass  # Expected – task was cancelled
    logger.info("✅ Shutdown complete")


# ── FastAPI application instance ──────────────────────────────
app = FastAPI(
    title="YTGrab Pro API",
    description="""
## YTGrab Pro REST API

Download YouTube videos as MP3 or MP4 with AI-powered quality recommendations.

### Key Endpoints
- **GET /api/info** – Fetch video metadata and available formats
- **POST /api/download** – Download and convert a video
- **POST /api/ai/analyze** – AI analysis via OpenAI GPT-4o
- **GET /api/health** – Health check

### Tech Stack
- **FastAPI** – High-performance async web framework
- **yt-dlp** – YouTube downloading engine
- **FFmpeg** – Media conversion
- **OpenAI GPT-4o** – AI video analysis
    """,
    version="2.0.0",
    docs_url="/docs",       # Swagger UI at /docs
    redoc_url="/redoc",     # ReDoc at /redoc
    lifespan=lifespan,
)


# ── CORS Middleware ───────────────────────────────────────────
# Allows the React frontend (running on port 5173) to call this API.
# In production, replace "*" with your actual frontend domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


# ── Static files ──────────────────────────────────────────────
# Serves downloaded files directly from the /files URL path.
# e.g. http://localhost:8000/files/video.mp4
app.mount("/files", StaticFiles(directory=str(DOWNLOADS_DIR)), name="files")


# ── Routers ───────────────────────────────────────────────────
# Each router handles a specific area of functionality.
# prefix="/api" means all routes start with /api/...

app.include_router(
    info.router,
    prefix="/api",
    tags=["Video Info"],
)
app.include_router(
    download.router,
    prefix="/api",
    tags=["Download"],
)
app.include_router(
    ai.router,
    prefix="/api",
    tags=["AI Analysis"],
)


# ── Global exception handler ──────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Catches any unhandled exceptions and returns a clean JSON error.
    Prevents stack traces from leaking to the client in production.
    """
    logger.error(f"Unhandled exception on {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc) if os.getenv("DEBUG", "false") == "true" else "An error occurred",
            "request_id": str(uuid.uuid4()),
        },
    )


# ── Health check endpoint ─────────────────────────────────────
@app.get("/api/health", tags=["System"])
async def health_check():
    """
    Health check endpoint.
    Returns server status and availability of key dependencies.
    Call this to verify the API is running correctly.
    """
    import shutil
    import yt_dlp

    # Check if FFmpeg is available on the system PATH
    ffmpeg_available = shutil.which("ffmpeg") is not None

    # Check if OpenAI API key is configured
    openai_configured = bool(os.getenv("OPENAI_API_KEY"))

    return {
        "status": "healthy",
        "version": "2.0.0",
        "yt_dlp_version": yt_dlp.version.__version__,
        "ffmpeg_available": ffmpeg_available,
        "openai_configured": openai_configured,
        "downloads_dir": str(DOWNLOADS_DIR.absolute()),
        "uptime_note": "Use /api/health for monitoring",
    }


# ── Root redirect ─────────────────────────────────────────────
@app.get("/", tags=["System"])
async def root():
    """Root endpoint – redirects to API docs."""
    return {
        "message": "Welcome to YTGrab Pro API",
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/api/health",
        "version": "2.0.0",
    }


# ── Development entry point ───────────────────────────────────
# Only runs when executing this file directly: python main.py
# In production, use: uvicorn main:app --host 0.0.0.0 --port 8000
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",      # Listen on all network interfaces
        port=8000,
        reload=True,          # Auto-restart on code changes (dev only)
        log_level="info",
    )
