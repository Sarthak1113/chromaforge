"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface FaqItem {
  question: string;
  answer: string;
}

interface CollapsibleFaqProps {
  title?: string;
  items: FaqItem[];
  className?: string;
}

export function CollapsibleFaq({
  title = "Frequently Asked Questions",
  items,
  className = "",
}: CollapsibleFaqProps) {
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const toggleIndex = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <section
      className={`bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4 ${className}`}
      aria-label="Frequently Asked Questions"
    >
      <h2 className="text-base font-bold text-zinc-100">{title}</h2>

      <div className="space-y-2.5">
        {items.map((item, idx) => {
          const isOpen = openIndices.includes(idx);
          return (
            <div
              key={idx}
              className="border border-zinc-800/80 bg-zinc-950/60 rounded-xl overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleIndex(idx)}
                className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-zinc-900/40 cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="text-xs sm:text-sm font-semibold text-zinc-200 pr-3">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-indigo-400" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/40">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
