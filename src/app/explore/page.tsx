"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef, Suspense } from "react";
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
      "Click the big search bar at the top to smoothly open the filter card. Click any style or size chip to embed it directly inside the search bar. You can also type hex codes (e.g. #ff5733) or color names (e.g. mint, navy, lavender, coral) to filter instantaneously.",
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
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

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

  // Click outside to collapse the slide-down filter card
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut: Escape to close filter card
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFilterOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && searchQuery === "") {
      // Remove the last selected chip when backspacing on empty input
      if (selectedCount) {
        handleCountClick(selectedCount);
      } else if (selectedStyle) {
        handleStyleClick(selectedStyle);
      }
    } else if (e.key === "Escape") {
      setIsFilterOpen(false);
    }
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
          {/* Centered Top Sub-Header */}
          <div className="text-center max-w-2xl mx-auto mb-6 pt-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight flex items-center justify-center space-x-3">
              <Compass className="w-7 h-7 sm:w-8 h-8 text-indigo-400" />
              <span>Curated Color Palettes Library</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              Explore {ALL_CURATED_PALETTES.length.toLocaleString()}+ harmonic OKLCH color palettes.
              Search by hex, color name, or click below to filter tags.
            </p>
            <p className="text-[11px] font-mono text-zinc-500 mt-1">
              Showing {filteredPalettes.length > 0 ? (validCurrentPage - 1) * ITEMS_PER_PAGE + 1 : 0}–
              {Math.min(validCurrentPage * ITEMS_PER_PAGE, filteredPalettes.length)} of{" "}
              {filteredPalettes.length.toLocaleString()} palettes (Page {validCurrentPage} of {totalPages})
            </p>
          </div>

          {/* Big Central Search Bar with Embedded Filter Chips & Smooth Slide-Down Card */}
          <div ref={searchContainerRef} className="relative w-full max-w-3xl mx-auto mb-8 z-30">
            {/* The Big Search Bar Container */}
            <div
              onClick={() => {
                searchInputRef.current?.focus();
                setIsFilterOpen(true);
              }}
              className={`w-full flex flex-wrap items-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3.5 rounded-2xl bg-zinc-900/95 border transition-all duration-200 shadow-xl backdrop-blur-md cursor-text ${
                isFilterOpen
                  ? "border-indigo-500/80 ring-2 ring-indigo-500/20 shadow-indigo-500/10"
                  : "border-zinc-800 hover:border-zinc-700"
              }`}
            >
              {/* Search Icon */}
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 shrink-0 mr-1" />

              {/* Embedded Style Chip inside Search Bar */}
              {selectedStyle && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-950/90 border border-indigo-500/50 text-xs font-semibold text-indigo-200 shadow-sm animate-in fade-in zoom-in-95 duration-150">
                  <span>Style: <strong className="text-white">{selectedStyle}</strong></span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStyleClick(selectedStyle);
                    }}
                    className="hover:text-red-400 text-indigo-300 p-0.5 rounded cursor-pointer transition-colors"
                    title="Remove style filter"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {/* Embedded Size Chip inside Search Bar */}
              {selectedCount && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-950/90 border border-indigo-500/50 text-xs font-mono font-semibold text-indigo-200 shadow-sm animate-in fade-in zoom-in-95 duration-150">
                  <span>Size: <strong className="text-white">{selectedCount} Colors</strong></span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCountClick(selectedCount);
                    }}
                    className="hover:text-red-400 text-indigo-300 p-0.5 rounded cursor-pointer transition-colors"
                    title="Remove size filter"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {/* Input Cursor */}
              <input
                ref={searchInputRef}
                type="text"
                placeholder={
                  selectedStyle || selectedCount
                    ? "Add keyword, hex (#ff5733), or color..."
                    : "Search 2,100+ palettes by name, hex (#ff5733), or click to filter tags..."
                }
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsFilterOpen(true)}
                onKeyDown={handleInputKeyDown}
                className="flex-1 min-w-[160px] bg-transparent text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none py-1"
              />

              {/* Right Action Icons in Search Bar */}
              {searchQuery && (
                <div className="flex items-center shrink-0 ml-auto">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchQuery("");
                      setCurrentPage(1);
                      syncUrl(selectedStyle, selectedCount, "", 1, true);
                    }}
                    className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors"
                    title="Clear search text"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Smooth Slide-Down Filter Card right below the Search Bar */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.99 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-0 right-0 mt-2 z-50 bg-zinc-950/95 border border-zinc-800/90 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-2xl"
                >
                  <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                    Styles
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {/* Style Chips */}
                    {STYLE_OPTIONS.map((style) => {
                      const isSelected = selectedStyle === style;
                      return (
                        <button
                          key={style}
                          type="button"
                          onClick={() => handleStyleClick(style)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer active:scale-95 ${
                            isSelected
                              ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30 ring-2 ring-indigo-500/40"
                              : "bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
                          }`}
                        >
                          {style}
                        </button>
                      );
                    })}

                    {/* Palette Size Chips included seamlessly in Styles */}
                    {COLOR_COUNT_OPTIONS.map((count) => {
                      const isSelected = selectedCount === count;
                      return (
                        <button
                          key={count}
                          type="button"
                          onClick={() => handleCountClick(count)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer active:scale-95 ${
                            isSelected
                              ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30 ring-2 ring-indigo-500/40"
                              : "bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
                          }`}
                        >
                          {count} Colors
                        </button>
                      );
                    })}
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

                      {/* Filter Badges: Style + Color Count (Click to add to search bar) */}
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
                              ? "bg-indigo-600 text-white font-semibold shadow-xs"
                              : "bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/50"
                          }`}
                          title={`Add ${p.style} chip to search`}
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
                              ? "bg-indigo-600 text-white font-semibold shadow-xs"
                              : "bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 border border-zinc-700/50"
                          }`}
                          title={`Add ${p.colorCount} Colors chip to search`}
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
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md transition-colors cursor-pointer"
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

      {/* Global Clean Footer */}
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
