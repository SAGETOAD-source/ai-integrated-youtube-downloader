// ============================================================
// APIDocsSection Component
// Displays FastAPI endpoint documentation in a code-style UI.
// Shows request/response examples for each endpoint.
// ============================================================

import { motion } from "framer-motion";
import { useState } from "react";
import { Code2, ChevronDown, ChevronUp, Copy, CheckCheck } from "lucide-react";

interface Endpoint {
  method: "GET" | "POST";
  path: string;
  description: string;
  request?: string;
  response: string;
}

const ENDPOINTS: Endpoint[] = [
  {
    method: "GET",
    path: "/api/info",
    description: "Fetch video metadata and available formats using yt-dlp.",
    request: `GET /api/info?url=https://youtube.com/watch?v=dQw4w9WgXcQ`,
    response: `{
  "title": "Rick Astley - Never Gonna Give You Up",
  "thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  "duration": 213,
  "uploader": "Rick Astley",
  "view_count": 1400000000,
  "formats": [
    { "format_id": "137", "ext": "mp4", "quality": "1080p", "filesize": 85000000 },
    { "format_id": "136", "ext": "mp4", "quality": "720p",  "filesize": 45000000 }
  ],
  "audio_formats": [
    { "format_id": "bestaudio-mp3-320", "ext": "mp3", "quality": "320 kbps" }
  ]
}`,
  },
  {
    method: "POST",
    path: "/api/download",
    description: "Download and convert a video. Returns a temporary download URL.",
    request: `POST /api/download
Content-Type: application/json

{
  "url": "https://youtube.com/watch?v=dQw4w9WgXcQ",
  "format_id": "136",
  "media_type": "mp4",
  "quality": "720p"
}`,
    response: `{
  "download_url": "/files/abc123.mp4",
  "filename": "rick-astley-never-gonna-give-you-up.mp4",
  "filesize": 45000000,
  "media_type": "mp4"
}`,
  },
  {
    method: "POST",
    path: "/api/ai/analyze",
    description: "AI analysis via OpenAI GPT-4o – returns insights, tags, and quality recommendation.",
    request: `POST /api/ai/analyze
Content-Type: application/json

{
  "url": "https://youtube.com/watch?v=dQw4w9WgXcQ"
}`,
    response: `{
  "summary": "Iconic 1987 pop song that became a global internet meme.",
  "recommended_quality": "720p",
  "tags": ["pop", "80s", "music", "viral", "meme"],
  "category": "Music",
  "sentiment": "Positive & Energetic"
}`,
  },
  {
    method: "GET",
    path: "/api/health",
    description: "Health check endpoint. Returns server status and dependency versions.",
    response: `{
  "status": "healthy",
  "yt_dlp_version": "2024.11.4",
  "ffmpeg_available": true,
  "openai_connected": true,
  "uptime_seconds": 3600
}`,
  },
];

const METHOD_COLORS = {
  GET: "bg-green-500/20 text-green-400 border-green-500/30",
  POST: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyResponse = () => {
    navigator.clipboard.writeText(endpoint.response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/3">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-5 hover:bg-white/5 transition-colors text-left"
      >
        <span
          className={`px-3 py-1 rounded-lg text-xs font-bold border uppercase tracking-wide ${
            METHOD_COLORS[endpoint.method]
          }`}
        >
          {endpoint.method}
        </span>
        <code className="text-white font-mono text-sm flex-1">{endpoint.path}</code>
        <span className="text-white/40 text-sm hidden sm:block flex-1">
          {endpoint.description}
        </span>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-white/40 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white/40 flex-shrink-0" />
        )}
      </button>

      {/* Expanded content */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="border-t border-white/10"
        >
          <div className="p-5 space-y-4">
            {endpoint.request && (
              <div>
                <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Request</p>
                <pre className="bg-black/50 border border-white/5 rounded-xl p-4 text-green-300 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                  {endpoint.request}
                </pre>
              </div>
            )}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Response</p>
                <button
                  onClick={copyResponse}
                  className="flex items-center gap-1.5 text-white/40 hover:text-white text-xs transition-colors"
                >
                  {copied ? <CheckCheck className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="bg-black/50 border border-white/5 rounded-xl p-4 text-cyan-300 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                {endpoint.response}
              </pre>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function APIDocsSection() {
  return (
    <section id="api-docs" className="py-24 bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold rounded-full mb-4">
            Developer API
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            REST API{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
              Reference
            </span>
          </h2>
          <p className="text-white/50 text-lg">
            Full FastAPI backend with auto-generated OpenAPI / Swagger docs at{" "}
            <code className="text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">/docs</code>
          </p>
        </motion.div>

        {/* Base URL */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl mb-6"
        >
          <Code2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
          <div>
            <span className="text-white/40 text-xs">Base URL</span>
            <code className="block text-white font-mono text-sm">http://localhost:8000</code>
          </div>
        </motion.div>

        {/* Endpoints */}
        <div className="space-y-3">
          {ENDPOINTS.map((ep, i) => (
            <motion.div
              key={ep.path}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <EndpointCard endpoint={ep} />
            </motion.div>
          ))}
        </div>

        {/* Swagger link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 p-5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl text-center"
        >
          <p className="text-white/70 text-sm mb-3">
            Full interactive documentation available at the Swagger UI
          </p>
          <code className="text-indigo-300 font-mono text-sm bg-black/30 px-4 py-2 rounded-xl">
            http://localhost:8000/docs
          </code>
        </motion.div>
      </div>
    </section>
  );
}
