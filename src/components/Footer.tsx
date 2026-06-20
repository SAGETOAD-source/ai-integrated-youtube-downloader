// ============================================================
// Footer Component
// Site footer with links, tech stack badges, and legal text.
// ============================================================

import { motion } from "framer-motion";
import { Download, Heart } from "lucide-react";

const TECH_STACK = [
  { name: "React 19", color: "bg-blue-500/15 text-blue-300 border-blue-500/20" },
  { name: "FastAPI", color: "bg-green-500/15 text-green-300 border-green-500/20" },
  { name: "yt-dlp", color: "bg-red-500/15 text-red-300 border-red-500/20" },
  { name: "FFmpeg", color: "bg-orange-500/15 text-orange-300 border-orange-500/20" },
  { name: "OpenAI GPT-4o", color: "bg-purple-500/15 text-purple-300 border-purple-500/20" },
  { name: "Tailwind CSS", color: "bg-cyan-500/15 text-cyan-300 border-cyan-500/20" },
  { name: "Framer Motion", color: "bg-pink-500/15 text-pink-300 border-pink-500/20" },
  { name: "Vite", color: "bg-yellow-500/15 text-yellow-300 border-yellow-500/20" },
];

const LINKS = {
  Product: ["Features", "How It Works", "API Docs", "Changelog"],
  Developer: ["GitHub Repository", "FastAPI Docs", "OpenAPI Spec", "Swagger UI"],
  Legal: ["Privacy Policy", "Terms of Service", "DMCA Policy", "Cookie Policy"],
  Support: ["FAQ", "Contact Us", "Bug Report", "Feature Request"],
};

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                <Download className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl">
                YT<span className="text-red-400">Grab</span>{" "}
                <span className="text-xs bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text font-semibold">
                  PRO
                </span>
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">
              The most powerful YouTube downloader, built with modern tech and AI intelligence.
              Download any video as MP3 or MP4 in seconds.
            </p>

            {/* Tech stack badges */}
            <div className="flex flex-wrap gap-2">
              {TECH_STACK.map((tech) => (
                <span
                  key={tech.name}
                  className={`px-2.5 py-1 text-xs font-medium rounded-full border ${tech.color}`}
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-white/40 hover:text-white text-sm transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5"
        >
          <p className="text-white/30 text-sm">
            © 2024 YTGrab Pro. All rights reserved.
          </p>
          <p className="text-white/30 text-sm flex items-center gap-2">
            Built with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using FastAPI + React + yt-dlp
          </p>
          <p className="text-white/20 text-xs text-center sm:text-right max-w-xs">
            For personal use only. Respect copyright laws.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
