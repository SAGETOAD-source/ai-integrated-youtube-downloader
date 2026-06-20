# YTGrab Pro – Complete Technical Manual

> **Version:** 2.0.0  
> **Stack:** FastAPI + React + yt-dlp + FFmpeg + OpenAI GPT-4o  
> **Author:** YTGrab Pro Team

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Frontend (React + TypeScript)](#3-frontend-react--typescript)
4. [Backend (FastAPI + Python)](#4-backend-fastapi--python)
5. [yt-dlp Integration](#5-yt-dlp-integration)
6. [AI Integration (OpenAI GPT-4o)](#6-ai-integration-openai-gpt-4o)
7. [Security & Best Practices](#7-security--best-practices)
8. [Deployment Guide](#8-deployment-guide)
9. [API Reference](#9-api-reference)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Project Overview

YTGrab Pro is a full-stack web application for downloading YouTube videos as MP3 (audio only) or MP4 (video) files at any available quality. It features AI-powered video analysis via OpenAI GPT-4o.

### Key Features
- Download YouTube videos as MP3 (128–320 kbps) or MP4 (144p–1080p)
- AI analysis: smart quality recommendations, content tags, sentiment
- Real-time download progress tracking
- Auto-delete downloaded files after 1 hour
- Full REST API with Swagger documentation
- Responsive UI that works on all devices

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 19 + TypeScript | User Interface |
| Styling | Tailwind CSS v4 | Component styling |
| Animations | Framer Motion | UI animations |
| Build Tool | Vite 7 | Fast build & dev server |
| Backend | FastAPI | REST API server |
| Runtime | Python 3.11+ | Backend language |
| ASGI Server | Uvicorn | Production server |
| Downloader | yt-dlp | YouTube media extraction |
| Converter | FFmpeg | Audio/video conversion |
| AI Engine | OpenAI GPT-4o | Intelligent video analysis |
| Validation | Pydantic v2 | Data models & validation |

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                          │
│  React App (localhost:5173)                              │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ HeroSection │  │FormatSelector│  │ AIInsightsPanel│  │
│  │ (URL input) │  │(quality pick)│  │(GPT-4o results)│  │
│  └──────┬──────┘  └──────┬───────┘  └───────┬────────┘  │
│         │                │                   │           │
└─────────┼────────────────┼───────────────────┼───────────┘
          │ HTTP Requests  │                   │
          ▼                ▼                   ▼
┌─────────────────────────────────────────────────────────┐
│              FastAPI Backend (localhost:8000)             │
│                                                          │
│  GET /api/info      POST /api/download  POST /api/ai/analyze │
│       │                    │                  │           │
│       ▼                    ▼                  ▼           │
│  [ytdlp_service]    [ytdlp_service]    [openai_service]  │
│  extract_info()     download_video()   analyze_video()   │
│       │                    │                  │           │
│       ▼                    ▼                  ▼           │
│    yt-dlp              yt-dlp +           OpenAI API     │
│  (metadata)          FFmpeg merge          GPT-4o         │
│                            │                              │
│                     downloads/folder                      │
│                            │                              │
│                     /files/static serve                   │
└─────────────────────────────────────────────────────────┘
```

### Request Flow (MP4 Download)

1. User pastes YouTube URL → React validates format
2. Frontend calls `GET /api/info?url=...`
3. FastAPI calls yt-dlp `extract_info()` in thread pool
4. Returns video metadata + available formats
5. User selects 720p MP4
6. Frontend calls `POST /api/download` with format_id
7. FastAPI calls yt-dlp to download video stream (137) + audio (bestaudio)
8. FFmpeg merges video+audio into MP4
9. Returns `/files/<job_id>.mp4` URL
10. Browser downloads the file

---

## 3. Frontend (React + TypeScript)

### File Structure

```
src/
├── App.tsx                   # Root component, coordinates all state
├── types/
│   └── index.ts              # All TypeScript interfaces
├── hooks/
│   └── useDownloader.ts      # Custom hook: all download logic + API calls
└── components/
    ├── Navbar.tsx             # Fixed top navigation
    ├── HeroSection.tsx        # Landing page with URL input
    ├── VideoInfoCard.tsx      # Displays video thumbnail, title, stats
    ├── FormatSelector.tsx     # MP3/MP4 toggle + quality grid
    ├── AIInsightsPanel.tsx    # Shows GPT-4o analysis
    ├── DownloadPanel.tsx      # Progress bar + download button
    ├── DownloadSection.tsx    # Container (orchestrates above 3)
    ├── FeaturesSection.tsx    # Marketing: feature grid
    ├── HowItWorksSection.tsx  # Step-by-step guide
    ├── APIDocsSection.tsx     # Interactive API documentation
    ├── ManualPage.tsx         # Full technical manual overlay
    └── Footer.tsx             # Site footer
```

### Key: useDownloader Hook

```typescript
// src/hooks/useDownloader.ts

export function useDownloader() {
  // STATE
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<DownloadStatus>("idle");
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<VideoFormat | null>(null);
  const [mediaType, setMediaType] = useState<"mp3" | "mp4">("mp4");
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // ACTIONS
  const fetchVideoInfo = useCallback(async (videoUrl: string) => {
    // Validate → set loading → call API → update state
  }, []);

  const startDownload = useCallback(async () => {
    // Set downloading → call API → update progress → set complete
  }, [videoInfo, selectedFormat, mediaType]);

  return { /* all state + actions */ };
}
```

### TypeScript Interfaces

```typescript
// src/types/index.ts

interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: number;       // seconds
  uploader: string;
  view_count: number;
  upload_date: string;
  formats: VideoFormat[]; // MP4 options
  audio_formats: VideoFormat[]; // MP3 options
}

interface VideoFormat {
  format_id: string;  // yt-dlp internal ID
  ext: string;        // "mp4" or "mp3"
  quality: string;    // "1080p" or "320 kbps"
  filesize?: number;  // bytes
}
```

---

## 4. Backend (FastAPI + Python)

### File Structure

```
backend/
├── main.py                   # FastAPI app, middleware, routers
├── requirements.txt          # Python dependencies
├── .env.example              # Environment variables template
├── models/
│   └── schemas.py            # Pydantic request/response models
├── routers/
│   ├── info.py               # GET /api/info
│   ├── download.py           # POST /api/download
│   └── ai.py                 # POST /api/ai/analyze
├── services/
│   ├── ytdlp_service.py      # yt-dlp wrapper
│   └── openai_service.py     # OpenAI GPT-4o wrapper
└── utils/
    └── file_cleaner.py       # Background cleanup task
```

### main.py Explained

```python
# Lifespan: runs setup on startup, cleanup on shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: start background file cleanup
    cleanup_task = asyncio.create_task(
        schedule_file_cleanup(DOWNLOADS_DIR, FILE_TTL_SECONDS)
    )
    yield  # App runs here
    # Shutdown: cancel cleanup task
    cleanup_task.cancel()

app = FastAPI(lifespan=lifespan)

# CORS: allow React frontend to call this API
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"])

# Static files: serve downloaded files at /files/
app.mount("/files", StaticFiles(directory="downloads"))

# Register routers (URL groups)
app.include_router(info.router,     prefix="/api")  # /api/info
app.include_router(download.router, prefix="/api")  # /api/download
app.include_router(ai.router,       prefix="/api")  # /api/ai/analyze
```

### Pydantic Models

```python
# backend/models/schemas.py

class DownloadRequest(BaseModel):
    url: str           # YouTube URL (required)
    format_id: str     # yt-dlp format ID (required)
    media_type: str    # "mp3" or "mp4" (validated)
    quality: str | None = None  # Optional display label

    @validator("media_type")
    def validate_media_type(cls, v):
        if v not in ("mp3", "mp4"):
            raise ValueError("Must be mp3 or mp4")
        return v

# FastAPI automatically:
# - Validates request body against this model
# - Returns HTTP 422 if validation fails
# - Shows model in /docs Swagger UI
```

---

## 5. yt-dlp Integration

### Installation

```bash
pip install yt-dlp
```

### Basic Usage

```python
import yt_dlp

# Extract info without downloading
with yt_dlp.YoutubeDL({"quiet": True}) as ydl:
    info = ydl.extract_info(url, download=False)
    # info["title"]   → video title
    # info["formats"] → list of all available formats
    # info["thumbnail"] → thumbnail URL
```

### MP3 Download Configuration

```python
ydl_opts = {
    "format": "bestaudio/best",    # Download best audio
    "postprocessors": [{
        "key": "FFmpegExtractAudio",
        "preferredcodec": "mp3",
        "preferredquality": "320",  # kbps: 128/192/256/320
    }],
    "outtmpl": "downloads/%(title)s.%(ext)s",
}
```

### MP4 Download Configuration

```python
ydl_opts = {
    # format string: video_stream + best_audio
    "format": "137+bestaudio/best",  # 137 = 1080p video-only
    "merge_output_format": "mp4",
    "postprocessors": [{
        "key": "FFmpegVideoConvertor",
        "preferedformat": "mp4",
    }],
}
# YouTube stores video and audio separately!
# FFmpeg merges them into the final MP4 file.
```

### Why asyncio.to_thread()

```python
# yt-dlp is synchronous (blocking)
# FastAPI is async (non-blocking)
# Solution: run yt-dlp in a thread pool

async def get_video_info(url: str):
    def _extract():  # synchronous
        with yt_dlp.YoutubeDL(opts) as ydl:
            return ydl.extract_info(url, download=False)
    
    # asyncio.to_thread runs _extract() in ThreadPoolExecutor
    # This doesn't block the async event loop
    return await asyncio.to_thread(_extract)
```

---

## 6. AI Integration (OpenAI GPT-4o)

### Setup

```bash
pip install openai
export OPENAI_API_KEY="sk-your-key-here"
```

### The Prompt Strategy

```python
# System prompt: defines GPT's role and required output format
system_prompt = """You are an expert video content analyst.
Return a JSON object with:
{
  "summary": "2-3 sentences about the video",
  "recommended_quality": "1080p or 720p or 320 kbps",
  "tags": ["array", "of", "tags"],
  "category": "Music/Education/Gaming/etc",
  "sentiment": "Positive/Neutral/Negative"
}"""

# API call with JSON mode
response = await client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"Analyze: {title}\n{description}"},
    ],
    response_format={"type": "json_object"},  # Force JSON output
    temperature=0.3,  # Low = more factual
)

analysis = json.loads(response.choices[0].message.content)
```

### Smart Quality Recommendations

GPT-4o recommends quality based on content:
- **Music videos** → 1080p (visual quality matters)
- **Podcasts/interviews** → 128 kbps MP3 (voice only)
- **Gaming** → 1080p (need to see details)
- **Tutorials** → 720p (HD is enough)
- **Music (audio only)** → 320 kbps MP3

---

## 7. Security & Best Practices

### Multi-Layer URL Validation

```
Layer 1 (Frontend): Regex pattern matching
Layer 2 (Router): String contains check
Layer 3 (Pydantic): @validator decorator
```

### Unique Filenames (Prevent Path Traversal)

```python
import uuid
job_id = str(uuid.uuid4()).replace("-", "")[:16]
# e.g. "a3b7f9c2d1e8f5a4"
output_path = downloads_dir / f"{job_id}.mp4"
# No user input in filename → safe from path traversal
```

### Auto File Deletion

```python
# Files are deleted after 1 hour
async def schedule_file_cleanup(downloads_dir, ttl=3600):
    while True:
        await asyncio.sleep(300)  # Check every 5 minutes
        for file in downloads_dir.iterdir():
            age = time.time() - file.stat().st_mtime
            if age > ttl:
                file.unlink()  # Delete the file
```

### Environment Variables

```bash
# Never hardcode secrets in code!
# Use .env file (add to .gitignore)
OPENAI_API_KEY=sk-your-key-here
DEBUG=false
```

---

## 8. Deployment Guide

### Prerequisites

```bash
python --version  # 3.11+
node --version    # 18+
ffmpeg -version   # Any recent version

# Install FFmpeg:
# macOS:  brew install ffmpeg
# Ubuntu: sudo apt install ffmpeg
# Windows: Download from https://ffmpeg.org
```

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/macOS
# OR: venv\Scripts\activate (Windows)

pip install -r requirements.txt
cp .env.example .env
# Edit .env: add OPENAI_API_KEY

uvicorn main:app --reload --port 8000
```

### Frontend

```bash
npm install
npm run dev  # Development: http://localhost:5173
# OR:
npm run build  # Production build → dist/
```

### Docker

```dockerfile
FROM python:3.11-slim
RUN apt-get update && apt-get install -y ffmpeg
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
RUN mkdir -p downloads
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 9. API Reference

### GET /api/info

Fetch video metadata.

**Request:**
```
GET /api/info?url=https://youtube.com/watch?v=dQw4w9WgXcQ
```

**Response:**
```json
{
  "title": "Rick Astley - Never Gonna Give You Up",
  "thumbnail": "https://i.ytimg.com/vi/.../maxresdefault.jpg",
  "duration": 213,
  "uploader": "Rick Astley",
  "view_count": 1400000000,
  "formats": [
    {"format_id": "137", "ext": "mp4", "quality": "1080p", "filesize": 85000000}
  ],
  "audio_formats": [
    {"format_id": "bestaudio-mp3-320", "ext": "mp3", "quality": "320 kbps"}
  ]
}
```

### POST /api/download

Download and convert a video.

**Request:**
```json
{
  "url": "https://youtube.com/watch?v=dQw4w9WgXcQ",
  "format_id": "136",
  "media_type": "mp4",
  "quality": "720p"
}
```

**Response:**
```json
{
  "download_url": "/files/a3b7f9c2.mp4",
  "filename": "rick-astley-a3b7f9.mp4",
  "filesize": 45000000,
  "media_type": "mp4",
  "job_id": "a3b7f9c2"
}
```

### POST /api/ai/analyze

AI video analysis.

**Request:**
```json
{"url": "https://youtube.com/watch?v=dQw4w9WgXcQ"}
```

**Response:**
```json
{
  "summary": "Iconic 1987 pop song by Rick Astley...",
  "recommended_quality": "1080p",
  "tags": ["pop", "80s", "music", "viral"],
  "category": "Music",
  "sentiment": "Positive & Energetic"
}
```

### GET /api/health

```json
{
  "status": "healthy",
  "yt_dlp_version": "2024.11.4",
  "ffmpeg_available": true,
  "openai_configured": true
}
```

---

## 10. Troubleshooting

| Problem | Solution |
|---------|----------|
| `ModuleNotFoundError: yt_dlp` | Run `pip install yt-dlp` |
| `FFmpeg not found` | Install FFmpeg and add to PATH |
| `OpenAI API error` | Check OPENAI_API_KEY in .env |
| `CORS error in browser` | Ensure CORS origins include frontend URL |
| `File not found after download` | Check downloads/ directory permissions |
| `Video unavailable` | Video may be age-restricted or private |
| `Port already in use` | Kill process on port 8000 / 5173 |

### Common yt-dlp Errors

```
ERROR: Sign in to confirm you're not a bot
Solution: Use --cookies-from-browser chrome (in CLI mode)

ERROR: This video is unavailable
Solution: Video is private, deleted, or geo-restricted

ERROR: Requested format not available
Solution: Use "best" as format_id fallback
```

---

*YTGrab Pro v2.0 – For personal use only. Respect copyright laws and YouTube's Terms of Service.*
