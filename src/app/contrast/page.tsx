"use client";

import React, { useState } from "react";
import {
  ArrowRightLeft,
  CheckCircle2,
  Star,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getContrastRatio } from "@/lib/colors/contrast";
import { hexToOklch } from "@/lib/colors/oklch";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { CollapsibleFaq } from "@/components/common/CollapsibleFaq";
import { motion } from "framer-motion";

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

export default function ContrastPage() {
  const [fgHex, setFgHex] = useState("#112A46");
  const [bgHex, setBgHex] = useState("#ACC8E5");
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

  const handleSwap = () => {
    const temp = bgHex;
    setBgHex(fgHex);
    setFgHex(temp);
  };

  const handleCopyTokens = () => {
    const code = `/* Color-Mint Contrast Token Pair */\ncolor: ${fgHex};\nbackground-color: ${bgHex};\n/* Ratio: ${ratio.toFixed(2)}:1 */`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSuper = ratio >= 7.0;
  const isGood = ratio >= 4.5;
  const isPoor = ratio >= 3.0;

  const ratingLabel = isSuper
    ? "Very good"
    : isGood
    ? "Good"
    : isPoor
    ? "Poor"
    : "Very poor";

  const overallStars = isSuper ? 5 : isGood ? 4 : isPoor ? 2 : 1;
  const smallStars = isSuper ? 3 : isGood ? 2 : 0;
  const largeStars = isSuper || isGood ? 3 : isPoor ? 2 : 0;

  const scoreTheme = isGood
    ? {
        cardBg: "bg-emerald-950/20 border-emerald-500/30",
        text: "text-emerald-400",
        star: "text-emerald-400",
        divider: "border-emerald-500/20",
        badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      }
    : isPoor
    ? {
        cardBg: "bg-amber-950/20 border-amber-500/30",
        text: "text-amber-400",
        star: "text-amber-400",
        divider: "border-amber-500/20",
        badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      }
    : {
        cardBg: "bg-rose-950/20 border-rose-500/30",
        text: "text-rose-400",
        star: "text-rose-400",
        divider: "border-rose-500/20",
        badge: "bg-rose-500/15 text-rose-400 border-rose-500/30",
      };

  const descriptionText = isGood
    ? "Good contrast for small text (below 18pt) and great contrast for large text (above 18pt or bold above 14pt)."
    : isPoor
    ? "Poor contrast for small text (below 18pt). Only passes for large or bold headings (above 18pt or bold above 14pt)."
    : "Fails WCAG accessibility standards for all text sizes. Difficult or impossible to read.";

  const renderStars = (count: number, max: number, activeColor: string) => (
    <div className="flex items-center space-x-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < count ? `fill-current ${activeColor}` : "text-zinc-700/60"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col select-none">
      <Navbar activePage="contrast" />

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex-1 p-5 sm:p-8 max-w-5xl mx-auto w-full flex flex-col space-y-8"
      >
        {/* Page Header */}
        <div className="pt-2 pb-1 space-y-1.5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>WCAG 2.1 &amp; APCA Diagnostic Studio</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
            Color Contrast Checker
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Calculate the contrast ratio of text and background colors in real time.
          </p>
        </div>

        {/* 2-Column Main Interface (Symmetrical, Perfectly Aligned) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Left Column: Color Controls & Contrast Diagnostic Card */}
          <div className="bg-zinc-900/80 border border-zinc-800/90 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl backdrop-blur-sm h-full">
            {/* Color Inputs Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Text Color Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 block uppercase tracking-wider font-mono">
                  Text color
                </label>
                <div className="flex items-center justify-between px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-2xl focus-within:border-emerald-500 transition-colors shadow-inner">
                  <input
                    type="text"
                    value={fgHex}
                    onChange={(e) => setFgHex(e.target.value)}
                    className="w-20 bg-transparent font-mono text-sm font-semibold uppercase text-zinc-100 outline-none"
                    maxLength={7}
                  />
                  <div
                    className="relative w-8 h-8 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-inner cursor-pointer"
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

              {/* Background Color Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 block uppercase tracking-wider font-mono">
                  Background color
                </label>
                <div className="flex items-center justify-between px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-2xl focus-within:border-emerald-500 transition-colors shadow-inner">
                  <input
                    type="text"
                    value={bgHex}
                    onChange={(e) => setBgHex(e.target.value)}
                    className="w-20 bg-transparent font-mono text-sm font-semibold uppercase text-zinc-100 outline-none"
                    maxLength={7}
                  />
                  <div
                    className="relative w-8 h-8 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-inner cursor-pointer"
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

            {/* Contrast Block */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">
                  Contrast
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  OKLCH &Delta;L: {deltaL}%
                </span>
              </div>

              {/* Sleek Polished Score Card */}
              <div
                className={`rounded-2xl border p-5 sm:p-6 transition-colors shadow-lg ${scoreTheme.cardBg}`}
              >
                {/* Top Ratio & Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-baseline space-x-1.5">
                    <span
                      className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${scoreTheme.text}`}
                    >
                      {ratio.toFixed(2)}
                    </span>
                    <span className="text-xs font-mono font-bold text-zinc-500">
                      :1
                    </span>
                  </div>

                  <div className="text-right space-y-1">
                    <span className={`text-xs font-bold block ${scoreTheme.text}`}>
                      {ratingLabel}
                    </span>
                    <div>{renderStars(overallStars, 5, scoreTheme.star)}</div>
                  </div>
                </div>

                {/* Sub-criteria Bar */}
                <div
                  className={`pt-3.5 border-t grid grid-cols-2 gap-4 ${scoreTheme.divider}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${scoreTheme.text}`}>
                      Small text
                    </span>
                    {renderStars(smallStars, 3, scoreTheme.star)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${scoreTheme.text}`}>
                      Large text
                    </span>
                    {renderStars(largeStars, 3, scoreTheme.star)}
                  </div>
                </div>
              </div>

              {/* Explanation text */}
              <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                {descriptionText}
              </p>
            </div>
          </div>

          {/* Right Column: Properly Aligned Interactive Preview Card */}
          <div
            className="rounded-3xl border border-zinc-800 p-6 sm:p-8 flex flex-col justify-between relative transition-colors duration-200 shadow-2xl h-full"
            style={{ backgroundColor: bgHex, color: fgHex }}
          >
            {/* Top Bar of Preview */}
            <div className="flex items-center justify-between w-full">
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border opacity-80"
                style={{ borderColor: fgHex }}
              >
                Live Preview
              </span>

              {/* Swap Button */}
              <button
                type="button"
                onClick={handleSwap}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl backdrop-blur-sm transition-all active:scale-95 cursor-pointer text-xs font-semibold border shadow-xs"
                style={{
                  backgroundColor: fgHex,
                  color: bgHex,
                  borderColor: fgHex,
                }}
                title="Swap foreground & background"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Swap</span>
              </button>
            </div>

            {/* Centered Main Typography Content */}
            <div className="max-w-md mx-auto text-center space-y-3.5 py-8 sm:py-12 my-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Tip of the Day
              </h2>
              <p className="text-sm sm:text-base leading-relaxed opacity-90 font-medium">
                Typography gives language a visual voice, shaping rhythm, hierarchy, and readability.
              </p>
            </div>

            {/* Bottom Meta & Copy Token Bar */}
            <div
              className="pt-3 border-t flex items-center justify-between text-xs font-mono opacity-80"
              style={{ borderColor: fgHex }}
            >
              <span>{fgHex} on {bgHex}</span>
              <button
                type="button"
                onClick={handleCopyTokens}
                className="flex items-center space-x-1 text-[11px] underline underline-offset-2 hover:opacity-100 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy CSS</span>
                  </>
                )}
              </button>
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
