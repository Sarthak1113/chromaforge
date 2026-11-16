"use client";

import React from "react";
import { useAtom, useSetAtom } from "jotai";
import {
  isShadesModalOpenAtom,
  shadesTargetColorIdAtom,
} from "@/atoms/ui.atoms";
import { paletteAtom, updateColorAtom } from "@/atoms/palette.atoms";
import { generateShadeRamp } from "@/lib/colors/shades";
import { getOptimalTextColor } from "@/lib/colors/contrast";
import { X, Check } from "lucide-react";

export function ShadesModal() {
  const [isOpen, setIsOpen] = useAtom(isShadesModalOpenAtom);
  const [targetId] = useAtom(shadesTargetColorIdAtom);
  const [palette] = useAtom(paletteAtom);
  const updateColor = useSetAtom(updateColorAtom);

  if (!isOpen || !targetId) return null;

  const targetColor = palette.find((c) => c.id === targetId);
  if (!targetColor) return null;

  const shades = generateShadeRamp(targetColor.oklch);

  const handleSelectShade = (hex: string) => {
    updateColor({ id: targetId, hex });
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-100">
              Shades & Tints (OKLCH Scale)
            </h2>
            <p className="text-xs text-zinc-400">
              Perceptual lightness gradient for {targetColor.name} ({targetColor.hex.toUpperCase()})
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shade steps list */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-1.5">
          {shades.map((s) => {
            const isCurrent = s.hex.toLowerCase() === targetColor.hex.toLowerCase();
            const { textColor } = getOptimalTextColor(s.hex);

            return (
              <button
                key={s.step}
                onClick={() => handleSelectShade(s.hex)}
                className="w-full h-12 rounded-xl flex items-center justify-between px-4 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-sm relative group cursor-pointer"
                style={{ backgroundColor: s.hex, color: textColor }}
              >
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-black/20 backdrop-blur-sm">
                    {s.step}
                  </span>
                  <span className="font-mono text-sm font-bold tracking-tight">
                    {s.hex.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-[11px] font-mono opacity-70">
                    L: {(s.l * 100).toFixed(0)}%
                  </span>
                  {isCurrent && (
                    <div className="w-5 h-5 rounded-full bg-black/30 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950/40 flex justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
