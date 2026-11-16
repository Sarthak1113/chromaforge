"use client";

import React, { useState, useRef, useEffect } from "react";
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
import { colorBlindnessModeAtom } from "@/atoms/color-blindness.atoms";
import { isThemeSettingsSheetOpenAtom } from "@/atoms/ui.atoms";
import { HarmonyType, ColorBlindnessType } from "@/types/color";
import {
  Undo2,
  Redo2,
  Plus,
  Minus,
  Sparkles,
  Glasses,
  ChevronDown,
  Check,
  SlidersHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const HARMONY_OPTIONS: { value: HarmonyType; label: string; desc: string }[] = [
  { value: "random", label: "Random Harmony", desc: "Aesthetic randomized OKLCH seeds" },
  { value: "analogous", label: "Analogous (±30°)", desc: "Adjacent hues on the color wheel" },
  { value: "monochromatic", label: "Monochromatic", desc: "Perceptual lightness steps" },
  { value: "triadic", label: "Triadic (120°)", desc: "Three equidistant hue points" },
  { value: "complementary", label: "Complementary (180°)", desc: "Opposite contrasting hues" },
  { value: "split-complementary", label: "Split-Complementary", desc: "High contrast with balance" },
  { value: "golden-ratio", label: "Golden Ratio (137.5°)", desc: "Natural Fibonacci hue spacing" },
  { value: "pastel", label: "Pastel Confection", desc: "High lightness, soft chroma" },
  { value: "deep", label: "Deep & Moody", desc: "Rich chroma, low lightness" },
];

const BLINDNESS_OPTIONS: { value: ColorBlindnessType; label: string; desc: string }[] = [
  { value: "normal", label: "Normal Vision", desc: "Standard full trichromatic sight" },
  { value: "protanopia", label: "Protanopia (Red-Blind)", desc: "Long-wavelength deficiency" },
  { value: "deuteranopia", label: "Deuteranopia (Green-Blind)", desc: "Medium-wavelength deficiency" },
  { value: "tritanopia", label: "Tritanopia (Blue-Blind)", desc: "Short-wavelength deficiency" },
  { value: "achromatopsia", label: "Achromatopsia (Monochrome)", desc: "Complete absence of color vision" },
];

export function WorkspaceToolbar() {
  const [colors] = useAtom(paletteAtom);
  const [harmony, setHarmony] = useAtom(harmonyModeAtom);
  const [blindnessMode, setBlindnessMode] = useAtom(colorBlindnessModeAtom);
  const generatePalette = useSetAtom(generatePaletteAtom);
  const undo = useSetAtom(undoAtom);
  const redo = useSetAtom(redoAtom);
  const addColor = useSetAtom(addColorAtom);
  const removeLastColor = useSetAtom(removeLastColorAtom);
  const setIsThemeSettingsOpen = useSetAtom(isThemeSettingsSheetOpenAtom);

  const [isHarmonyOpen, setIsHarmonyOpen] = useState(false);
  const [isBlindnessOpen, setIsBlindnessOpen] = useState(false);

  const harmonyRef = useRef<HTMLDivElement>(null);
  const blindnessRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (harmonyRef.current && !harmonyRef.current.contains(event.target as Node)) {
        setIsHarmonyOpen(false);
      }
      if (blindnessRef.current && !blindnessRef.current.contains(event.target as Node)) {
        setIsBlindnessOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeHarmonyObj = HARMONY_OPTIONS.find((h) => h.value === harmony) || HARMONY_OPTIONS[0];
  const activeBlindnessObj = BLINDNESS_OPTIONS.find((b) => b.value === blindnessMode) || BLINDNESS_OPTIONS[0];

  return (
    <div className="h-14 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between z-30 select-none">
      {/* Left: Spacebar Generator Trigger & Custom Dropdowns */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Spacebar Generator Button */}
        <button
          onClick={() => generatePalette()}
          className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all cursor-pointer group"
          title="Generate Palette (Spacebar on Desktop)"
        >
          <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
          <span>Generate</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-white/20 text-white font-bold ml-1">
            Space
          </kbd>
        </button>

        {/* Mobile Tune Button (< md) - Opens Theme Settings Bottom Sheet */}
        <button
          onClick={() => setIsThemeSettingsOpen(true)}
          className="md:hidden flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white active:scale-95 text-xs font-semibold cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
          <span>Tune</span>
        </button>

        {/* Custom Modern Harmony Dropdown (Desktop Only) */}
        <div className="relative hidden md:block" ref={harmonyRef}>
          <button
            onClick={() => {
              setIsHarmonyOpen(!isHarmonyOpen);
              setIsBlindnessOpen(false);
            }}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all active:scale-95 cursor-pointer ${
              isHarmonyOpen
                ? "bg-zinc-800 border-indigo-500/50 text-white shadow-lg"
                : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            <span className="text-[11px] text-zinc-400 hidden sm:inline">Harmony:</span>
            <span className="font-semibold text-zinc-100 max-w-[90px] sm:max-w-none truncate">{activeHarmonyObj.label}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
                isHarmonyOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {isHarmonyOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute top-full left-0 mt-2 w-72 bg-zinc-900/95 border border-zinc-800 rounded-2xl shadow-2xl p-1.5 backdrop-blur-xl z-50 overflow-hidden"
              >
                <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                  OKLCH Harmony Models
                </div>
                <div className="space-y-0.5">
                  {HARMONY_OPTIONS.map((opt) => {
                    const isSelected = harmony === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setHarmony(opt.value);
                          setIsHarmonyOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                          isSelected
                            ? "bg-indigo-600/15 border border-indigo-500/30 text-white"
                            : "hover:bg-zinc-800/80 text-zinc-300 hover:text-white"
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold">{opt.label}</div>
                          <div className="text-[10px] text-zinc-400 leading-tight">
                            {opt.desc}
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Custom Modern Vision Deficiency Dropdown */}
        <div className="relative hidden md:block" ref={blindnessRef}>
          <button
            onClick={() => {
              setIsBlindnessOpen(!isBlindnessOpen);
              setIsHarmonyOpen(false);
            }}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all active:scale-95 cursor-pointer ${
              isBlindnessOpen
                ? "bg-zinc-800 border-indigo-500/50 text-white shadow-lg"
                : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            <Glasses className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-semibold text-zinc-100">{activeBlindnessObj.label}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
                isBlindnessOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {isBlindnessOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute top-full left-0 mt-2 w-72 bg-zinc-900/95 border border-zinc-800 rounded-2xl shadow-2xl p-1.5 backdrop-blur-xl z-50 overflow-hidden"
              >
                <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                  Color Vision Deficiency
                </div>
                <div className="space-y-0.5">
                  {BLINDNESS_OPTIONS.map((opt) => {
                    const isSelected = blindnessMode === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setBlindnessMode(opt.value);
                          setIsBlindnessOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                          isSelected
                            ? "bg-indigo-600/15 border border-indigo-500/30 text-white"
                            : "hover:bg-zinc-800/80 text-zinc-300 hover:text-white"
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold">{opt.label}</div>
                          <div className="text-[10px] text-zinc-400 leading-tight">
                            {opt.desc}
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right: History Undo/Redo & Column Size Controls (Bounded to Max 8) */}
      <div className="flex items-center space-x-3">
        {/* Undo / Redo */}
        <div className="flex items-center space-x-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
          <button
            onClick={() => undo()}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all active:scale-90 cursor-pointer"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => redo()}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all active:scale-90 cursor-pointer"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Column Adjusters (+ / -) Bounded to Min 2, Max 8 */}
        <div className="flex items-center space-x-1.5 bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
          <button
            onClick={() => removeLastColor()}
            disabled={colors.length <= 2}
            className="p-1.5 rounded-lg hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent text-zinc-300 hover:text-red-400 transition-all active:scale-90 cursor-pointer"
            title="Remove Column (Min 2)"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <span className="px-1.5 text-xs font-mono text-zinc-300 font-semibold">
            {colors.length} <span className="text-[10px] text-zinc-500">/ 8</span>
          </span>

          <button
            onClick={() => addColor()}
            disabled={colors.length >= 8}
            className="p-1.5 rounded-lg hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent text-zinc-300 hover:text-white transition-all active:scale-90 cursor-pointer"
            title="Add Column (Max 8)"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
