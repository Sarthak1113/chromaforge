"use client";

import React from "react";
import Link from "next/link";
import { useAtomValue } from "jotai";
import { paletteAtom } from "@/atoms/palette.atoms";
import { motion } from "framer-motion";
import UseAnimations from "react-useanimations";
import layout from "react-useanimations/lib/layout";
import trendingUp from "react-useanimations/lib/trendingUp";
import checkmark from "react-useanimations/lib/checkmark";
import arrowRightAnim from "react-useanimations/lib/arrowRight";

export function VisualizerShowcaseSection() {
  const palette = useAtomValue(paletteAtom);

  // Extract swatches for live preview
  const c1 = palette[0]?.hex || "#10b981";
  const c2 = palette[1]?.hex || "#06b6d4";
  const c3 = palette[2]?.hex || "#6366f1";

  return (
    <section className="w-full bg-zinc-950 py-24 sm:py-32 px-6 select-none">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto space-y-5"
        >
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider shadow-sm">
            <UseAnimations animation={layout} size={16} strokeColor="#22d3ee" autoplay loop />
            <span>Contextual Design Previews</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            Swatches on cards don&apos;t tell the whole story.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Real interfaces do.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            A primary accent might look balanced in isolation, but fail on an active button or navigation pill. Test your primary, surface, and semantic colors against realistic UI layouts in real time.
          </p>
        </motion.div>

        {/* Live UI Simulator Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="p-7 sm:p-11 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 shadow-2xl space-y-9"
        >
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
            <div className="flex items-center space-x-1.5 p-1.5 rounded-xl bg-zinc-950 border border-zinc-800 shadow-inner">
              {palette.map((color) => (
                <div
                  key={color.id}
                  className="w-5 h-5 rounded-lg shadow-sm hover:scale-110 transition-transform"
                  style={{ backgroundColor: color.hex }}
                  title={`${color.name} (${color.hex})`}
                />
              ))}
            </div>
          </div>

          {/* Interactive Mock Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Metric Card 1 */}
            <div className="group p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-3 hover:border-zinc-700 transition-colors">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Monthly Recurring Revenue</span>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono text-zinc-900 shadow-xs group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: c1 }}
                >
                  +18.4%
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-zinc-100">$84,230</div>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: "74%", backgroundColor: c1 }} />
              </div>
            </div>

            {/* Metric Card 2 */}
            <div className="group p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-3 hover:border-zinc-700 transition-colors">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Active Designers</span>
                <UseAnimations animation={trendingUp} size={18} strokeColor="#22d3ee" autoplay loop />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-zinc-100">14,920</div>
              <div className="flex items-center space-x-2 text-xs">
                <span
                  className="w-2.5 h-2.5 rounded-full animate-pulse"
                  style={{ backgroundColor: c2 }}
                />
                <span className="text-zinc-400">Synchronized tokens</span>
              </div>
            </div>

            {/* Action Card 3 */}
            <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-xs text-zinc-400">Call to Action Test</div>
                <div className="text-sm font-bold text-zinc-200 mt-1">
                  Primary &amp; Ghost Buttons
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <button
                  type="button"
                  className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-zinc-950 shadow-sm transition-transform active:scale-95 hover:brightness-110 cursor-pointer"
                  style={{ backgroundColor: c1 }}
                >
                  Upgrade
                </button>
                <button
                  type="button"
                  className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors hover:brightness-125 cursor-pointer"
                  style={{ borderColor: c2, color: c2 }}
                >
                  Details
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Features Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4 text-xs text-zinc-400 border-t border-zinc-800/60">
            <div className="flex items-center space-x-2.5">
              <UseAnimations animation={checkmark} size={16} strokeColor="#34d399" autoplay loop />
              <span>Full dark &amp; light theme stress testing</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <UseAnimations animation={checkmark} size={16} strokeColor="#34d399" autoplay loop />
              <span>Ocular deficiency simulations (Protanopia / Tritanopia)</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <UseAnimations animation={checkmark} size={16} strokeColor="#34d399" autoplay loop />
              <span>5 viewports: SaaS, Mobile, Branding, Pattern, Typography</span>
            </div>
          </div>
        </motion.div>

        {/* Section Action */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
          className="text-center"
        >
          <Link
            href="/visualizer"
            className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-600/25 transition-all cursor-pointer group"
          >
            <span>Preview Components in Full-Screen Visualizer</span>
            <UseAnimations animation={arrowRightAnim} size={16} strokeColor="#ffffff" className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
