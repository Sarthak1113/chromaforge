"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import UseAnimations from "react-useanimations";
import zap from "react-useanimations/lib/zap";
import arrowRightAnim from "react-useanimations/lib/arrowRight";
import explore from "react-useanimations/lib/explore";

export function CtaBannerSection() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-zinc-950 py-24 sm:py-32 px-6 select-none">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative rounded-3xl bg-gradient-to-tr from-zinc-900 via-zinc-900/90 to-zinc-950 border border-emerald-500/30 p-8 sm:p-14 overflow-hidden shadow-2xl text-center space-y-8"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Eyebrow */}
          <div className="relative group inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider transition-colors hover:bg-emerald-500/20">
            <UseAnimations animation={zap} size={16} strokeColor="#34d399" autoplay loop />
            <span>Ready in Seconds • Zero Signup Required</span>
          </div>

          {/* Main Headline */}
          <div className="relative space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
              Build your next design system in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                perceptual color.
              </span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Generate harmonic palettes, audit contrast with APCA, and export production-ready tokens directly in your browser.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={scrollToTop}
              className="group w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <span>Generate Palette in Workspace</span>
              <UseAnimations animation={arrowRightAnim} size={18} strokeColor="#ffffff" className="group-hover:translate-x-1 transition-transform" />
            </button>

            <Link
              href="/explore"
              className="group w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 active:scale-95 text-zinc-200 border border-zinc-700/80 font-bold text-sm transition-all cursor-pointer"
            >
              <UseAnimations animation={explore} size={18} strokeColor="#34d399" />
              <span>Explore 240+ Curated Palettes</span>
            </Link>
          </div>

          {/* Trust Microcopy */}
          <div className="relative text-xs text-zinc-500 pt-2">
            Zero signup required • 100% in-browser computation • Free forever
          </div>
        </motion.div>
      </div>
    </section>
  );
}
