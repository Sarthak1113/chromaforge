"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAtomValue } from "jotai";
import { paletteAtom } from "@/atoms/palette.atoms";
import {
  exportAsTailwindV4Theme,
  exportAsCssVariables,
  exportAsJson,
} from "@/lib/export/exporters";
import { paletteToSlug } from "@/lib/url/base62";
import { motion } from "framer-motion";
import UseAnimations from "react-useanimations";
import code from "react-useanimations/lib/code";
import copyAnim from "react-useanimations/lib/copy";
import checkmark from "react-useanimations/lib/checkmark";
import arrowRightAnim from "react-useanimations/lib/arrowRight";

type CodeTab = "tailwind" | "css" | "json" | "url";

export function DeveloperHandoffSection() {
  const [activeTab, setActiveTab] = useState<CodeTab>("tailwind");
  const [copied, setCopied] = useState(false);
  const palette = useAtomValue(paletteAtom);

  const slug = paletteToSlug(palette.map((c) => c.hex));
  const shareableUrl = `https://color-mint.sarthakranjanhota.site/palette/${slug}`;

  let codeOutput = "";
  switch (activeTab) {
    case "tailwind":
      codeOutput = exportAsTailwindV4Theme(palette);
      break;
    case "css":
      codeOutput = exportAsCssVariables(palette);
      break;
    case "json":
      codeOutput = exportAsJson(palette);
      break;
    case "url":
      codeOutput = shareableUrl;
      break;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(codeOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider shadow-sm">
            <UseAnimations animation={code} size={16} strokeColor="#34d399" autoplay loop />
            <span>Developer-First Handoff</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            Export clean tokens.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Zero manual reformatting.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Whether you are configuring Tailwind CSS v4&apos;s new <code className="text-emerald-300 font-mono text-xs">@theme</code> directive, setting up CSS Custom Properties for a design system, or sharing a Base62 URL, Color-Mint outputs production syntax with one click.
          </p>
        </motion.div>

        {/* Code Showcase Window */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-2xl overflow-hidden max-w-4xl mx-auto"
        >
          {/* Top Window Bar */}
          <div className="px-6 py-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-950/60">
            {/* Window Dots & Tab Selector */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>

              {/* Tabs */}
              <div className="flex items-center space-x-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("tailwind")}
                  className={`px-3 py-1.5 rounded-lg font-mono transition-colors cursor-pointer ${
                    activeTab === "tailwind"
                      ? "bg-zinc-800 text-emerald-400 font-bold shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Tailwind v4
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("css")}
                  className={`px-3 py-1.5 rounded-lg font-mono transition-colors cursor-pointer ${
                    activeTab === "css"
                      ? "bg-zinc-800 text-emerald-400 font-bold shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  CSS Variables
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("json")}
                  className={`px-3 py-1.5 rounded-lg font-mono transition-colors cursor-pointer ${
                    activeTab === "json"
                      ? "bg-zinc-800 text-emerald-400 font-bold shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  JSON Schema
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("url")}
                  className={`px-3 py-1.5 rounded-lg font-mono transition-colors cursor-pointer ${
                    activeTab === "url"
                      ? "bg-zinc-800 text-emerald-400 font-bold shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Base62 Share URL
                </button>
              </div>
            </div>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-200 text-xs font-semibold border border-zinc-700/80 transition-all cursor-pointer w-fit group"
            >
              {copied ? (
                <>
                  <UseAnimations animation={checkmark} size={15} strokeColor="#34d399" autoplay />
                  <span className="text-emerald-400 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <UseAnimations animation={copyAnim} size={15} strokeColor="#a1a1aa" interaction="hover-replay" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Syntax Code Block */}
          <div className="p-6 sm:p-8 bg-zinc-950/90 font-mono text-xs sm:text-sm text-zinc-300 leading-relaxed overflow-x-auto select-text max-h-80">
            <pre className="whitespace-pre">{codeOutput}</pre>
          </div>
        </motion.div>

        {/* Action Link */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
          className="text-center"
        >
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 transition-all cursor-pointer group"
          >
            <span>Export Full Palette in Generator</span>
            <UseAnimations animation={arrowRightAnim} size={16} strokeColor="#ffffff" className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
