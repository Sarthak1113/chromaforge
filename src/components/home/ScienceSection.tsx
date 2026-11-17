"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, AlertCircle, Sparkles, Layers } from "lucide-react";
import { motion } from "framer-motion";

export function ScienceSection() {
  const [activeModel, setActiveModel] = useState<"oklch" | "hsl">("oklch");

  return (
    <section className="w-full bg-zinc-950 py-12 sm:py-16 px-6 select-none border-t border-zinc-900">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 text-xs font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Perceptual Difference</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            Traditional color pickers distort human vision.{" "}
            <span className="text-emerald-400">OKLCH fixes the math.</span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Legacy models like HSL and sRGB assume all hues at 50% lightness appear equally bright to humans. In reality, your eyes perceive yellow nearly four times brighter than blue. OKLCH maps color directly to the human visual cortex.
          </p>
        </div>

        {/* Asymmetrical 2-Column Scientific Comparator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Left Column: Core Insight Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="flex items-center space-x-2.5 text-amber-400 font-semibold text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <h3 className="font-heading font-bold text-zinc-100">The HSL Flaw</h3>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                In standard HSL, <code className="text-amber-300 font-mono text-xs">hsl(60, 100%, 50%)</code> (yellow) and <code className="text-amber-300 font-mono text-xs">hsl(240, 100%, 50%)</code> (blue) claim equal lightness. Your retina perceives yellow at ~93% luminance and blue at ~26%. HSL completely ignores perceived contrast.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-emerald-500/30 space-y-3">
              <div className="flex items-center space-x-2.5 text-emerald-400 font-semibold text-sm">
                <Check className="w-4 h-4 shrink-0" />
                <h3 className="font-heading font-bold text-zinc-100">The OKLCH Solution</h3>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Developed by Björn Ottosson, OKLCH normalizes lightness across all 360 degrees of hue. An OKLCH lightness value of <code className="text-emerald-400 font-mono text-xs">0.70</code> produces identical perceived brightness whether the color is pure emerald, electric cyan, or deep ruby.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="flex items-center space-x-2.5 text-zinc-300 font-semibold text-sm">
                <Layers className="w-4 h-4 shrink-0 text-zinc-400" />
                <h3 className="font-heading font-bold text-zinc-100">Native CSS Level 4</h3>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Natively supported across all modern browsers. Write <code className="text-zinc-200 font-mono text-xs">color: oklch(0.7 0.18 150)</code> directly in your stylesheets without JavaScript polyfills or build-time overhead.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Diagnostic Workbench (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between space-y-6 shadow-xl">
            {/* Top Bar with Model Switcher */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="space-y-0.5">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Perceptual Luminance Test</span>
                <div className="text-sm font-bold text-zinc-100">
                  {activeModel === "oklch" ? "OKLCH: Uniform Human Luminance" : "HSL: Severe Luminance Distortion"}
                </div>
              </div>

              <div className="flex items-center space-x-1 p-1 rounded-xl bg-zinc-950 border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setActiveModel("oklch")}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    activeModel === "oklch"
                      ? "bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  OKLCH
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModel("hsl")}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    activeModel === "hsl"
                      ? "bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Legacy HSL
                </button>
              </div>
            </div>

            {/* Visualizer Display Area */}
            {activeModel === "oklch" ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>Hue distribution at L=0.72 (Constant Lightness)</span>
                    <span className="text-emerald-400 font-bold">ΔL = 0.00 (Zero Drift)</span>
                  </div>
                  <div className="h-12 rounded-xl overflow-hidden flex shadow-inner border border-zinc-800">
                    <div className="flex-1 bg-[oklch(0.72_0.20_145)] flex items-center justify-center text-[10px] font-mono font-bold text-zinc-950">
                      Mint 72%
                    </div>
                    <div className="flex-1 bg-[oklch(0.72_0.20_210)] flex items-center justify-center text-[10px] font-mono font-bold text-zinc-950">
                      Teal 72%
                    </div>
                    <div className="flex-1 bg-[oklch(0.72_0.20_280)] flex items-center justify-center text-[10px] font-mono font-bold text-zinc-950">
                      Blue 72%
                    </div>
                    <div className="flex-1 bg-[oklch(0.72_0.20_340)] flex items-center justify-center text-[10px] font-mono font-bold text-zinc-950">
                      Rose 72%
                    </div>
                    <div className="flex-1 bg-[oklch(0.72_0.20_50)] flex items-center justify-center text-[10px] font-mono font-bold text-zinc-950">
                      Amber 72%
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                  <div className="text-xs font-mono text-zinc-400">Why this matters for your UI:</div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    When you swap accent colors in OKLCH, contrast against background surfaces remains completely invariant. You never need to recalculate text contrast or adjust border opacities when switching brand themes.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>Nominal L=50% in HSL (Human Retina Perception)</span>
                    <span className="text-amber-400 font-bold">ΔL = 67% (Severe Clashing)</span>
                  </div>
                  <div className="h-12 rounded-xl overflow-hidden flex shadow-inner border border-zinc-800">
                    <div className="w-1/2 bg-[#ffff00] flex items-center justify-center text-[11px] font-mono font-bold text-zinc-950">
                      Yellow (Perceived 93%)
                    </div>
                    <div className="w-1/2 bg-[#0000ff] flex items-center justify-center text-[11px] font-mono font-bold text-white">
                      Blue (Perceived 26%)
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                  <div className="text-xs font-mono text-zinc-400">The Problem in Production:</div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    White text passes on blue with an 8.6:1 ratio, but fails catastrophically on yellow with an unreadable 1.1:1 ratio—even though both colors claim &quot;50% Lightness&quot; in HSL.
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Action Strip */}
            <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-zinc-400">Audit your current brand colors with WCAG AAA &amp; APCA</span>
              <Link
                href="/contrast"
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all cursor-pointer group"
              >
                <span>Audit Contrast with APCA</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
