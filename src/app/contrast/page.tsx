"use client";

import React, { useState } from "react";
import {
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Copy,
  Check,
  Sparkles,
  Layout,
  Type,
  Layers,
  SlidersHorizontal,
} from "lucide-react";
import { getContrastRatio } from "@/lib/colors/contrast";
import { hexToOklch } from "@/lib/colors/oklch";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { CollapsibleFaq } from "@/components/common/CollapsibleFaq";
import { motion, AnimatePresence } from "framer-motion";

const CONTRAST_FAQS = [
  {
    question: "What is the minimum contrast ratio for WCAG Level AA and AAA?",
    answer:
      "WCAG 2.1 Level AA requires a contrast ratio of at least 4.5:1 for normal body text and 3:1 for large text (18pt or 14pt bold). Level AAA raises this requirement to 7:1 for normal text and 4.5:1 for large typography, ensuring legibility for users with significant visual impairments.",
  },
  {
    question: "How does APCA contrast differ from traditional WCAG 2.1?",
    answer:
      "The Accessible Perceptual Contrast Algorithm (APCA) evaluates perceived lightness differences dynamically based on font weight, font size, and visual polarity. Unlike WCAG 2.1, which treats white-on-black identically to black-on-white, APCA accurately reflects how human rods and cones process light-on-dark and dark-on-light displays.",
  },
  {
    question: "Can text pass accessibility audits if the font weight is increased?",
    answer:
      "Yes. Under WCAG guidelines, text that is 14pt and bold (or 18pt regular) is classified as 'large text' and is permitted to pass with a lower contrast threshold of 3:1 for Level AA and 4.5:1 for Level AAA. APCA provides even more granular lightness compensation for bold weights.",
  },
  {
    question: "How do dark mode color pairs affect visual readability?",
    answer:
      "Pure white text (#FFFFFF) on pure black (#000000) produces a harsh 21:1 contrast ratio that can cause eye strain and visual halation (glowing blur) for astigmatic readers. Design systems achieve superior dark mode readability using off-white text (such as #E4E4E7) against dark slate or zinc backgrounds (such as #09090B).",
  },
];

const PRESETS = [
  { name: "Deep Navy & Sky", fg: "#112A46", bg: "#ACC8E5" },
  { name: "Mint Dark", fg: "#34D399", bg: "#09090B" },
  { name: "Editorial Paper", fg: "#18181B", bg: "#F4F4F5" },
  { name: "Solar Gold", fg: "#F59E0B", bg: "#0F172A" },
  { name: "Electric Violet", fg: "#E9D5FF", bg: "#3B0764" },
  { name: "Clean High-Con", fg: "#000000", bg: "#FFFFFF" },
];

type PreviewMode = "components" | "editorial" | "scale";
type FontWeight = "font-normal" | "font-semibold" | "font-bold";

export default function ContrastPage() {
  const [fgHex, setFgHex] = useState("#112A46");
  const [bgHex, setBgHex] = useState("#ACC8E5");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("components");
  const [fontWeight, setFontWeight] = useState<FontWeight>("font-normal");
  const [copied, setCopied] = useState(false);

  // Parse RGB for Contrast
  const parseHex = (hex: string) => {
    const clean = hex.replace("#", "").trim();
    const full =
      clean.length === 3
        ? clean.split("").map((c) => c + c).join("")
        : clean;
    return {
      r: parseInt(full.slice(0, 2), 16) || 0,
      g: parseInt(full.slice(2, 4), 16) || 0,
      b: parseInt(full.slice(4, 6), 16) || 0,
    };
  };

  const fgRgb = parseHex(fgHex);
  const bgRgb = parseHex(bgHex);
  const ratio = getContrastRatio(bgRgb, fgRgb);

  // Perceptual OKLCH Lightness
  const fgOklch = hexToOklch(fgHex);
  const bgOklch = hexToOklch(bgHex);
  const fgL = Math.round(fgOklch.l * 100);
  const bgL = Math.round(bgOklch.l * 100);
  const deltaL = Math.abs(fgL - bgL);
  const isLightOnDark = fgL > bgL;

  const handleSwap = () => {
    const temp = bgHex;
    setBgHex(fgHex);
    setFgHex(temp);
  };

  const handleCopyTokens = () => {
    const code = `/* Color-Mint Contrast Token Pair */\ncolor: ${fgHex};\nbackground-color: ${bgHex};\n/* Contrast Ratio: ${ratio.toFixed(2)}:1 */`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // WCAG Compliance evaluation
  const isAAA = ratio >= 7.0;
  const isAA = ratio >= 4.5;
  const isAALarge = ratio >= 3.0;

  // Logarithmic calculation for progress meter (1:1 to 21:1)
  const meterProgress = Math.min(
    100,
    Math.max(0, (Math.log10(ratio) / Math.log10(21)) * 100)
  );

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col select-none">
      <Navbar activePage="contrast" />

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex-1 p-5 sm:p-8 max-w-6xl mx-auto w-full flex flex-col space-y-8"
      >
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>WCAG 2.1 &amp; APCA Diagnostic Studio</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
              Color Contrast Checker
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Calculate relative luminance and verify typography legibility across real-world digital components.
            </p>
          </div>

          {/* Quick Preset Selector Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full sm:max-w-md">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setFgHex(p.fg);
                  setBgHex(p.bg);
                }}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 font-medium transition-all shrink-0 cursor-pointer active:scale-95"
                title={`${p.name} (${p.fg} on ${p.bg})`}
              >
                <div className="flex -space-x-1 items-center">
                  <span
                    className="w-3 h-3 rounded-full border border-black/30 shadow-xs"
                    style={{ backgroundColor: p.fg }}
                  />
                  <span
                    className="w-3 h-3 rounded-full border border-black/30 shadow-xs"
                    style={{ backgroundColor: p.bg }}
                  />
                </div>
                <span className="text-[11px] whitespace-nowrap">{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Main Interface (Unique Cockpit + Interactive UI Preview) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Cockpit & Dynamic Contrast Matrix (Span 5) */}
          <div className="lg:col-span-5 flex flex-col space-y-5">
            {/* Color Input Controls Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-zinc-900/70 border border-zinc-800/80 shadow-xl backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider">
                  Color Pairing
                </span>
                <button
                  type="button"
                  onClick={handleSwap}
                  className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-semibold border border-zinc-700/80 transition-all active:scale-95 cursor-pointer shadow-xs"
                  title="Swap foreground & background"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Swap</span>
                </button>
              </div>

              {/* Color Inputs Grid */}
              <div className="grid grid-cols-2 gap-3.5">
                {/* Text (Foreground) Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-zinc-300">Text Color</span>
                    <span className="font-mono text-zinc-500">L: {fgL}%</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-2xl focus-within:border-emerald-500 transition-colors">
                    <input
                      type="text"
                      value={fgHex}
                      onChange={(e) => setFgHex(e.target.value)}
                      className="w-20 bg-transparent font-mono text-sm font-semibold uppercase text-zinc-100 outline-none"
                      maxLength={7}
                    />
                    <div
                      className="relative w-7 h-7 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-inner cursor-pointer"
                      style={{ backgroundColor: fgHex }}
                    >
                      <input
                        type="color"
                        value={fgHex.length === 7 ? fgHex : "#112A46"}
                        onChange={(e) => setFgHex(e.target.value)}
                        className="absolute -inset-2 w-12 h-12 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Canvas (Background) Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-zinc-300">Background</span>
                    <span className="font-mono text-zinc-500">L: {bgL}%</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-2xl focus-within:border-emerald-500 transition-colors">
                    <input
                      type="text"
                      value={bgHex}
                      onChange={(e) => setBgHex(e.target.value)}
                      className="w-20 bg-transparent font-mono text-sm font-semibold uppercase text-zinc-100 outline-none"
                      maxLength={7}
                    />
                    <div
                      className="relative w-7 h-7 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-inner cursor-pointer"
                      style={{ backgroundColor: bgHex }}
                    >
                      <input
                        type="color"
                        value={bgHex.length === 7 ? bgHex : "#ACC8E5"}
                        onChange={(e) => setBgHex(e.target.value)}
                        className="absolute -inset-2 w-12 h-12 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Perceptual OKLCH Delta Indicator */}
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-[11px] font-mono text-zinc-400">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>OKLCH ΔLightness:</span>
                  <span className="font-bold text-zinc-200">{deltaL}%</span>
                </div>
                <span className="text-zinc-500">
                  {isLightOnDark ? "Light on Dark" : "Dark on Light"}
                </span>
              </div>
            </div>

            {/* Precision Contrast Gauge & Meter Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-zinc-900/70 border border-zinc-800/80 shadow-xl backdrop-blur-md space-y-5 flex-1 flex flex-col justify-between">
              <div>
                {/* Big Score Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                      Contrast Ratio
                    </span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-zinc-100">
                        {ratio.toFixed(2)}
                      </span>
                      <span className="text-base sm:text-lg font-mono font-bold text-zinc-400">
                        :1
                      </span>
                    </div>
                  </div>

                  {/* Level Status Pill */}
                  <div className="text-right">
                    {isAAA ? (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Level AAA Super</span>
                      </span>
                    ) : isAA ? (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-400 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-teal-400" />
                        <span>Level AA Standard</span>
                      </span>
                    ) : isAALarge ? (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span>Large Text Only</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-rose-400" />
                        <span>Fails WCAG</span>
                      </span>
                    )}
                    <span className="block text-[11px] font-mono text-zinc-500 mt-1">
                      APCA Lc ~{Math.round(ratio * 11.2)}
                    </span>
                  </div>
                </div>

                {/* Logarithmic Visual Spectrum Scale Bar */}
                <div className="space-y-1.5 mt-5">
                  <div className="relative h-3 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 p-0.5">
                    {/* Gradient Bar representing 1 to 21 */}
                    <div className="h-full w-full rounded-full bg-gradient-to-r from-rose-500 via-amber-400 via-40% via-teal-400 via-65% to-emerald-400" />
                    {/* Active Marker Position Indicator */}
                    <div
                      className="absolute top-0 bottom-0 w-2.5 bg-white border border-zinc-900 rounded-full shadow-md transition-all duration-300"
                      style={{
                        left: `calc(${meterProgress}% - 5px)`,
                      }}
                    />
                  </div>

                  {/* Benchmark threshold ticks */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 px-0.5">
                    <span>1:1</span>
                    <span className={ratio >= 3.0 ? "text-amber-400 font-bold" : ""}>
                      3:1 (Large AA)
                    </span>
                    <span className={ratio >= 4.5 ? "text-teal-400 font-bold" : ""}>
                      4.5:1 (AA)
                    </span>
                    <span className={ratio >= 7.0 ? "text-emerald-400 font-bold" : ""}>
                      7:1 (AAA)
                    </span>
                    <span>21:1</span>
                  </div>
                </div>
              </div>

              {/* 3-Pillar Compliance Grid */}
              <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-zinc-800/80">
                {/* Normal Text (<18pt) */}
                <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800/60 text-center space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400 block">Normal Text</span>
                  {isAAA ? (
                    <div className="inline-flex items-center space-x-1 text-emerald-400 font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>PASS AAA</span>
                    </div>
                  ) : isAA ? (
                    <div className="inline-flex items-center space-x-1 text-teal-400 font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>PASS AA</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center space-x-1 text-rose-400 font-bold text-xs">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>FAIL</span>
                    </div>
                  )}
                  <span className="text-[9px] font-mono text-zinc-500 block">&ge;4.5:1</span>
                </div>

                {/* Large Text (≥18pt or 14pt bold) */}
                <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800/60 text-center space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400 block">Headings (18pt+)</span>
                  {isAAA || isAA ? (
                    <div className="inline-flex items-center space-x-1 text-emerald-400 font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>PASS AAA</span>
                    </div>
                  ) : isAALarge ? (
                    <div className="inline-flex items-center space-x-1 text-teal-400 font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>PASS AA</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center space-x-1 text-rose-400 font-bold text-xs">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>FAIL</span>
                    </div>
                  )}
                  <span className="text-[9px] font-mono text-zinc-500 block">&ge;3.0:1</span>
                </div>

                {/* UI Components & Borders */}
                <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800/60 text-center space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400 block">UI Controls</span>
                  {isAALarge ? (
                    <div className="inline-flex items-center space-x-1 text-emerald-400 font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>PASS</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center space-x-1 text-rose-400 font-bold text-xs">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>FAIL</span>
                    </div>
                  )}
                  <span className="text-[9px] font-mono text-zinc-500 block">&ge;3.0:1</span>
                </div>
              </div>

              {/* Dynamic Actionable Recommendation */}
              <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-950/40 p-3 rounded-2xl border border-zinc-800/60">
                {isAAA ? (
                  <span className="text-emerald-300">
                    <strong>Enterprise Ready:</strong> Exceeds the highest WCAG 2.1 AAA accessibility threshold. Optimal readability for body copy, micro-captions, and high-density dashboards.
                  </span>
                ) : isAA ? (
                  <span className="text-teal-300">
                    <strong>Production Standard:</strong> Compliant with WCAG Level AA. Recommended for general web applications. Increase lightness difference by 15% to reach Level AAA.
                  </span>
                ) : isAALarge ? (
                  <span className="text-amber-300">
                    <strong>Headings Only:</strong> Meets the 3:1 minimum for large text (18pt+) and UI input borders. Inaccessible for standard paragraph body copy.
                  </span>
                ) : (
                  <span className="text-rose-300">
                    <strong>Critical Failure:</strong> Fails all WCAG standards. Difficult or impossible for low-vision readers to decipher. Adjust the lightness of either color to restore compliance.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Right Column: Multi-Context UI Preview Studio Sandbox (Span 7) */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            {/* Sandbox Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-2">
              {/* Mode Switcher Tabs */}
              <div className="flex items-center space-x-1 bg-zinc-900 border border-zinc-800 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setPreviewMode("components")}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    previewMode === "components"
                      ? "bg-zinc-800 text-emerald-400 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Layout className="w-3.5 h-3.5" />
                  <span>UI Components</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewMode("editorial")}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    previewMode === "editorial"
                      ? "bg-zinc-800 text-emerald-400 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                  <span>Editorial</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewMode("scale")}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    previewMode === "scale"
                      ? "bg-zinc-800 text-emerald-400 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Typography Scale</span>
                </button>
              </div>

              {/* Weight & Copy Actions */}
              <div className="flex items-center space-x-2">
                {/* Weight Selector */}
                <div className="flex items-center space-x-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => setFontWeight("font-normal")}
                    className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                      fontWeight === "font-normal"
                        ? "bg-zinc-800 text-zinc-100 font-bold"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    400
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontWeight("font-semibold")}
                    className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                      fontWeight === "font-semibold"
                        ? "bg-zinc-800 text-zinc-100 font-bold"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    600
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontWeight("font-bold")}
                    className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                      fontWeight === "font-bold"
                        ? "bg-zinc-800 text-zinc-100 font-bold"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    700
                  </button>
                </div>

                {/* Copy CSS Button */}
                <button
                  type="button"
                  onClick={handleCopyTokens}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800 transition-all cursor-pointer active:scale-95"
                  title="Copy CSS variables"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Copy CSS</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Dynamic UI Sandbox Stage */}
            <div
              className={`rounded-3xl border border-zinc-800 p-6 sm:p-10 flex-1 flex flex-col justify-between relative transition-colors duration-300 shadow-2xl min-h-[380px] sm:min-h-[460px] overflow-hidden ${fontWeight}`}
              style={{ backgroundColor: bgHex, color: fgHex }}
            >
              {/* Floating Swap Pill inside Stage */}
              <button
                type="button"
                onClick={handleSwap}
                className="absolute top-5 right-5 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl backdrop-blur-md transition-all active:scale-95 cursor-pointer text-xs font-semibold shadow-sm border"
                style={{
                  backgroundColor: fgHex,
                  color: bgHex,
                  borderColor: fgHex,
                }}
                title="Swap foreground & background"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Invert</span>
              </button>

              {/* Mode 1: Component UI */}
              {previewMode === "components" && (
                <div className="space-y-6 max-w-lg mx-auto w-full my-auto">
                  {/* Card Header & Badge */}
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-xs"
                      style={{
                        borderColor: fgHex,
                        backgroundColor: "transparent",
                      }}
                    >
                      Design System • Live
                    </span>
                    <span className="text-xs opacity-75 font-mono">
                      {ratio.toFixed(2)}:1 Contrast
                    </span>
                  </div>

                  {/* Primary Heading & Body Text */}
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                      Typography gives language a visual voice.
                    </h2>
                    <p className="text-sm leading-relaxed opacity-90">
                      Color contrast shapes rhythm, optical hierarchy, and reading velocity. Proper lightness separation ensures your digital interface remains effortless to parse under direct sunlight.
                    </p>
                  </div>

                  {/* Mock Input Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold opacity-85 block">
                      Accessibility feedback
                    </label>
                    <div
                      className="p-3 rounded-xl border opacity-90 text-xs flex items-center justify-between"
                      style={{ borderColor: fgHex }}
                    >
                      <span className="opacity-80">Enter system token name...</span>
                      <span className="text-[10px] font-mono opacity-60">ESC</span>
                    </div>
                  </div>

                  {/* Interactive Button Group */}
                  <div className="flex items-center gap-3 pt-1">
                    {/* Primary Button */}
                    <button
                      type="button"
                      className="flex-1 py-3 px-4 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 hover:opacity-90 cursor-pointer text-center"
                      style={{
                        backgroundColor: fgHex,
                        color: bgHex,
                      }}
                    >
                      Primary Action
                    </button>

                    {/* Secondary Ghost Button */}
                    <button
                      type="button"
                      className="flex-1 py-3 px-4 rounded-xl text-xs font-bold border transition-all active:scale-95 hover:opacity-85 cursor-pointer text-center"
                      style={{
                        borderColor: fgHex,
                        color: fgHex,
                        backgroundColor: "transparent",
                      }}
                    >
                      Secondary
                    </button>
                  </div>
                </div>
              )}

              {/* Mode 2: Editorial Story */}
              {previewMode === "editorial" && (
                <div className="space-y-5 max-w-lg mx-auto w-full my-auto">
                  <div className="space-y-1">
                    <span className="text-xs font-mono tracking-widest uppercase opacity-75">
                      Issue 42 • Digital Craft
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                      The Harmony of Light &amp; Shadow
                    </h2>
                  </div>

                  <p className="text-sm sm:text-base leading-relaxed opacity-95">
                    Human visual perception does not calculate color as separate, isolated hexadecimal integers. We perceive luminance through complex retinal receptive fields tuned to spatial frequency.
                  </p>

                  <div
                    className="p-4 rounded-2xl border-l-4 my-2 opacity-95"
                    style={{ borderColor: fgHex }}
                  >
                    <blockquote className="text-sm italic font-medium leading-relaxed">
                      &ldquo;When contrast is calibrated perceptually, user interfaces achieve an effortless calm that users feel before they read.&rdquo;
                    </blockquote>
                  </div>

                  <div className="flex items-center justify-between text-xs opacity-75 pt-2 font-mono">
                    <span>Sarthak Ranjan Hota</span>
                    <span>Color-Mint Studio</span>
                  </div>
                </div>
              )}

              {/* Mode 3: Typography Scale */}
              {previewMode === "scale" && (
                <div className="space-y-4 max-w-lg mx-auto w-full my-auto">
                  <div className="flex items-center justify-between text-xs font-mono opacity-75 border-b pb-2" style={{ borderColor: fgHex }}>
                    <span>Font Size</span>
                    <span>WCAG Status</span>
                  </div>

                  <div className="space-y-3.5">
                    {/* 32px Display */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-2xl sm:text-3xl font-black tracking-tight truncate">
                        32px Display
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0" style={{ borderColor: fgHex }}>
                        {isAALarge ? "PASS" : "FAIL"}
                      </span>
                    </div>

                    {/* 22px Section Heading */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-xl font-bold tracking-tight truncate">
                        22px Section Title
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0" style={{ borderColor: fgHex }}>
                        {isAALarge ? "PASS" : "FAIL"}
                      </span>
                    </div>

                    {/* 16px Body */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-base truncate">
                        16px Standard Body Copy
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0" style={{ borderColor: fgHex }}>
                        {isAA ? "PASS" : "FAIL"}
                      </span>
                    </div>

                    {/* 13px Caption */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-xs truncate">
                        13px Caption &amp; Metadata
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0" style={{ borderColor: fgHex }}>
                        {isAA ? "PASS" : "FAIL"}
                      </span>
                    </div>

                    {/* 11px Micro-token */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-[11px] font-mono truncate">
                        11px System Code Badge
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0" style={{ borderColor: fgHex }}>
                        {isAAA ? "AAA OPTIMAL" : isAA ? "AA PASS" : "FAIL"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Stage Bottom Footer */}
              <div className="pt-4 border-t flex items-center justify-between text-[11px] opacity-75 font-mono" style={{ borderColor: fgHex }}>
                <span>FG: {fgHex}</span>
                <span>BG: {bgHex}</span>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works & Accessibility Standards Guide (AEO Direct Answers) */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-zinc-100 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Color Contrast &amp; Accessibility Standards Guide</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 leading-relaxed">
              Color-Mint calculates relative luminance and perceptual contrast strictly compliant with W3C Web Content Accessibility Guidelines (WCAG 2.1) and the modern Accessible Perceptual Contrast Algorithm (APCA).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 space-y-1.5">
              <div className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
                <span>WCAG Level AA (Minimum Contrast)</span>
                <span className="font-mono text-emerald-400 text-[11px]">4.5:1 / 3:1</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Requires a minimum contrast ratio of <strong>4.5:1</strong> for regular body text (&lt; 18pt) and <strong>3.0:1</strong> for large text (18pt+ or 14pt bold). This ensures content is readable for users with moderate low vision.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 space-y-1.5">
              <div className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
                <span>WCAG Level AAA (Enhanced Contrast)</span>
                <span className="font-mono text-indigo-400 text-[11px]">7.0:1 / 4.5:1</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The gold standard for accessibility, demanding at least <strong>7.0:1</strong> for body typography and <strong>4.5:1</strong> for large headings, guaranteeing legibility across severe visual impairments.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 space-y-1.5">
              <div className="text-xs font-semibold text-zinc-200">
                How Relative Luminance is Calculated
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Luminance is calculated by linearizing sRGB values through gamma expansion and weighting spectral sensitivity (21.26% Red, 71.52% Green, 7.22% Blue), measuring perceived photometric brightness.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 space-y-1.5">
              <div className="text-xs font-semibold text-zinc-200">
                APCA vs Traditional WCAG 2.1
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                APCA (Accessible Perceptual Contrast Algorithm) models human spatial vision, accounting for font weight and polarity (dark-on-light vs light-on-dark) to eliminate false contrast failures.
              </p>
            </div>
          </div>
        </div>

        {/* Collapsible Frequently Asked Questions (AEO & SEO) */}
        <CollapsibleFaq items={CONTRAST_FAQS} />
      </motion.main>

      <Footer />
    </div>
  );
}
