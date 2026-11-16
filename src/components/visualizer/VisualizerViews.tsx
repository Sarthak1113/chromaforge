"use client";

import React from "react";
import { useAtom } from "jotai";
import { paletteAtom } from "@/atoms/palette.atoms";
import { getOptimalTextColor } from "@/lib/colors/contrast";

export function MockBrandingView() {
  const [palette] = useAtom(paletteAtom);
  const c1 = palette[0]?.hex || "#3b82f6";
  const c2 = palette[1]?.hex || "#10b981";
  const c3 = palette[2]?.hex || "#f59e0b";
  const c4 = palette[3]?.hex || "#ef4444";
  const c5 = palette[4]?.hex || "#8b5cf6";
  const t1 = getOptimalTextColor(c1).textColor;
  const t2 = getOptimalTextColor(c2).textColor;

  return (
    <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl text-zinc-100 select-none space-y-6">
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm shadow-lg tracking-wider"
            style={{ backgroundColor: c1, color: t1 }}
          >
            A•X
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight">Apex Labs Identity</h3>
            <p className="text-xs text-zinc-400">Design System & Brand Visuals</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold border border-zinc-700 bg-zinc-900 text-zinc-300">
          v2.4 Brand Spec
        </span>
      </div>

      {/* Business Cards Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card Front */}
        <div
          className="h-52 rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all"
          style={{ backgroundColor: c1, color: t1 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest opacity-80">
              Corporate Mark
            </span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md"
              style={{ backgroundColor: c2, color: t2 }}
            >
              ✦
            </div>
          </div>
          <div>
            <h4 className="text-2xl font-black tracking-tight">APEX LABS</h4>
            <p className="text-xs opacity-80 font-medium mt-0.5">
              Next-generation spatial computation
            </p>
          </div>
        </div>

        {/* Card Back */}
        <div className="h-52 rounded-2xl p-6 flex flex-col justify-between shadow-2xl border border-zinc-800 bg-zinc-900/90 text-zinc-100">
          <div className="flex items-start justify-between">
            <div>
              <h5 className="font-bold text-base">Sarah Jenkins</h5>
              <p className="text-xs font-mono text-zinc-400 mt-0.5">Chief Design Officer</p>
            </div>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c3 }} />
          </div>

          <div className="space-y-1.5 text-xs text-zinc-300 font-mono">
            <p className="flex items-center space-x-2">
              <span className="text-zinc-500">E:</span>
              <span>sarah.j@apexlabs.io</span>
            </p>
            <p className="flex items-center space-x-2">
              <span className="text-zinc-500">W:</span>
              <span>apexlabs.io</span>
            </p>
          </div>

          <div className="flex items-center space-x-1.5 pt-2 border-t border-zinc-800/80">
            {palette.slice(0, 6).map((c, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-md shadow-inner"
                style={{ backgroundColor: c.hex }}
                title={c.hex}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Brand Color Token Swatches */}
      <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40">
        <div className="text-xs font-semibold text-zinc-300 mb-3">Color Hierarchy Tokens</div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {palette.slice(0, 5).map((c, i) => {
            const role = ["Primary", "Secondary", "Accent", "Surface", "Muted"][i] || `Token ${i + 1}`;
            return (
              <div key={i} className="space-y-1.5">
                <div
                  className="h-14 rounded-xl shadow-inner border border-white/10"
                  style={{ backgroundColor: c.hex }}
                />
                <div className="text-[11px] font-bold text-zinc-200">{role}</div>
                <div className="text-[10px] font-mono text-zinc-400 uppercase">{c.hex}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function MockTypographyView() {
  const [palette] = useAtom(paletteAtom);
  const c1 = palette[0]?.hex || "#3b82f6";
  const c2 = palette[1]?.hex || "#10b981";
  const c3 = palette[2]?.hex || "#f59e0b";
  const c4 = palette[3]?.hex || "#ef4444";

  return (
    <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl text-zinc-100 select-none space-y-6">
      {/* Specimen Header */}
      <div className="pb-6 border-b border-zinc-800">
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-semibold block mb-1">
          Typographic Hierarchy & Editorial Specimen
        </span>
        <h2
          className="text-3xl sm:text-4xl font-black tracking-tight"
          style={{ color: c1 }}
        >
          Form follows function, color commands emotion.
        </h2>
        <p className="text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">
          Testing contrast ratios, letter spacing, optical balance, and legibility across all font weights using active chromatic tokens.
        </p>
      </div>

      {/* Quote Card with Accent Line */}
      <div
        className="p-6 rounded-2xl border-l-4 bg-zinc-900/50 space-y-2"
        style={{ borderColor: c2 }}
      >
        <p className="text-base sm:text-lg italic font-serif leading-relaxed text-zinc-200">
          “Color is the visual language of thought. It communicates before grammar, resonates before comprehension, and defines the soul of modern design.”
        </p>
        <span className="text-xs font-semibold uppercase tracking-wider block" style={{ color: c3 }}>
          — Architectural Digest Typographic Survey
        </span>
      </div>

      {/* Type Scale Ladder */}
      <div className="space-y-3 p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40">
        <div className="flex items-baseline justify-between border-b border-zinc-800 pb-2">
          <span className="text-2xl font-bold" style={{ color: c1 }}>
            Display Heavy (32pt)
          </span>
          <span className="text-xs font-mono text-zinc-500">Heading 1</span>
        </div>
        <div className="flex items-baseline justify-between border-b border-zinc-800 pb-2">
          <span className="text-lg font-semibold" style={{ color: c2 }}>
            Subheadline Medium (20pt)
          </span>
          <span className="text-xs font-mono text-zinc-500">Heading 2</span>
        </div>
        <div className="flex items-baseline justify-between border-b border-zinc-800 pb-2">
          <span className="text-sm font-medium" style={{ color: c3 }}>
            Interactive Callout & Navigation Link (14pt)
          </span>
          <span className="text-xs font-mono text-zinc-500">Caption</span>
        </div>
        <div className="flex items-baseline justify-between pt-1">
          <span className="text-xs font-mono" style={{ color: c4 }}>
            System Code Monospace Token (12pt)
          </span>
          <span className="text-xs font-mono text-zinc-500">Code</span>
        </div>
      </div>
    </div>
  );
}

export function MockPatternView() {
  const [palette] = useAtom(paletteAtom);
  const c1 = palette[0]?.hex || "#3b82f6";
  const c2 = palette[1]?.hex || "#10b981";
  const c3 = palette[2]?.hex || "#f59e0b";
  const c4 = palette[3]?.hex || "#ef4444";
  const c5 = palette[4]?.hex || "#8b5cf6";

  return (
    <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl text-zinc-100 select-none space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <h3 className="font-bold text-sm tracking-tight">Bauhaus Geometric Tessellation</h3>
          <p className="text-xs text-zinc-400">Algorithmic SVG pattern generation</p>
        </div>
        <div className="flex items-center space-x-1.5">
          {palette.slice(0, 5).map((c, i) => (
            <div key={i} className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: c.hex }} />
          ))}
        </div>
      </div>

      {/* Seamless Geometric Canvas */}
      <div className="h-80 w-full rounded-2xl overflow-hidden border border-zinc-800 relative bg-zinc-900 shadow-inner">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="geometric-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <rect width="80" height="80" fill={c1} opacity="0.12" />
              <circle cx="40" cy="40" r="28" fill={c2} opacity="0.8" />
              <path d="M 0 0 L 80 80 M 80 0 L 0 80" stroke={c3} strokeWidth="3" opacity="0.6" />
              <circle cx="0" cy="0" r="18" fill={c4} opacity="0.75" />
              <circle cx="80" cy="0" r="18" fill={c4} opacity="0.75" />
              <circle cx="0" cy="80" r="18" fill={c5} opacity="0.75" />
              <circle cx="80" cy="80" r="18" fill={c5} opacity="0.75" />
              <rect x="26" y="26" width="28" height="28" fill={c1} transform="rotate(45 40 40)" opacity="0.9" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#geometric-grid)" />
        </svg>

        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] font-mono text-zinc-300 border border-white/10">
          Pattern: 80×80px Cartesian Grid
        </div>
      </div>
    </div>
  );
}

export function MockIllustrationView() {
  const [palette] = useAtom(paletteAtom);
  const c1 = palette[0]?.hex || "#3b82f6";
  const c2 = palette[1]?.hex || "#10b981";
  const c3 = palette[2]?.hex || "#f59e0b";
  const c4 = palette[3]?.hex || "#ef4444";
  const c5 = palette[4]?.hex || "#8b5cf6";

  return (
    <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl text-zinc-100 select-none space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <h3 className="font-bold text-sm tracking-tight">Modernist Vector Horizon</h3>
          <p className="text-xs text-zinc-400">Minimalist geometric landscape illustration</p>
        </div>
        <span className="text-xs font-mono text-zinc-400 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
          Vector SVG
        </span>
      </div>

      {/* SVG Vector Landscape */}
      <div className="h-80 w-full rounded-2xl overflow-hidden border border-zinc-800 relative bg-zinc-900 shadow-inner flex items-center justify-center">
        <svg viewBox="0 0 800 450" className="w-full h-full object-cover">
          {/* Background Sky */}
          <rect width="800" height="450" fill={c5} opacity="0.25" />

          {/* Sun / Geometric Celestial Sphere */}
          <circle cx="400" cy="180" r="90" fill={c1} />

          {/* Distant Mountains */}
          <polygon points="100,450 320,240 540,450" fill={c2} opacity="0.8" />
          <polygon points="350,450 560,200 770,450" fill={c3} opacity="0.85" />

          {/* Foreground Wave Curves */}
          <path d="M 0,340 Q 200,280 400,340 T 800,340 L 800,450 L 0,450 Z" fill={c4} opacity="0.9" />
          <path d="M 0,390 Q 250,330 500,400 T 800,380 L 800,450 L 0,450 Z" fill={c2} />

          {/* Architectural Bauhaus Accents */}
          <circle cx="160" cy="120" r="16" fill={c3} />
          <rect x="680" y="90" width="28" height="28" fill={c4} transform="rotate(45 694 104)" />
        </svg>

        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] font-mono text-zinc-300 border border-white/10">
          Isometric Chromatic Depth
        </div>
      </div>
    </div>
  );
}
