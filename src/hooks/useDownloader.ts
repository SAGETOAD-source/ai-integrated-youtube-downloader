// ============================================================
// useDownloader Custom Hook
// Manages all download-related state and API interactions.
// Uses a simulated API layer since this is a frontend demo –
// in production this connects to the FastAPI backend.
// ============================================================

import { useState, useCallback } from "react";
import axios from "axios";
import type {
  VideoInfo,
  DownloadStatus,
  AIAnalysis,
  VideoFormat,
} from "../types";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

// ---- Helper to format file size ----
export function formatFileSize(bytes?: number): string {
  if (!bytes) return "Unknown size";
  if (bytes >= 1_000_000_000) return `${(bytes / 1_000_000_000).toFixed(2)} GB`;
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(0)} KB`;
  return `${bytes} B`;
}

// ---- Helper to format duration ----
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// ---- Helper to format view count ----
export function formatViews(count: number): string {
  if (count >= 1_000_000_000) return `${(count / 1_000_000_000).toFixed(1)}B`;
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
  return String(count);
}

// ---- Main hook ----
export function useDownloader() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<DownloadStatus>("idle");
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<VideoFormat | null>(null);
  const [mediaType, setMediaType] = useState<"mp3" | "mp4">("mp4");
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  /**
   * fetchVideoInfo
   * Calls GET /api/info?url=<youtube_url>
   * In demo mode: simulates network delay and returns mock data
   */
  const fetchVideoInfo = useCallback(async (videoUrl: string) => {
    if (!videoUrl.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    // Validate YouTube URL pattern
    const ytPattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]{11}/;
    if (!ytPattern.test(videoUrl)) {
      setError("Please enter a valid YouTube URL (e.g. https://youtube.com/watch?v=...)");
      return;
    }

    setError(null);
    setStatus("fetching_info");
    setVideoInfo(null);
    setAiAnalysis(null);
    setSelectedFormat(null);
    setDownloadProgress(0);

    try {
      const response = await axios.get<VideoInfo>(`${API_BASE}/api/info`, {
        params: { url: videoUrl },
      });
      const info = response.data;

      setVideoInfo(info);
      // Pre-select best quality
      setSelectedFormat(info.formats[1] ?? info.formats[0] ?? info.audio_formats[0] ?? null);
      setStatus("ready");

      // Trigger AI analysis after info is ready
      triggerAIAnalysis(videoUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to fetch video info";
      setError(`API Error: ${msg}. Make sure the FastAPI backend is running.`);
      setStatus("error");
    }
  }, []);

  /**
   * triggerAIAnalysis
   * Calls POST /api/ai/analyze with the video URL
   * Returns AI-generated insights about the video
   */
  const triggerAIAnalysis = useCallback(async (videoUrl: string) => {
    setIsAnalyzing(true);
    try {
      const response = await axios.post<AIAnalysis>(`${API_BASE}/api/ai/analyze`, {
        url: videoUrl,
      });
      setAiAnalysis(response.data);
    } catch {
      // AI analysis is non-critical – fail silently
      console.warn("AI analysis unavailable");
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  /**
   * startDownload
   * Calls POST /api/download with selected format
   * Simulates download progress in demo mode
   */
  const startDownload = useCallback(async () => {
    if (!videoInfo || !selectedFormat) return;

    setStatus("downloading");
    setDownloadProgress(0);

    try {
      setDownloadProgress(10);
      const response = await axios.post(`${API_BASE}/api/download`, {
        url,
        format_id: selectedFormat.format_id,
        media_type: mediaType,
        quality: selectedFormat.quality,
      });
      setDownloadProgress(100);

      const downloadUrl = response.data.download_url.startsWith("http")
        ? response.data.download_url
        : `${API_BASE}${response.data.download_url}`;
      window.open(downloadUrl, "_blank");

      setStatus("complete");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Download failed";
      setError(`Download Error: ${msg}`);
      setStatus("error");
    }
  }, [videoInfo, selectedFormat, mediaType, url]);

  /** Reset all state back to initial */
  const reset = useCallback(() => {
    setUrl("");
    setStatus("idle");
    setVideoInfo(null);
    setAiAnalysis(null);
    setSelectedFormat(null);
    setDownloadProgress(0);
    setError(null);
    setIsAnalyzing(false);
    setMediaType("mp4");
  }, []);

  return {
    // State
    url, setUrl,
    status,
    videoInfo,
    aiAnalysis,
    selectedFormat, setSelectedFormat,
    mediaType, setMediaType,
    downloadProgress,
    error,
    isAnalyzing,
    // Actions
    fetchVideoInfo,
    startDownload,
    reset,
  };
}
