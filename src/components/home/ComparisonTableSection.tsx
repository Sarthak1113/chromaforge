"use client";

import React from "react";
import { Check, X, Sparkles, Scale, Zap } from "lucide-react";
import { motion } from "framer-motion";

const COMPARISONS = [
  {
    feature: "Color Science Engine",
    legacy: "sRGB / HSL (Perceptually non-uniform)",
    colormint: "Native OKLCH (Perceptually uniform)",
    badge: "100% Coherent",
  },
  {
    feature: "Midpoint Gradients",
    legacy: "Dull 'gray dead zone' in middle",
    colormint: "Curved Bézier & Voronoi high-chroma paths",
    badge: "Zero Desaturation",
  },
  {
    feature: "Contrast Testing",
    legacy: "Legacy WCAG 2.0 (High false-positive rate)",
    colormint: "WCAG 2.1 AAA + Modern APCA Polarity",
    badge: "Spatial Frequency",
  },
  {
    feature: "Contextual UI Preview",
    legacy: "Abstract swatch blocks only",
    colormint: "Live SaaS, Mobile & Typography simulator",
    badge: "5 Screen Modes",
  },
  {
    feature: "Image Extraction",
    legacy: "Slow server-side upload required",
    colormint: "Instant, private in-browser canvas cluster",
    badge: "Zero Network Latency",
  },
  {
    feature: "Developer Handoff",
    legacy: "Basic Hex / RGB strings",
    colormint: "Tailwind v4 @theme, CSS Vars, JSON & SVG",
    badge: "Production Ready",
  },
  {
    feature: "Pricing & Access",
    legacy: "Paywalls, sign-up gates & banner ads",
    colormint: "Free forever, zero login, zero tracking",
    badge: "No Barriers",
  },
];

export function ComparisonTableSection() {
  return (
    <section className="w-full bg-zinc-950 py-24 sm:py-32 px-6 border-t border-zinc-800/80 select-none">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="group inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-semibold uppercase tracking-wider transition-colors hover:bg-teal-500/20">
            <Scale className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            <span>The Head-to-Head Comparison</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            Color-Mint vs.{" "}
            <span className="text-zinc-500">Legacy Web Generators</span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            See why leading digital product designers, design system engineers, and frontend developers choose Color-Mint over outdated hex tools.
          </p>
        </motion.div>

        {/* Mobile View: Dedicated Comparison Cards (No Awkward Horizontal Scroll) */}
        <div className="block md:hidden space-y-4">
          {COMPARISONS.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 space-y-3.5 shadow-lg"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-sm text-zinc-200">{item.feature}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30 shrink-0">
                  {item.badge}
                </span>
              </div>

              {/* Color-Mint Advantage (Highlighted) */}
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start space-x-2.5 text-xs text-emerald-200">
                <div className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-emerald-400 block text-[11px] uppercase tracking-wider font-mono">
                    Color-Mint Studio
                  </span>
                  <span className="mt-0.5 block font-medium">{item.colormint}</span>
                </div>
              </div>

              {/* Legacy Web Tools (Muted) */}
              <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 flex items-start space-x-2.5 text-xs text-zinc-400">
                <div className="p-0.5 rounded-full bg-rose-500/10 text-rose-400 shrink-0 mt-0.5">
                  <X className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-zinc-500 block text-[11px] uppercase tracking-wider font-mono">
                    Legacy Tools
                  </span>
                  <span className="mt-0.5 block">{item.legacy}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop / Tablet View: Elegant Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="hidden md:block rounded-3xl bg-zinc-900/60 border border-zinc-800/80 shadow-2xl overflow-hidden"
        >
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/80 text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="p-5">Feature</th>
                <th className="p-5">Legacy Web Tools</th>
                <th className="p-5 text-emerald-400 font-bold bg-emerald-950/20">
                  Color-Mint Studio
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {COMPARISONS.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-zinc-900/40 transition-colors group"
                >
                  <td className="p-5 font-bold text-zinc-200">
                    {row.feature}
                  </td>

                  <td className="p-5 text-zinc-500">
                    <div className="flex items-center space-x-2">
                      <X className="w-4 h-4 text-rose-500/80 shrink-0 transition-transform group-hover:scale-110" />
                      <span>{row.legacy}</span>
                    </div>
                  </td>

                  <td className="p-5 text-zinc-100 bg-emerald-950/10 font-medium">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 font-bold transition-transform group-hover:scale-110" />
                        <span>{row.colormint}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30 shrink-0">
                        {row.badge}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
