"use client";

import React from "react";
import { useAtom, useSetAtom } from "jotai";
import {
  paletteAtom,
  toggleLockAtom,
  removeColorAtom,
} from "@/atoms/palette.atoms";
import {
  isShadesModalOpenAtom,
  shadesTargetColorIdAtom,
  isAdjusterModalOpenAtom,
  adjusterTargetColorIdAtom,
} from "@/atoms/ui.atoms";
import { ColorColumn } from "./ColorColumn";
import { motion, AnimatePresence } from "framer-motion";

export function PaletteBoard() {
  const [colors] = useAtom(paletteAtom);
  const toggleLock = useSetAtom(toggleLockAtom);
  const removeColor = useSetAtom(removeColorAtom);

  const setShadesModalOpen = useSetAtom(isShadesModalOpenAtom);
  const setShadesTargetId = useSetAtom(shadesTargetColorIdAtom);
  const setAdjusterModalOpen = useSetAtom(isAdjusterModalOpenAtom);
  const setAdjusterTargetId = useSetAtom(adjusterTargetColorIdAtom);

  const handleOpenShades = (id: string) => {
    setShadesTargetId(id);
    setShadesModalOpen(true);
  };

  const handleOpenAdjuster = (id: string) => {
    setAdjusterTargetId(id);
    setAdjusterModalOpen(true);
  };

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row w-full h-full overflow-y-auto md:overflow-hidden pb-24 md:pb-0 select-none">
      <AnimatePresence initial={false}>
        {colors.map((color, index) => (
          <motion.div
            key={color.id}
            layout
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex-1 min-h-[72px] sm:min-h-[80px] md:min-h-0 md:h-full w-full flex"
          >
            <ColorColumn
              color={color}
              index={index}
              canRemove={colors.length > 2}
              onToggleLock={toggleLock}
              onOpenShades={handleOpenShades}
              onOpenAdjuster={handleOpenAdjuster}
              onRemove={removeColor}
              onCopyHex={handleCopyHex}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
