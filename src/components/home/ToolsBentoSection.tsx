"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Layers,
  Eye,
  Image as ImageIcon,
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

export function ToolsBentoSection() {
  return (
    <section className="w-full bg-zinc-950 py-20 px-6 border-t border-zinc-800/80 select-none">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>The Color-Mint Utility Suite</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            Everything you need from moodboard to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              design token handoff.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Stop switching between five disjointed browser tabs. Color-Mint unites contrast auditing, procedural gradient generation, and live UI previewing into one high-performance studio.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: Contrast Checker (Span 7) */}
          <div className="md:col-span-7 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-zinc-700 transition-colors group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  WCAG AAA &amp; APCA
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-zinc-100 group-hover:text-white transition-colors">
                  Contrast Checker
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-indigo-400 mt-1">
                  WCAG 2.1 AAA &amp; APCA Compliance Without Guesswork
                </p>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Calculate relative luminance ratios for normal and large typography in real-time. Toggle between traditional WCAG 4.5:1 ratios and modern spatial-frequency APCA scores that account for font weight, size, and dark-mode polarity.
              </p>
            </div>

            {/* Interactive Preview Element */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-[11px] text-zinc-400 font-medium">Headline Contrast Score</div>
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Passes Level AAA (8.4:1)</span>
                </div>
              </div>
              <Link
                href="/contrast"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-700/80 transition-all hover:text-white cursor-pointer"
              >
                <span>Launch Checker</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Gradient Studio (Span 5) */}
          <div className="md:col-span-5 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-zinc-700 transition-colors group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-400 font-semibold border border-teal-500/30">
                  in oklch
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-zinc-100 group-hover:text-white transition-colors">
                  Gradient Studio
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-teal-400 mt-1">
                  Kill the Gray Dead Zone forever
                </p>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                When standard gradients cross opposite hues in sRGB, they collapse into lifeless gray. Color-Mint curves transitions along polar Bézier splines and Voronoi noise in OKLCH, keeping midpoints lush and vibrant.
              </p>
            </div>

            {/* Live Gradient Preview Bar */}
            <div className="space-y-3">
              <div className="h-10 rounded-xl overflow-hidden shadow-inner border border-zinc-800 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500" />
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-500">Bézier Spline Mesh</span>
                <Link
                  href="/gradients"
                  className="flex items-center space-x-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors"
                >
                  <span>Open Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Palette Visualizer (Span 5) */}
          <div className="md:col-span-5 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-zinc-700 transition-colors group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Eye className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30">
                  Live UI Mockups
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-zinc-100 group-hover:text-white transition-colors">
                  Palette Visualizer
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-cyan-400 mt-1">
                  Preview tokens on real interfaces
                </p>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Never ship an unreadable UI again. Map your swatches directly into live SaaS analytics dashboards, mobile interfaces, typography scales, and brand identity mockups before pushing code.
              </p>
            </div>

            <Link
              href="/visualizer"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 transition-all"
            >
              <span>Test on Live UI Mockups</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </Link>
          </div>

          {/* Card 4: Image Extractor (Span 4) */}
          <div className="md:col-span-4 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-zinc-700 transition-colors group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  Auto-Cluster
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-zinc-100 group-hover:text-white transition-colors">
                  Image Extractor
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-emerald-400 mt-1">
                  Turn photos into harmonic palettes
                </p>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Drag and drop brand photography, architectural shots, or landscape stills. Our local canvas clustering engine isolates dominant clusters and translates them into balanced OKLCH swatches in milliseconds.
              </p>
            </div>

            <Link
              href="/image-picker"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 transition-all"
            >
              <span>Extract Image Swatches</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </Link>
          </div>

          {/* Card 5: Curated Library (Span 3) */}
          <div className="md:col-span-3 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-zinc-700 transition-colors group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400 font-semibold border border-purple-500/30">
                  240+ Themes
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-zinc-100 group-hover:text-white transition-colors">
                  Curated Library
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-purple-400 mt-1">
                  Hand-crafted color systems
                </p>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Browse color systems curated across Cyberpunk, Minimalist, Sunset, Vintage, and Enterprise aesthetic moods.
              </p>
            </div>

            <Link
              href="/explore"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 transition-all"
            >
              <span>Browse 240+</span>
              <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
