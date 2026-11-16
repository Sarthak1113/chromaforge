"use client";

import React from "react";
import { useAtom } from "jotai";
import { isShortcutsModalOpenAtom } from "@/atoms/ui.atoms";
import { X, Keyboard } from "lucide-react";

const SHORTCUTS = [
  { key: "Spacebar", desc: "Generate a new harmonious color palette" },
  { key: "1 - 8", desc: "Lock / unlock column by number (1st to 8th)" },
  { key: "L", desc: "Lock / unlock hovered color column" },
  { key: "S", desc: "Open OKLCH shades & tints ramp for hovered color" },
  { key: "A", desc: "Open color adjustment sliders for hovered color" },
  { key: "E", desc: "Open export modal (CSS, Tailwind v4, SVG, URL)" },
  { key: "Ctrl + Z", desc: "Undo last palette change" },
  { key: "Ctrl + Shift + Z", desc: "Redo last palette change" },
  { key: "?", desc: "Toggle this keyboard shortcuts dialog" },
];

export function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useAtom(isShortcutsModalOpenAtom);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Keyboard className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-zinc-100">
              Keyboard Shortcuts & Quick Controls
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-6 space-y-3">
          {SHORTCUTS.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between text-xs py-1 border-b border-zinc-800/50 last:border-0"
            >
              <span className="text-zinc-400">{s.desc}</span>
              <kbd className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 font-mono text-[11px] text-zinc-200 shadow-sm font-semibold">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950/40 flex justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
