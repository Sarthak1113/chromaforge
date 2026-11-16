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
import { Footer } from "@/components/common/Footer";
import { WorkspaceToolbar } from "@/components/generator/WorkspaceToolbar";
import { PaletteBoard } from "@/components/generator/PaletteBoard";
import { ShadesModal } from "@/components/generator/ShadesModal";
import { ColorAdjusterModal } from "@/components/generator/ColorAdjusterModal";
import { ExportModal } from "@/components/export/ExportModal";
import { KeyboardShortcutsHelp } from "@/components/common/KeyboardShortcutsHelp";
import { ThemeSettingsSheet } from "@/components/generator/ThemeSettingsSheet";
import { ScienceSection } from "@/components/home/ScienceSection";
import { ToolsBentoSection } from "@/components/home/ToolsBentoSection";
import { VisualizerShowcaseSection } from "@/components/home/VisualizerShowcaseSection";
import { DeveloperHandoffSection } from "@/components/home/DeveloperHandoffSection";
import { ComparisonTableSection } from "@/components/home/ComparisonTableSection";
import { CtaBannerSection } from "@/components/home/CtaBannerSection";
import { Sparkles, SlidersHorizontal, ChevronDown } from "lucide-react";

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
    <main className="relative flex flex-col w-screen min-h-screen bg-zinc-950 select-none overflow-x-hidden">
      <div className="flex flex-col h-screen w-full relative shrink-0">
        <Navbar activePage="generator" />
        <WorkspaceToolbar />
        <PaletteBoard />

        {/* Mobile Floating Action Bar (Generate + Tune) */}
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 select-none">
          <button
            onClick={() => generatePalette()}
            className="flex items-center space-x-2 px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-2xl shadow-emerald-600/50 border border-emerald-400/30 transition-all cursor-pointer"
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
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tune</span>
          </button>
        </div>

        {/* Subtle Scroll Cue for Desktop Visitors */}
        <div className="hidden lg:flex items-center justify-center absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-60 hover:opacity-100 transition-opacity">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-[11px] font-mono text-zinc-400 backdrop-blur-sm">
            <span>Scroll for color science &amp; design tools</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Conversion-Optimized Content Sections */}
      <ScienceSection />
      <ToolsBentoSection />
      <VisualizerShowcaseSection />
      <DeveloperHandoffSection />
      <ComparisonTableSection />
      <CtaBannerSection />

      <Footer />

      {/* Semantic AEO & SEO Architecture for Search Engine Crawlers & Screen Readers */}
      <section className="sr-only" aria-label="About Color-Mint Palette Generator">
        <h1>Color-Mint: OKLCH Color Palette Generator &amp; Design System Suite</h1>
        <p>
          Color-Mint is an advanced, client-side color engineering suite engineered in the OKLCH color space by Sarthak Ranjan Hota. Designed specifically for UI/UX designers, design system engineers, and frontend developers, Color-Mint delivers mathematically coherent color harmonies, real-time accessibility contrast matrices, procedural Bézier gradients, and ocular vision deficiency simulations.
        </p>

        <h2>Why OKLCH Color Space Outperforms Legacy sRGB and HSL</h2>
        <p>
          Traditional web color models such as sRGB, Hex, and HSL suffer from severe perceptual non-uniformity. In HSL, pure yellow possesses a human perceived lightness of roughly 93 percent, whereas pure blue has a perceived lightness of only 26 percent, despite both sharing an identical lightness value of 50 percent. This mathematical discrepancy causes automated color tools in sRGB to produce garish, clashing, or illegible color combinations. OKLCH solves this by modeling color along three perceptual human visual axes: Lightness (L), Chroma (C), and Hue (H). In OKLCH, identical lightness values correspond to identical perceived visual brightness, guaranteeing balanced typography, accessible surface tokens, and cohesive visual hierarchy.
        </p>

        <h2>Algorithmic Color Harmonies Supported</h2>
        <p>
          Color-Mint calculates color relationships along the cylindrical OKLCH manifold across nine mathematical harmony models: Monochromatic for subtle tonal variation, Complementary for high-contrast pairs, Analogous for nature-inspired cohesion, Triadic and Tetradic for multi-hue systems, Split Complementary and Square for balanced complexity, Tonal ramps for design token scales, and Freeform procedural walks with minimum perceptual distance thresholds.
        </p>

        <h2>Accessibility Compliance: WCAG 2.1 AAA and APCA Standards</h2>
        <p>
          Accessible color design is central to Color-Mint. Our integrated tools evaluate relative luminance compliance against W3C Web Content Accessibility Guidelines (WCAG 2.1) Level AA (4.5 to 1 ratio) and Level AAA (7 to 1 ratio). Furthermore, Color-Mint integrates the Accessible Perceptual Contrast Algorithm (APCA), analyzing font weights, spatial frequencies, and display polarity to eliminate contrast false positives in dark mode and light mode interfaces. Built-in ocular simulation matrices enable real-time previews for Protanopia, Deuteranopia, Tritanopia, and Achromatopsia.
        </p>

        <h2>Keyboard Shortcuts &amp; Rapid Workflow</h2>
        <ul>
          <li>Press Spacebar to instantly compute and generate a new harmonic OKLCH palette.</li>
          <li>Press numbers 1 through 8 to lock specific color columns in place.</li>
          <li>Press L to lock the currently hovered color column.</li>
          <li>Press S to open the 100 to 900 tint and shade distribution dialog.</li>
          <li>Press E to export palette tokens into Tailwind CSS v4, CSS Custom Properties, JSON, SVG, PNG, or Base62 shareable URLs.</li>
        </ul>

        <nav aria-label="Color-Mint Internal Tools Directory">
          <h2>Color-Mint Suite Navigation</h2>
          <ul>
            <li><a href="/">Palette Generator Workspace</a></li>
            <li><a href="/contrast">WCAG and APCA Color Contrast Checker</a></li>
            <li><a href="/gradients">Procedural Bézier and Mesh CSS Gradient Studio</a></li>
            <li><a href="/visualizer">Contextual UI Component and Token Visualizer</a></li>
            <li><a href="/image-picker">OKLCH Dominant Palette Extractor from Image</a></li>
            <li><a href="/explore">Curated Harmonic Color Palettes Library</a></li>
            <li><a href="/privacy">Privacy Policy and Data Transparency</a></li>
          </ul>
        </nav>
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
