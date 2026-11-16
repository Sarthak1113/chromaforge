"use client";

import React, { useState } from "react";
import { useAtom } from "jotai";
import { isExportModalOpenAtom } from "@/atoms/ui.atoms";
import { paletteAtom } from "@/atoms/palette.atoms";
import {
  exportAsCssVariables,
  exportAsTailwindV4Theme,
  exportAsScss,
  exportAsJson,
  exportAsSvg,
  downloadSvgFile,
} from "@/lib/export/exporters";
import { paletteToSlug, packPaletteToBase62 } from "@/lib/url/base62";
import { X, Copy, Check, Share2, Code2, FileCode, Sparkles, Download } from "lucide-react";

export function ExportModal() {
  const [isOpen, setIsOpen] = useAtom(isExportModalOpenAtom);
  const [palette] = useAtom(paletteAtom);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "url" | "tailwind" | "css" | "scss" | "svg" | "json"
  >("url");

  if (!isOpen) return null;

  const hexList = palette.map((c) => c.hex);
  const slug = paletteToSlug(hexList);

  const shareableUrl = typeof window !== "undefined"
    ? `${window.location.origin}/palette/${slug}`
    : `https://color-mint.sarthakranjanhota.site/palette/${slug}`;

  let codeContent = "";
  switch (activeTab) {
    case "url":
      codeContent = shareableUrl;
      break;
    case "tailwind":
      codeContent = exportAsTailwindV4Theme(palette);
      break;
    case "css":
      codeContent = exportAsCssVariables(palette);
      break;
    case "scss":
      codeContent = exportAsScss(palette);
      break;
    case "svg":
      codeContent = exportAsSvg(palette);
      break;
    case "json":
      codeContent = exportAsJson(palette);
      break;
  }

  const handleCopy = (formatName: string, textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedFormat(formatName);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleDownloadSvg = () => {
    downloadSvgFile(palette, `color-mint-${slug}.svg`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col transition-all transform animate-in zoom-in-95 duration-150 max-h-[90vh]">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-zinc-100">
                Export Palette
              </h2>
              <p className="text-xs text-zinc-400">
                Download SVG vectors, grab Tailwind v4 code, or copy shareable link
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mini Palette Swatch */}
        <div className="h-10 flex w-full">
          {palette.map((c) => (
            <div
              key={c.id}
              className="flex-1 h-full"
              style={{ backgroundColor: c.hex }}
              title={`${c.name} (${c.hex})`}
            />
          ))}
        </div>

        {/* Export Options Tabs */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/40 px-4 sm:px-6 pt-2 overflow-x-auto space-x-1 no-scrollbar">
          {[
            { id: "url", label: "Share Link", icon: Share2 },
            { id: "svg", label: "SVG Vector", icon: Download },
            { id: "tailwind", label: "Tailwind v4", icon: Sparkles },
            { id: "css", label: "CSS Variables", icon: Code2 },
            { id: "scss", label: "SCSS", icon: FileCode },
            { id: "json", label: "JSON Tokens", icon: FileCode },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold whitespace-nowrap transition-all border-b-2 active:scale-95 ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-400"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div className="p-6">
          <div className="relative">
            <pre className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-300 overflow-x-auto max-h-60 leading-relaxed">
              {codeContent}
            </pre>
            <div className="absolute top-3 right-3 flex items-center space-x-2">
              {activeTab === "svg" && (
                <button
                  onClick={handleDownloadSvg}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all active:scale-95 shadow-md shadow-indigo-600/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .svg</span>
                </button>
              )}
              <button
                onClick={() => handleCopy(activeTab, codeContent)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 backdrop-blur-md text-xs font-medium text-zinc-200 border border-zinc-700 transition-all active:scale-95"
              >
                {copiedFormat === activeTab ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {activeTab === "url" && (
            <p className="text-xs text-zinc-500 mt-3">
              This link encodes your palette directly into the URL slug for instant, stateless sharing.
            </p>
          )}
          {activeTab === "svg" && (
            <p className="text-xs text-zinc-500 mt-3">
              Export vector SVG with full color swatches, hex codes, and color names for Figma, Illustrator, or web embedding.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950/40 flex items-center justify-between">
          <button
            onClick={handleDownloadSvg}
            className="flex items-center space-x-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download SVG directly</span>
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
