"use client";

import React, { useState } from "react";
import { ArrowRightLeft, CheckCircle2, Star } from "lucide-react";
import { getContrastRatio } from "@/lib/colors/contrast";
import { Navbar } from "@/components/common/Navbar";
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

  const ratio = getContrastRatio(
    {
      r: parseInt(bgHex.slice(1, 3), 16) || 0,
      g: parseInt(bgHex.slice(3, 5), 16) || 0,
      b: parseInt(bgHex.slice(5, 7), 16) || 0,
    },
    {
      r: parseInt(fgHex.slice(1, 3), 16) || 0,
      g: parseInt(fgHex.slice(3, 5), 16) || 0,
      b: parseInt(fgHex.slice(5, 7), 16) || 0,
    }
  );

  const handleSwap = () => {
    const temp = bgHex;
    setBgHex(fgHex);
    setFgHex(temp);
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
        cardBg: "bg-emerald-950/30 border-emerald-500/30",
        text: "text-emerald-400",
        star: "text-emerald-400",
        divider: "border-emerald-500/20",
      }
    : isPoor
    ? {
        cardBg: "bg-amber-950/30 border-amber-500/30",
        text: "text-amber-400",
        star: "text-amber-400",
        divider: "border-amber-500/20",
      }
    : {
        cardBg: "bg-rose-950/30 border-rose-500/30",
        text: "text-rose-400",
        star: "text-rose-400",
        divider: "border-rose-500/20",
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
            i < count ? `fill-current ${activeColor}` : "text-zinc-600/50"
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
        className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full flex flex-col space-y-8"
      >
        {/* Header */}
        <div className="pt-4 pb-2 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight flex items-center space-x-3">
            <CheckCircle2 className="w-8 h-8 text-indigo-400 shrink-0" />
            <span>Contrast Checker</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400">
            Calculate the contrast ratio of text and background colors.
          </p>
        </div>

        {/* 2-Column Main Section (Matching Image Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Left Column: Color Pickers & Contrast Score Card */}
          <div className="bg-zinc-900/80 border border-zinc-800/90 rounded-3xl p-5 sm:p-7 flex flex-col justify-between space-y-6 shadow-xl backdrop-blur-sm">
            {/* Color Inputs Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Text Color Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 block">
                  Text color
                </label>
                <div className="flex items-center justify-between px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-2xl focus-within:border-indigo-500 transition-colors">
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
                <label className="text-xs font-semibold text-zinc-400 block">
                  Background color
                </label>
                <div className="flex items-center justify-between px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-2xl focus-within:border-indigo-500 transition-colors">
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
            <div className="space-y-3">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                Contrast
              </span>

              {/* Tinted Score Card */}
              <div
                className={`rounded-2xl border p-5 transition-colors ${scoreTheme.cardBg}`}
              >
                {/* Top Ratio & Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`text-4xl sm:text-5xl font-extrabold font-mono tracking-tight ${scoreTheme.text}`}
                  >
                    {ratio.toFixed(2)}
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold block ${scoreTheme.text}`}>
                      {ratingLabel}
                    </span>
                    <div className="mt-1">
                      {renderStars(overallStars, 5, scoreTheme.star)}
                    </div>
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

          {/* Right Column: Interactive Tip Card Preview */}
          <div
            className="rounded-3xl border border-zinc-800 p-6 sm:p-10 flex flex-col justify-center items-center text-center relative transition-colors duration-200 shadow-2xl min-h-[260px] sm:min-h-[340px]"
            style={{ backgroundColor: bgHex, color: fgHex }}
          >
            <button
              onClick={handleSwap}
              className="absolute top-5 right-5 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-black/10 hover:bg-black/20 backdrop-blur-sm transition-all active:scale-95 cursor-pointer text-xs font-semibold"
              title="Swap colors"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 opacity-80" />
              <span className="opacity-90">Swap</span>
            </button>

            <div className="max-w-md mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Tip of the Day
              </h2>
              <p className="text-sm sm:text-base leading-relaxed opacity-90 font-medium">
                Typography gives language a visual voice, shaping rhythm, hierarchy, and readability.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works & Accessibility Standards Guide (AEO Direct Answers) */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-5">
          <div>
            <h2 className="text-base font-bold text-zinc-100">
              Color Contrast & Accessibility Standards Guide
            </h2>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Color-Mint calculates relative luminance and perceptual contrast strictly compliant with W3C Web Content Accessibility Guidelines (WCAG 2.1) and the modern Accessible Perceptual Contrast Algorithm (APCA).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-1.5">
              <div className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
                <span>WCAG Level AA (Minimum Contrast)</span>
                <span className="font-mono text-emerald-400 text-[11px]">4.5:1 / 3:1</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Requires a minimum contrast ratio of <strong>4.5:1</strong> for regular body text (&lt; 18pt) and <strong>3.0:1</strong> for large text (18pt+ or 14pt bold). This ensures content is readable for users with moderate low vision.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-1.5">
              <div className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
                <span>WCAG Level AAA (Enhanced Contrast)</span>
                <span className="font-mono text-indigo-400 text-[11px]">7.0:1 / 4.5:1</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The gold standard for accessibility, demanding at least <strong>7.0:1</strong> for body typography and <strong>4.5:1</strong> for large headings, guaranteeing legibility across severe visual impairments.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-1.5">
              <div className="text-xs font-semibold text-zinc-200">
                How Relative Luminance is Calculated
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Luminance is calculated by linearizing sRGB values through gamma expansion and weighting spectral sensitivity (21.26% Red, 71.52% Green, 7.22% Blue), measuring perceived photometric brightness.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-1.5">
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
    </div>
  );
}
