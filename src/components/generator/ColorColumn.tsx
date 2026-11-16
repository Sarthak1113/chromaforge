"use client";

import React, { useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { ColorItem } from "@/types/color";
import { Lock, Unlock, SlidersHorizontal, Grid3X3, Copy, Trash2, Check } from "lucide-react";
import { getOptimalTextColor } from "@/lib/colors/contrast";
import { colorBlindnessModeAtom } from "@/atoms/color-blindness.atoms";
import { hoveredColorIdAtom } from "@/atoms/palette.atoms";
import { simulateColorBlindnessHex } from "@/lib/colors/blindness";

interface ColorColumnProps {
  color: ColorItem;
  index: number;
  canRemove: boolean;
  onToggleLock: (id: string) => void;
  onOpenShades: (id: string) => void;
  onOpenAdjuster: (id: string) => void;
  onRemove: (id: string) => void;
  onCopyHex: (hex: string) => void;
}

export function ColorColumn({
  color,
  index,
  canRemove,
  onToggleLock,
  onOpenShades,
  onOpenAdjuster,
  onRemove,
  onCopyHex,
}: ColorColumnProps) {
  const [blindnessMode] = useAtom(colorBlindnessModeAtom);
  const setHoveredColorId = useSetAtom(hoveredColorIdAtom);
  const [copied, setCopied] = useState(false);

  // Apply color blindness simulation if active
  const displayHex =
    blindnessMode === "normal"
      ? color.hex
      : simulateColorBlindnessHex(color.hex, blindnessMode);

  const { textColor } = getOptimalTextColor(displayHex);

  const handleCopy = () => {
    onCopyHex(color.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const shortcutKey = index < 9 ? `${index + 1}` : index === 9 ? "0" : "";

  return (
    <div
      onMouseEnter={() => setHoveredColorId(color.id)}
      onMouseLeave={() => setHoveredColorId(null)}
      className="relative flex-1 w-full h-full flex transition-colors duration-300 ease-out select-none group"
      style={{ backgroundColor: displayHex, color: textColor }}
    >
      {/* Mobile Horizontal Card Layout (< md) */}
      <div className="flex md:hidden items-center justify-between w-full h-full px-4 py-3 select-none">
        {/* Left: Color Info + Tap to Copy */}
        <button
          onClick={handleCopy}
          className="flex items-center space-x-3 text-left active:scale-95 transition-transform cursor-pointer"
        >
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-base sm:text-lg font-bold tracking-tight">
                {displayHex.toUpperCase()}
              </span>
              {copied && (
                <span className="px-1.5 py-0.5 rounded-full bg-black/40 text-[10px] font-mono font-bold text-emerald-400 flex items-center space-x-1">
                  <Check className="w-2.5 h-2.5" />
                  <span>COPIED</span>
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 text-[11px] opacity-80 font-mono">
              <span className="uppercase font-semibold truncate max-w-[120px]">{color.name}</span>
              <span className="opacity-60">•</span>
              <span className="opacity-70">L:{(color.oklch.l * 100).toFixed(0)}%</span>
            </div>
          </div>
        </button>

        {/* Right: Touch Controls (Always Visible on Mobile) */}
        <div className="flex items-center space-x-1.5">
          {/* Lock / Unlock */}
          <button
            onClick={() => onToggleLock(color.id)}
            className={`p-2.5 rounded-xl backdrop-blur-md transition-all active:scale-90 cursor-pointer ${
              color.isLocked
                ? "bg-black/40 text-white ring-1 ring-white/30"
                : "bg-black/20 hover:bg-black/35 opacity-80"
            }`}
            aria-label={color.isLocked ? "Unlock color" : "Lock color"}
          >
            {color.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>

          {/* Shades Modal Trigger */}
          <button
            onClick={() => onOpenShades(color.id)}
            className="p-2.5 rounded-xl bg-black/20 hover:bg-black/35 opacity-80 backdrop-blur-md transition-all active:scale-90 cursor-pointer"
            aria-label="View shades"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>

          {/* Adjuster Modal Trigger */}
          <button
            onClick={() => onOpenAdjuster(color.id)}
            className="p-2.5 rounded-xl bg-black/20 hover:bg-black/35 opacity-80 backdrop-blur-md transition-all active:scale-90 cursor-pointer"
            aria-label="Adjust color"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Remove Color Trigger (if > 2 colors) */}
          {canRemove && (
            <button
              onClick={() => onRemove(color.id)}
              className="p-2.5 rounded-xl bg-black/20 hover:bg-rose-500/80 opacity-80 backdrop-blur-md transition-all active:scale-90 cursor-pointer"
              aria-label="Remove color"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Desktop Vertical Column Layout (md+) */}
      <div className="hidden md:flex flex-col justify-between w-full h-full p-6">
        {/* Top column controls */}
        <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={() => onToggleLock(color.id)}
            className="flex items-center space-x-1.5 p-2 rounded-xl bg-black/25 hover:bg-black/45 backdrop-blur-md transition-all active:scale-90 cursor-pointer"
            title={`Lock/Unlock color (Press ${shortcutKey} or L)`}
          >
            {color.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            {shortcutKey && (
              <span className="hidden md:inline-block text-[10px] font-mono px-1 rounded bg-black/30 font-semibold opacity-90">
                {shortcutKey}
              </span>
            )}
          </button>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => onOpenShades(color.id)}
              className="p-2.5 rounded-xl bg-black/25 hover:bg-black/45 backdrop-blur-md transition-all active:scale-90 cursor-pointer"
              title="View Shades & Tints (S)"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onOpenAdjuster(color.id)}
              className="p-2.5 rounded-xl bg-black/25 hover:bg-black/45 backdrop-blur-md transition-all active:scale-90 cursor-pointer"
              title="Adjust Color Values (A)"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            {canRemove && (
              <button
                onClick={() => onRemove(color.id)}
                className="p-2.5 rounded-xl bg-black/25 hover:bg-red-500/80 backdrop-blur-md transition-all active:scale-90 cursor-pointer"
                title="Remove color column"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Lock indicator when not hovering */}
        {color.isLocked && (
          <div className="absolute top-6 left-6 group-hover:hidden flex items-center space-x-1.5 p-2 rounded-xl bg-black/25 backdrop-blur-md">
            <Lock className="w-4 h-4" />
            {shortcutKey && (
              <span className="hidden md:inline-block text-[10px] font-mono px-1 rounded bg-black/30 opacity-80">
                {shortcutKey}
              </span>
            )}
          </div>
        )}

        {/* Center quick copy action on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-mono font-medium flex items-center space-x-1.5 shadow-lg">
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 opacity-80" />
                <span>Click Hex to Copy</span>
              </>
            )}
          </div>
        </div>

        {/* Bottom Color Info */}
        <div className="flex flex-col space-y-1 z-10">
          <span className="text-xs font-mono uppercase tracking-widest opacity-80 font-medium">
            {color.name}
          </span>
          <button
            onClick={handleCopy}
            className="text-left font-mono text-2xl font-bold tracking-tight hover:opacity-85 transition-opacity flex items-center space-x-2 cursor-pointer"
          >
            <span>{displayHex.toUpperCase()}</span>
          </button>
          <span className="text-[11px] font-mono opacity-70">
            oklch({color.oklch.l.toFixed(2)} {color.oklch.c.toFixed(2)} {color.oklch.h}°)
          </span>
        </div>
      </div>
    </div>
  );
}
