// ============================================================
// App.tsx – Root Application Component
// YTGrab Pro: YouTube Video & Audio Downloader
//
// Built with:
//   - React 19 + TypeScript (Frontend)
//   - Framer Motion (Animations)
//   - Tailwind CSS v4 (Styling)
//   - FastAPI (Backend – see /backend folder)
//   - yt-dlp (YouTube downloading)
//   - FFmpeg (Media conversion)
//   - OpenAI GPT-4o (AI analysis)
//
// Architecture:
//   App → useDownloader hook → FastAPI endpoints → yt-dlp + FFmpeg
// ============================================================

import { Toaster, toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import DownloadSection from "./components/DownloadSection";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import APIDocsSection from "./components/APIDocsSection";
import Footer from "./components/Footer";
import ManualPage from "./components/ManualPage";
import { useDownloader } from "./hooks/useDownloader";

export default function App() {
  const [showManual, setShowManual] = useState(false);

  const {
    url,
    setUrl,
    status,
    videoInfo,
    aiAnalysis,
    selectedFormat,
    setSelectedFormat,
    mediaType,
    setMediaType,
    downloadProgress,
    error,
    isAnalyzing,
    fetchVideoInfo,
    startDownload,
    reset,
  } = useDownloader();

  // Show toast notifications based on status changes
  useEffect(() => {
    if (status === "ready" && videoInfo) {
      toast.success("Video info loaded! Choose your format.", {
        style: { background: "#1a1a2e", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" },
        iconTheme: { primary: "#ef4444", secondary: "#fff" },
      });
    }
    if (status === "complete") {
      toast.success("Download complete! 🎉", {
        style: { background: "#1a1a2e", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" },
        iconTheme: { primary: "#22c55e", secondary: "#fff" },
        duration: 5000,
      });
    }
    if (status === "error" && error) {
      toast.error(error.slice(0, 80), {
        style: { background: "#1a1a2e", color: "#fff", border: "1px solid rgba(255,100,100,0.3)" },
      });
    }
  }, [status, error, videoInfo]);

  const handleFetch = (videoUrl: string) => {
    fetchVideoInfo(videoUrl);
    // Smooth scroll to download section after a short delay
    setTimeout(() => {
      const el = document.getElementById("download-section");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-950 font-['Inter',sans-serif]">
      {/* Toast notifications */}
      <Toaster position="top-right" />

      {/* Navigation */}
      <Navbar />

      {/* Hero with URL input */}
      <HeroSection
        url={url}
        setUrl={setUrl}
        onFetch={handleFetch}
        isLoading={status === "fetching_info"}
      />

      {/* Download interface (shown after URL is submitted) */}
      {status !== "idle" && (
        <div id="download-section">
          <DownloadSection
            videoInfo={videoInfo}
            aiAnalysis={aiAnalysis}
            isAnalyzing={isAnalyzing}
            status={status}
            selectedFormat={selectedFormat}
            setSelectedFormat={setSelectedFormat}
            mediaType={mediaType}
            setMediaType={setMediaType}
            progress={downloadProgress}
            error={error}
            onDownload={startDownload}
            onReset={reset}
          />
        </div>
      )}

      {/* Features grid */}
      <FeaturesSection />

      {/* How it works */}
      <HowItWorksSection />

      {/* API documentation */}
      <APIDocsSection />

      {/* Footer */}
      <Footer />

      {/* Manual Page (full-screen overlay) */}
      <AnimatePresence>
        {showManual && <ManualPage onClose={() => setShowManual(false)} />}
      </AnimatePresence>

      {/* Floating manual button */}
      <button
        onClick={() => setShowManual(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-2xl shadow-2xl shadow-purple-500/30 hover:scale-105 transition-all duration-200 hover:shadow-purple-500/50"
        title="Open Technical Manual"
      >
        <BookOpen className="w-4 h-4" />
        <span className="hidden sm:inline">Technical Manual</span>
      </button>
    </div>
  );
}
