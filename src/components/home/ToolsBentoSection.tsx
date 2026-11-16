"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import UseAnimations from "react-useanimations";
import zap from "react-useanimations/lib/zap";
import shield from "react-useanimations/lib/shield";
import activity from "react-useanimations/lib/activity";
import layout from "react-useanimations/lib/layout";
import imageAnim from "react-useanimations/lib/image";
import explore from "react-useanimations/lib/explore";
import arrowRightAnim from "react-useanimations/lib/arrowRight";

export function ToolsBentoSection() {
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
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-semibold uppercase tracking-wider shadow-sm">
            <UseAnimations animation={zap} size={16} strokeColor="#2dd4bf" autoplay loop />
            <span>The Color-Mint Utility Suite</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            Everything you need from moodboard to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              design token handoff.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Stop switching between five disjointed browser tabs. Color-Mint unites contrast auditing, procedural gradient generation, and live UI previewing into one high-performance studio.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8"
        >
          {/* Card 1: Contrast Checker (Span 7) */}
          <div className="group md:col-span-7 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 p-7 sm:p-9 flex flex-col justify-between space-y-7 hover:border-indigo-500/40 hover:bg-zinc-900/80 transition-all duration-300 shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-sm">
                  <UseAnimations animation={shield} size={26} strokeColor="#818cf8" autoplay loop />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  WCAG AAA &amp; APCA
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors">
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
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between shadow-inner">
              <div className="space-y-1">
                <div className="text-[11px] text-zinc-400 font-medium">Headline Contrast Score</div>
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Passes Level AAA (8.4:1)</span>
                </div>
              </div>
              <Link
                href="/contrast"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-700/80 transition-all hover:text-white cursor-pointer group/btn"
              >
                <span>Launch Checker</span>
                <UseAnimations animation={arrowRightAnim} size={15} strokeColor="#ffffff" className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 2: Gradient Studio (Span 5) */}
          <div className="group md:col-span-5 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 p-7 sm:p-9 flex flex-col justify-between space-y-7 hover:border-teal-500/40 hover:bg-zinc-900/80 transition-all duration-300 shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-sm">
                  <UseAnimations animation={activity} size={26} strokeColor="#2dd4bf" autoplay loop />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-400 font-semibold border border-teal-500/30">
                  in oklch
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-zinc-100 group-hover:text-teal-300 transition-colors">
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
              <div className="h-10 rounded-xl overflow-hidden shadow-inner border border-zinc-800 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 group-hover:scale-[1.01] transition-transform" />
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-500">Bézier Spline Mesh</span>
                <Link
                  href="/gradients"
                  className="flex items-center space-x-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors group/link"
                >
                  <span>Open Studio</span>
                  <UseAnimations animation={arrowRightAnim} size={15} strokeColor="#2dd4bf" className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Palette Visualizer (Span 5) */}
          <div className="group md:col-span-5 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 p-7 sm:p-9 flex flex-col justify-between space-y-7 hover:border-cyan-500/40 hover:bg-zinc-900/80 transition-all duration-300 shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm">
                  <UseAnimations animation={layout} size={26} strokeColor="#22d3ee" autoplay loop />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30">
                  Live UI Mockups
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-zinc-100 group-hover:text-cyan-300 transition-colors">
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
              className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 transition-all group/btn"
            >
              <span>Test on Live UI Mockups</span>
              <UseAnimations animation={arrowRightAnim} size={15} strokeColor="#22d3ee" className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 4: Image Extractor (Span 4) */}
          <div className="group md:col-span-4 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 p-7 sm:p-9 flex flex-col justify-between space-y-7 hover:border-emerald-500/40 hover:bg-zinc-900/80 transition-all duration-300 shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
                  <UseAnimations animation={imageAnim} size={26} strokeColor="#34d399" autoplay loop />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  Auto-Cluster
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors">
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
              className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 transition-all group/btn"
            >
              <span>Extract Image Swatches</span>
              <UseAnimations animation={arrowRightAnim} size={15} strokeColor="#34d399" className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 5: Curated Library (Span 3) */}
          <div className="group md:col-span-3 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 p-7 sm:p-9 flex flex-col justify-between space-y-7 hover:border-purple-500/40 hover:bg-zinc-900/80 transition-all duration-300 shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-sm">
                  <UseAnimations animation={explore} size={26} strokeColor="#c084fc" autoplay loop />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400 font-semibold border border-purple-500/30">
                  240+ Themes
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-zinc-100 group-hover:text-purple-300 transition-colors">
                  Curated Library
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-purple-400 mt-1">
                  Hand-crafted palettes
                </p>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Browse color systems curated across Cyberpunk, Minimalist, Sunset, Vintage, and Enterprise aesthetic moods.
              </p>
            </div>

            <Link
              href="/explore"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 transition-all group/btn"
            >
              <span>Browse 240+</span>
              <UseAnimations animation={arrowRightAnim} size={15} strokeColor="#c084fc" className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
