"use client";

import React, { useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import {
  paletteAtom,
  harmonyModeAtom,
  generatePaletteAtom,
  addColorAtom,
  removeLastColorAtom,
} from "@/atoms/palette.atoms";
import { colorBlindnessModeAtom } from "@/atoms/color-blindness.atoms";
import { isThemeSettingsSheetOpenAtom } from "@/atoms/ui.atoms";
import { HarmonyType, ColorBlindnessType } from "@/types/color";
import {
  X,
  Check,
  Sparkles,
  Glasses,
  Minus,
  Plus,
  SlidersHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const HARMONY_OPTIONS: { value: HarmonyType; label: string; desc: string }[] = [
  { value: "random", label: "Random Harmony", desc: "Aesthetic randomized OKLCH seeds" },
  { value: "analogous", label: "Analogous (±30°)", desc: "Adjacent hues on color wheel" },
  { value: "monochromatic", label: "Monochromatic", desc: "Perceptual lightness steps" },
  { value: "triadic", label: "Triadic (120°)", desc: "Three equidistant hue points" },
  { value: "complementary", label: "Complementary (180°)", desc: "Opposite contrasting hues" },
  { value: "split-complementary", label: "Split-Comp", desc: "High contrast with balance" },
  { value: "golden-ratio", label: "Golden Ratio", desc: "Fibonacci hue spacing (137.5°)" },
  { value: "pastel", label: "Pastel Confection", desc: "High lightness, soft chroma" },
  { value: "deep", label: "Deep & Moody", desc: "Rich chroma, low lightness" },
];

const BLINDNESS_OPTIONS: { value: ColorBlindnessType; label: string; desc: string }[] = [
  { value: "normal", label: "Normal Vision", desc: "Standard full trichromatic sight" },
  { value: "protanopia", label: "Protanopia (Red-Blind)", desc: "Long-wavelength deficiency" },
  { value: "deuteranopia", label: "Deuteranopia (Green-Blind)", desc: "Medium-wavelength deficiency" },
  { value: "tritanopia", label: "Tritanopia (Blue-Blind)", desc: "Short-wavelength deficiency" },
  { value: "achromatopsia", label: "Achromatopsia", desc: "Complete absence of color vision" },
];

export function ThemeSettingsSheet() {
  const [isOpen, setIsOpen] = useAtom(isThemeSettingsSheetOpenAtom);
  const [colors] = useAtom(paletteAtom);
  const [harmony, setHarmony] = useAtom(harmonyModeAtom);
  const [blindnessMode, setBlindnessMode] = useAtom(colorBlindnessModeAtom);
  const generatePalette = useSetAtom(generatePaletteAtom);
  const addColor = useSetAtom(addColorAtom);
  const removeLastColor = useSetAtom(removeLastColorAtom);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, setIsOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          {/* Subtle Backdrop with Light Blur (Keeps Palette Visible Above) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Slide-Up Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative z-10 w-full bg-zinc-950/98 border-t border-zinc-800 rounded-t-3xl shadow-2xl p-5 pb-8 flex flex-col max-h-[70vh] backdrop-blur-xl select-none"
          >
            {/* Grab Handle */}
            <div className="w-12 h-1.5 rounded-full bg-zinc-700/80 mx-auto mb-3 cursor-grab" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800/80">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">
                    Theme & Engine Settings
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Harmonies, deficiency filters & size
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
                aria-label="Close settings"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Settings Content */}
            <div className="flex-1 overflow-y-auto space-y-6 py-4 pr-1">
              {/* Section 1: Color Harmony Model */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 px-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-xs font-semibold text-zinc-200">
                    OKLCH Harmony Model
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {HARMONY_OPTIONS.map((opt) => {
                    const isSelected = harmony === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setHarmony(opt.value);
                          generatePalette();
                        }}
                        className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all active:scale-98 cursor-pointer ${
                          isSelected
                            ? "bg-indigo-600/15 border-indigo-500/50 text-white shadow-md ring-1 ring-indigo-500/30"
                            : "bg-zinc-900/60 border-zinc-800/80 text-zinc-300 hover:bg-zinc-900 hover:text-white"
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="text-xs font-bold truncate">
                            {opt.label}
                          </div>
                          <div className="text-[10px] text-zinc-400 leading-tight truncate">
                            {opt.desc}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Color Vision Deficiency Simulator */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 px-1">
                  <Glasses className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-xs font-semibold text-zinc-200">
                    Color Vision Deficiency (Live Simulation)
                  </span>
                </div>

                <div className="space-y-1.5">
                  {BLINDNESS_OPTIONS.map((opt) => {
                    const isSelected = blindnessMode === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setBlindnessMode(opt.value)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl border text-left transition-all active:scale-98 cursor-pointer ${
                          isSelected
                            ? "bg-indigo-600/15 border-indigo-500/50 text-white shadow-md ring-1 ring-indigo-500/30"
                            : "bg-zinc-900/60 border-zinc-800/80 text-zinc-300 hover:bg-zinc-900 hover:text-white"
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold">
                            {opt.label}
                          </div>
                          <div className="text-[10px] text-zinc-400 leading-tight">
                            {opt.desc}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Palette Bounds & Size */}
              <div className="space-y-2 p-3.5 rounded-2xl border border-zinc-800 bg-zinc-900/50">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-zinc-200 block">
                      Palette Size
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Bounded between 2 and 8 colors
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 bg-zinc-950 border border-zinc-800 p-1 rounded-xl">
                    <button
                      onClick={() => removeLastColor()}
                      disabled={colors.length <= 2}
                      className="p-2 rounded-lg hover:bg-zinc-800 disabled:opacity-30 text-zinc-300 hover:text-red-400 transition-all active:scale-90 cursor-pointer"
                      title="Remove Color"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span className="px-2 text-xs font-mono text-zinc-200 font-bold">
                      {colors.length} <span className="text-zinc-500 text-[10px]">/ 8</span>
                    </span>

                    <button
                      onClick={() => addColor()}
                      disabled={colors.length >= 8}
                      className="p-2 rounded-lg hover:bg-zinc-800 disabled:opacity-30 text-zinc-300 hover:text-white transition-all active:scale-90 cursor-pointer"
                      title="Add Color"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action Button */}
            <div className="pt-3 border-t border-zinc-800/80">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Done</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
