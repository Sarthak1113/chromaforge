"use client";

import React from "react";
import Link from "next/link";
import { Globe, Mail, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer
      className="w-full bg-zinc-950 border-t border-zinc-800/80 text-zinc-400 select-none pb-[calc(1rem+env(safe-area-inset-bottom))]"
      aria-label="Site Footer"
    >
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Column: Brand Logo & Tagline */}
          <div className="md:col-span-5 lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform text-sm">
                CM
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-extrabold text-zinc-100 tracking-tight group-hover:text-white transition-colors">
                  Color-Mint
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  OKLCH
                </span>
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm">
              Modern OKLCH Color Palette Generator &amp; Design System Utilities for digital designers and frontend developers.
            </p>
          </div>

          {/* Middle Column: Quick Links */}
          <div className="md:col-span-4 lg:col-span-5 grid grid-cols-2 gap-6 sm:gap-8">
            {/* Design Utilities */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200">
                Design Utilities
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <Link href="/" className="hover:text-emerald-400 transition-colors">
                    Palette Generator
                  </Link>
                </li>
                <li>
                  <Link href="/contrast" className="hover:text-emerald-400 transition-colors">
                    Contrast Checker
                  </Link>
                </li>
                <li>
                  <Link href="/gradients" className="hover:text-emerald-400 transition-colors">
                    Gradient Studio
                  </Link>
                </li>
                <li>
                  <Link href="/visualizer" className="hover:text-emerald-400 transition-colors">
                    Palette Visualizer
                  </Link>
                </li>
                <li>
                  <Link href="/image-picker" className="hover:text-emerald-400 transition-colors">
                    Image Extractor
                  </Link>
                </li>
                <li>
                  <Link href="/explore" className="hover:text-emerald-400 transition-colors">
                    Curated Palettes
                  </Link>
                </li>
              </ul>
            </div>

            {/* Feedback & Platform */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200">
                Feedback &amp; Legal
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <a
                    href="https://forms.gle/iZtRVxswX15exxHu8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors group"
                  >
                    <span>Request Feature / Feedback</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <a
                    href="/llms.txt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-400 transition-colors font-mono text-[11px]"
                  >
                    AI Docs (llms.txt)
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Creator, Website Icon & Mail Icon, Copyright */}
          <div className="md:col-span-3 lg:col-span-3 space-y-4 md:text-right flex flex-col md:items-end justify-between">
            <div className="space-y-1">
              <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                Crafted by
              </div>
              <div className="text-sm sm:text-base font-bold text-zinc-100">
                Sarthak Ranjan Hota
              </div>
              <div className="text-xs text-zinc-400">
                Designer &amp; Developer
              </div>
            </div>

            {/* Only Website and Mail icons with sleek hover effects */}
            <div className="flex items-center space-x-3 pt-1">
              <a
                href="https://www.sarthakranjanhota.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sarthak Ranjan Hota Website (www.sarthakranjanhota.com)"
                title="www.sarthakranjanhota.com"
                className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:scale-105 active:scale-95 transition-all shadow-sm group"
              >
                <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </a>

              <a
                href="mailto:sarthakranjanhota.official@gmail.com"
                aria-label="Email Sarthak Ranjan Hota"
                title="sarthakranjanhota.official@gmail.com"
                className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:scale-105 active:scale-95 transition-all shadow-sm group"
              >
                <Mail className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            {/* Copyright */}
            <div className="text-[11px] text-zinc-500 pt-2">
              © {new Date().getFullYear()} Color-Mint. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
