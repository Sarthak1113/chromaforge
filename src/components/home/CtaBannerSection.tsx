"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Compass } from "lucide-react";

export function CtaBannerSection() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-zinc-950 py-12 sm:py-16 px-6 select-none border-t border-zinc-900">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-3xl bg-zinc-900/80 border border-zinc-800 p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-emerald-400 text-xs font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zero Signup Required • 100% In-Browser</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
              Build your next design system in{" "}
              <span className="text-emerald-400">perceptual color.</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Generate harmonic palettes, verify contrast with APCA, and export production-ready tokens directly in your browser.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={scrollToTop}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold text-sm transition-all cursor-pointer shadow-lg shadow-emerald-600/20"
            >
              <span>Generate Palette in Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              href="/explore"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-200 border border-zinc-700 font-semibold text-sm transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Explore 240+ Curated Palettes</span>
            </Link>
          </div>

          {/* Trust Microcopy */}
          <div className="text-xs font-mono text-zinc-500 pt-2">
            Free forever • Completely client-side • MIT License
          </div>
        </div>
      </div>
    </section>
  );
}
