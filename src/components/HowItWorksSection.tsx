// ============================================================
// HowItWorksSection Component
// Step-by-step visual guide showing the download process.
// ============================================================

import { motion } from "framer-motion";
import { Link2, Settings2, Download, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Link2,
    title: "Paste URL",
    description: "Copy any YouTube video URL and paste it into the input field above.",
    color: "from-red-500 to-pink-500",
  },
  {
    number: "02",
    icon: Settings2,
    title: "Choose Quality",
    description: "Select MP3 or MP4, then pick your desired quality from the available options.",
    color: "from-purple-500 to-violet-500",
  },
  {
    number: "03",
    icon: Download,
    title: "Download",
    description: "Hit the download button. Our FastAPI backend processes it instantly.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Enjoy!",
    description: "Your file is ready. Listen or watch offline, anytime, anywhere.",
    color: "from-green-500 to-emerald-500",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-950 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold rounded-full mb-4">
            Simple as 1-2-3
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            How it{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
              works
            </span>
          </h2>
          <p className="text-white/50 text-lg">Four easy steps to get your content</p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-red-500/20 via-purple-500/40 to-green-500/20" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Step number + icon */}
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-7 h-7 bg-gray-900 border border-white/10 rounded-full flex items-center justify-center">
                      <span className="text-white/60 text-xs font-bold">{step.number}</span>
                    </div>
                  </div>

                  <h3 className="text-white font-bold text-xl mb-3">{step.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Architecture diagram */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-20 p-8 bg-white/3 border border-white/10 rounded-3xl"
        >
          <h3 className="text-white font-bold text-xl mb-6 text-center">System Architecture</h3>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            {[
              { label: "React + Vite", sub: "Frontend UI", color: "bg-blue-500/20 border-blue-500/30 text-blue-300" },
              { label: "→", sub: "", color: "text-white/30" },
              { label: "FastAPI", sub: "REST Backend", color: "bg-green-500/20 border-green-500/30 text-green-300" },
              { label: "→", sub: "", color: "text-white/30" },
              { label: "yt-dlp", sub: "Downloader", color: "bg-red-500/20 border-red-500/30 text-red-300" },
              { label: "→", sub: "", color: "text-white/30" },
              { label: "FFmpeg", sub: "Converter", color: "bg-orange-500/20 border-orange-500/30 text-orange-300" },
              { label: "→", sub: "", color: "text-white/30" },
              { label: "OpenAI API", sub: "AI Analysis", color: "bg-purple-500/20 border-purple-500/30 text-purple-300" },
            ].map((item, i) =>
              item.sub ? (
                <div
                  key={i}
                  className={`px-4 py-3 rounded-xl border ${item.color} text-center min-w-[90px]`}
                >
                  <div className="font-bold">{item.label}</div>
                  <div className="opacity-60 text-xs mt-0.5">{item.sub}</div>
                </div>
              ) : (
                <span key={i} className={`text-2xl font-bold ${item.color}`}>
                  {item.label}
                </span>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
