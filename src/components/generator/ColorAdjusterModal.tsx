"use client";

import React, { useState, useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import {
  isAdjusterModalOpenAtom,
  adjusterTargetColorIdAtom,
} from "@/atoms/ui.atoms";
import { paletteAtom, updateColorAtom } from "@/atoms/palette.atoms";
import {
  oklchToRgb,
  rgbToOklch,
  rgbToHsl,
  rgbToCmyk,
  oklchToHex,
  hexToOklch,
} from "@/lib/colors/oklch";
import { getOptimalTextColor } from "@/lib/colors/contrast";
import { X, Check } from "lucide-react";
import { OKLCHColor, RGBColor, HSLColor, CMYKColor } from "@/types/color";

export function ColorAdjusterModal() {
  const [isOpen, setIsOpen] = useAtom(isAdjusterModalOpenAtom);
  const [targetId] = useAtom(adjusterTargetColorIdAtom);
  const [palette] = useAtom(paletteAtom);
  const updateColor = useSetAtom(updateColorAtom);

  const [activeTab, setActiveTab] = useState<"oklch" | "rgb" | "hsl" | "cmyk">("oklch");
  const [currentOklch, setCurrentOklch] = useState<OKLCHColor>({ l: 0.5, c: 0.1, h: 180 });
  const [hexInput, setHexInput] = useState<string>("#808080");

  const targetColor = palette.find((c) => c.id === targetId);

  useEffect(() => {
    if (targetColor) {
      setCurrentOklch(targetColor.oklch);
      setHexInput(targetColor.hex);
    }
  }, [targetColor, isOpen]);

  if (!isOpen || !targetColor) return null;

  const currentRgb: RGBColor = oklchToRgb(currentOklch);
  const currentHsl: HSLColor = rgbToHsl(currentRgb);
  const currentCmyk: CMYKColor = rgbToCmyk(currentRgb);
  const currentHex = oklchToHex(currentOklch);
  const { textColor, contrastRatio } = getOptimalTextColor(currentOklch);

  const handleOklchChange = (key: keyof OKLCHColor, val: number) => {
    const updated = { ...currentOklch, [key]: val };
    setCurrentOklch(updated);
    setHexInput(oklchToHex(updated));
  };

  const handleRgbChange = (key: keyof RGBColor, val: number) => {
    const updatedRgb = { ...currentRgb, [key]: val };
    const updatedOklch = rgbToOklch(updatedRgb);
    setCurrentOklch(updatedOklch);
    setHexInput(oklchToHex(updatedOklch));
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      const oklch = hexToOklch(val);
      setCurrentOklch(oklch);
    }
  };

  const handleSave = () => {
    if (targetId) {
      updateColor({ id: targetId, oklch: currentOklch });
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-100">
              Adjust Color
            </h2>
            <p className="text-xs text-zinc-400">
              Fine-tune values across OKLCH, RGB, HSL and CMYK color spaces
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Swatch Preview */}
        <div
          className="h-28 flex flex-col justify-end p-4 transition-colors duration-150"
          style={{ backgroundColor: currentHex, color: textColor }}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-xl font-bold uppercase tracking-tight block">
                {currentHex}
              </span>
              <span className="text-xs font-mono opacity-80">
                Contrast Ratio: {contrastRatio}:1
              </span>
            </div>
            <input
              type="color"
              value={currentHex}
              onChange={(e) => {
                const oklch = hexToOklch(e.target.value);
                setCurrentOklch(oklch);
                setHexInput(e.target.value);
              }}
              className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
            />
          </div>
        </div>

        {/* Color Space Tabs */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/40 px-4 pt-2">
          {(["oklch", "rgb", "hsl", "cmyk"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === tab
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Slider Controls */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[48vh]">
          {activeTab === "oklch" && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-zinc-300 mb-1">
                  <span>Lightness (L)</span>
                  <span className="font-mono">{(currentOklch.l * 100).toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.005"
                  value={currentOklch.l}
                  onChange={(e) => handleOklchChange("l", parseFloat(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-zinc-300 mb-1">
                  <span>Chroma (C)</span>
                  <span className="font-mono">{currentOklch.c.toFixed(3)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.35"
                  step="0.002"
                  value={currentOklch.c}
                  onChange={(e) => handleOklchChange("c", parseFloat(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-zinc-300 mb-1">
                  <span>Hue (H)</span>
                  <span className="font-mono">{currentOklch.h}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  value={currentOklch.h}
                  onChange={(e) => handleOklchChange("h", parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>
          )}

          {activeTab === "rgb" && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-zinc-300 mb-1">
                  <span>Red</span>
                  <span className="font-mono">{currentRgb.r}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={currentRgb.r}
                  onChange={(e) => handleRgbChange("r", parseInt(e.target.value))}
                  className="w-full accent-red-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-zinc-300 mb-1">
                  <span>Green</span>
                  <span className="font-mono">{currentRgb.g}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={currentRgb.g}
                  onChange={(e) => handleRgbChange("g", parseInt(e.target.value))}
                  className="w-full accent-green-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-zinc-300 mb-1">
                  <span>Blue</span>
                  <span className="font-mono">{currentRgb.b}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={currentRgb.b}
                  onChange={(e) => handleRgbChange("b", parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>
          )}

          {activeTab === "hsl" && (
            <div className="space-y-4">
              <div className="flex justify-between text-xs text-zinc-300">
                <span>Hue: <span className="font-mono">{currentHsl.h}°</span></span>
                <span>Sat: <span className="font-mono">{currentHsl.s}%</span></span>
                <span>Light: <span className="font-mono">{currentHsl.l}%</span></span>
              </div>
              <p className="text-xs text-zinc-500">
                Tip: Adjust in OKLCH for perceptually balanced hues and brightness.
              </p>
            </div>
          )}

          {activeTab === "cmyk" && (
            <div className="grid grid-cols-2 gap-4 text-xs font-mono text-zinc-300">
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                <span className="text-zinc-500 block">Cyan (C)</span>
                <span className="text-base font-bold">{currentCmyk.c}%</span>
              </div>
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                <span className="text-zinc-500 block">Magenta (M)</span>
                <span className="text-base font-bold">{currentCmyk.m}%</span>
              </div>
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                <span className="text-zinc-500 block">Yellow (Y)</span>
                <span className="text-base font-bold">{currentCmyk.y}%</span>
              </div>
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                <span className="text-zinc-500 block">Key / Black (K)</span>
                <span className="text-base font-bold">{currentCmyk.k}%</span>
              </div>
            </div>
          )}

          {/* Direct Hex Input */}
          <div className="pt-2">
            <label className="text-xs text-zinc-400 block mb-1">Direct Hex Code</label>
            <input
              type="text"
              value={hexInput}
              onChange={handleHexInputChange}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm font-mono text-zinc-100 focus:outline-none focus:border-indigo-500"
              placeholder="#3b82f6"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950/40 flex justify-end space-x-3">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Color</span>
          </button>
        </div>
      </div>
    </div>
  );
}
