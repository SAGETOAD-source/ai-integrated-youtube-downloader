// ============================================================
// FeaturesSection Component
// Marketing section showing key features of the application.
// ============================================================

import { motion } from "framer-motion";
import {
  Zap,
  Shield,
  Brain,
  Music2,
  MonitorPlay,
  Globe,
  Clock,
  Code2,
} from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "GPT-4o analyzes every video before download — extracting tags, sentiment, and recommending the best quality for your needs.",
    color: "from-purple-500 to-violet-600",
    glow: "shadow-purple-500/20",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "FastAPI backend with async processing ensures downloads complete in seconds. No waiting, no queueing.",
    color: "from-yellow-500 to-orange-500",
    glow: "shadow-yellow-500/20",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "All downloads are processed server-side. Files are auto-deleted after 1 hour. No data is stored permanently.",
    color: "from-green-500 to-emerald-600",
    glow: "shadow-green-500/20",
  },
  {
    icon: Music2,
    title: "MP3 Any Bitrate",
    description: "Convert to MP3 at 128, 192, 256, or 320 kbps. Powered by yt-dlp + FFmpeg for pristine audio quality.",
    color: "from-pink-500 to-rose-600",
    glow: "shadow-pink-500/20",
  },
  {
    icon: MonitorPlay,
    title: "MP4 up to 1080p",
    description: "Download videos in 144p, 360p, 480p, 720p, or 1080p Full HD. Merges best video+audio streams automatically.",
    color: "from-red-500 to-rose-500",
    glow: "shadow-red-500/20",
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    description: "Fully responsive frontend works on desktop, tablet, and mobile. Access from any browser, any device.",
    color: "from-blue-500 to-cyan-500",
    glow: "shadow-blue-500/20",
  },
  {
    icon: Clock,
    title: "Real-Time Progress",
    description: "Live download progress bar with speed and ETA estimates via Server-Sent Events (SSE) from the backend.",
    color: "from-teal-500 to-green-500",
    glow: "shadow-teal-500/20",
  },
  {
    icon: Code2,
    title: "Open REST API",
    description: "Full FastAPI with auto-generated OpenAPI docs. Build your own client or integrate into any application.",
    color: "from-indigo-500 to-blue-600",
    glow: "shadow-indigo-500/20",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-gray-950">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold rounded-full mb-4">
            Why YTGrab Pro?
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Everything you need,{" "}
            <span className="bg-gradient-to-r from-red-400 to-pink-400 text-transparent bg-clip-text">
              nothing you don't
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Built with FastAPI, React, and yt-dlp. AI-enhanced with GPT-4o.
            Production-ready and open source.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative p-6 bg-white/3 hover:bg-white/6 border border-white/5 hover:border-white/15 rounded-3xl transition-all duration-300"
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg ${feature.glow} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-white font-bold text-base mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/45 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover glow */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
