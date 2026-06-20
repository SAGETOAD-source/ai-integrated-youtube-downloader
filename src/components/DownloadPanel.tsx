// ============================================================
// DownloadPanel Component
// Shows the selected format summary and triggers the download.
// Displays animated progress bar during download.
// ============================================================

import { motion, AnimatePresence } from "framer-motion";
import { Download, CheckCircle2, Music, Video, FileDown } from "lucide-react";
import type { VideoFormat, DownloadStatus } from "../types";
import { formatFileSize } from "../hooks/useDownloader";

interface DownloadPanelProps {
  selectedFormat: VideoFormat | null;
  mediaType: "mp3" | "mp4";
  status: DownloadStatus;
  progress: number;
  onDownload: () => void;
  onReset: () => void;
}

export default function DownloadPanel({
  selectedFormat,
  mediaType,
  status,
  progress,
  onDownload,
  onReset,
}: DownloadPanelProps) {
  const isDownloading = status === "downloading";
  const isComplete = status === "complete";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
    >
      <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
        <FileDown className="w-5 h-5 text-red-400" />
        Download
      </h3>

      {/* Selected format summary */}
      {selectedFormat && !isComplete && (
        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 mb-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center flex-shrink-0">
            {mediaType === "mp3" ? (
              <Music className="w-6 h-6 text-white" />
            ) : (
              <Video className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="flex-1">
            <div className="text-white font-semibold text-sm">
              {mediaType.toUpperCase()} · {selectedFormat.quality}
            </div>
            <div className="text-white/40 text-xs mt-0.5">
              {formatFileSize(selectedFormat.filesize)} · .{selectedFormat.ext}
            </div>
          </div>
          <div className="text-right">
            <div className="text-white/60 text-xs uppercase font-semibold tracking-wide">
              {selectedFormat.format_note}
            </div>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <AnimatePresence>
        {isDownloading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-5 overflow-hidden"
          >
            <div className="flex justify-between text-xs text-white/50 mb-2">
              <span>Downloading...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            {/* Speed/ETA placeholder */}
            <div className="flex justify-between text-xs text-white/30 mt-1.5">
              <span>~3.2 MB/s</span>
              <span>ETA: {Math.ceil((100 - progress) / 10)}s</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complete state */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-6 gap-4 text-center mb-5"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30"
            >
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </motion.div>
            <div>
              <p className="text-white font-bold text-lg">Download Complete!</p>
              <p className="text-white/50 text-sm mt-1">
                Your file has been downloaded successfully.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <div className="flex gap-3">
        {!isComplete ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDownload}
            disabled={!selectedFormat || isDownloading}
            className="flex-1 flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold text-base rounded-2xl hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Download {mediaType.toUpperCase()}
              </>
            )}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-3 py-4 bg-white/10 text-white font-bold text-base rounded-2xl hover:bg-white/15 transition-all duration-300 border border-white/20"
          >
            Download Another
          </motion.button>
        )}
      </div>

      {/* Legal notice */}
      <p className="text-white/25 text-xs text-center mt-4 leading-relaxed">
        For personal use only. Please respect copyright laws and YouTube's Terms of Service.
      </p>
    </motion.div>
  );
}
