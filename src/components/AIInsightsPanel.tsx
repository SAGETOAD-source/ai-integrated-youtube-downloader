// ============================================================
// AIInsightsPanel Component
// Displays AI-generated analysis of the YouTube video.
// Shows summary, recommended quality, tags, category & sentiment.
// This data comes from the FastAPI /api/ai/analyze endpoint
// which uses OpenAI GPT to analyze video metadata.
// ============================================================

import { motion } from "framer-motion";
import { Brain, Star, Tag, Layers, Loader2 } from "lucide-react";
import type { AIAnalysis } from "../types";

interface AIInsightsPanelProps {
  analysis: AIAnalysis | null;
  isAnalyzing: boolean;
}

// Sentiment icon/color mapping
const SENTIMENT_CONFIG: Record<string, { color: string; emoji: string }> = {
  "Positive & Energetic": { color: "text-green-400", emoji: "⚡" },
  "Positive": { color: "text-green-400", emoji: "😊" },
  "Neutral": { color: "text-blue-400", emoji: "😐" },
  "Negative": { color: "text-red-400", emoji: "😞" },
};

export default function AIInsightsPanel({ analysis, isAnalyzing }: AIInsightsPanelProps) {
  const sentimentConf = analysis
    ? SENTIMENT_CONFIG[analysis.sentiment] ?? { color: "text-white/60", emoji: "🤖" }
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden"
    >
      {/* AI glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />

      <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2 relative">
        <Brain className="w-5 h-5 text-purple-400" />
        AI Insights
        <span className="ml-auto px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs font-semibold rounded-full">
          GPT-4o
        </span>
      </h3>

      {/* Loading state */}
      {isAnalyzing && !analysis && (
        <div className="flex flex-col items-center justify-center py-8 gap-4">
          <div className="relative">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            <div className="absolute inset-0 w-8 h-8 bg-purple-400/20 rounded-full animate-ping" />
          </div>
          <div className="text-center">
            <p className="text-white/60 text-sm font-medium">AI is analyzing video...</p>
            <p className="text-white/30 text-xs mt-1">Extracting insights with GPT-4o</p>
          </div>
          {/* Shimmer placeholders */}
          <div className="w-full space-y-3 mt-2">
            {[100, 80, 60].map((w) => (
              <div
                key={w}
                className="h-4 bg-white/5 rounded-full animate-pulse"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Analysis content */}
      {analysis && (
        <div className="space-y-5 relative">
          {/* Summary */}
          <div>
            <div className="flex items-center gap-2 text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5" />
              Summary
            </div>
            <p className="text-white/80 text-sm leading-relaxed">{analysis.summary}</p>
          </div>

          {/* Recommended quality */}
          <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
            <Star className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <div>
              <p className="text-yellow-400 text-xs font-semibold uppercase tracking-wide">
                AI Recommended Quality
              </p>
              <p className="text-white font-bold">{analysis.recommended_quality}</p>
            </div>
          </div>

          {/* Category & Sentiment */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/3 rounded-xl border border-white/5">
              <p className="text-white/40 text-xs mb-1">Category</p>
              <p className="text-white text-sm font-semibold">{analysis.category}</p>
            </div>
            <div className="p-3 bg-white/3 rounded-xl border border-white/5">
              <p className="text-white/40 text-xs mb-1">Sentiment</p>
              <p className={`text-sm font-semibold ${sentimentConf?.color}`}>
                {sentimentConf?.emoji} {analysis.sentiment}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center gap-2 text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">
              <Tag className="w-3.5 h-3.5" />
              AI Tags
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-purple-500/15 border border-purple-500/20 text-purple-300 text-xs font-medium rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Placeholder when not yet analyzing */}
      {!isAnalyzing && !analysis && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Brain className="w-12 h-12 text-white/10 mb-3" />
          <p className="text-white/30 text-sm">AI analysis will appear after fetching video info</p>
        </div>
      )}
    </motion.div>
  );
}
