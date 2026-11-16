"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  Palette,
  Compass,
  ChevronDown,
  Eye,
  CheckCircle2,
  Layers,
  Image as ImageIcon,
  Download,
  Keyboard,
  Menu,
  X,
} from "lucide-react";
import { useSetAtom } from "jotai";
import { isExportModalOpenAtom, isShortcutsModalOpenAtom } from "@/atoms/ui.atoms";
import { motion, AnimatePresence } from "framer-motion";

export type NavRoute =
  | "generator"
  | "explore"
  | "visualizer"
  | "contrast"
  | "gradients"
  | "image-picker";

interface NavbarProps {
  activePage?: NavRoute;
}

const TOOLS_ITEMS = [
  {
    name: "Palette Visualizer",
    description: "Preview palettes on mock apps & dashboards",
    href: "/visualizer",
    icon: Eye,
    route: "visualizer" as NavRoute,
    badge: "Interactive",
  },
  {
    name: "Contrast Checker",
    description: "Test WCAG 2.1 & APCA text accessibility",
    href: "/contrast",
    icon: CheckCircle2,
    route: "contrast" as NavRoute,
    badge: "WCAG AAA",
  },
  {
    name: "Gradient Studio",
    description: "Generate OKLCH-interpolated gradients",
    href: "/gradients",
    icon: Layers,
    route: "gradients" as NavRoute,
    badge: "in oklch",
  },
  {
    name: "Image Extractor",
    description: "Extract dominant color palettes from photos",
    href: "/image-picker",
    icon: ImageIcon,
    route: "image-picker" as NavRoute,
    badge: "Auto-Cluster",
  },
];

export function Navbar({ activePage = "generator" }: NavbarProps) {
  const [mounted, setMounted] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const setExportOpen = useSetAtom(isExportModalOpenAtom);
  const setShortcutsOpen = useSetAtom(isShortcutsModalOpenAtom);

  const isToolActive = [
    "visualizer",
    "contrast",
    "gradients",
    "image-picker",
  ].includes(activePage);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        toolsMenuRef.current &&
        !toolsMenuRef.current.contains(event.target as Node)
      ) {
        setIsToolsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsToolsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="h-14 sm:h-16 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Left: Brand Logo & Desktop Nav Tabs */}
      <div className="flex items-center space-x-3 sm:space-x-6">
        {/* Brand Anchor */}
        <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3.5 group">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform text-xs sm:text-sm">
            CM
          </div>
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="text-sm font-bold text-zinc-100 tracking-tight group-hover:text-white transition-colors block">
                Color-Mint
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                OKLCH
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-zinc-400">
              Perceptual Palette & Design Suite
            </p>
          </div>
        </Link>

        {/* Global Navigation Tabs (Generator | Explore | Tools Dropdown) - Desktop Only */}
        <nav className="hidden md:flex items-center space-x-1 pl-4 border-l border-zinc-800/80">
          {/* Generator Tab */}
          <Link
            href="/"
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
              activePage === "generator"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            <span>Generator</span>
          </Link>

          {/* Explore Tab */}
          <Link
            href="/explore"
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
              activePage === "explore"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>Explore</span>
          </Link>

          {/* Tools Menu Popover */}
          <div className="relative" ref={toolsMenuRef}>
            <button
              onClick={() => setIsToolsOpen(!isToolsOpen)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
                isToolActive || isToolsOpen
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              }`}
            >
              <span>Tools</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isToolsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isToolsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-full left-0 mt-2 w-80 bg-zinc-900/95 border border-zinc-800 rounded-2xl shadow-2xl p-2 backdrop-blur-xl z-50 overflow-hidden"
                >
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                    Design Utilities
                  </div>
                  <div className="space-y-1">
                    {TOOLS_ITEMS.map((item) => {
                      const Icon = item.icon;
                      const isCurrent = activePage === item.route;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsToolsOpen(false)}
                          className={`flex items-start space-x-3 p-2.5 rounded-xl transition-all ${
                            isCurrent
                              ? "bg-indigo-600/15 border border-indigo-500/30 text-white"
                              : "hover:bg-zinc-800/80 text-zinc-300 hover:text-white"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg mt-0.5 ${
                              isCurrent
                                ? "bg-indigo-600 text-white"
                                : "bg-zinc-800 text-zinc-400"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold">
                                {item.name}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Privacy & Legal Footnote */}
                  <div className="pt-2 mt-1 border-t border-zinc-800/80 px-2 flex items-center justify-between text-[11px] text-zinc-500">
                    <Link
                      href="/privacy"
                      onClick={() => setIsToolsOpen(false)}
                      className="hover:text-zinc-300 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                    <span>100% Client-Side</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
      </div>

      {/* Right: Actions & Mobile Hamburger Menu */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Desktop-Only Keyboard Shortcuts (Hidden on mobile/tablet) */}
        {activePage === "generator" && (
          <button
            onClick={() => setShortcutsOpen(true)}
            className="hidden md:flex p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all active:scale-95 cursor-pointer"
            title="Keyboard Shortcuts (?)"
          >
            <Keyboard className="w-4 h-4" />
          </button>
        )}

        {/* Export Palette Button (Homepage) */}
        {activePage === "generator" && (
          <button
            onClick={() => setExportOpen(true)}
            className="flex items-center space-x-1.5 sm:space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Export Palette</span>
            <span className="sm:hidden">Export</span>
          </button>
        )}

        {/* Mobile Hamburger Drawer Trigger (Visible only on < md) */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-900 border border-zinc-800/80 active:scale-95 transition-all cursor-pointer flex items-center justify-center min-w-[38px] min-h-[38px]"
          aria-label={isMobileMenuOpen ? "Close navigation" : "Open navigation"}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Slide-Out Navigation Drawer rendered directly to document.body via Portal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isMobileMenuOpen && (
              <div className="fixed inset-0 z-[100] md:hidden">
                {/* Full-screen Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
                />

                {/* Full-height Slide-in Drawer */}
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 28, stiffness: 300 }}
                  className="fixed inset-y-0 right-0 w-80 max-w-[85vw] h-full h-dvh bg-zinc-950 border-l border-zinc-800 p-6 flex flex-col justify-between shadow-2xl z-10 select-none overflow-y-auto"
                >
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center font-bold text-white text-xs shadow-md">
                          CM
                        </div>
                        <div>
                          <span className="font-bold text-sm text-zinc-100 block">
                            Color-Mint
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400">
                            OKLCH Studio
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                        aria-label="Close menu"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Primary Pages */}
                    <div className="space-y-1">
                      <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                        Main Pages
                      </div>

                      <Link
                        href="/"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
                          activePage === "generator"
                            ? "bg-indigo-600/15 border border-indigo-500/30 text-white font-bold shadow-sm"
                            : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                        }`}
                      >
                        <Palette className="w-4 h-4 text-indigo-400" />
                        <span>Palette Generator</span>
                      </Link>

                      <Link
                        href="/explore"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
                          activePage === "explore"
                            ? "bg-indigo-600/15 border border-indigo-500/30 text-white font-bold shadow-sm"
                            : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                        }`}
                      >
                        <Compass className="w-4 h-4 text-indigo-400" />
                        <span>Explore Curated Palettes</span>
                      </Link>
                    </div>

                    {/* Design Utilities */}
                    <div className="space-y-1">
                      <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                        Design Utilities
                      </div>

                      {TOOLS_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isCurrent = activePage === item.route;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-start space-x-3 p-3 rounded-2xl transition-all ${
                              isCurrent
                                ? "bg-indigo-600/15 border border-indigo-500/30 text-white font-bold shadow-sm"
                                : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                            }`}
                          >
                            <div
                              className={`p-2 rounded-xl mt-0.5 ${
                                isCurrent
                                  ? "bg-indigo-600 text-white"
                                  : "bg-zinc-900 text-zinc-400 border border-zinc-800"
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold">{item.name}</span>
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                                  {item.badge}
                                </span>
                              </div>
                              <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Drawer Footer */}
                  <div className="pt-6 border-t border-zinc-800/80 space-y-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setExportOpen(true);
                      }}
                      className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-semibold shadow-sm transition-all cursor-pointer active:scale-98"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Export Palette</span>
                    </button>

                    <div className="flex items-center justify-center space-x-3 text-[11px] text-zinc-500 pt-1">
                      <Link
                        href="/privacy"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="hover:text-zinc-300 transition-colors"
                      >
                        Privacy Policy
                      </Link>
                      <span>•</span>
                      <a
                        href="https://sarthakranjanhota.site"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-zinc-300 transition-colors"
                      >
                        Sarthak Ranjan Hota
                      </a>
                    </div>

                    <p className="text-center text-[10px] font-mono text-zinc-600">
                      Color-Mint • OKLCH Perceptual Engine
                    </p>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </header>
  );
}
