"use client";

import React, { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Copy, Check, ChevronLeft, ChevronRight, Compass, X, SlidersHorizontal, Sparkles } from "lucide-react";
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
import { motion } from "framer-motion";

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

          {/* Interactive Filter Panel (Styles & Color Counts) */}
          <div className="mb-8 p-5 bg-zinc-900/70 border border-zinc-800/80 rounded-2xl shadow-sm backdrop-blur-sm space-y-4">
            {/* Styles Row */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center space-x-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
                  <h2 className="text-sm font-semibold text-zinc-200">Styles</h2>
                  {selectedStyle && (
                    <span className="text-[11px] font-medium text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                      {selectedStyle}
                    </span>
                  )}
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs text-zinc-400 hover:text-indigo-400 transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    <span>Reset filters</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleStyleClick(null)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    selectedStyle === null
                      ? "bg-zinc-100 text-zinc-950 font-bold shadow-sm"
                      : "bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/50"
                  }`}
                >
                  All
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
                          : "bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/50"
                      }`}
                    >
                      {style}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sizes (Color Count: 2 to 8) Row */}
            <div className="pt-3 border-t border-zinc-800/60">
              <div className="flex items-center space-x-2 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Palette Size
                </h3>
                {selectedCount && (
                  <span className="text-[11px] font-medium text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">
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
                      : "bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/50"
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
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? "bg-indigo-600 text-white font-bold shadow-sm ring-2 ring-indigo-500/30"
                          : "bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/50"
                      }`}
                    >
                      {count} Colors
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Filter Pills Bar (if filters selected) */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6 text-xs text-zinc-400">
              <span className="font-medium text-zinc-300">Active Filters:</span>
              {selectedStyle && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200">
                  Style: <strong className="text-white">{selectedStyle}</strong>
                  <button
                    onClick={() => handleStyleClick(selectedStyle)}
                    className="hover:text-red-400 ml-1 p-0.5"
                    title="Remove style filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCount && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono">
                  Size: <strong className="text-white">{selectedCount} Colors</strong>
                  <button
                    onClick={() => handleCountClick(selectedCount)}
                    className="hover:text-red-400 ml-1 p-0.5"
                    title="Remove size filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery.trim() && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200">
                  Search: <strong className="text-white">&ldquo;{searchQuery}&rdquo;</strong>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setCurrentPage(1);
                      syncUrl(selectedStyle, selectedCount, "", 1, true);
                    }}
                    className="hover:text-red-400 ml-1 p-0.5"
                    title="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={handleClearFilters}
                className="text-xs text-indigo-400 hover:text-indigo-300 ml-1 font-semibold transition-colors"
              >
                Clear all
              </button>
            </div>
          )}

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
