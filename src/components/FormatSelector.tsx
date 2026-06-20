// ============================================================
// FormatSelector Component
// Allows users to switch between MP3/MP4 and select quality.
// Shows file size estimates for each option.
// ============================================================

import { motion, AnimatePresence } from "framer-motion";
import { Music, Video, CheckCircle2, HardDrive } from "lucide-react";
import type { VideoInfo, VideoFormat } from "../types";
import { formatFileSize } from "../hooks/useDownloader";

interface FormatSelectorProps {
  videoInfo: VideoInfo;
  mediaType: "mp3" | "mp4";
  setMediaType: (t: "mp3" | "mp4") => void;
  selectedFormat: VideoFormat | null;
  setSelectedFormat: (f: VideoFormat) => void;
}

// Quality badge color mapping
const QUALITY_COLORS: Record<string, string> = {
  "1080p": "from-yellow-400 to-orange-500",
  "720p":  "from-green-400 to-emerald-500",
  "480p":  "from-blue-400 to-cyan-500",
  "360p":  "from-purple-400 to-violet-500",
  "144p":  "from-gray-400 to-slate-500",
  "320 kbps": "from-yellow-400 to-orange-500",
  "256 kbps": "from-green-400 to-emerald-500",
  "192 kbps": "from-blue-400 to-cyan-500",
  "128 kbps": "from-gray-400 to-slate-500",
};

export default function FormatSelector({
  videoInfo,
  mediaType,
  setMediaType,
  selectedFormat,
  setSelectedFormat,
}: FormatSelectorProps) {
  const formats = mediaType === "mp4" ? videoInfo.formats : videoInfo.audio_formats;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
    >
      <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
        <HardDrive className="w-5 h-5 text-red-400" />
        Choose Format & Quality
      </h3>

      {/* Media type toggle */}
      <div className="flex gap-3 mb-6">
        {(["mp4", "mp3"] as const).map((type) => (
          <button
            key={type}
            onClick={() => {
              setMediaType(type);
              // Auto-select best format when switching
              const fmts = type === "mp4" ? videoInfo.formats : videoInfo.audio_formats;
              if (fmts.length > 0) setSelectedFormat(fmts[0]);
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
              mediaType === type
                ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/30"
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/10"
            }`}
          >
            {type === "mp4" ? (
              <Video className="w-4 h-4" />
            ) : (
              <Music className="w-4 h-4" />
            )}
            {type.toUpperCase()}
            {type === "mp4" && <span className="text-xs opacity-70">Video</span>}
            {type === "mp3" && <span className="text-xs opacity-70">Audio Only</span>}
          </button>
        ))}
      </div>

      {/* Quality options */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mediaType}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {formats.map((fmt) => {
            const isSelected = selectedFormat?.format_id === fmt.format_id;
            const gradient = QUALITY_COLORS[fmt.quality] || "from-gray-400 to-slate-500";

            return (
              <motion.button
                key={fmt.format_id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedFormat(fmt)}
                className={`relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left ${
                  isSelected
                    ? "bg-white/10 border-red-500/50 shadow-lg shadow-red-500/10"
                    : "bg-white/3 border-white/5 hover:border-white/20 hover:bg-white/8"
                }`}
              >
                {/* Quality badge */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <span className="text-white font-bold text-xs text-center leading-tight px-1">
                    {fmt.quality}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold text-sm">
                      {fmt.quality}
                    </span>
                    {fmt.format_note && (
                      <span className="text-white/40 text-xs">{fmt.format_note}</span>
                    )}
                  </div>
                  <div className="text-white/40 text-xs mt-0.5 uppercase tracking-wide">
                    .{fmt.ext}
                  </div>
                  <div className="text-white/30 text-xs mt-1">
                    {formatFileSize(fmt.filesize)}
                  </div>
                </div>

                {/* Selected checkmark */}
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-red-400 flex-shrink-0" />
                )}

                {/* Best badge */}
                {fmt === formats[0] && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 text-[10px] font-bold rounded-full">
                    BEST
                  </span>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
