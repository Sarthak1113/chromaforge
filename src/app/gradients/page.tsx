"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Copy,
  Check,
  RefreshCw,
  Layers,
  Download,
  Sliders,
  ChevronDown,
  ArrowRightLeft,
  X,
} from "lucide-react";
import { generateRandomOklch } from "@/lib/colors/harmonies";
import { oklchToHex, rgbToHsl } from "@/lib/colors/oklch";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { CollapsibleFaq } from "@/components/common/CollapsibleFaq";
import { motion, AnimatePresence } from "framer-motion";
import {
  renderGradientToCanvas,
  GradientColorStop,
} from "@/lib/colors/gradient-engine";

type AspectRatio = "16:9" | "1:1" | "4:3" | "9:16";
type GradientType = "linear" | "radial" | "conic";

const WARP_SHAPES = [
  "Voronoi Noise",
  "Worley Noise",
  "Domain Warping",
  "FBM Noise",
  "Simplex Noise",
  "Circular",
  "Waves",
  "Smooth Noise",
  "Oval",
  "Value Noise",
  "Rows",
  "Columns",
  "Gravity",
  "Flat",
];

const GRADIENT_MODES = [
  "Soft Bézier",
  "Sharp Bézier",
  "Mesh Static",
  "Mesh Grid",
  "OKLCH Perceptual",
  "Simple (sRGB)",
];

const RATIOS: { id: AspectRatio; label: string; aspectClass: string; w: number; h: number }[] = [
  { id: "16:9", label: "16:9", aspectClass: "aspect-video", w: 1920, h: 1080 },
  { id: "1:1", label: "1:1", aspectClass: "aspect-square", w: 1080, h: 1080 },
  { id: "4:3", label: "4:3", aspectClass: "aspect-[4/3]", w: 1440, h: 1080 },
  { id: "9:16", label: "9:16", aspectClass: "aspect-[9/16] max-h-[460px]", w: 1080, h: 1920 },
];

const GRADIENT_FAQS = [
  {
    question: "Why do standard CSS linear gradients look muddy and gray in the center?",
    answer: "Standard CSS linear gradients interpolate colors in the non-linear sRGB color space. When transitioning between complementary hues (like cyan and magenta), the straight line in sRGB cuts directly through the desaturated center of the color cube where red, green, and blue values cancel out, creating an unnatural 'gray dead zone'.",
  },
  {
    question: "How does Bézier interpolation preserve color saturation?",
    answer: "Instead of cutting straight across the color space, Color-Mint curves the interpolation path along the high-chroma outer perimeter using Bézier mathematical splines and polar OKLCH coordinates. This maintains vivid chromatic intensity across midpoints without desaturation.",
  },
  {
    question: "Is OKLCH gradient syntax supported in all modern web browsers?",
    answer: "Yes. CSS Color Module Level 4 syntax like linear-gradient(in oklch 90deg, ...) is supported across Chrome, Safari, Firefox, and Edge. For older browsers, Color-Mint automatically exports fallback hsla rules and vendor prefixes.",
  },
  {
    question: "How do I export and use multi-stop gradients in CSS?",
    answer: "Click the 'Copy CSS' button to open the code preview modal. You can copy the complete CSS block or click 'Download' to get a ready-to-import gradient.css stylesheet with standard, webkit, and moz fallback rules.",
  },
];

function hexToHsla(hex: string): string {
  const clean = hex.replace("#", "").trim();
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const r = parseInt(full.slice(0, 2), 16) || 0;
  const g = parseInt(full.slice(2, 4), 16) || 0;
  const b = parseInt(full.slice(4, 6), 16) || 0;
  const hsl = rgbToHsl({ r, g, b });
  return `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)`;
}

function renderHighlightedCssLine(line: string) {
  const colonIdx = line.indexOf(":");
  if (colonIdx === -1) {
    return <span className="text-zinc-800">{line}</span>;
  }
  const prop = line.slice(0, colonIdx + 1);
  const rest = line.slice(colonIdx + 1);

  // Match quoted strings or numbers with optional %, deg
  const tokens = rest.split(/(".*?"|\b\d+(?:\.\d+)?(?:%|deg)?\b)/g);

  return (
    <>
      <span className="text-[#0284c7] font-semibold">{prop}</span>
      {tokens.map((token, i) => {
        const isHighlight = /^(".*?"|\b\d+(?:\.\d+)?(?:%|deg)?\b)$/.test(token);
        if (isHighlight) {
          return (
            <span key={i} className="text-[#0284c7] font-semibold">
              {token}
            </span>
          );
        }
        return (
          <span key={i} className="text-zinc-800 font-medium">
            {token}
          </span>
        );
      })}
    </>
  );
}

export default function GradientsPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stops, setStops] = useState<GradientColorStop[]>([
    { id: "s1", color: "#F9C823", position: 0 },
    { id: "s2", color: "#FF5E7E", position: 100 },
  ]);
  const [activeStopIndex, setActiveStopIndex] = useState(0);

  const [angle, setAngle] = useState(90);
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [ratio, setRatio] = useState<AspectRatio>("16:9");

  // Advanced Mesh & Warp Settings (Default OFF per user requirement)
  const [isAdvancedEnabled, setIsAdvancedEnabled] = useState(false);
  const [warpShape, setWarpShape] = useState("Voronoi Noise");
  const [gradientMode, setGradientMode] = useState("Soft Bézier");
  const [gridW, setGridW] = useState(648);
  const [warp, setWarp] = useState(45);
  const [warpSize, setWarpSize] = useState(40);
  const [noise, setNoise] = useState(15);

  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCssModalOpen, setIsCssModalOpen] = useState(false);
  const [modalCopied, setModalCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCssModalOpen(false);
    };
    if (isCssModalOpen) {
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }
  }, [isCssModalOpen]);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);

  const handleTrackMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (stops.length >= 4 || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    setHoverPosition(Math.max(5, Math.min(95, percent)));
  };

  const handleTrackMouseLeave = () => {
    setHoverPosition(null);
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (stops.length >= 4 || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    const newPos = Math.max(5, Math.min(95, percent));

    const newColor = oklchToHex(generateRandomOklch());
    const newStop: GradientColorStop = {
      id: `s-${Date.now()}`,
      color: newColor,
      position: newPos,
    };

    const nextStops = [...stops, newStop];
    setStops(nextStops);
    setActiveStopIndex(nextStops.length - 1);
    setHoverPosition(null);
  };

  const handleAddStopMobile = () => {
    if (stops.length >= 4) return;
    const newPos = stops.length === 2 ? 50 : stops.length === 3 ? 75 : 50;
    const newColor = oklchToHex(generateRandomOklch());
    const newStop: GradientColorStop = {
      id: `s-${Date.now()}`,
      color: newColor,
      position: newPos,
    };
    const nextStops = [...stops, newStop];
    setStops(nextStops);
    setActiveStopIndex(nextStops.length - 1);
  };

  const handleRemoveActiveStop = (idx: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (stops.length <= 2) return;
    const nextStops = stops.filter((_, i) => i !== idx);
    setStops(nextStops);
    setActiveStopIndex(Math.max(0, idx - 1));
  };

  const activeStop = stops[activeStopIndex] || stops[0];

  const updateActiveColor = (hex: string) => {
    setStops((prev) =>
      prev.map((s, idx) => (idx === activeStopIndex ? { ...s, color: hex } : s))
    );
  };

  const updateActivePosition = (pos: number) => {
    setStops((prev) =>
      prev.map((s, idx) => (idx === activeStopIndex ? { ...s, position: pos } : s))
    );
  };

  const handleSwapStops = () => {
    if (stops.length >= 2) {
      setStops((prev) => {
        const reversedColors = [...prev].map((s) => s.color).reverse();
        return prev.map((s, idx) => ({
          ...s,
          color: reversedColors[idx],
        }));
      });
    }
  };

  const handleRandomize = () => {
    setStops((prev) =>
      prev.map((stop) => ({
        ...stop,
        color: oklchToHex(generateRandomOklch()),
      }))
    );
  };

  // Re-render live canvas on any state change
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const curRatio = RATIOS.find((r) => r.id === ratio) || RATIOS[0];

    // Preview resolution optimized for instant real-time interaction
    const previewWidth = 480;
    const previewHeight = Math.round((previewWidth * curRatio.h) / curRatio.w);

    canvas.width = previewWidth;
    canvas.height = previewHeight;

    renderGradientToCanvas(canvas, {
      stops,
      angle,
      gradientType,
      ratio,
      isAdvancedEnabled,
      gradientMode,
      warpShape,
      warp,
      warpSize,
      noise,
      gridW,
    });
  }, [
    stops,
    angle,
    gradientType,
    ratio,
    isAdvancedEnabled,
    gradientMode,
    warpShape,
    warp,
    warpSize,
    noise,
    gridW,
  ]);

  // CSS generation
  const sortedStops = [...stops].sort((a, b) => a.position - b.position);
  const isOklch = gradientMode === "OKLCH Perceptual";

  let gradientCss = "";
  if (gradientType === "radial") {
    gradientCss = isOklch
      ? `radial-gradient(circle in oklch, ${sortedStops.map((s) => `${s.color} ${s.position}%`).join(", ")})`
      : `radial-gradient(circle, ${sortedStops.map((s) => `${s.color} ${s.position}%`).join(", ")})`;
  } else if (gradientType === "conic") {
    gradientCss = isOklch
      ? `conic-gradient(from ${angle}deg in oklch, ${sortedStops.map((s) => `${s.color} ${s.position}%`).join(", ")})`
      : `conic-gradient(from ${angle}deg, ${sortedStops.map((s) => `${s.color} ${s.position}%`).join(", ")})`;
  } else {
    gradientCss = isOklch
      ? `linear-gradient(in oklch ${angle}deg, ${sortedStops.map((s) => `${s.color} ${s.position}%`).join(", ")})`
      : `linear-gradient(${angle}deg, ${sortedStops.map((s) => `${s.color} ${s.position}%`).join(", ")})`;
  }

  const generateCompleteCssLines = (): string[] => {
    const sorted = [...stops].sort((a, b) => a.position - b.position);
    const hslaStops = sorted.map((s) => `${hexToHsla(s.color)} ${s.position}%`).join(", ");
    const fallback = hexToHsla(sorted[0].color);
    const startColor = sorted[0].color.toUpperCase();
    const endColor = sorted[sorted.length - 1].color.toUpperCase();

    let standardRule = "";
    let mozRule = "";
    let webkitRule = "";

    if (gradientType === "radial") {
      standardRule = `radial-gradient(circle, ${hslaStops})`;
      mozRule = `-moz-radial-gradient(circle, ${hslaStops})`;
      webkitRule = `-webkit-radial-gradient(circle, ${hslaStops})`;
    } else if (gradientType === "conic") {
      standardRule = `conic-gradient(from ${angle}deg, ${hslaStops})`;
      mozRule = `conic-gradient(from ${angle}deg, ${hslaStops})`;
      webkitRule = `-webkit-conic-gradient(from ${angle}deg, ${hslaStops})`;
    } else {
      standardRule = `linear-gradient(${angle}deg, ${hslaStops})`;
      mozRule = `-moz-linear-gradient(${angle}deg, ${hslaStops})`;
      webkitRule = `-webkit-linear-gradient(${angle}deg, ${hslaStops})`;
    }

    return [
      `background: ${fallback};`,
      `background: ${standardRule};`,
      `background: ${mozRule};`,
      `background: ${webkitRule};`,
      `filter: progid: DXImageTransform.Microsoft.gradient( startColorstr="${startColor}", endColorstr="${endColor}", GradientType=1 );`,
    ];
  };

  const handleDownloadCssFile = () => {
    const cssContent = generateCompleteCssLines().join("\n\n");
    const blob = new Blob([cssContent], { type: "text/css;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gradient.css";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCssModal = () => {
    const cssContent = generateCompleteCssLines().join("\n\n");
    navigator.clipboard.writeText(cssContent);
    setModalCopied(true);
    setTimeout(() => setModalCopied(false), 1500);
  };

  const handleCopyCss = () => {
    setIsCssModalOpen(true);
  };

  // High-Resolution Image Export (Applies Exact Warp Shape & Noise)
  const handleDownloadImage = () => {
    setIsDownloading(true);
    setTimeout(() => {
      const curRatio = RATIOS.find((r) => r.id === ratio) || RATIOS[0];
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = curRatio.w;
      exportCanvas.height = curRatio.h;

      renderGradientToCanvas(exportCanvas, {
        stops,
        angle,
        gradientType,
        ratio,
        isAdvancedEnabled,
        gradientMode,
        warpShape,
        warp,
        warpSize,
        noise,
        gridW,
      });

      const a = document.createElement("a");
      a.download = `color-mint-${isAdvancedEnabled ? warpShape.toLowerCase().replace(/\s+/g, "-") : "gradient"}-${ratio.replace(":", "x")}.png`;
      a.href = exportCanvas.toDataURL("image/png");
      a.click();
      setIsDownloading(false);
    }, 50);
  };

  const currentRatioObj = RATIOS.find((r) => r.id === ratio) || RATIOS[0];

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col select-none">
      <Navbar activePage="gradients" />

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full flex flex-col space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 pb-2">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight flex items-center space-x-3">
              <Layers className="w-8 h-8 text-indigo-400 shrink-0" />
              <span>Gradient Studio</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-400">
              Generate custom mesh, Voronoi, and Bézier gradients.
            </p>
          </div>

          <button
            onClick={handleRandomize}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-semibold active:scale-95 transition-all cursor-pointer w-fit"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Randomize</span>
          </button>
        </div>

        {/* 2-Column Inspector & Preview Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Column: Gradient Controls Card */}
          <div className="bg-zinc-900/80 border border-zinc-800/90 rounded-3xl p-5 sm:p-6 space-y-6 shadow-xl backdrop-blur-sm order-2 lg:order-1">
            {/* Gradient Slider Track with Add Stop on Hover */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-zinc-400">
                <div className="flex items-center space-x-2">
                  <span>Gradient Stops</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold border border-zinc-700/60">
                    {stops.length} / 4
                  </span>
                </div>
                {stops.length < 4 ? (
                  <button
                    onClick={handleAddStopMobile}
                    className="text-[11px] text-indigo-400 font-medium hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>+ Add Stop</span>
                    <span className="hidden sm:inline text-zinc-500 font-normal">(or click line)</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-zinc-500 font-medium">
                    Max 4 stops reached
                  </span>
                )}
              </div>

              {/* Slider Track with draggable/clickable handles and hover + preview */}
              <div
                ref={trackRef}
                onClick={handleTrackClick}
                onMouseMove={handleTrackMouseMove}
                onMouseLeave={handleTrackMouseLeave}
                className="relative h-7 w-full rounded-full p-1 border border-zinc-700/60 shadow-inner flex items-center cursor-pointer select-none group"
                style={{
                  background: `linear-gradient(90deg, ${sortedStops.map((s) => `${s.color} ${s.position}%`).join(", ")})`,
                }}
              >
                {/* Floating '+' Indicator on Hover */}
                {hoverPosition !== null && stops.length < 4 && (
                  <div
                    className="absolute w-6 h-6 rounded-full bg-indigo-600 border-2 border-white shadow-xl flex items-center justify-center -translate-x-1/2 pointer-events-none transition-transform scale-110 z-20 text-white font-bold text-xs"
                    style={{ left: `${hoverPosition}%` }}
                  >
                    +
                  </div>
                )}

                {/* Stop Handles */}
                {stops.map((stop, idx) => (
                  <div
                    key={stop.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveStopIndex(idx);
                    }}
                    className={`absolute w-6 h-6 rounded-full border-2 shadow-xl transition-transform hover:scale-110 active:scale-95 cursor-pointer -translate-x-1/2 flex items-center justify-center ${
                      activeStopIndex === idx
                        ? "border-white scale-125 ring-2 ring-indigo-500 z-10"
                        : "border-black/50 z-0"
                    }`}
                    style={{
                      left: `${stop.position}%`,
                      backgroundColor: stop.color,
                    }}
                    title={`Stop ${idx + 1}: ${stop.color} (${stop.position}%) - Click to edit`}
                  >
                    {stops.length > 2 && activeStopIndex === idx && (
                      <button
                        onClick={(e) => handleRemoveActiveStop(idx, e)}
                        className="w-3.5 h-3.5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold shadow -top-2 -right-2 absolute hover:scale-110"
                        title="Remove stop"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Inputs Grid: Color & Position */}
            <div className="grid grid-cols-2 gap-4">
              {/* Active Color */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
                  <span className="truncate">Color (Stop {activeStopIndex + 1})</span>
                  {stops.length > 2 && (
                    <button
                      onClick={(e) => handleRemoveActiveStop(activeStopIndex, e)}
                      className="text-[11px] text-rose-400 hover:text-rose-300 font-normal cursor-pointer"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-2xl focus-within:border-indigo-500 transition-colors">
                  <input
                    type="text"
                    value={activeStop.color}
                    onChange={(e) => updateActiveColor(e.target.value)}
                    className="w-20 bg-transparent font-mono text-sm font-semibold uppercase text-zinc-100 outline-none"
                    maxLength={7}
                  />
                  <div
                    className="relative w-8 h-8 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-inner cursor-pointer"
                    style={{ backgroundColor: activeStop.color }}
                  >
                    <input
                      type="color"
                      value={activeStop.color}
                      onChange={(e) => updateActiveColor(e.target.value)}
                      className="absolute -inset-2 w-12 h-12 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Active Position */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 block">Position ({activeStop.position}%)</label>
                <div className="flex items-center px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-2xl h-[50px]">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={activeStop.position}
                    onChange={(e) => updateActivePosition(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
                  />
                </div>
              </div>
            </div>

            {/* Inputs Grid: Rotation & Type */}
            <div className="grid grid-cols-2 gap-4">
              {/* Rotation */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 block">Rotation</label>
                <div className="flex items-center px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-2xl h-[50px]">
                  <select
                    value={angle}
                    onChange={(e) => setAngle(Number(e.target.value))}
                    disabled={gradientType === "radial"}
                    className="w-full bg-transparent text-sm font-semibold text-zinc-200 outline-none cursor-pointer disabled:opacity-40"
                  >
                    <option value={0} className="bg-zinc-900">0°</option>
                    <option value={45} className="bg-zinc-900">45°</option>
                    <option value={90} className="bg-zinc-900">90°</option>
                    <option value={135} className="bg-zinc-900">135°</option>
                    <option value={180} className="bg-zinc-900">180°</option>
                    <option value={225} className="bg-zinc-900">225°</option>
                    <option value={270} className="bg-zinc-900">270°</option>
                    <option value={315} className="bg-zinc-900">315°</option>
                  </select>
                </div>
              </div>

              {/* Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 block">Type</label>
                <div className="flex items-center px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-2xl h-[50px]">
                  <select
                    value={gradientType}
                    onChange={(e) => setGradientType(e.target.value as GradientType)}
                    className="w-full bg-transparent text-sm font-semibold text-zinc-200 outline-none cursor-pointer"
                  >
                    <option value="linear" className="bg-zinc-900">Linear</option>
                    <option value="radial" className="bg-zinc-900">Radial</option>
                    <option value="conic" className="bg-zinc-900">Conic</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Collapsible Advanced Settings Accordion with Default OFF Toggle */}
            <div className="border border-zinc-800/80 rounded-2xl overflow-hidden bg-zinc-950/40">
              <button
                type="button"
                onClick={() => setIsAdvancedEnabled(!isAdvancedEnabled)}
                className="w-full flex items-center justify-between p-3.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900/60 transition-colors cursor-pointer select-none"
              >
                <div className="flex items-center space-x-2">
                  <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Advanced Noise & Warp Settings</span>
                </div>

                <div className="flex items-center space-x-2.5">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                      isAdvancedEnabled ? "text-indigo-400" : "text-zinc-500"
                    }`}
                  >
                    {isAdvancedEnabled ? "ON" : "OFF"}
                  </span>
                  <div
                    className={`w-8 h-4.5 rounded-full transition-colors relative ${
                      isAdvancedEnabled ? "bg-indigo-600" : "bg-zinc-800"
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                        isAdvancedEnabled ? "left-4" : "left-0.5"
                      }`}
                    />
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${
                      isAdvancedEnabled ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              <AnimatePresence>
                {isAdvancedEnabled && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="p-4 pt-1 space-y-4 border-t border-zinc-800/60"
                  >
                    {/* Selectors: Gradient Mode & Warp Shape */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-zinc-400">Gradient Mode</span>
                        <select
                          value={gradientMode}
                          onChange={(e) => setGradientMode(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-200 p-2 rounded-xl outline-none cursor-pointer"
                        >
                          {GRADIENT_MODES.map((mode) => (
                            <option key={mode} value={mode} className="bg-zinc-900">
                              {mode}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-zinc-400">Warp Shape</span>
                        <select
                          value={warpShape}
                          onChange={(e) => setWarpShape(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-200 p-2 rounded-xl outline-none cursor-pointer"
                        >
                          {WARP_SHAPES.map((shape) => (
                            <option key={shape} value={shape} className="bg-zinc-900">
                              {shape}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Grid Coordinate Dimension (W) */}
                    <div className="flex items-center justify-between text-xs py-1 border-b border-zinc-800/60">
                      <span className="text-zinc-400">Grid Resolution</span>
                      <div className="flex items-center space-x-1.5 font-mono">
                        <span className="text-zinc-500">W</span>
                        <input
                          type="number"
                          value={gridW}
                          onChange={(e) => setGridW(Number(e.target.value))}
                          className="w-16 bg-zinc-900 border border-zinc-800 text-zinc-200 px-2 py-1 rounded-lg text-xs font-mono text-center outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Sliders: Warp, Warp Size, Noise */}
                    <div className="space-y-3 pt-1">
                      <div>
                        <div className="flex justify-between text-xs text-zinc-400 mb-1">
                          <span>Warp</span>
                          <span className="font-mono text-zinc-300">{warp}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={warp}
                          onChange={(e) => setWarp(Number(e.target.value))}
                          className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-zinc-400 mb-1">
                          <span>Warp Size</span>
                          <span className="font-mono text-zinc-300">{warpSize}</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={warpSize}
                          onChange={(e) => setWarpSize(Number(e.target.value))}
                          className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-zinc-400 mb-1">
                          <span>Noise Grain</span>
                          <span className="font-mono text-zinc-300">{noise}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={noise}
                          onChange={(e) => setNoise(Number(e.target.value))}
                          className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleRandomize}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                Random
              </button>

              <button
                onClick={handleCopyCss}
                className="flex-[1.5] py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 active:scale-95 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy CSS"}</span>
              </button>

              <button
                onClick={handleDownloadImage}
                disabled={isDownloading}
                className="flex items-center space-x-1.5 py-2.5 px-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60 active:scale-95 transition-all cursor-pointer text-xs font-semibold"
                title={`Download ${ratio} PNG Image`}
              >
                <Download className="w-4 h-4 text-indigo-400" />
                <span className="hidden sm:inline">Export PNG</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Procedural Canvas Preview with Aspect Ratio Settings */}
          <div className="space-y-3 order-1 lg:order-2">
            {/* Aspect Ratio Selector Pills */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400">Aspect Ratio:</span>
              <div className="flex items-center space-x-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
                {RATIOS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRatio(r.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all active:scale-95 cursor-pointer ${
                      ratio === r.id
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gradient Canvas Container */}
            <div
              className={`w-full ${currentRatioObj.aspectClass} rounded-3xl shadow-2xl border border-zinc-800 relative overflow-hidden transition-all duration-300 flex items-end justify-between p-6 sm:p-8 bg-zinc-950`}
            >
              {/* The Live Procedural Canvas Element */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />

              {/* Top-Right Canvas Actions (Swap Color & Download) */}
              <div className="absolute top-5 right-5 flex items-center space-x-2 z-10">
                <button
                  onClick={handleSwapStops}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md text-white text-xs font-semibold transition-all active:scale-95 cursor-pointer border border-white/10 shadow-lg"
                  title="Swap Stop Colors"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 opacity-80" />
                  <span>Swap</span>
                </button>

                <button
                  onClick={handleDownloadImage}
                  disabled={isDownloading}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md text-white text-xs font-semibold transition-all active:scale-95 cursor-pointer border border-white/10 shadow-lg"
                  title={`Download ${ratio} PNG Image`}
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{isDownloading ? "Exporting..." : ratio}</span>
                </button>
              </div>

              {/* Bottom Canvas Pill */}
              <div className="relative z-10 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-white font-mono text-xs border border-white/10 shadow-md">
                {isAdvancedEnabled ? `${warpShape} • ${gradientMode}` : (isOklch ? "in oklch" : "sRGB")} • {ratio}
              </div>
            </div>
          </div>
        </div>

        {/* Gradient Engineering & Mathematical Reference (AEO Direct Answers) */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-zinc-100">
              Procedural Gradient Architecture & Color Science
            </h2>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Standard digital gradients produce washed-out midpoints. Color-Mint solves this by combining OKLCH cylindrical space with non-linear Bézier and cellular noise fields.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-1.5">
              <div className="text-xs font-semibold text-zinc-200">
                Eliminating the Gray Dead Zone
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Linear sRGB gradients cut through the desaturated center of the color cube. Bézier interpolation curves around the perimeter, sustaining vibrant midpoint chroma.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-1.5">
              <div className="text-xs font-semibold text-zinc-200">
                OKLCH Perceptual Uniformity
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Matches biological human ocular sensitivity so gradient transitions feel uniformly smooth without abrupt perceived luminance spikes.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-1.5">
              <div className="text-xs font-semibold text-zinc-200">
                Voronoi & Domain Warping
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Applies procedural cellular displacement algorithms to stretch color stops into fluid, organic aesthetic blobs rather than static linear lines.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-1.5">
              <div className="text-xs font-semibold text-zinc-200">
                Anti-Banding Noise Grain
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Applies procedural perceptual grain to eliminate stepped color contouring rings on high-resolution Retina and OLED mobile displays.
              </p>
            </div>
          </div>
        </div>

        {/* Collapsible Frequently Asked Questions (AEO & SEO) */}
        <CollapsibleFaq items={GRADIENT_FAQS} />
      </motion.main>

      <Footer />

      {/* Gradient CSS Popup Modal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isCssModalOpen && (
              <div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
                onClick={() => setIsCssModalOpen(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 8 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-3xl w-full max-w-md sm:max-w-lg shadow-2xl overflow-hidden flex flex-col border border-zinc-100 text-zinc-900 max-h-[90vh]"
                >
                  {/* Header */}
                  <div className="relative px-6 py-4 border-b border-zinc-100 flex items-center justify-center">
                    <h2 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
                      Gradient CSS
                    </h2>
                    <button
                      onClick={() => setIsCssModalOpen(false)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors cursor-pointer"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Code Snippet Box with Exact Syntax Highlighting */}
                  <div className="p-5 sm:p-6 bg-white overflow-y-auto">
                    <div className="bg-[#f6f7f9] border border-zinc-200/60 rounded-2xl p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto select-text shadow-inner">
                      <div className="space-y-4">
                        {generateCompleteCssLines().map((line, idx) => (
                          <div key={idx} className="break-all whitespace-pre-wrap">
                            {renderHighlightedCssLine(line)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons matching reference design */}
                  <div className="px-6 py-4 border-t border-zinc-100 flex items-center gap-4 bg-white">
                    <button
                      onClick={handleDownloadCssFile}
                      className="flex-1 py-3 px-4 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 active:scale-[0.98] text-zinc-900 font-bold text-sm sm:text-base shadow-xs transition-all cursor-pointer text-center"
                    >
                      Download
                    </button>

                    <button
                      onClick={handleCopyCssModal}
                      className="flex-1 py-3 px-4 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-[0.98] text-white font-bold text-sm sm:text-base shadow-sm shadow-blue-500/20 transition-all cursor-pointer text-center"
                    >
                      {modalCopied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
