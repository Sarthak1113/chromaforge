"use client";

import React, { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  X,
  SlidersHorizontal,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from "lucide-react";
import { paletteToSlug } from "@/lib/url/base62";
import {
  ALL_CURATED_PALETTES,
  STYLE_OPTIONS,
  COLOR_COUNT_OPTIONS,
  CuratedPalette,
} from "@/lib/colors/presets";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { CollapsibleFaq } from "@/components/common/CollapsibleFaq";
import { motion, AnimatePresence } from "framer-motion";

const EXPLORE_FAQS = [
  {
    question: "How are the 2,100+ curated color palettes generated?",
    answer:
      "Every curated palette in Color-Mint is mathematically balanced in the OKLCH color space. Palettes span 14 distinct aesthetic styles (such as Warm, Cold, Bright, Dark, Pastel, Vintage, Monochromatic, Gradient, Rainbow, Neon, Earthy, Minimal, Luxury, and Sunset) and 7 size tiers (2 to 8 colors), ensuring consistent perceptual brightness and WCAG-compliant contrast.",
  },
  {
    question: "How can I search and filter palettes by style, color, or size?",
    answer:
      "Use the interactive Styles and Palette Size filter pills at the top, or query the instant search bar. You can search by palette name, style, color count (e.g. '5 colors'), friendly color names (like 'mint', 'navy', 'lavender', 'peach', 'teal'), or exact hex codes (e.g. '#22c55e').",
  },
  {
    question: "Can I edit or customize a curated palette in the generator?",
    answer:
      "Yes! Clicking any curated palette card instantly loads its swatches into the Color-Mint Generator workspace. From there, you can lock your favorite swatches, randomize individual columns, adjust tints and shades, or test contrast in real time.",
  },
  {
    question: "What formats can I copy from the curated explore library?",
    answer:
      "Clicking the copy icon on any palette card copies a clean comma-separated list of hex values. When opened in the Generator, you can export to Tailwind CSS v4 variables, CSS custom properties, JSON token structures, or SVG vector swatches.",
  },
];

const ITEMS_PER_PAGE = 24;

function ExploreContent() {
  const searchParams = useSearchParams();

  // Read initial params from URL if present
  const initialStyle = useMemo(() => {
    const s = searchParams.get("style");
    if (!s) return null;
    return STYLE_OPTIONS.find((opt) => opt.toLowerCase() === s.toLowerCase()) || null;
  }, [searchParams]);

  const initialCount = useMemo(() => {
    const c = searchParams.get("colors");
    if (!c) return null;
    const num = parseInt(c, 10);
    return COLOR_COUNT_OPTIONS.includes(num as any) ? num : null;
  }, [searchParams]);

  const initialQuery = useMemo(() => searchParams.get("q") || "", [searchParams]);
  const initialPage = useMemo(() => {
    const p = searchParams.get("page");
    return p ? Math.max(1, parseInt(p, 10) || 1) : 1;
  }, [searchParams]);

  const [selectedStyle, setSelectedStyle] = useState<string | null>(initialStyle);
  const [selectedCount, setSelectedCount] = useState<number | null>(initialCount);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(false);

  // Sync state to URL smoothly without full navigation
  const syncUrl = useCallback(
    (style: string | null, count: number | null, query: string, page: number, push = false) => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams();
      if (style) params.set("style", style.toLowerCase());
      if (count) params.set("colors", count.toString());
      if (query.trim()) params.set("q", query.trim());
      if (page > 1) params.set("page", page.toString());

      const qs = params.toString();
      const newPath = qs ? `/explore?${qs}` : "/explore";

      if (push) {
        window.history.pushState(null, "", newPath);
      } else {
        window.history.replaceState(null, "", newPath);
      }
    },
    []
  );

  // Handle browser Back / Forward popstate
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const s = params.get("style");
      const c = params.get("colors");
      const q = params.get("q");
      const p = params.get("page");

      setSelectedStyle(
        s ? STYLE_OPTIONS.find((opt) => opt.toLowerCase() === s.toLowerCase()) || null : null
      );
      setSelectedCount(c ? parseInt(c, 10) || null : null);
      setSearchQuery(q || "");
      setCurrentPage(p ? parseInt(p, 10) || 1 : 1);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Multi-vector Filtering across 2,100 palettes
  const filteredPalettes = useMemo(() => {
    const cleanQ = searchQuery.toLowerCase().trim().replace(/^#/, "");

    return ALL_CURATED_PALETTES.filter((p) => {
      // 1. Style Filter
      if (selectedStyle && p.style.toLowerCase() !== selectedStyle.toLowerCase()) {
        return false;
      }

      // 2. Color Count Filter
      if (selectedCount && p.colorCount !== selectedCount) {
        return false;
      }

      // 3. Search Query Filter (name, style, hex, color name, count)
      if (cleanQ) {
        const matchesName = p.name.toLowerCase().includes(cleanQ);
        const matchesStyle = p.style.toLowerCase().includes(cleanQ);
        const matchesHex = p.colors.some((hex) =>
          hex.toLowerCase().replace("#", "").includes(cleanQ)
        );
        const matchesColorName = p.colorNames.some((name) =>
          name.toLowerCase().includes(cleanQ)
        );
        const matchesCount =
          cleanQ.includes("color") && cleanQ.includes(p.colorCount.toString());

        if (
          !matchesName &&
          !matchesStyle &&
          !matchesHex &&
          !matchesColorName &&
          !matchesCount
        ) {
          return false;
        }
      }

      return true;
    });
  }, [selectedStyle, selectedCount, searchQuery]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredPalettes.length / ITEMS_PER_PAGE));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedPalettes = useMemo(() => {
    const start = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredPalettes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPalettes, validCurrentPage]);

  // Event handlers with smooth URL sync
  const handleStyleClick = (style: string | null) => {
    const nextStyle = selectedStyle === style ? null : style;
    setSelectedStyle(nextStyle);
    setCurrentPage(1);
    syncUrl(nextStyle, selectedCount, searchQuery, 1, true);
  };

  const handleCountClick = (count: number | null) => {
    const nextCount = selectedCount === count ? null : count;
    setSelectedCount(nextCount);
    setCurrentPage(1);
    syncUrl(selectedStyle, nextCount, searchQuery, 1, true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    setCurrentPage(1);
    syncUrl(selectedStyle, selectedCount, q, 1, false);
  };

  const handleClearFilters = () => {
    setSelectedStyle(null);
    setSelectedCount(null);
    setSearchQuery("");
    setCurrentPage(1);
    syncUrl(null, null, "", 1, true);
  };

  const handleCopyPalette = (p: CuratedPalette, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(p.colors.join(", "));
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    syncUrl(selectedStyle, selectedCount, searchQuery, page, true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters = Boolean(selectedStyle || selectedCount || searchQuery.trim());
  const activeFilterCount = (selectedStyle ? 1 : 0) + (selectedCount ? 1 : 0);

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col select-none">
      {/* Top Global Navbar */}
      <Navbar activePage="explore" />

      {/* Main Body Content with Entrance Animation */}
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex-1 p-5 sm:p-6 md:p-8 max-w-7xl mx-auto w-full flex flex-col justify-between"
      >
        <div>
          {/* Sub-Header: Title + Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-zinc-800/80">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight flex items-center space-x-2.5">
                <Compass className="w-6 h-6 text-indigo-400" />
                <span>Curated Color Palettes Library</span>
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Showing {filteredPalettes.length > 0 ? (validCurrentPage - 1) * ITEMS_PER_PAGE + 1 : 0}–
                {Math.min(validCurrentPage * ITEMS_PER_PAGE, filteredPalettes.length)} of{" "}
                {filteredPalettes.length.toLocaleString()} curated OKLCH palettes (Page {validCurrentPage} of {totalPages})
              </p>
            </div>

            {/* In-Body Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search by name, hex (#ff5733), or color (mint, navy)..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-8 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                    syncUrl(selectedStyle, selectedCount, "", 1, true);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 p-0.5"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Unique Collapsible Filter Chip System */}
          <div className="mb-8 space-y-3">
            {/* Collapsible Filter Bar */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Main Expand/Collapse Master Filter Chip */}
              <button
                type="button"
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95 ${
                  isFilterExpanded || activeFilterCount > 0
                    ? "bg-zinc-100 text-zinc-950 font-bold shadow-md shadow-black/20"
                    : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700"
                }`}
                title={isFilterExpanded ? "Collapse filter options" : "Expand all styles and sizes"}
              >
                <SlidersHorizontal
                  className={`w-3.5 h-3.5 ${
                    isFilterExpanded || activeFilterCount > 0 ? "text-indigo-600" : "text-indigo-400"
                  }`}
                />
                <span>Filter Palettes</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
                {isFilterExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-60" />
                )}
              </button>

              {/* Active Style Chip (Removable directly from the bar) */}
              {selectedStyle && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-xs text-indigo-200 shadow-sm animate-in fade-in duration-200">
                  <span>
                    Style: <strong className="text-white">{selectedStyle}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleStyleClick(selectedStyle)}
                    className="hover:text-red-400 text-indigo-300 p-0.5 rounded transition-colors cursor-pointer"
                    title="Clear style filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Active Size Chip (Removable directly from the bar) */}
              {selectedCount && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-xs text-indigo-200 font-mono shadow-sm animate-in fade-in duration-200">
                  <span>
                    Size: <strong className="text-white">{selectedCount} Colors</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCountClick(selectedCount)}
                    className="hover:text-red-400 text-indigo-300 p-0.5 rounded transition-colors cursor-pointer"
                    title="Clear size filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Active Search Query Chip */}
              {searchQuery.trim() && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 shadow-sm animate-in fade-in duration-200">
                  <span>
                    Search: <strong className="text-white">&ldquo;{searchQuery}&rdquo;</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setCurrentPage(1);
                      syncUrl(selectedStyle, selectedCount, "", 1, true);
                    }}
                    className="hover:text-red-400 text-zinc-400 p-0.5 rounded transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Quick Popular Style Chips (Available when collapsed for instant 1-tap filtering) */}
              {!isFilterExpanded && (
                <>
                  <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto py-0.5">
                    {["Warm", "Cold", "Pastel", "Dark", "Neon", "Vintage", "Minimal"].map((style) => {
                      const isActive = selectedStyle === style;
                      return (
                        <button
                          key={style}
                          type="button"
                          onClick={() => handleStyleClick(style)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                            isActive
                              ? "bg-zinc-100 text-zinc-950 font-bold shadow-sm"
                              : "bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80"
                          }`}
                        >
                          {style}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsFilterExpanded(true)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 px-2.5 py-1.5 rounded-xl hover:bg-indigo-950/30 transition-colors cursor-pointer font-medium"
                  >
                    + More Styles & Sizes
                  </button>
                </>
              )}

              {/* Reset All Filters Button */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs text-zinc-400 hover:text-red-400 flex items-center space-x-1 px-2.5 py-1.5 rounded-xl hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors ml-auto cursor-pointer"
                  title="Reset all filters and search"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Smooth Collapsible Filter Tray (Expanded Card) */}
            <AnimatePresence>
              {isFilterExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -8 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-5 bg-zinc-900/80 border border-zinc-800/90 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
                    {/* Header inside the expanded drawer */}
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs sm:text-sm font-semibold text-zinc-200">
                          Explore by Style & Palette Size
                        </span>
                        <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
                          ({filteredPalettes.length.toLocaleString()} matching)
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {hasActiveFilters && (
                          <button
                            type="button"
                            onClick={handleClearFilters}
                            className="text-xs text-zinc-400 hover:text-indigo-400 transition-colors cursor-pointer mr-2"
                          >
                            Reset
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setIsFilterExpanded(false)}
                          className="text-xs text-zinc-400 hover:text-white flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/60 transition-colors cursor-pointer"
                        >
                          <span>Collapse</span>
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Styles Row */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2.5">
                        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                          Aesthetic Styles ({STYLE_OPTIONS.length})
                        </h3>
                        {selectedStyle && (
                          <span className="text-[10px] font-medium text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                            {selectedStyle}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleStyleClick(null)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                            selectedStyle === null
                              ? "bg-zinc-100 text-zinc-950 font-bold shadow-sm"
                              : "bg-zinc-800/70 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/50"
                          }`}
                        >
                          All Styles
                        </button>
                        {STYLE_OPTIONS.map((style) => {
                          const isActive = selectedStyle === style;
                          return (
                            <button
                              key={style}
                              type="button"
                              onClick={() => handleStyleClick(style)}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                                isActive
                                  ? "bg-zinc-100 text-zinc-950 font-bold shadow-sm ring-2 ring-indigo-500/30"
                                  : "bg-zinc-800/70 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/50"
                              }`}
                            >
                              {style}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Sizes (2 to 8 colors) Row */}
                    <div className="pt-3 border-t border-zinc-800/60">
                      <div className="flex items-center space-x-2 mb-2.5">
                        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                          Palette Size (2 to 8 Colors)
                        </h3>
                        {selectedCount && (
                          <span className="text-[10px] font-medium text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">
                            {selectedCount} Colors
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleCountClick(null)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                            selectedCount === null
                              ? "bg-indigo-600 text-white font-bold shadow-sm"
                              : "bg-zinc-800/70 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/50"
                          }`}
                        >
                          All Sizes
                        </button>
                        {COLOR_COUNT_OPTIONS.map((count) => {
                          const isActive = selectedCount === count;
                          return (
                            <button
                              key={count}
                              type="button"
                              onClick={() => handleCountClick(count)}
                              className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                                isActive
                                  ? "bg-indigo-600 text-white font-bold shadow-sm ring-2 ring-indigo-500/30"
                                  : "bg-zinc-800/70 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/50"
                              }`}
                            >
                              <span>{count} Colors</span>
                              <span className="opacity-60 font-mono tracking-tighter text-[9px]">
                                {"•".repeat(count)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Footer note */}
                    <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-500">
                      <span>Click any style or size badge on a palette card to filter instantly.</span>
                      <button
                        type="button"
                        onClick={() => setIsFilterExpanded(false)}
                        className="text-indigo-400 hover:underline cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Palettes Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paginatedPalettes.map((p) => {
              const slug = paletteToSlug(p.colors);

              return (
                <div
                  key={p.id}
                  className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-lg hover:border-zinc-700 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl flex flex-col group"
                >
                  {/* Visual Swatch Strip (2 to 8 colors proportionally rendered) */}
                  <Link
                    href={`/palette/${slug}`}
                    className="h-28 flex w-full cursor-pointer relative overflow-hidden"
                    title={`Open ${p.name} in Generator`}
                  >
                    {p.colors.map((hex, i) => (
                      <div
                        key={i}
                        className="flex-1 h-full transition-transform duration-300 group-hover:scale-y-105 origin-bottom"
                        style={{ backgroundColor: hex }}
                        title={`${p.colorNames[i] || "Color"}: ${hex}`}
                      />
                    ))}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <span className="px-3.5 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-xs font-semibold text-white shadow-md active:scale-95 transition-transform">
                        Open in Generator
                      </span>
                    </div>
                  </Link>

                  {/* Card Details */}
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-semibold text-sm text-zinc-100 mb-2 truncate" title={p.name}>
                        {p.name}
                      </h3>

                      {/* Filter Badges: Style + Color Count (Replaced #tags) */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleStyleClick(p.style);
                          }}
                          className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                            selectedStyle === p.style
                              ? "bg-zinc-100 text-zinc-950 font-semibold"
                              : "bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/50"
                          }`}
                          title={`Filter by style: ${p.style}`}
                        >
                          {p.style}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleCountClick(p.colorCount);
                          }}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                            selectedCount === p.colorCount
                              ? "bg-indigo-600 text-white font-semibold"
                              : "bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 border border-zinc-700/50"
                          }`}
                          title={`Filter by size: ${p.colorCount} Colors`}
                        >
                          {p.colorCount} Colors
                        </button>
                      </div>
                    </div>

                    {/* Bottom Hex Bar & Quick Copy Button */}
                    <div className="pt-3 border-t border-zinc-800/70 flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 font-mono text-[10px] text-zinc-400 truncate">
                        {p.colors.slice(0, 4).map((c) => (
                          <span key={c}>{c.toUpperCase()}</span>
                        ))}
                        {p.colors.length > 4 && <span>+{p.colors.length - 4}</span>}
                      </div>

                      <button
                        onClick={(e) => handleCopyPalette(p, e)}
                        className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 active:scale-90 transition-all cursor-pointer"
                        title="Copy hex codes"
                      >
                        {copiedId === p.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPalettes.length === 0 && (
            <div className="text-center py-24 bg-zinc-900/30 border border-zinc-800/60 rounded-2xl my-6">
              <Compass className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-300 font-semibold text-base mb-1">
                No palettes found
              </p>
              <p className="text-zinc-500 text-xs max-w-sm mx-auto mb-4">
                No results match your current combination of style, size, or search query.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Prominent Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-14 py-8 border-t border-zinc-900">
            {/* Previous Page */}
            <button
              onClick={() => handlePageChange(validCurrentPage - 1)}
              disabled={validCurrentPage <= 1}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-zinc-900 text-zinc-300 border border-zinc-800 text-xs font-semibold active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Page Number Buttons */}
            <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto max-w-full py-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= validCurrentPage - 2 && pageNum <= validCurrentPage + 2)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-mono font-bold transition-all active:scale-90 cursor-pointer ${
                        validCurrentPage === pageNum
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                          : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 hover:text-white"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === validCurrentPage - 3 ||
                  pageNum === validCurrentPage + 3
                ) {
                  return (
                    <span key={pageNum} className="text-zinc-600 px-1 text-xs font-mono">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            {/* Next Page */}
            <button
              onClick={() => handlePageChange(validCurrentPage + 1)}
              disabled={validCurrentPage >= totalPages}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-zinc-900 text-zinc-300 border border-zinc-800 text-xs font-semibold active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Collapsible Frequently Asked Questions (AEO & SEO) */}
        <CollapsibleFaq items={EXPLORE_FAQS} className="mt-12" />
      </motion.main>

      <Footer />
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex items-center justify-center">
          <div className="flex items-center space-x-3 text-zinc-400 text-sm">
            <Compass className="w-5 h-5 animate-spin text-indigo-400" />
            <span>Loading 2,100+ curated palettes...</span>
          </div>
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
