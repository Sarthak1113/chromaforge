"use client";

import React from "react";
import { useAtom, useSetAtom } from "jotai";
import {
  paletteAtom,
  generatePaletteAtom,
  undoAtom,
  redoAtom,
  addColorAtom,
  removeLastColorAtom,
  harmonyModeAtom,
} from "@/atoms/palette.atoms";
import { isExportModalOpenAtom, isShortcutsModalOpenAtom } from "@/atoms/ui.atoms";
import { colorBlindnessModeAtom } from "@/atoms/color-blindness.atoms";
import { HarmonyType, ColorBlindnessType } from "@/types/color";
import {
  Undo2,
  Redo2,
  Plus,
  Minus,
  Download,
  Eye,
  Sparkles,
  Glasses,
  Keyboard,
} from "lucide-react";
import Link from "next/link";

export function Toolbar() {
  const [colors] = useAtom(paletteAtom);
  const [harmony, setHarmony] = useAtom(harmonyModeAtom);
  const [blindnessMode, setBlindnessMode] = useAtom(colorBlindnessModeAtom);
  const generatePalette = useSetAtom(generatePaletteAtom);
  const undo = useSetAtom(undoAtom);
  const redo = useSetAtom(redoAtom);
  const addColor = useSetAtom(addColorAtom);
  const removeLastColor = useSetAtom(removeLastColorAtom);
  const setExportModalOpen = useSetAtom(isExportModalOpenAtom);
  const setShortcutsModalOpen = useSetAtom(isShortcutsModalOpenAtom);

  return (
    <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-6 flex items-center justify-between z-30 select-none">
      {/* Brand logo & title - Consistent across all pages */}
      <Link href="/" className="flex items-center space-x-3.5 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
          CF
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-sm font-bold text-zinc-100 tracking-tight group-hover:text-white transition-colors">
              ChromaForge
            </h1>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-semibold border border-indigo-500/30">
              OKLCH v2
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Press <span className="font-mono text-zinc-200">Spacebar</span> to generate
          </p>
        </div>
      </Link>

      {/* Middle controls: Harmony selection & size */}
      <div className="flex items-center space-x-2.5">
        {/* Harmony Selector */}
        <div className="flex items-center space-x-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <select
            value={harmony}
            onChange={(e) => setHarmony(e.target.value as HarmonyType)}
            className="bg-transparent text-zinc-200 outline-none cursor-pointer text-xs"
          >
            <option value="random" className="bg-zinc-900">Random Harmony</option>
            <option value="analogous" className="bg-zinc-900">Analogous</option>
            <option value="monochromatic" className="bg-zinc-900">Monochromatic</option>
            <option value="triadic" className="bg-zinc-900">Triadic</option>
            <option value="complementary" className="bg-zinc-900">Complementary</option>
            <option value="split-complementary" className="bg-zinc-900">Split Complementary</option>
            <option value="golden-ratio" className="bg-zinc-900">Golden Ratio</option>
            <option value="pastel" className="bg-zinc-900">Pastel</option>
            <option value="deep" className="bg-zinc-900">Deep & Moody</option>
          </select>
        </div>

        {/* Color Blindness Simulation Mode */}
        <div className="flex items-center space-x-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs">
          <Glasses className="w-3.5 h-3.5 text-zinc-400" />
          <select
            value={blindnessMode}
            onChange={(e) => setBlindnessMode(e.target.value as ColorBlindnessType)}
            className="bg-transparent text-zinc-200 outline-none cursor-pointer text-xs"
            title="Simulate Color Vision Deficiency"
          >
            <option value="normal" className="bg-zinc-900">Normal Vision</option>
            <option value="protanopia" className="bg-zinc-900">Protanopia (Red-Blind)</option>
            <option value="deuteranopia" className="bg-zinc-900">Deuteranopia (Green-Blind)</option>
            <option value="tritanopia" className="bg-zinc-900">Tritanopia (Blue-Blind)</option>
            <option value="achromatopsia" className="bg-zinc-900">Achromatopsia (Monochrome)</option>
          </select>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center space-x-1 bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg">
          <button
            onClick={() => undo()}
            className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-300 transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => redo()}
            className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-300 transition-colors"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Color Column Sizing (+ / -) */}
        <div className="flex items-center space-x-1">
          {colors.length > 2 && (
            <button
              onClick={() => removeLastColor()}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-red-500/20 text-zinc-300 hover:text-red-400 border border-zinc-800 text-xs transition-colors"
              title="Remove Color Column (Min 2)"
            >
              <Minus className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          )}

          {colors.length < 10 && (
            <button
              onClick={() => addColor()}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs transition-colors"
              title="Add Color Column (Max 10)"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>

      {/* Right navigation & actions */}
      <div className="flex items-center space-x-2.5">
        <button
          onClick={() => setShortcutsModalOpen(true)}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
          title="Keyboard Shortcuts (?)"
        >
          <Keyboard className="w-4 h-4" />
        </button>
        <Link
          href="/explore"
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
        >
          Explore
        </Link>
        <Link
          href="/visualizer"
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors flex items-center space-x-1"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Visualizer</span>
        </Link>
        <button
          onClick={() => setExportModalOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 text-xs font-medium transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
        <button
          onClick={() => generatePalette()}
          className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <span>Generate</span>
        </button>
      </div>
    </header>
  );
}
