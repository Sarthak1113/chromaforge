"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, EyeOff, ServerOff, Database, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col select-none">
      <Navbar />

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex-1 p-6 md:p-12 max-w-4xl mx-auto w-full flex flex-col space-y-8 select-text"
      >
        {/* Navigation Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-zinc-400 hover:text-indigo-400 transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Palette Generator</span>
        </Link>

        {/* Header */}
        <header className="space-y-3 pb-6 border-b border-zinc-800/80">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacy & Data Sovereignty</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
            Privacy Policy & Data Transparency
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
            Color-Mint is engineered as a 100% client-side design utility. We believe your creative workflow, palette data, and uploaded assets belong solely to you.
          </p>
          <p className="text-xs text-zinc-500">
            Last Updated: November 16, 2026
          </p>
        </header>

        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-2">
            <div className="flex items-center space-x-2.5 text-indigo-400">
              <ServerOff className="w-5 h-5" />
              <h2 className="text-sm font-bold text-zinc-100">Zero Server Processing</h2>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              All OKLCH calculations, color harmony matrices, contrast calculations, and image extractions happen strictly within your local browser memory using HTML5 Canvas and JavaScript. No color or image data is ever transmitted to remote servers.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-2">
            <div className="flex items-center space-x-2.5 text-emerald-400">
              <EyeOff className="w-5 h-5" />
              <h2 className="text-sm font-bold text-zinc-100">No Tracking or Analytics Cookies</h2>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Color-Mint does not employ invasive tracking cookies, third-party marketing beacons, or fingerprinting scripts. We do not sell, monetize, or harvest user telemetry.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-2">
            <div className="flex items-center space-x-2.5 text-amber-400">
              <Database className="w-5 h-5" />
              <h2 className="text-sm font-bold text-zinc-100">Local Browser Storage</h2>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We utilize standard HTML5 <code className="font-mono text-zinc-300">localStorage</code> solely to remember your locked color swatches, active harmony choices, and UI theme preferences across page refreshes. This data never leaves your device.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-2">
            <div className="flex items-center space-x-2.5 text-sky-400">
              <Lock className="w-5 h-5" />
              <h2 className="text-sm font-bold text-zinc-100">URL-Based Palette Sharing</h2>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              When you share a palette link, the color codes are packed directly into the URL hash using stateless Base62 encoding. Palettes are decoded by the recipient&apos;s browser with zero database lookups or link tracking.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <section className="space-y-6 pt-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-zinc-100">
              1. Information Collection & Usage
            </h2>
            <p className="text-zinc-400">
              Color-Mint does not require account creation, login, or personal details (such as names, physical addresses, or payment credentials). You are completely anonymous while using any tool in this suite.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-zinc-100">
              2. Uploaded Images & File Privacy
            </h2>
            <p className="text-zinc-400">
              When using the <Link href="/image-picker" className="text-indigo-400 hover:underline">Image Color Extractor</Link>, your uploaded files are read via the standard FileReader API inside your browser. The file is never uploaded to any cloud storage, bucket, or external API. Refreshing the browser instantly purges the image from memory.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-zinc-100">
              3. External Links & Creator Contact
            </h2>
            <p className="text-zinc-400">
              Color-Mint was engineered and designed by{" "}
              <a
                href="https://sarthakranjanhota.site"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline font-semibold"
              >
                Sarthak Ranjan Hota
              </a>
              . If you have any inquiries regarding data protection, accessibility standards, or color algorithms, you may contact the creator directly through his portfolio.
            </p>
          </div>
        </section>
      </motion.main>

      <Footer />
    </div>
  );
}
