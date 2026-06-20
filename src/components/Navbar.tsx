// ============================================================
// Navbar Component
// Top navigation bar with logo, links, and theme branding.
// ============================================================

import { motion } from "framer-motion";
import { Download, Zap } from "lucide-react";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-black animate-pulse" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              YT<span className="text-red-400">Grab</span>{" "}
              <span className="text-xs font-medium bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                PRO
              </span>
            </span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {["Features", "How It Works", "API Docs", "Pricing"].map((item) => (
              <button
                key={item}
                className="text-white/60 hover:text-white text-sm font-medium transition-colors duration-200"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-white/60 hover:text-white transition-colors text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10"
            >
              GitHub
            </a>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all duration-200 hover:scale-105">
              <Zap className="w-4 h-4" />
              Get API Key
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
