"use client";

import React from "react";
import { useAtom } from "jotai";
import { paletteAtom } from "@/atoms/palette.atoms";
import { getOptimalTextColor } from "@/lib/colors/contrast";
import {
  TrendingUp,
  Users,
  CreditCard,
  Activity,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

export function MockUIDashboard() {
  const [palette] = useAtom(paletteAtom);

  const c1 = palette[0]?.hex || "#3b82f6";
  const c2 = palette[1]?.hex || "#10b981";
  const c3 = palette[2]?.hex || "#f59e0b";
  const c4 = palette[3]?.hex || "#ef4444";
  const c5 = palette[4]?.hex || "#8b5cf6";

  const t1 = getOptimalTextColor(c1).textColor;
  const t2 = getOptimalTextColor(c2).textColor;

  return (
    <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl text-zinc-100 select-none">
      {/* Mock Header */}
      <header className="flex items-center justify-between pb-6 border-b border-zinc-800">
        <div className="flex items-center space-x-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-md"
            style={{ backgroundColor: c1, color: t1 }}
          >
            CF
          </div>
          <span className="font-semibold text-sm">Fintech Analytics Cloud</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
            style={{ backgroundColor: c1, color: t1 }}
          >
            New Project
          </button>
          <div
            className="w-7 h-7 rounded-full border border-zinc-700 flex items-center justify-center text-xs font-mono"
            style={{ backgroundColor: c2, color: t2 }}
          >
            JD
          </div>
        </div>
      </header>

      {/* Hero Banner with Palette Gradient */}
      <div
        className="my-6 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between"
        style={{
          background: `linear-gradient(135deg, ${c1} 0%, ${c5} 100%)`,
          color: t1,
        }}
      >
        <div className="relative z-10 max-w-md">
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-black/20 backdrop-blur-md mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Q4 Performance Growth</span>
          </span>
          <h3 className="text-2xl font-extrabold tracking-tight">
            Revenue up +38.4%
          </h3>
          <p className="text-xs opacity-90 mt-1">
            Real-time analytics engine synchronized with your OKLCH visual theme.
          </p>
        </div>

        <div className="mt-4 flex space-x-2">
          <button
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white text-zinc-950 shadow-md"
          >
            View Full Report
          </button>
        </div>
      </div>

      {/* Metric Cards Grid - 2x2 on Mobile, 4x1 on Desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs">Active Users</span>
            <Users className="w-4 h-4" style={{ color: c1 }} />
          </div>
          <div className="text-xl font-bold font-mono">24,582</div>
          <div className="text-[11px] flex items-center space-x-1 mt-1 font-medium" style={{ color: c2 }}>
            <TrendingUp className="w-3 h-3" />
            <span>+12.5% this week</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs">Monthly Volume</span>
            <CreditCard className="w-4 h-4" style={{ color: c2 }} />
          </div>
          <div className="text-xl font-bold font-mono">$184,200</div>
          <div className="text-[11px] flex items-center space-x-1 mt-1 font-medium" style={{ color: c2 }}>
            <ArrowUpRight className="w-3 h-3" />
            <span>+8.2% vs target</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs">Conversion Rate</span>
            <Activity className="w-4 h-4" style={{ color: c3 }} />
          </div>
          <div className="text-xl font-bold font-mono">4.92%</div>
          <div className="text-[11px] text-zinc-400 mt-1">Benchmark: 3.8%</div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs">Server Latency</span>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c4 }} />
          </div>
          <div className="text-xl font-bold font-mono">14ms</div>
          <div className="text-[11px] text-emerald-400 mt-1">99.99% Uptime</div>
        </div>
      </div>

      {/* Chart Bars Preview */}
      <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40">
        <div className="text-xs font-semibold text-zinc-300 mb-4">
          Weekly Palette Distribution
        </div>
        <div className="h-28 flex items-end justify-between space-x-2 sm:space-x-3 pt-4">
          {[
            { label: "Mon", short: "M", h: "45%", color: c1 },
            { label: "Tue", short: "T", h: "70%", color: c2 },
            { label: "Wed", short: "W", h: "60%", color: c3 },
            { label: "Thu", short: "T", h: "90%", color: c4 },
            { label: "Fri", short: "F", h: "80%", color: c5 },
            { label: "Sat", short: "S", h: "50%", color: c1 },
            { label: "Sun", short: "S", h: "65%", color: c2 },
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center space-y-2">
              <div
                className="w-full rounded-t-lg transition-all duration-300"
                style={{ height: bar.h, backgroundColor: bar.color }}
              />
              <span className="text-[10px] text-zinc-500 font-mono">
                <span className="sm:hidden">{bar.short}</span>
                <span className="hidden sm:inline">{bar.label}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
