"use client";

import React from "react";
import { Check, X, Scale } from "lucide-react";

const COMPARISONS = [
  {
    feature: "Color Science Engine",
    legacy: "sRGB / HSL (Perceptually non-uniform)",
    colormint: "Native OKLCH (Perceptually uniform)",
    badge: "100% Coherent",
  },
  {
    feature: "Midpoint Gradients",
    legacy: "Dull gray dead zone in middle",
    colormint: "Curved Bézier polar paths",
    badge: "Zero Desaturation",
  },
  {
    feature: "Contrast Testing",
    legacy: "Legacy WCAG 2.0 (High false-positive rate)",
    colormint: "WCAG 2.1 AAA + APCA Polarity",
    badge: "Spatial Frequency",
  },
  {
    feature: "Contextual UI Preview",
    legacy: "Abstract swatch blocks only",
    colormint: "Live SaaS & Mobile UI simulator",
    badge: "5 Screen Modes",
  },
  {
    feature: "Image Extraction",
    legacy: "Slow server upload required",
    colormint: "Instant private in-browser canvas cluster",
    badge: "Zero Network Latency",
  },
  {
    feature: "Developer Handoff",
    legacy: "Basic Hex / RGB strings",
    colormint: "Tailwind v4 @theme, CSS Vars, JSON & SVG",
    badge: "Production Ready",
  },
  {
    feature: "Pricing & Privacy",
    legacy: "Paywalls, sign-up gates & banner ads",
    colormint: "Free forever, zero login, zero tracking",
    badge: "No Barriers",
  },
];

export function ComparisonTableSection() {
  return (
    <section className="w-full bg-zinc-950 py-12 sm:py-16 px-6 select-none border-t border-zinc-900">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-teal-400 text-xs font-mono uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            <span>Head-to-Head Comparison</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            Color-Mint vs. <span className="text-zinc-500">Legacy Generators</span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            A direct technical comparison between perceptual OKLCH color engineering and legacy sRGB tools.
          </p>
        </div>

        {/* Mobile View: Dedicated Comparison Cards */}
        <div className="block md:hidden space-y-3">
          {COMPARISONS.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-heading font-bold text-sm text-zinc-200">{item.feature}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30 shrink-0">
                  {item.badge}
                </span>
              </div>

              {/* Color-Mint Advantage */}
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/25 flex items-start space-x-2.5 text-xs text-emerald-200">
                <div className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <span className="font-semibold text-emerald-400 block text-[10px] uppercase tracking-wider font-mono">
                    Color-Mint Studio
                  </span>
                  <span className="mt-0.5 block font-medium">{item.colormint}</span>
                </div>
              </div>

              {/* Legacy Tools */}
              <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/60 flex items-start space-x-2.5 text-xs text-zinc-400">
                <div className="p-0.5 rounded-full bg-rose-500/10 text-rose-400 shrink-0 mt-0.5">
                  <X className="w-3 h-3" />
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase tracking-wider font-mono">
                    Legacy Tools
                  </span>
                  <span className="mt-0.5 block">{item.legacy}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Clean Table */}
        <div className="hidden md:block rounded-2xl bg-zinc-900/60 border border-zinc-800 shadow-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/80 text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="p-4 pl-6">Feature</th>
                <th className="p-4">Legacy Web Tools</th>
                <th className="p-4 pr-6 text-emerald-400 font-bold bg-emerald-950/15">
                  Color-Mint Studio
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {COMPARISONS.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="p-4 pl-6 font-heading font-bold text-zinc-200">
                    {row.feature}
                  </td>

                  <td className="p-4 text-zinc-400">
                    <div className="flex items-center space-x-2">
                      <X className="w-3.5 h-3.5 text-rose-500/80 shrink-0" />
                      <span>{row.legacy}</span>
                    </div>
                  </td>

                  <td className="p-4 pr-6 text-zinc-100 bg-emerald-950/10 font-medium">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center space-x-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{row.colormint}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30 shrink-0">
                        {row.badge}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
