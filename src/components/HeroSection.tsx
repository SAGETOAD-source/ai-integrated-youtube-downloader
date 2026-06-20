// ============================================================
// HeroSection Component
// Main landing hero with animated gradient background,
// floating particles, and the primary URL input form.
// ============================================================

import { motion } from "framer-motion";
import { Search, Sparkles, Shield, Globe, Cpu } from "lucide-react";
import { useState } from "react";

interface HeroSectionProps {
  url: string;
  setUrl: (url: string) => void;
  onFetch: (url: string) => void;
  isLoading: boolean;
}

// Stats displayed beneath the hero heading
const STATS = [
  { icon: Globe, label: "Countries", value: "195+" },
  { icon: Shield, label: "Secure Downloads", value: "100%" },
  { icon: Cpu, label: "AI Powered", value: "v2.0" },
];

// Floating particles config
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  delay: Math.random() * 4,
  duration: Math.random() * 6 + 6,
}));

export default function HeroSection({ url, setUrl, onFetch, isLoading }: HeroSectionProps) {
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFetch(url);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch {
      // clipboard access denied
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950" />
      
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Glowing orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-3xl"
      />

      {/* Floating particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/20"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [-20, 20, -20], opacity: [0, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 mb-8 backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>AI-Powered Video Intelligence</span>
          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold">NEW</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
        >
          Download YouTube
          <br />
          <span className="bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 text-transparent bg-clip-text">
            Videos & Music
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-white/50 text-lg sm:text-xl mb-12 max-w-2xl mx-auto"
        >
          Convert any YouTube video to MP3 or MP4 in any quality.
          Powered by FastAPI + AI intelligence for the best experience.
        </motion.p>

        {/* URL Input Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onSubmit={handleSubmit}
          className="relative max-w-2xl mx-auto mb-12"
        >
          <div
            className={`relative rounded-2xl transition-all duration-300 ${
              focused
                ? "shadow-2xl shadow-red-500/20 ring-2 ring-red-500/50"
                : "shadow-xl shadow-black/50"
            }`}
          >
            {/* Input background */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10" />

            {/* YouTube icon */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                  <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.04 0 11.99 0 11.99s0 3.95.5 5.8a3.02 3.02 0 0 0 2.12 2.14C4.46 20.48 12 20.48 12 20.48s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14c.5-1.85.5-5.8.5-5.8s0-3.95-.5-5.8zM9.75 15.5v-7l6.25 3.5-6.25 3.5z" />
                </svg>
              </div>
            </div>

            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Paste YouTube URL here... (e.g. https://youtube.com/watch?v=...)"
              className="relative w-full bg-transparent text-white placeholder-white/30 pl-16 pr-36 py-5 text-sm rounded-2xl outline-none"
            />

            {/* Action buttons */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
              <button
                type="button"
                onClick={handlePaste}
                className="px-3 py-2 text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
              >
                Paste
              </button>
              <button
                type="submit"
                disabled={isLoading || !url}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              >
                <Search className="w-4 h-4" />
                {isLoading ? "Loading..." : "Analyze"}
              </button>
            </div>
          </div>

          {/* Example URLs */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <span className="text-white/30 text-xs">Try:</span>
            {[
              "https://youtube.com/watch?v=dQw4w9WgXcQ",
              "https://youtu.be/jNQXAC9IVRw",
            ].map((exUrl) => (
              <button
                key={exUrl}
                type="button"
                onClick={() => setUrl(exUrl)}
                className="text-white/40 hover:text-red-400 text-xs transition-colors underline underline-offset-2"
              >
                {exUrl.slice(0, 35)}...
              </button>
            ))}
          </div>
        </motion.form>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-6 sm:gap-12"
        >
          {STATS.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-white/60" />
              </div>
              <div className="text-left">
                <div className="text-white font-bold text-lg">{value}</div>
                <div className="text-white/40 text-xs">{label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-2"
        >
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
