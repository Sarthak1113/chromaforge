"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAtomValue } from "jotai";
import { paletteAtom } from "@/atoms/palette.atoms";
import { Eye, ArrowRight, CheckCircle2, TrendingUp, Sparkles, Layout } from "lucide-react";

export function VisualizerShowcaseSection() {
  const palette = useAtomValue(paletteAtom);

  // Extract swatches for live preview
  const c1 = palette[0]?.hex || "#10b981";
  const c2 = palette[1]?.hex || "#06b6d4";
  const c3 = palette[2]?.hex || "#6366f1";
  const c4 = palette[3]?.hex || "#f59e0b";
  const c5 = palette[4]?.hex || "#ec4899";

  return (
    <section className="w-full bg-zinc-950 py-20 px-6 border-t border-zinc-800/80 select-none">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <Layout className="w-3.5 h-3.5" />
            <span>Contextual Design Previews</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            Swatches on cards don&apos;t tell the whole story.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Real interfaces do.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            A primary accent might look stunning in isolation, but fail completely when applied to a data table header or a pill button. Color-Mint pressure-tests your palette against live components in real time.
          </p>
        </div>

        {/* Live UI Simulator Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 shadow-2xl space-y-8">
          {/* Top Bar with Live Palette Indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
            <div className="space-y-1">
              <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                Live Simulator (Powered by your active palette)
              </div>
              <div className="text-sm font-bold text-zinc-200">
                SaaS Analytics Dashboard &amp; Mobile UI Test
              </div>
            </div>

            {/* Mini Swatches Preview */}
            <div className="flex items-center space-x-1.5 p-1.5 rounded-xl bg-zinc-950 border border-zinc-800">
              {palette.map((color) => (
                <div
                  key={color.id}
                  className="w-5 h-5 rounded-lg shadow-sm"
                  style={{ backgroundColor: color.hex }}
                  title={`${color.name} (${color.hex})`}
                />
              ))}
            </div>
          </div>

          {/* Interactive Mock Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Metric Card 1 */}
            <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Monthly Recurring Revenue</span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono text-zinc-900"
                  style={{ backgroundColor: c1 }}
                >
                  +18.4%
                </span>
              </div>
              <div className="text-2xl font-black text-zinc-100">$84,230</div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: "74%", backgroundColor: c1 }} />
              </div>
            </div>

            {/* Metric Card 2 */}
            <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Active Designers</span>
                <TrendingUp className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="text-2xl font-black text-zinc-100">14,920</div>
              <div className="flex items-center space-x-2 text-xs">
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: c2 }}
                />
                <span className="text-zinc-400">Synchronized tokens</span>
              </div>
            </div>

            {/* Action Card 3 */}
            <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-xs text-zinc-400">Call to Action Test</div>
                <div className="text-sm font-bold text-zinc-200 mt-1">
                  Primary &amp; Ghost Buttons
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-zinc-950 shadow-sm transition-transform active:scale-95"
                  style={{ backgroundColor: c1 }}
                >
                  Upgrade
                </button>
                <button
                  type="button"
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-colors"
                  style={{ borderColor: c2, color: c2 }}
                >
                  Details
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Features Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs text-zinc-400">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full dark &amp; light theme stress testing</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Ocular deficiency simulations (Protanopia / Tritanopia)</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>5 viewports: SaaS, Mobile, Branding, Pattern, Typography</span>
            </div>
          </div>
        </div>

        {/* Section Action */}
        <div className="text-center">
          <Link
            href="/visualizer"
            className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-600/25 transition-all cursor-pointer"
          >
            <span>Try Interactive Visualizer on Full Screens</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
