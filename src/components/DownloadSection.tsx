// ============================================================
// DownloadSection Component
// Container section that shows the download interface
// after a video URL has been analyzed. Includes:
// - VideoInfoCard (metadata display)
// - FormatSelector (quality picker)
// - AIInsightsPanel (AI analysis)
// - DownloadPanel (download trigger)
// ============================================================

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, RotateCcw } from "lucide-react";
import VideoInfoCard from "./VideoInfoCard";
import FormatSelector from "./FormatSelector";
import AIInsightsPanel from "./AIInsightsPanel";
import DownloadPanel from "./DownloadPanel";
import type {
  VideoInfo,
  AIAnalysis,
  VideoFormat,
  DownloadStatus,
} from "../types";

interface DownloadSectionProps {
  videoInfo: VideoInfo | null;
  aiAnalysis: AIAnalysis | null;
  isAnalyzing: boolean;
  status: DownloadStatus;
  selectedFormat: VideoFormat | null;
  setSelectedFormat: (f: VideoFormat) => void;
  mediaType: "mp3" | "mp4";
  setMediaType: (t: "mp3" | "mp4") => void;
  progress: number;
  error: string | null;
  onDownload: () => void;
  onReset: () => void;
}

// Loading skeleton while fetching video info
function LoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      {/* Video info skeleton */}
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        <div className="flex gap-0">
          <div className="w-64 h-48 bg-white/10 animate-pulse flex-shrink-0" />
          <div className="flex-1 p-6 space-y-4">
            <div className="h-5 bg-white/10 rounded-full animate-pulse w-3/4" />
            <div className="h-4 bg-white/10 rounded-full animate-pulse w-1/2" />
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 bg-white/10 rounded-full animate-pulse" />
              ))}
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 w-24 bg-white/10 rounded-full animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Format selector skeleton */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
        <div className="h-5 bg-white/10 rounded-full animate-pulse w-1/3" />
        <div className="flex gap-3">
          <div className="flex-1 h-12 bg-white/10 rounded-2xl animate-pulse" />
          <div className="flex-1 h-12 bg-white/10 rounded-2xl animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-white/10 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>

      {/* Center loading message */}
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-3 text-white/60">
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm">Fetching video information...</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function DownloadSection({
  videoInfo,
  aiAnalysis,
  isAnalyzing,
  status,
  selectedFormat,
  setSelectedFormat,
  mediaType,
  setMediaType,
  progress,
  error,
  onDownload,
  onReset,
}: DownloadSectionProps) {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-950 to-gray-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {/* Error state */}
          {status === "error" && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto"
            >
              <div className="flex items-start gap-4 p-6 bg-red-500/10 border border-red-500/30 rounded-3xl">
                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-red-400 font-bold mb-1">Something went wrong</h3>
                  <p className="text-white/60 text-sm">{error}</p>
                </div>
              </div>
              <div className="text-center mt-6">
                <button
                  onClick={onReset}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white rounded-2xl transition-colors font-semibold"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </button>
              </div>
            </motion.div>
          )}

          {/* Loading skeleton */}
          {status === "fetching_info" && (
            <motion.div key="loading" className="max-w-3xl mx-auto">
              <LoadingSkeleton />
            </motion.div>
          )}

          {/* Main content: ready, downloading, complete */}
          {videoInfo && (status === "ready" || status === "downloading" || status === "complete") && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Left column: video info + format selector */}
              <div className="lg:col-span-2 space-y-5">
                <VideoInfoCard info={videoInfo} />
                <FormatSelector
                  videoInfo={videoInfo}
                  mediaType={mediaType}
                  setMediaType={setMediaType}
                  selectedFormat={selectedFormat}
                  setSelectedFormat={setSelectedFormat}
                />
              </div>

              {/* Right column: AI insights + download */}
              <div className="space-y-5">
                <AIInsightsPanel analysis={aiAnalysis} isAnalyzing={isAnalyzing} />
                <DownloadPanel
                  selectedFormat={selectedFormat}
                  mediaType={mediaType}
                  status={status}
                  progress={progress}
                  onDownload={onDownload}
                  onReset={onReset}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
