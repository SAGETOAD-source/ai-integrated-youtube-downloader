// ============================================================
// VideoInfoCard Component
// Displays fetched video metadata: thumbnail, title, uploader,
// duration, views, and upload date.
// ============================================================

import { motion } from "framer-motion";
import { Clock, Eye, User, Calendar } from "lucide-react";
import type { VideoInfo } from "../types";
import { formatDuration, formatViews } from "../hooks/useDownloader";

interface VideoInfoCardProps {
  info: VideoInfo;
}

export default function VideoInfoCard({ info }: VideoInfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row gap-0">
        {/* Thumbnail */}
        <div className="relative sm:w-64 flex-shrink-0">
          <img
            src={info.thumbnail}
            alt={info.title}
            className="w-full h-48 sm:h-full object-cover"
          />
          {/* Duration badge */}
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 backdrop-blur-sm text-white text-xs font-semibold rounded-lg">
            {formatDuration(info.duration)}
          </div>
          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40">
            <div className="w-14 h-14 bg-red-600/90 rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white ml-1">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 p-6">
          {/* Title */}
          <h3 className="text-white font-bold text-lg leading-snug mb-3 line-clamp-2">
            {info.title}
          </h3>

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <User className="w-4 h-4 text-red-400" />
              <span className="truncate">{info.uploader}</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Eye className="w-4 h-4 text-blue-400" />
              <span>{formatViews(info.view_count)} views</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Clock className="w-4 h-4 text-green-400" />
              <span>{formatDuration(info.duration)}</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>{info.upload_date}</span>
            </div>
          </div>

          {/* Description preview */}
          <p className="text-white/40 text-xs line-clamp-2 leading-relaxed">
            {info.description}
          </p>

          {/* Format availability badges */}
          <div className="flex gap-2 mt-4">
            <span className="px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold rounded-full">
              MP4 Available
            </span>
            <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-semibold rounded-full">
              MP3 Available
            </span>
            <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-semibold rounded-full">
              HD Ready
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
