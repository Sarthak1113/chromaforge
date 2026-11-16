"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Eye,
  Sliders,
  Download,
  ArrowRight,
  Check,
  Layout,
  Briefcase,
  Type,
  Grid3X3,
  Palette,
  Plus,
  Minus,
} from "lucide-react";
import { MockUIDashboard } from "@/components/visualizer/MockUIDashboard";
import {
  MockBrandingView,
  MockTypographyView,
  MockPatternView,
  MockIllustrationView,
} from "@/components/visualizer/VisualizerViews";
import { useAtom, useSetAtom } from "jotai";
import {
  paletteAtom,
  generatePaletteAtom,
  addColorAtom,
  removeLastColorAtom,
} from "@/atoms/palette.atoms";
import { downloadSvgFile } from "@/lib/export/exporters";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { CollapsibleFaq } from "@/components/common/CollapsibleFaq";
import { motion, AnimatePresence } from "framer-motion";

const VISUALIZER_FAQS = [
  {
    question: "How does contextual UI color previewing speed up design systems?",
    answer:
      "Rather than testing color tokens in isolation on abstract swatch cards, the visualizer maps your active palette directly into real UI widgets: analytics cards, metric charts, button hierarchies, and mobile interfaces. This reveals visual balance and contrast problems immediately before committing to code.",
  },
  {
    question: "Can I test my palette for dark mode and light mode readability?",
    answer:
      "Yes. The visualizer tests how primary accents, secondary fills, surface backgrounds, and border tokens interact in dark theme contexts. You can swap swatches or adjust color counts from 2 to 8 directly in the sticky bottom control bar.",
  },
  {
    question: "How do I export visualizer tokens to Tailwind CSS v4 or CSS variables?",
    answer:
      "Click 'Generator' in the bottom toolbar to return to the workspace, then click 'Export' (or press E). You can copy clean Tailwind CSS v4 theme variables, CSS custom properties (--color-primary), JSON token schemas, or SVG vector swatches.",
  },
  {
    question: "Does the visualizer support SVG vector export?",
    answer:
      "Yes. Click the 'SVG' button in the bottom dock to download an editable vector graphic of your current palette swatches with hex annotations, ready to import into Figma, Sketch, or Adobe Illustrator.",
  },
];

type VisualizerCategory = "ui" | "branding" | "typography" | "pattern" | "illustration";

const CATEGORIES: { id: VisualizerCategory; label: string; icon: React.ElementType }[] = [
  { id: "ui", label: "Mobile/Web UI", icon: Layout },
  { id: "branding", label: "Branding", icon: Briefcase },
  { id: "typography", label: "Typography", icon: Type },
  { id: "pattern", label: "Pattern", icon: Grid3X3 },
  { id: "illustration", label: "Illustration", icon: Palette },
];

export default function VisualizerPage() {
  const [selectedCategory, setSelectedCategory] = useState<VisualizerCategory>("ui");
  const [palette] = useAtom(paletteAtom);
  const generatePalette = useSetAtom(generatePaletteAtom);
  const addColor = useSetAtom(addColorAtom);
  const removeLastColor = useSetAtom(removeLastColorAtom);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col select-none">
      <Navbar activePage="visualizer" />

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full flex flex-col space-y-6 pb-12"
      >
        {/* Header */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 pb-2">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight flex items-center space-x-3">
              <Eye className="w-8 h-8 text-indigo-400 shrink-0" />
              <span>Palette Visualizer</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-400">
              Preview your colors on real designs for a better visual understanding.
            </p>
          </div>

          <button
            onClick={() => generatePalette()}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all cursor-pointer w-fit"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Shuffle Palette</span>
          </button>
        </div>

        {/* Filter Pills - Horizontal Touch Rail on Mobile */}
        <div className="flex overflow-x-auto no-scrollbar py-1 gap-2 select-none -mx-2 px-2 sm:mx-0 sm:px-0">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center space-x-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 cursor-pointer shrink-0 ${
                  isSelected
                    ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-indigo-400" : "text-zinc-500"}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Design Showcase */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {selectedCategory === "ui" && <MockUIDashboard />}
            {selectedCategory === "branding" && <MockBrandingView />}
            {selectedCategory === "typography" && <MockTypographyView />}
            {selectedCategory === "pattern" && <MockPatternView />}
            {selectedCategory === "illustration" && <MockIllustrationView />}
          </motion.div>
        </AnimatePresence>

        {/* Collapsible Frequently Asked Questions (AEO & SEO) */}
        <CollapsibleFaq items={VISUALIZER_FAQS} />
      </motion.main>

      <div className="pb-20 sm:pb-16">
        <Footer />
      </div>

      {/* Sticky Bottom Active Palette Bar */}
      <div className="sticky bottom-0 left-0 right-0 z-30 border-t border-zinc-800/90 bg-zinc-950/95 backdrop-blur-xl px-4 sm:px-6 py-2.5 sm:py-3 shadow-2xl pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
          {/* Swatches Strip & Size Controls */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 w-full sm:w-auto flex-1 min-w-0">
            <div className="h-9 sm:h-10 flex-1 max-w-none sm:max-w-md flex rounded-xl overflow-hidden shadow-inner border border-zinc-800">
              {palette.map((color, i) => (
                <div
                  key={color.id || i}
                  onClick={() => handleCopyHex(color.hex)}
                  className="flex-1 h-full flex items-end justify-center pb-1 cursor-pointer transition-transform hover:scale-y-110 active:scale-95 group relative"
                  style={{ backgroundColor: color.hex }}
                  title={`Click to copy ${color.hex}`}
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 backdrop-blur-md px-1 py-0.5 rounded text-[9px] font-mono font-bold text-white shadow-md">
                    {copiedHex === color.hex ? "COPIED" : color.hex.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>

            {/* Column Adjusters (+ / -) Bounded to Min 2, Max 8 */}
            <div className="flex items-center space-x-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl shrink-0">
              <button
                onClick={() => removeLastColor()}
                disabled={palette.length <= 2}
                className="p-1 sm:p-1.5 rounded-lg hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent text-zinc-300 hover:text-red-400 transition-all active:scale-90 cursor-pointer"
                title="Remove Color (Min 2)"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <span className="px-1.5 text-xs font-mono text-zinc-300 font-semibold">
                {palette.length} <span className="text-[10px] text-zinc-500">/ 8</span>
              </span>

              <button
                onClick={() => addColor()}
                disabled={palette.length >= 8}
                className="p-1 sm:p-1.5 rounded-lg hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent text-zinc-300 hover:text-white transition-all active:scale-90 cursor-pointer"
                title="Add Color (Max 8)"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {copiedHex && (
              <span className="text-xs font-mono text-emerald-400 font-bold hidden lg:flex items-center gap-1 shrink-0">
                <Check className="w-3 h-3" /> Copied {copiedHex}
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => downloadSvgFile(palette)}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-semibold active:scale-95 transition-all cursor-pointer shadow-sm"
              title="Download SVG vector file"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>SVG</span>
            </button>

            <Link
              href="/"
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold active:scale-95 shadow-md shadow-indigo-600/25 transition-all cursor-pointer whitespace-nowrap"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Generator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
