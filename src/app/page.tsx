"use client";

import React, { useEffect } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import {
  generatePaletteAtom,
  undoAtom,
  redoAtom,
  toggleLockByIndexAtom,
  toggleLockHoveredAtom,
  hoveredColorIdAtom,
} from "@/atoms/palette.atoms";
import {
  isExportModalOpenAtom,
  isShortcutsModalOpenAtom,
  isShadesModalOpenAtom,
  shadesTargetColorIdAtom,
  isAdjusterModalOpenAtom,
  adjusterTargetColorIdAtom,
  isThemeSettingsSheetOpenAtom,
} from "@/atoms/ui.atoms";
import { Navbar } from "@/components/common/Navbar";
import { WorkspaceToolbar } from "@/components/generator/WorkspaceToolbar";
import { PaletteBoard } from "@/components/generator/PaletteBoard";
import { ShadesModal } from "@/components/generator/ShadesModal";
import { ColorAdjusterModal } from "@/components/generator/ColorAdjusterModal";
import { ExportModal } from "@/components/export/ExportModal";
import { KeyboardShortcutsHelp } from "@/components/common/KeyboardShortcutsHelp";
import { ThemeSettingsSheet } from "@/components/generator/ThemeSettingsSheet";
import { Sparkles, SlidersHorizontal } from "lucide-react";

export default function Home() {
  const generatePalette = useSetAtom(generatePaletteAtom);
  const undo = useSetAtom(undoAtom);
  const redo = useSetAtom(redoAtom);
  const toggleLockByIndex = useSetAtom(toggleLockByIndexAtom);
  const toggleLockHovered = useSetAtom(toggleLockHoveredAtom);
  const hoveredColorId = useAtomValue(hoveredColorIdAtom);

  const setExportOpen = useSetAtom(isExportModalOpenAtom);
  const setShortcutsOpen = useSetAtom(isShortcutsModalOpenAtom);
  const setShadesOpen = useSetAtom(isShadesModalOpenAtom);
  const setShadesTarget = useSetAtom(shadesTargetColorIdAtom);
  const setAdjusterOpen = useSetAtom(isAdjusterModalOpenAtom);
  const setAdjusterTarget = useSetAtom(adjusterTargetColorIdAtom);
  const setIsThemeSettingsOpen = useSetAtom(isThemeSettingsSheetOpenAtom);

  // Global spacebar and keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      // Spacebar: Generate palette
      if (e.code === "Space") {
        e.preventDefault();
        generatePalette();
        return;
      }

      // Undo / Redo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }

      // Number keys 1-8: Toggle lock by column index
      if (/^[1-8]$/.test(e.key)) {
        const colIndex = parseInt(e.key, 10) - 1;
        toggleLockByIndex(colIndex);
        return;
      }

      // L key: Toggle lock for hovered column
      if (e.key.toLowerCase() === "l") {
        e.preventDefault();
        toggleLockHovered();
        return;
      }

      // E key: Open export dialog
      if (e.key.toLowerCase() === "e") {
        e.preventDefault();
        setExportOpen(true);
        return;
      }

      // S key: Open shades for hovered color
      if (e.key.toLowerCase() === "s" && hoveredColorId) {
        e.preventDefault();
        setShadesTarget(hoveredColorId);
        setShadesOpen(true);
        return;
      }

      // A key: Open adjuster for hovered color
      if (e.key.toLowerCase() === "a" && hoveredColorId) {
        e.preventDefault();
        setAdjusterTarget(hoveredColorId);
        setAdjusterOpen(true);
        return;
      }

      // ? key: Open shortcuts help
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    generatePalette,
    undo,
    redo,
    toggleLockByIndex,
    toggleLockHovered,
    hoveredColorId,
    setExportOpen,
    setShortcutsOpen,
    setShadesOpen,
    setShadesTarget,
    setAdjusterOpen,
    setAdjusterTarget,
  ]);

  return (
    <main className="relative flex flex-col w-screen h-screen bg-zinc-950 select-none overflow-hidden">
      <Navbar activePage="generator" />
      <WorkspaceToolbar />
      <PaletteBoard />

      {/* Mobile Floating Action Bar (Generate + Tune) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 select-none">
        <button
          onClick={() => generatePalette()}
          className="flex items-center space-x-2 px-5 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs shadow-2xl shadow-indigo-600/50 border border-indigo-400/30 transition-all cursor-pointer"
          title="Generate New Palette"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate</span>
        </button>

        <button
          onClick={() => setIsThemeSettingsOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-3 rounded-full bg-zinc-900/95 hover:bg-zinc-800 active:scale-95 text-zinc-200 border border-zinc-700/80 font-semibold text-xs shadow-xl backdrop-blur-xl transition-all cursor-pointer"
          title="Theme & Engine Settings"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
          <span>Tune</span>
        </button>
      </div>

      {/* Semantic AEO & SEO Content for AI Answer Engines & Screen Readers */}
      <section className="sr-only" aria-label="About ChromaForge Palette Generator">
        <h1>ChromaForge — Perceptual Color Palette Generator & Design Suite</h1>
        <p>
          ChromaForge is a high-performance, client-side color engineering platform built on the OKLCH color space by Sarthak Ranjan Hota. It delivers perceptually uniform color harmonies, real-time WCAG 2.1 AAA and APCA contrast matrices, procedural Bézier mesh gradients, and ocular vision deficiency simulations.
        </p>
        <h2>Key Capabilities & Shortcuts</h2>
        <ul>
          <li>Press Spacebar to instantly generate a new perceptually uniform OKLCH palette.</li>
          <li>Press 1 through 8 or click the Lock icon to freeze specific color columns.</li>
          <li>Choose from 9 algorithmic color harmonies: Monochromatic, Complementary, Analogous, Triadic, Tetradic, Split Complementary, Square, Tonal, and Freeform.</li>
          <li>Simulate color vision deficiencies including Protanopia, Deuteranopia, Tritanopia, and Achromatopsia.</li>
          <li>Export production tokens as Tailwind CSS v4, CSS Custom Properties, JSON, SVG, PNG, and shareable Base62 URLs.</li>
        </ul>
      </section>

      {/* Interactive Modals & Sheets */}
      <ThemeSettingsSheet />
      <ShadesModal />
      <ColorAdjusterModal />
      <ExportModal />
      <KeyboardShortcutsHelp />
    </main>
  );
}
