// ============================================================
// ManualPage Component
// Complete technical manual displayed as a styled web page.
// Explains every component, file, and line of important code.
// ============================================================

import { motion } from "framer-motion";
import { useState } from "react";
import { BookOpen, X, ChevronRight, Code2, Server, Brain, Download, Shield, Zap } from "lucide-react";

// Table of contents sections
const TOC = [
  { id: "overview", title: "1. Project Overview", icon: BookOpen },
  { id: "architecture", title: "2. System Architecture", icon: Server },
  { id: "frontend", title: "3. Frontend (React)", icon: Code2 },
  { id: "backend", title: "4. Backend (FastAPI)", icon: Server },
  { id: "ytdlp", title: "5. yt-dlp Integration", icon: Download },
  { id: "ai", title: "6. AI Integration (GPT-4o)", icon: Brain },
  { id: "security", title: "7. Security & Best Practices", icon: Shield },
  { id: "deployment", title: "8. Deployment Guide", icon: Zap },
];

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

function CodeBlock({ code, language = "python", title }: CodeBlockProps) {
  return (
    <div className="my-4 rounded-xl overflow-hidden border border-white/10">
      {title && (
        <div className="px-4 py-2 bg-white/5 border-b border-white/10 text-white/60 text-xs font-mono flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5" />
          {title}
        </div>
      )}
      <pre className="bg-black/60 p-4 overflow-x-auto text-xs font-mono">
        <code className={`language-${language} text-green-300`}>{code}</code>
      </pre>
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-white/10 flex items-center gap-3">
        <span className="w-1 h-8 bg-gradient-to-b from-red-500 to-pink-600 rounded-full" />
        {title}
      </h2>
      <div className="space-y-4 text-white/70 leading-relaxed">{children}</div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-white/90 mb-3 flex items-center gap-2">
        <ChevronRight className="w-4 h-4 text-red-400" />
        {title}
      </h3>
      <div className="pl-6 space-y-3">{children}</div>
    </div>
  );
}

export default function ManualPage({ onClose }: { onClose: () => void }) {
  const [activeSection, setActiveSection] = useState("overview");

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-gray-950 overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">YTGrab Pro – Technical Manual</h1>
            <p className="text-white/40 text-xs">Complete developer guide & code documentation</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar TOC */}
        <nav className="w-64 flex-shrink-0 border-r border-white/10 bg-black/30 overflow-y-auto hidden lg:block">
          <div className="p-4">
            <p className="text-white/30 text-xs font-semibold uppercase tracking-wider mb-3">Contents</p>
            {TOC.map(({ id, title, icon: Icon }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left mb-1 transition-all ${
                  activeSection === id
                    ? "bg-red-500/20 text-red-300 border border-red-500/30"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{title}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-8 max-w-4xl">
          
          {/* ── Section 1: Overview ── */}
          <Section id="overview" title="1. Project Overview">
            <p>
              <strong className="text-white">YTGrab Pro</strong> is a full-stack web application
              that allows users to download YouTube videos as MP3 (audio) or MP4 (video) files
              at any available quality. It combines a modern React frontend with a high-performance
              FastAPI backend, using yt-dlp for media extraction and OpenAI GPT-4o for intelligent
              video analysis.
            </p>

            <SubSection title="Technology Stack">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Frontend", "React 19 + TypeScript + Vite + Tailwind CSS v4"],
                  ["Backend", "FastAPI + Python 3.11+ + Uvicorn"],
                  ["Downloader", "yt-dlp (maintained fork of youtube-dl)"],
                  ["Converter", "FFmpeg (audio/video conversion)"],
                  ["AI Engine", "OpenAI GPT-4o via API"],
                  ["Animations", "Framer Motion"],
                  ["Validation", "Pydantic v2"],
                  ["Package Mgr", "npm (frontend) + pip (backend)"],
                ].map(([k, v]) => (
                  <div key={k} className="p-3 bg-white/3 rounded-xl border border-white/5">
                    <div className="text-red-400 text-xs font-semibold mb-1">{k}</div>
                    <div className="text-white/70 text-sm">{v}</div>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="Project File Structure">
              <CodeBlock
                language="text"
                title="Project Structure"
                code={`ytgrab-pro/
├── src/                      # React frontend source
│   ├── App.tsx               # Root component
│   ├── types/index.ts        # TypeScript interfaces
│   ├── hooks/
│   │   └── useDownloader.ts  # Main state management hook
│   └── components/
│       ├── Navbar.tsx        # Navigation bar
│       ├── HeroSection.tsx   # Landing hero + URL input
│       ├── VideoInfoCard.tsx # Video metadata display
│       ├── FormatSelector.tsx# Quality picker
│       ├── AIInsightsPanel.tsx # AI analysis display
│       ├── DownloadPanel.tsx # Download trigger + progress
│       ├── DownloadSection.tsx # Container for download UI
│       ├── FeaturesSection.tsx # Feature grid
│       ├── HowItWorksSection.tsx # Step-by-step guide
│       ├── APIDocsSection.tsx # API docs display
│       └── Footer.tsx        # Site footer
│
├── backend/                  # FastAPI Python backend
│   ├── main.py               # App entry point
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example          # Environment variables template
│   ├── models/
│   │   └── schemas.py        # Pydantic data models
│   ├── routers/
│   │   ├── info.py           # GET /api/info
│   │   ├── download.py       # POST /api/download
│   │   └── ai.py             # POST /api/ai/analyze
│   ├── services/
│   │   ├── ytdlp_service.py  # yt-dlp wrapper
│   │   └── openai_service.py # OpenAI GPT-4o wrapper
│   └── utils/
│       └── file_cleaner.py   # Auto-delete old files
│
├── index.html                # HTML entry point
├── package.json              # Node.js dependencies
└── vite.config.ts            # Vite build config`}
              />
            </SubSection>
          </Section>

          {/* ── Section 2: Architecture ── */}
          <Section id="architecture" title="2. System Architecture">
            <p>
              YTGrab Pro follows a <strong className="text-white">client-server architecture</strong> with
              clear separation of concerns. The frontend handles UI state and user interactions,
              while the backend handles all media processing.
            </p>

            <SubSection title="Request Flow">
              <CodeBlock
                language="text"
                title="Request Flow Diagram"
                code={`User → React UI → FastAPI Backend → YouTube
                                         ↓
                                     yt-dlp
                                         ↓
                                     FFmpeg
                                         ↓
                                  downloads/ folder
                                         ↓
                          Static File Server (/files)
                                         ↓
                               User downloads file

Parallel flow for AI:
User → React UI → FastAPI /api/ai/analyze → yt-dlp (metadata)
                                                    ↓
                                            OpenAI GPT-4o API
                                                    ↓
                                         AI insights → React UI`}
              />
            </SubSection>

            <SubSection title="CORS Configuration">
              <p>
                Cross-Origin Resource Sharing (CORS) is configured in <code className="text-purple-400">main.py</code>.
                Since the React dev server runs on port 5173 and FastAPI runs on port 8000,
                CORS headers must be set to allow cross-origin requests.
              </p>
              <CodeBlock
                language="python"
                title="backend/main.py – CORS Setup"
                code={`# Allow the React frontend to call our API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",    # Vite dev server
        "https://yourdomain.com",   # Production frontend
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)`}
              />
            </SubSection>

            <SubSection title="Async Architecture">
              <p>
                FastAPI is fully asynchronous. However, yt-dlp is a synchronous library.
                We solve this by running yt-dlp operations in a thread pool using{" "}
                <code className="text-purple-400">asyncio.to_thread()</code>:
              </p>
              <CodeBlock
                language="python"
                title="backend/services/ytdlp_service.py – Async wrapper"
                code={`async def get_video_info(url: str) -> Dict[str, Any]:
    """
    Async function that wraps synchronous yt-dlp code.
    asyncio.to_thread() runs the function in a ThreadPoolExecutor,
    preventing it from blocking the event loop.
    """
    def _extract():
        # This runs in a separate thread
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            return ydl.extract_info(url, download=False)
    
    # Await the thread-pool execution
    info = await asyncio.to_thread(_extract)
    return info`}
              />
            </SubSection>
          </Section>

          {/* ── Section 3: Frontend ── */}
          <Section id="frontend" title="3. Frontend (React + TypeScript)">
            <SubSection title="useDownloader Hook (State Management)">
              <p>
                All download logic lives in <code className="text-purple-400">src/hooks/useDownloader.ts</code>.
                This custom hook follows React's{" "}
                <strong className="text-white">separation of concerns</strong> principle:
                components handle rendering, hooks handle logic.
              </p>
              <CodeBlock
                language="typescript"
                title="src/hooks/useDownloader.ts – Core state"
                code={`// All possible states of the download process
type DownloadStatus = 
  | "idle"           // Initial state, nothing submitted
  | "fetching_info"  // Calling GET /api/info
  | "ready"          // Video info loaded, waiting for user
  | "downloading"    // Calling POST /api/download
  | "complete"       // Download finished successfully
  | "error"          // Something went wrong

// The hook manages all these state variables
const [url, setUrl] = useState("");
const [status, setStatus] = useState<DownloadStatus>("idle");
const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
const [downloadProgress, setDownloadProgress] = useState(0);`}
              />
            </SubSection>

            <SubSection title="URL Validation">
              <p>
                Before calling the API, we validate the YouTube URL with a regex pattern:
              </p>
              <CodeBlock
                language="typescript"
                title="src/hooks/useDownloader.ts – URL Validation"
                code={`// This regex matches:
// - https://youtube.com/watch?v=XXXXXXXXXXX
// - https://youtu.be/XXXXXXXXXXX
// - https://youtube.com/shorts/XXXXXXXXXXX
const ytPattern = /^(https?:\\/\\/)?(www\\.)?(youtube\\.com\\/(watch\\?v=|shorts\\/)|youtu\\.be\\/)[\w-]{11}/;

if (!ytPattern.test(videoUrl)) {
  setError("Please enter a valid YouTube URL");
  return;  // Stop here, don't call the API
}`}
              />
            </SubSection>

            <SubSection title="Component Data Flow">
              <CodeBlock
                language="text"
                title="Component hierarchy and data flow"
                code={`App.tsx
├── useDownloader hook (state + API calls)
│
├── Navbar.tsx (no props – static)
│
├── HeroSection.tsx
│   Props: url, setUrl, onFetch, isLoading
│   Renders: URL input, paste button, submit button
│
└── DownloadSection.tsx (shown when status !== "idle")
    Props: videoInfo, status, selectedFormat, ...
    │
    ├── VideoInfoCard.tsx
    │   Props: info (VideoInfo)
    │   Renders: thumbnail, title, stats
    │
    ├── FormatSelector.tsx
    │   Props: videoInfo, mediaType, selectedFormat, ...
    │   Renders: MP3/MP4 toggle, quality grid
    │
    ├── AIInsightsPanel.tsx
    │   Props: analysis, isAnalyzing
    │   Renders: AI summary, tags, recommendations
    │
    └── DownloadPanel.tsx
        Props: selectedFormat, status, progress, ...
        Renders: format summary, progress bar, download button`}
              />
            </SubSection>

            <SubSection title="Framer Motion Animations">
              <p>
                Every major UI element uses Framer Motion for smooth animations.
                Key patterns used:
              </p>
              <CodeBlock
                language="typescript"
                title="Animation patterns used throughout the app"
                code={`// 1. Fade-in from below (most common)
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>

// 2. Staggered children (features grid)
transition={{ delay: index * 0.08 }}  // Each card delays 80ms more

// 3. Scroll-triggered (sections)
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}  // Only trigger once
>

// 4. Hover/tap effects (buttons)
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>

// 5. AnimatePresence (conditional rendering)
<AnimatePresence mode="wait">
  {isLoading && <motion.div exit={{ opacity: 0 }}>Loading...</motion.div>}
  {isReady && <motion.div>Content</motion.div>}
</AnimatePresence>`}
              />
            </SubSection>
          </Section>

          {/* ── Section 4: Backend ── */}
          <Section id="backend" title="4. Backend (FastAPI)">
            <SubSection title="FastAPI Application Setup">
              <p>
                FastAPI is the web framework. It automatically generates OpenAPI documentation
                and handles request validation via Pydantic models.
              </p>
              <CodeBlock
                language="python"
                title="backend/main.py – App initialization"
                code={`from fastapi import FastAPI

app = FastAPI(
    title="YTGrab Pro API",
    version="2.0.0",
    docs_url="/docs",    # Swagger UI auto-generated
    redoc_url="/redoc",  # ReDoc auto-generated
    lifespan=lifespan,   # Startup/shutdown events
)

# Register routers (each handles a group of endpoints)
app.include_router(info.router,     prefix="/api")  # GET /api/info
app.include_router(download.router, prefix="/api")  # POST /api/download
app.include_router(ai.router,       prefix="/api")  # POST /api/ai/analyze`}
              />
            </SubSection>

            <SubSection title="Pydantic Models (Data Validation)">
              <p>
                Pydantic models define the shape of request and response data.
                FastAPI automatically validates incoming requests against these models.
              </p>
              <CodeBlock
                language="python"
                title="backend/models/schemas.py – Request validation"
                code={`from pydantic import BaseModel, validator

class DownloadRequest(BaseModel):
    url: str          # Required: YouTube URL
    format_id: str    # Required: yt-dlp format ID
    media_type: str   # Required: "mp3" or "mp4"
    quality: str | None = None  # Optional: display label

    @validator("media_type")
    def validate_media_type(cls, v):
        # Pydantic validator – runs on every request
        # Raises ValidationError (HTTP 422) if invalid
        if v not in ("mp3", "mp4"):
            raise ValueError("media_type must be 'mp3' or 'mp4'")
        return v
        
# When FastAPI receives:
# POST /api/download {"url": "...", "media_type": "avi"}
# It automatically responds with HTTP 422 Unprocessable Entity`}
              />
            </SubSection>

            <SubSection title="Endpoint Example – GET /api/info">
              <CodeBlock
                language="python"
                title="backend/routers/info.py – Info endpoint"
                code={`@router.get(
    "/info",
    response_model=VideoInfoResponse,  # FastAPI validates output too!
)
async def get_info(
    # Query parameter: GET /api/info?url=...
    url: str = Query(..., description="YouTube URL")
):
    # 1. Validate the URL format
    if "youtube.com" not in url and "youtu.be" not in url:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL")
    
    # 2. Call yt-dlp service (async)
    info = await get_video_info(url)
    
    # 3. FastAPI auto-serializes the dict to JSON
    return info  # → response_model validates and serializes`}
              />
            </SubSection>

            <SubSection title="Background Tasks">
              <p>
                FastAPI supports background tasks that run after the response is sent.
                We use this for logging and file cleanup:
              </p>
              <CodeBlock
                language="python"
                title="backend/routers/download.py – Background tasks"
                code={`async def download(
    request: DownloadRequest,
    background_tasks: BackgroundTasks,  # Injected by FastAPI
):
    # ... do the download ...
    
    # This runs AFTER the response is sent to the client
    # The user doesn't wait for it
    background_tasks.add_task(
        log_download,          # Function to call
        url=request.url,       # Arguments
        media_type=request.media_type,
    )
    
    return DownloadResponse(...)  # Sent immediately`}
              />
            </SubSection>
          </Section>

          {/* ── Section 5: yt-dlp ── */}
          <Section id="ytdlp" title="5. yt-dlp Integration">
            <p>
              <strong className="text-white">yt-dlp</strong> is the core library that handles
              all YouTube interactions. It's a maintained fork of youtube-dl with bug fixes,
              new features, and better YouTube compatibility.
            </p>

            <SubSection title="Info Extraction (No Download)">
              <CodeBlock
                language="python"
                title="backend/services/ytdlp_service.py – Info extraction"
                code={`import yt_dlp

ydl_opts = {
    "quiet": True,         # Don't print progress to stdout
    "no_warnings": True,   # Suppress warning messages
    "extract_flat": False, # Extract full info (not just URLs)
}

with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    # download=False means: only fetch metadata, don't download
    info = ydl.extract_info(url, download=False)

# info is a large dict containing:
# info["title"]         → Video title
# info["thumbnail"]     → Thumbnail URL
# info["duration"]      → Duration in seconds
# info["formats"]       → List of all available formats
# info["uploader"]      → Channel name
# info["view_count"]    → Number of views`}
              />
            </SubSection>

            <SubSection title="MP3 Download Configuration">
              <CodeBlock
                language="python"
                title="backend/services/ytdlp_service.py – MP3 download"
                code={`ydl_opts = {
    "format": "bestaudio/best",  # Download best available audio stream
    "outtmpl": str(output_path), # Output filename template
    "postprocessors": [
        {
            # FFmpegExtractAudio: extract audio and convert
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",   # Convert to MP3
            "preferredquality": "320", # Bitrate: 128/192/256/320 kbps
        }
    ],
}

# The postprocessor tells yt-dlp:
# 1. Download the best audio stream (e.g. .webm or .m4a)
# 2. Run FFmpeg to convert it to .mp3 at 320kbps
# 3. Delete the original downloaded file`}
              />
            </SubSection>

            <SubSection title="MP4 Download Configuration">
              <CodeBlock
                language="python"
                title="backend/services/ytdlp_service.py – MP4 download"
                code={`ydl_opts = {
    # Format selector: take specific video + best audio, merge to MP4
    # "137" = 1080p video-only stream
    # "+bestaudio" = merge with best audio stream
    # "/best" = fallback if merge not possible
    "format": f"{format_id}+bestaudio/best[ext=mp4]/best",
    
    "outtmpl": str(output_path),
    "merge_output_format": "mp4",  # Ensure MP4 container
    "postprocessors": [
        {
            "key": "FFmpegVideoConvertor",  # Use FFmpeg to merge
            "preferedformat": "mp4",
        }
    ],
}

# Why we need FFmpeg:
# YouTube stores video and audio as SEPARATE streams
# FFmpeg merges them into a single MP4 file
# Without FFmpeg: video would have NO SOUND`}
              />
            </SubSection>

            <SubSection title="Format Filtering">
              <CodeBlock
                language="python"
                title="backend/services/ytdlp_service.py – Format filtering"
                code={`def extract_video_formats(formats):
    """
    yt-dlp returns 30-50+ format options.
    We filter and deduplicate to show only the best option
    at each resolution.
    """
    video_formats = []
    seen_heights = set()
    
    for fmt in formats:
        # Skip audio-only formats (no height)
        if not fmt.get("height"):
            continue
        
        # Skip duplicate resolutions (keep first/best)
        if fmt["height"] in seen_heights:
            continue
        seen_heights.add(fmt["height"])
        
        video_formats.append({
            "format_id": fmt["format_id"],
            "quality": f"{fmt['height']}p",
            "filesize": fmt.get("filesize"),
            ...
        })
    
    # Sort highest quality first (1080p before 720p, etc.)
    return sorted(video_formats, key=lambda f: int(f["quality"][:-1]), reverse=True)`}
              />
            </SubSection>
          </Section>

          {/* ── Section 6: AI Integration ── */}
          <Section id="ai" title="6. AI Integration (OpenAI GPT-4o)">
            <p>
              The AI integration uses <strong className="text-white">OpenAI GPT-4o</strong> to
              analyze YouTube videos and provide intelligent recommendations. It sends video
              metadata (not the video itself) to the API for analysis.
            </p>

            <SubSection title="The Prompt Strategy">
              <p>
                We use a two-part prompt strategy:
                (1) A <strong className="text-white">system prompt</strong> that defines GPT's role and required JSON output format,
                and (2) a <strong className="text-white">user prompt</strong> with the actual video data.
              </p>
              <CodeBlock
                language="python"
                title="backend/services/openai_service.py – Prompt design"
                code={`# System prompt: defines role and output format
system_prompt = """You are an expert video content analyst.
Analyze the provided video metadata and return a JSON object:
{
  "summary": "2-3 sentences about the video",
  "recommended_quality": "1080p or 720p or 320 kbps",
  "tags": ["array", "of", "tags"],
  "category": "Music/Education/Gaming/etc",
  "sentiment": "Positive/Neutral/Negative"
}
Always return valid JSON only."""

# User prompt: the actual data
user_prompt = f"""Analyze this YouTube video:
Title: {title}
Channel: {uploader}
Duration: {duration_str}
Views: {view_count:,}
Description: {description}"""

# API call with JSON mode enforced
response = await client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ],
    response_format={"type": "json_object"},  # Force JSON output
    max_tokens=500,
    temperature=0.3,  # Low = more consistent, factual responses
)`}
              />
            </SubSection>

            <SubSection title="Fallback Analysis">
              <p>
                When OpenAI is unavailable (no API key, rate limit, network error),
                the service falls back to a rule-based analysis system:
              </p>
              <CodeBlock
                language="python"
                title="backend/services/openai_service.py – Fallback"
                code={`def _fallback_analysis(video_info):
    """Rule-based analysis when OpenAI is unavailable."""
    title = video_info.get("title", "").lower()
    
    # Keyword-based category detection
    categories = {
        "Music": ["music", "song", "official", "ft.", "remix"],
        "Gaming": ["game", "gameplay", "minecraft", "speedrun"],
        "Education": ["tutorial", "how to", "learn", "course"],
    }
    
    detected = "Entertainment"
    for cat, keywords in categories.items():
        if any(kw in title for kw in keywords):
            detected = cat
            break
    
    # Smart quality recommendations based on content type
    quality_map = {
        "Music": "1080p",      # Music videos need HD
        "Education": "720p",   # Tutorials: HD is enough
        "Gaming": "1080p",     # Gaming needs high resolution
    }
    
    return {
        "summary": f"Video by {video_info.get('uploader')}",
        "recommended_quality": quality_map.get(detected, "720p"),
        "category": detected,
        ...
    }`}
              />
            </SubSection>

            <SubSection title="Cost Optimization">
              <p>Key strategies to minimize OpenAI API costs:</p>
              <ul className="list-disc pl-5 space-y-2 text-white/60">
                <li><strong className="text-white/80">Truncate descriptions</strong> – Only send first 300 characters to GPT-4o</li>
                <li><strong className="text-white/80">max_tokens=500</strong> – Limit response length to control cost</li>
                <li><strong className="text-white/80">Non-blocking</strong> – AI analysis runs in parallel, doesn't block downloads</li>
                <li><strong className="text-white/80">Fallback</strong> – Rule-based analysis when API is unavailable</li>
                <li><strong className="text-white/80">Cache results</strong> – In production, cache by video ID (Redis)</li>
              </ul>
            </SubSection>
          </Section>

          {/* ── Section 7: Security ── */}
          <Section id="security" title="7. Security & Best Practices">
            <SubSection title="Input Validation">
              <CodeBlock
                language="python"
                title="URL Validation at multiple layers"
                code={`# Layer 1: Frontend (TypeScript)
const ytPattern = /^(https?:\\/\\/)?(www\\.)?(youtube\\.com\\/|youtu\\.be\\/)[\w-]{11}/;
if (!ytPattern.test(url)) { setError("Invalid URL"); return; }

# Layer 2: FastAPI router
if "youtube.com" not in url and "youtu.be" not in url:
    raise HTTPException(status_code=400, detail="Invalid URL")

# Layer 3: Pydantic validator
@validator("url")
def validate_youtube_url(cls, v):
    if "youtube.com" not in v and "youtu.be" not in v:
        raise ValueError("Must be a YouTube URL")
    return v`}
              />
            </SubSection>

            <SubSection title="File Security">
              <ul className="list-disc pl-5 space-y-2 text-white/60">
                <li><strong className="text-white/80">Unique filenames</strong> – UUID-based names prevent path traversal attacks</li>
                <li><strong className="text-white/80">Auto-deletion</strong> – Files deleted after 1 hour (configurable)</li>
                <li><strong className="text-white/80">Static serving</strong> – Files served by FastAPI static file handler, not executed</li>
                <li><strong className="text-white/80">Sandboxed</strong> – Downloads directory is isolated from application code</li>
              </ul>
            </SubSection>

            <SubSection title="Rate Limiting (Production)">
              <CodeBlock
                language="python"
                title="Add rate limiting with slowapi"
                code={`# pip install slowapi
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@router.get("/info")
@limiter.limit("10/minute")  # Max 10 requests per minute per IP
async def get_info(request: Request, url: str = Query(...)):
    ...`}
              />
            </SubSection>

            <SubSection title="Environment Variables">
              <p>
                Never hardcode secrets in source code. Use environment variables:
              </p>
              <CodeBlock
                language="bash"
                title=".env file (never commit to git!)"
                code={`# .env
OPENAI_API_KEY=sk-your-key-here
DEBUG=false
FILE_TTL_SECONDS=3600

# Load in Python:
# from dotenv import load_dotenv
# load_dotenv()
# api_key = os.getenv("OPENAI_API_KEY")`}
              />
            </SubSection>
          </Section>

          {/* ── Section 8: Deployment ── */}
          <Section id="deployment" title="8. Deployment Guide">
            <SubSection title="Prerequisites">
              <CodeBlock
                language="bash"
                title="Required software"
                code={`# Check if installed:
python --version   # Need 3.11+
node --version     # Need 18+
ffmpeg -version    # Need any recent version

# Install FFmpeg:
# macOS:   brew install ffmpeg
# Ubuntu:  sudo apt install ffmpeg
# Windows: Download from ffmpeg.org`}
              />
            </SubSection>

            <SubSection title="Backend Setup">
              <CodeBlock
                language="bash"
                title="Start the FastAPI backend"
                code={`# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment (isolated Python environment)
python -m venv venv

# 3. Activate virtual environment
# Linux/macOS:
source venv/bin/activate
# Windows:
venv\\Scripts\\activate

# 4. Install Python dependencies
pip install -r requirements.txt

# 5. Copy and fill in environment variables
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# 6. Start the server
uvicorn main:app --reload --port 8000

# Server runs at: http://localhost:8000
# API docs at:    http://localhost:8000/docs`}
              />
            </SubSection>

            <SubSection title="Frontend Setup">
              <CodeBlock
                language="bash"
                title="Start the React frontend"
                code={`# 1. Navigate to project root
cd ..  # (back to project root)

# 2. Install Node.js dependencies
npm install

# 3. Start development server
npm run dev

# Frontend runs at: http://localhost:5173

# For production build:
npm run build
# Generates dist/ folder with static files
# Serve with nginx, Apache, or any static host`}
              />
            </SubSection>

            <SubSection title="Production Deployment (Docker)">
              <CodeBlock
                language="dockerfile"
                title="Dockerfile for backend"
                code={`FROM python:3.11-slim

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create downloads directory
RUN mkdir -p downloads

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`}
              />
              <CodeBlock
                language="yaml"
                title="docker-compose.yml"
                code={`version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=\${OPENAI_API_KEY}
    volumes:
      - ./downloads:/app/downloads
  
  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend`}
              />
            </SubSection>

            <SubSection title="Quick Test">
              <CodeBlock
                language="bash"
                title="Test the API with curl"
                code={`# Test health endpoint
curl http://localhost:8000/api/health

# Test info endpoint
curl "http://localhost:8000/api/info?url=https://youtu.be/dQw4w9WgXcQ"

# Test download endpoint
curl -X POST http://localhost:8000/api/download \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://youtu.be/dQw4w9WgXcQ","format_id":"136","media_type":"mp4"}'

# Test AI analysis
curl -X POST http://localhost:8000/api/ai/analyze \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://youtu.be/dQw4w9WgXcQ"}'`}
              />
            </SubSection>

            <div className="mt-8 p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl">
              <h4 className="text-green-400 font-bold mb-2">✅ You're Ready!</h4>
              <p className="text-white/60 text-sm">
                With both servers running, open <code className="text-green-300">http://localhost:5173</code> in
                your browser. Paste a YouTube URL, select your format, and download!
              </p>
            </div>
          </Section>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-white/10 text-center text-white/30 text-sm">
            <p>YTGrab Pro Technical Manual v2.0 · Built with FastAPI + React + yt-dlp + GPT-4o</p>
            <p className="mt-2">For personal use only. Respect copyright laws and YouTube's Terms of Service.</p>
          </div>
        </main>
      </div>
    </motion.div>
  );
}
