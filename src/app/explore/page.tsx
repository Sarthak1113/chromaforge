"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Copy, Check, ChevronLeft, ChevronRight, Compass } from "lucide-react";
import { paletteToSlug } from "@/lib/url/base62";
import { ALL_CURATED_PALETTES, CuratedPalette } from "@/lib/colors/presets";
import { Navbar } from "@/components/common/Navbar";
import { motion } from "framer-motion";

const ITEMS_PER_PAGE = 24;

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter across all 240 palettes
  const filteredPalettes = useMemo(() => {
    if (!searchQuery.trim()) return ALL_CURATED_PALETTES;
    const q = searchQuery.toLowerCase().trim();
    return ALL_CURATED_PALETTES.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.colors.some((c) => c.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredPalettes.length / ITEMS_PER_PAGE));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedPalettes = useMemo(() => {
    const start = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredPalettes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPalettes, validCurrentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col select-none">
      {/* Top Global Navbar - 100% Consistent across all pages */}
      <Navbar activePage="explore" />

      {/* Main Body Content with Entrance Animation */}
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full flex flex-col justify-between"
      >
        <div>
          {/* Body Sub-Header: Title + Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-800/80">
            <div>
              <h1 className="text-lg font-bold text-zinc-100 tracking-tight flex items-center space-x-2">
                <Compass className="w-5 h-5 text-indigo-400" />
                <span>Explore Palettes</span>
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Showing {filteredPalettes.length > 0 ? (validCurrentPage - 1) * ITEMS_PER_PAGE + 1 : 0}–
                {Math.min(validCurrentPage * ITEMS_PER_PAGE, filteredPalettes.length)} of{" "}
                {filteredPalettes.length} curated OKLCH palettes (Page {validCurrentPage} of {totalPages})
              </p>
            </div>

            {/* In-Body Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search 240+ palettes by name, tag, or hex..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors shadow-sm"
              />
            </div>
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
                  {/* Visual 5-Color Strip (Click to open in Generator) */}
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
                      <h3 className="font-semibold text-sm text-zinc-100 mb-2 truncate">
                        {p.name}
                      </h3>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {p.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-zinc-800/80 text-[10px] text-zinc-400 font-mono"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Hex Bar & Quick Copy Button */}
                    <div className="pt-3 border-t border-zinc-800/70 flex items-center justify-between">
                      <div className="flex space-x-1.5 font-mono text-[10px] text-zinc-400 truncate">
                        {p.colors.slice(0, 3).map((c) => (
                          <span key={c}>{c.toUpperCase()}</span>
                        ))}
                        {p.colors.length > 3 && <span>+{p.colors.length - 3}</span>}
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
            <div className="text-center py-24 text-zinc-500 text-sm">
              No palettes found matching &ldquo;{searchQuery}&rdquo;. Try another color name or hex!
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
      </motion.main>
    </div>
  );
}
