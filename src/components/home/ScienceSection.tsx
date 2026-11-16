"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, AlertTriangle, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function ScienceSection() {
  return (
    <section className="w-full bg-zinc-950 py-24 sm:py-32 px-6 border-t border-zinc-800/80 select-none">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto space-y-5"
        >
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>The Color Science Upgrade</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            Your old color picker is mathematically broken.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Here&apos;s why.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Traditional web color models like HSL and sRGB treat pure yellow and deep blue as if they share the same brightness. The result? Muddy gradients, inaccessible button states, and clashing visual hierarchies.
          </p>
        </motion.div>

        {/* 3-Card Grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
        >
          {/* Card 1: HSL Illusion */}
          <div className="group p-7 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between space-y-6 hover:border-amber-500/40 hover:bg-zinc-900/80 transition-all duration-300">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 shadow-sm">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                The HSL Fallacy
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                In standard HSL, <code className="text-amber-300 font-mono text-xs">hsl(60, 100%, 50%)</code> (yellow) and <code className="text-amber-300 font-mono text-xs">hsl(240, 100%, 50%)</code> (blue) claim identical 50% lightness. Yet human eyes perceive yellow as nearly 4x brighter. HSL completely ignores retinal luminance.
              </p>
            </div>

            {/* Visual demo bar */}
            <div className="space-y-2 pt-2 border-t border-zinc-800/60">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>Both L=50% in HSL</span>
                <span className="text-amber-400 font-bold">4x Brightness Delta</span>
              </div>
              <div className="h-7 rounded-xl overflow-hidden flex shadow-inner">
                <div className="w-1/2 bg-[#ffee00] flex items-center justify-center text-[10px] font-bold text-zinc-900 font-mono">
                  Yellow (93% L)
                </div>
                <div className="w-1/2 bg-[#0000ff] flex items-center justify-center text-[10px] font-bold text-white font-mono">
                  Blue (26% L)
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: The OKLCH Standard */}
          <div className="group p-7 rounded-3xl bg-gradient-to-b from-zinc-900/90 to-zinc-900/40 border border-emerald-500/30 flex flex-col justify-between space-y-6 shadow-xl shadow-emerald-500/5 hover:border-emerald-500/60 hover:bg-zinc-900/90 transition-all duration-300">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm shadow-emerald-500/10">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 flex items-center space-x-2 group-hover:text-emerald-300 transition-colors">
                <span>The OKLCH Standard</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                  Human Vision
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Developed by Björn Ottosson, OKLCH aligns with human visual perception. An OKLCH lightness value of <code className="text-emerald-400 font-mono text-xs">0.70</code> delivers identical perceived brightness across every single hue—from radiant cyan to deep magenta.
              </p>
            </div>

            {/* Visual demo bar */}
            <div className="space-y-2 pt-2 border-t border-emerald-500/20">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>Constant L=0.70 in OKLCH</span>
                <span className="text-emerald-400 font-bold">100% Uniform</span>
              </div>
              <div className="h-7 rounded-xl overflow-hidden flex shadow-inner">
                <div className="flex-1 bg-[oklch(0.70_0.22_150)] flex items-center justify-center text-[9px] font-bold text-zinc-900 font-mono">
                  Green
                </div>
                <div className="flex-1 bg-[oklch(0.70_0.22_220)] flex items-center justify-center text-[9px] font-bold text-zinc-900 font-mono">
                  Cyan
                </div>
                <div className="flex-1 bg-[oklch(0.70_0.22_320)] flex items-center justify-center text-[9px] font-bold text-white font-mono">
                  Pink
                </div>
                <div className="flex-1 bg-[oklch(0.70_0.22_40)] flex items-center justify-center text-[9px] font-bold text-zinc-900 font-mono">
                  Orange
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Native CSS Support */}
          <div className="group p-7 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between space-y-6 hover:border-cyan-500/40 hover:bg-zinc-900/80 transition-all duration-300">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 group-hover:text-cyan-300 transition-colors">
                Native CSS Support
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                CSS Color Module Level 4 is natively supported in Chrome, Safari, Firefox, and Edge. Write <code className="text-cyan-300 font-mono text-xs">color: oklch(0.7 0.18 150)</code> today with zero runtime JavaScript overhead or polyfills.
              </p>
            </div>

            {/* Code Snippet Box */}
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 font-mono text-[11px] text-zinc-300 space-y-1">
              <div className="text-zinc-500 text-[10px]">/* Native CSS Color 4 */</div>
              <div><span className="text-cyan-400">--brand-primary</span>: <span className="text-emerald-400">oklch</span>(0.72 0.19 160);</div>
              <div><span className="text-cyan-400">--brand-accent</span>: <span className="text-emerald-400">oklch</span>(0.72 0.22 350);</div>
            </div>
          </div>
        </motion.div>

        {/* Section Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-between gap-5 p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 shadow-lg"
        >
          <div className="text-xs sm:text-sm text-zinc-300 text-center sm:text-left">
            Ready to audit your current brand colors for true human readability?
          </div>
          <Link
            href="/contrast"
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer whitespace-nowrap group"
          >
            <span>Test Contrast with APCA</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
