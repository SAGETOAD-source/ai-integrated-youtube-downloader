// ============================================================
// TYPE DEFINITIONS
// All shared TypeScript interfaces and types used across
// the YTGrab Pro frontend application.
// ============================================================

/** Represents a video quality/format option returned by the API */
export interface VideoFormat {
  format_id: string;
  ext: string;           // e.g. "mp4", "webm"
  quality: string;       // e.g. "1080p", "720p", "360p"
  filesize?: number;     // bytes, optional
  vcodec?: string;       // video codec
  acodec?: string;       // audio codec
  format_note?: string;
}

/** Represents video metadata returned from /api/info endpoint */
export interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: number;       // seconds
  uploader: string;
  view_count: number;
  upload_date: string;
  description: string;
  formats: VideoFormat[];
  audio_formats: VideoFormat[];
}

/** Payload sent to /api/download endpoint */
export interface DownloadRequest {
  url: string;
  format_id: string;
  media_type: "mp3" | "mp4";
  quality?: string;
}

/** Response from /api/download endpoint */
export interface DownloadResponse {
  download_url: string;
  filename: string;
  filesize: number;
  media_type: "mp3" | "mp4";
}

/** AI Analysis result from /api/ai/analyze endpoint */
export interface AIAnalysis {
  summary: string;
  recommended_quality: string;
  tags: string[];
  category: string;
  sentiment: string;
}

/** App-wide download state */
export type DownloadStatus =
  | "idle"
  | "fetching_info"
  | "ready"
  | "downloading"
  | "complete"
  | "error";

/** Stats shown in the hero section */
export interface AppStats {
  downloads: string;
  countries: string;
  uptime: string;
}
