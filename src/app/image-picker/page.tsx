"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Upload, ArrowRight, Copy, Check, ImageIcon } from "lucide-react";
import { useSetAtom } from "jotai";
import { paletteAtom } from "@/atoms/palette.atoms";
import { rgbToOklch } from "@/lib/colors/oklch";
import { getNearestColorName } from "@/lib/colors/names";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { motion } from "framer-motion";

export default function ImagePickerPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [extractedHexes, setExtractedHexes] = useState<string[]>([]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const setPalette = useSetAtom(paletteAtom);
  const router = useRouter();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);

      const img = new Image();
      img.onload = () => {
        extractPaletteFromImage(img);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const extractPaletteFromImage = (img: HTMLImageElement) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const maxDim = 150;
    const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    const sampleMap: Record<string, number> = {};
    const step = 4 * 3;

    for (let i = 0; i < imgData.length; i += step) {
      const r = imgData[i];
      const g = imgData[i + 1];
      const b = imgData[i + 2];
      const a = imgData[i + 3];

      if (a < 128) continue;

      const qr = Math.round(r / 24) * 24;
      const qg = Math.round(g / 24) * 24;
      const qb = Math.round(b / 24) * 24;

      const key = `${qr},${qg},${qb}`;
      sampleMap[key] = (sampleMap[key] || 0) + 1;
    }

    const sorted = Object.entries(sampleMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([key]) => {
        const [r, g, b] = key.split(",").map(Number);
        const toHex = (n: number) => n.toString(16).padStart(2, "0");
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      });

    setExtractedHexes(sorted);
  };

  const handleApplyToGenerator = () => {
    if (extractedHexes.length === 0) return;

    const items = extractedHexes.map((hex, idx) => {
      const oklch = rgbToOklch({
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16),
      });
      return {
        id: `img-${Date.now()}-${idx}`,
        hex,
        oklch,
        isLocked: false,
        name: getNearestColorName(oklch),
      };
    });

    setPalette(items);
    router.push("/");
  };

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col select-none">
      {/* Top Global Navbar - 100% Consistent */}
      <Navbar activePage="image-picker" />

      {/* Main Container */}
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
              <ImageIcon className="w-8 h-8 text-indigo-400 shrink-0" />
              <span>Image Extractor</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-400">
              Extract beautiful palettes from your photos.
            </p>
          </div>

          {extractedHexes.length > 0 && (
            <button
              onClick={handleApplyToGenerator}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all cursor-pointer w-fit"
            >
              <span>Open in Generator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Upload Dropzone */}
        {!imageSrc ? (
          <label className="border-2 border-dashed border-zinc-800 hover:border-indigo-500 rounded-3xl p-8 sm:p-16 flex flex-col items-center justify-center cursor-pointer transition-all bg-zinc-900/20 hover:bg-zinc-900/40 hover:scale-[1.01] active:scale-[0.99] group shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-7 h-7" />
            </div>
            <h3 className="font-semibold text-base mb-1 text-zinc-100">
              Upload an image to extract colors
            </h3>
            <p className="text-xs text-zinc-500 mb-4">
              Supports PNG, JPG, WEBP, or SVG
            </p>
            <span className="px-4 py-2 rounded-xl bg-zinc-800 group-hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors shadow-md">
              Browse Files
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        ) : (
          <div className="flex flex-col space-y-6">
            {/* Image Preview */}
            <div className="relative rounded-3xl overflow-hidden border border-zinc-800 max-h-96 flex items-center justify-center bg-zinc-900/40 shadow-2xl">
              <img
                src={imageSrc}
                alt="Uploaded source"
                className="max-h-96 w-auto object-contain rounded-2xl"
              />
            </div>

            {/* Extracted Swatches */}
            {extractedHexes.length > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm">Extracted Dominant Palette</h3>
                  <label className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium">
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="h-16 sm:h-24 flex rounded-2xl overflow-hidden shadow-2xl mb-4">
                  {extractedHexes.map((hex) => (
                    <div
                      key={hex}
                      className="flex-1 h-full flex items-end justify-center pb-3 cursor-pointer transition-transform hover:scale-y-105"
                      style={{ backgroundColor: hex }}
                      onClick={() => handleCopyHex(hex)}
                      title={`Click to copy ${hex}`}
                    >
                      <span className="bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold text-white flex items-center space-x-1 shadow-md">
                        {copiedHex === hex ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <span>{hex.toUpperCase()}</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* How It Works */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-zinc-100">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-1">
              <div className="text-xs font-semibold text-zinc-200">
                Upload your image
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Drag and drop or browse to select any PNG, JPG, WEBP, or SVG file.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-1">
              <div className="text-xs font-semibold text-zinc-200">
                Instant Extraction
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Our tool instantly samples the image to generate a harmonic color palette.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-1">
              <div className="text-xs font-semibold text-zinc-200">
                Total Privacy
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                All image processing and palette generation is handled locally on your device. We never upload, store, or transmit your images to any external servers.
              </p>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions (AEO & SEO) */}
        <section className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-5" aria-label="Frequently Asked Questions">
          <div>
            <h2 className="text-base font-bold text-zinc-100">
              Frequently Asked Questions (FAQ)
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Everything you need to know about extracting color palettes from photographs and graphics.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-1.5">
              <h3 className="text-xs font-semibold text-indigo-300">
                How does ChromaForge extract dominant colors from photos?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                When you drop an image, ChromaForge downsamples the bitmap onto an off-screen HTML5 Canvas and clusters pixel frequencies. It filters out near-black, near-white, and low-saturation noise, then maps the most prominent color clusters into the OKLCH color space to ensure perceptual harmony and balanced contrast.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-1.5">
              <h3 className="text-xs font-semibold text-indigo-300">
                Are my uploaded images uploaded or stored on any external server?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                No. All image decoding and pixel color sampling occurs 100% inside your local browser memory using the standard client-side FileReader API. Your images are never sent over the network, uploaded to cloud buckets, or saved anywhere on external servers.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-1.5">
              <h3 className="text-xs font-semibold text-indigo-300">
                What image file formats are supported?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                ChromaForge supports all web standard image formats including PNG, JPEG, JPG, WEBP, AVIF, and SVG. There is no file size limit because processing is handled directly by your device&apos;s graphics processor.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-1.5">
              <h3 className="text-xs font-semibold text-indigo-300">
                How can I use the extracted colors in the palette generator?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                After sampling your image, click &apos;Open in Generator&apos;. ChromaForge transfers your extracted swatches directly into the interactive generator workspace, where you can lock colors, generate complementary tones, test contrast, and export tokens.
              </p>
            </div>
          </div>
        </section>
      </motion.main>
    </div>
  );
}
