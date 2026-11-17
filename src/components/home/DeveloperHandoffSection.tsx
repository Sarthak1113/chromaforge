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
import { Code2, Check, Copy, ArrowRight } from "lucide-react";

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
    <section className="w-full bg-zinc-950 py-12 sm:py-16 px-6 select-none border-t border-zinc-900">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 text-xs font-mono uppercase tracking-wider">
            <Code2 className="w-3.5 h-3.5" />
            <span>Developer-First Handoff</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            Export clean tokens.{" "}
            <span className="text-emerald-400">Zero manual reformatting.</span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Whether you are configuring Tailwind CSS v4&apos;s new <code className="text-emerald-300 font-mono text-xs">@theme</code> directive, setting up CSS Custom Properties for a design system, or sharing a Base62 URL, Color-Mint outputs production syntax with one click.
          </p>
        </div>

        {/* Code Showcase Window */}
        <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-xl overflow-hidden max-w-4xl mx-auto">
          {/* Top Window Bar */}
          <div className="px-5 py-3.5 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-950/70">
            {/* Window Dots & Tab Selector */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              </div>

              {/* Tabs */}
              <div className="flex items-center space-x-1 bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("tailwind")}
                  className={`px-3 py-1 rounded-md font-mono transition-colors cursor-pointer ${
                    activeTab === "tailwind"
                      ? "bg-zinc-800 text-emerald-400 font-bold shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Tailwind v4
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("css")}
                  className={`px-3 py-1 rounded-md font-mono transition-colors cursor-pointer ${
                    activeTab === "css"
                      ? "bg-zinc-800 text-emerald-400 font-bold shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  CSS Variables
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("json")}
                  className={`px-3 py-1 rounded-md font-mono transition-colors cursor-pointer ${
                    activeTab === "json"
                      ? "bg-zinc-800 text-emerald-400 font-bold shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  JSON
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("url")}
                  className={`px-3 py-1 rounded-md font-mono transition-colors cursor-pointer ${
                    activeTab === "url"
                      ? "bg-zinc-800 text-emerald-400 font-bold shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Base62 URL
                </button>
              </div>
            </div>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-all cursor-pointer w-fit group"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-200" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Syntax Code Block */}
          <div className="p-5 sm:p-6 bg-zinc-950 font-mono text-xs sm:text-sm text-zinc-300 leading-relaxed overflow-x-auto select-text max-h-80">
            <pre className="whitespace-pre">{codeOutput}</pre>
          </div>
        </div>

        {/* Action Link */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer group"
          >
            <span>Export Full Palette in Generator</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
