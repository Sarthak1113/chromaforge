"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Layers, Eye, Image as ImageIcon, Compass, ArrowRight } from "lucide-react";

export function ToolsBentoSection() {
  return (
    <section className="w-full bg-zinc-950 py-12 sm:py-16 px-6 select-none border-t border-zinc-900">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 text-xs font-mono uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>The Color-Mint Suite</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            Every tool required to engineer{" "}
            <span className="text-emerald-400">production-ready palettes.</span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Eliminate fragmented tools. Color-Mint integrates perceptual harmony, APCA contrast validation, Bézier gradients, and live component previews into one client-side workbench.
          </p>
        </div>

        {/* 21st-Inspired Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          {/* Card 1: Contrast Checker (Span 7) */}
          <div className="group md:col-span-7 rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-zinc-700 transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30">
                  WCAG AAA &amp; APCA
                </span>
              </div>

              <div>
                <h3 className="font-heading text-xl font-bold text-zinc-100">Contrast Checker</h3>
                <p className="text-xs font-mono text-emerald-400 mt-0.5">Spatial Frequency &amp; Polarity Validation</p>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Evaluate relative luminance ratios for small and large typography in real time. Switch between traditional WCAG 4.5:1 ratios and modern APCA scores that account for font weight, size, and display polarity.
              </p>
            </div>

            {/* Interactive Preview Widget */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-[11px] font-mono text-zinc-400">Contrast Ratio</div>
                <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="font-mono text-base">8.42:1</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    AAA Pass
                  </span>
                </div>
              </div>
              <Link
                href="/contrast"
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-all hover:text-white cursor-pointer group/btn"
              >
                <span>Launch Contrast Checker</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 2: Gradient Studio (Span 5) */}
          <div className="group md:col-span-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-zinc-700 transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-teal-400">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-400 font-semibold border border-teal-500/30">
                  in oklch
                </span>
              </div>

              <div>
                <h3 className="font-heading text-xl font-bold text-zinc-100">Gradient Studio</h3>
                <p className="text-xs font-mono text-teal-400 mt-0.5">Zero Midtone Desaturation</p>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Standard sRGB gradients collapse into muddy gray midtones. Color-Mint interpolates along polar Bézier splines in OKLCH, keeping transitions saturated and luminous.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="h-8 rounded-lg overflow-hidden border border-zinc-800 bg-[linear-gradient(90deg,oklch(0.7_0.2_150),oklch(0.75_0.18_200),oklch(0.65_0.22_280))]" />
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-500">Bézier Spline Mode</span>
                <Link
                  href="/gradients"
                  className="flex items-center space-x-1 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors group/link"
                >
                  <span>Launch Gradient Studio</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Palette Visualizer (Span 4) */}
          <div className="group md:col-span-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 flex flex-col justify-between space-y-5 hover:border-zinc-700 transition-colors">
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-cyan-400">
                <Eye className="w-4 h-4" />
              </div>
              <h3 className="font-heading text-lg font-bold text-zinc-100">UI Visualizer</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Test colors on live interactive buttons, cards, typography ramps, and dashboard layouts before writing CSS.
              </p>
            </div>

            <Link
              href="/visualizer"
              className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-colors group/btn"
            >
              <span>Launch UI Visualizer</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform text-cyan-400" />
            </Link>
          </div>

          {/* Card 4: Image Extractor (Span 4) */}
          <div className="group md:col-span-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 flex flex-col justify-between space-y-5 hover:border-zinc-700 transition-colors">
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-emerald-400">
                <ImageIcon className="w-4 h-4" />
              </div>
              <h3 className="font-heading text-lg font-bold text-zinc-100">Image Extractor</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Drop in brand photography or reference art. In-browser clustering extracts dominant OKLCH swatches with zero server upload.
              </p>
            </div>

            <Link
              href="/image-picker"
              className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-colors group/btn"
            >
              <span>Extract Image Swatches</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform text-emerald-400" />
            </Link>
          </div>

          {/* Card 5: Curated Library (Span 4) */}
          <div className="group md:col-span-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 flex flex-col justify-between space-y-5 hover:border-zinc-700 transition-colors">
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-indigo-400">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="font-heading text-lg font-bold text-zinc-100">Curated Library</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Explore 240+ harmonic schemes categorized by aesthetic mood: Minimalist, Cyberpunk, Editorial, and Architectural.
              </p>
            </div>

            <Link
              href="/explore"
              className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-colors group/btn"
            >
              <span>Explore Curated Library</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform text-indigo-400" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
