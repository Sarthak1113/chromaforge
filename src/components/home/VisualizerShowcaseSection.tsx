"use client";

import React from "react";
import Link from "next/link";
import { useAtomValue } from "jotai";
import { paletteAtom } from "@/atoms/palette.atoms";
import { Eye, Check, ArrowRight, BarChart3 } from "lucide-react";

export function VisualizerShowcaseSection() {
  const palette = useAtomValue(paletteAtom);

  // Extract swatches for live preview
  const c1 = palette[0]?.hex || "#10b981";
  const c2 = palette[1]?.hex || "#06b6d4";
  const c3 = palette[2]?.hex || "#6366f1";

  return (
    <section className="w-full bg-zinc-950 py-12 sm:py-16 px-6 select-none border-t border-zinc-900">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <Eye className="w-3.5 h-3.5" />
            <span>Contextual Previews</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            Swatches on cards don&apos;t tell the whole story.{" "}
            <span className="text-cyan-400">Real interfaces do.</span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            A primary accent might look balanced in isolation, but fail on an active button or navigation pill. Test your primary, surface, and semantic colors against realistic UI layouts in real time.
          </p>
        </div>

        {/* Live UI Simulator Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/70 border border-zinc-800 shadow-xl space-y-6">
          {/* Top Bar with Live Palette Indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
            <div className="space-y-0.5">
              <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                Live Interface Preview (Reactive to Generator)
              </div>
              <div className="text-sm font-bold text-zinc-200">
                SaaS Dashboard &amp; Mobile Component Simulator
              </div>
            </div>

            {/* Mini Swatches Preview */}
            <div className="flex items-center space-x-1.5 p-1 rounded-lg bg-zinc-950 border border-zinc-800">
              {palette.map((color) => (
                <div
                  key={color.id}
                  className="w-4 h-4 rounded shadow-xs"
                  style={{ backgroundColor: color.hex }}
                  title={`${color.name} (${color.hex})`}
                />
              ))}
            </div>
          </div>

          {/* Miniature UI Canvas Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Widget 1: Primary Action Button & Status Pill */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Interactive States</span>
              <div className="space-y-3">
                <button
                  type="button"
                  style={{ backgroundColor: c1 }}
                  className="w-full py-2.5 rounded-xl text-zinc-950 font-bold text-xs shadow-md transition-opacity hover:opacity-90"
                >
                  Primary CTA Button
                </button>
                <div
                  style={{ backgroundColor: `${c2}18`, borderColor: `${c2}40`, color: c2 }}
                  className="w-full py-2 px-3 rounded-lg border text-center font-mono text-xs font-semibold"
                >
                  Active Semantic Badge
                </div>
              </div>
            </div>

            {/* Widget 2: Metric Analytics Card */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Analytics Metric</span>
              <div className="space-y-1">
                <div className="text-2xl font-bold font-mono text-zinc-100">84.2%</div>
                <div className="text-xs text-zinc-400">Monthly conversion rate</div>
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: "84%", backgroundColor: c1 }} />
              </div>
            </div>

            {/* Widget 3: Navigation Item Preview */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Navigation Stack</span>
              <div className="space-y-1.5">
                <div
                  style={{ backgroundColor: `${c3}20`, color: c3, borderColor: `${c3}40` }}
                  className="px-3 py-2 rounded-lg border text-xs font-semibold flex items-center justify-between"
                >
                  <span>Dashboard Overview</span>
                  <BarChart3 className="w-3.5 h-3.5" />
                </div>
                <div className="px-3 py-2 rounded-lg text-zinc-400 text-xs flex items-center justify-between hover:text-zinc-200">
                  <span>Settings &amp; Tokens</span>
                  <span className="text-[10px] font-mono text-zinc-600">v4.0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Checklist */}
          <div className="pt-4 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-zinc-400">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Real-time atom reactivity</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Ocular deficiency simulations</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>5 screen modes: SaaS, Mobile &amp; Typography</span>
            </div>
          </div>
        </div>

        {/* Section Action */}
        <div className="text-center pt-2">
          <Link
            href="/visualizer"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer group"
          >
            <span>Preview Components in Full-Screen Visualizer</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
