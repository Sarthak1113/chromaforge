import { atom } from "jotai";
import { ColorItem, HarmonyType, OKLCHColor } from "@/types/color";
import {
  generateHarmonyPalette,
  generateRandomOklch,
} from "@/lib/colors/harmonies";
import { oklchToHex, hexToOklch } from "@/lib/colors/oklch";
import { getNearestColorName } from "@/lib/colors/names";

// Active color harmony model
export const harmonyModeAtom = atom<HarmonyType>("random");

// Initial 5-color aesthetic palette generated in OKLCH
export function createInitialPalette(count: number = 5): ColorItem[] {
  const oklchColors = generateHarmonyPalette(count, "random");
  return oklchColors.map((oklch, idx) => ({
    id: `col-${Date.now()}-${idx}`,
    hex: oklchToHex(oklch),
    oklch,
    isLocked: false,
    name: getNearestColorName(oklch),
  }));
}

// Core Atomic State
export const paletteAtom = atom<ColorItem[]>(createInitialPalette(5));

// Active color index selected for editing
export const activeColorIndexAtom = atom<number | null>(null);

// History stack for Undo / Redo
export const historyAtom = atom<{
  past: ColorItem[][];
  future: ColorItem[][];
}>({
  past: [],
  future: [],
});

// Derived atom for palette hex array (useful for exports and URL sync)
export const paletteHexListAtom = atom<string[]>((get) => {
  return get(paletteAtom).map((item) => item.hex);
});

// Write-only atom: Generate new palette preserving locked colors
export const generatePaletteAtom = atom(null, (get, set) => {
  const current = get(paletteAtom);
  const harmony = get(harmonyModeAtom);

  // Push current to history
  set(historyAtom, (prev) => ({
    past: [...prev.past.slice(-20), current],
    future: [],
  }));

  // Identify if any locked color can act as anchor
  const lockedAnchor = current.find((c) => c.isLocked);
  const anchorOklch = lockedAnchor ? lockedAnchor.oklch : undefined;

  const newOklchPalette = generateHarmonyPalette(
    current.length,
    harmony,
    anchorOklch
  );

  const nextColors = current.map((item, idx) => {
    if (item.isLocked) return item;
    const oklch = newOklchPalette[idx] || generateRandomOklch();
    return {
      ...item,
      hex: oklchToHex(oklch),
      oklch,
      name: getNearestColorName(oklch),
    };
  });

  set(paletteAtom, nextColors);
});

// Write-only atom: Toggle lock state
export const toggleLockAtom = atom(null, (get, set, colorId: string) => {
  const current = get(paletteAtom);
  set(
    paletteAtom,
    current.map((item) =>
      item.id === colorId ? { ...item, isLocked: !item.isLocked } : item
    )
  );
});

// Write-only atom: Update specific color
export const updateColorAtom = atom(
  null,
  (
    get,
    set,
    payload: { id: string; hex?: string; oklch?: OKLCHColor; isLocked?: boolean }
  ) => {
    const current = get(paletteAtom);
    set(
      paletteAtom,
      current.map((item) => {
        if (item.id !== payload.id) return item;

        let oklch = item.oklch;
        let hex = item.hex;

        if (payload.oklch) {
          oklch = payload.oklch;
          hex = oklchToHex(oklch);
        } else if (payload.hex) {
          hex = payload.hex;
          oklch = hexToOklch(hex);
        }

        return {
          ...item,
          hex,
          oklch,
          isLocked: payload.isLocked !== undefined ? payload.isLocked : item.isLocked,
          name: getNearestColorName(oklch),
        };
      })
    );
  }
);

// Write-only atom: Reorder colors (drag-and-drop)
export const reorderColorsAtom = atom(
  null,
  (get, set, payload: { fromIndex: number; toIndex: number }) => {
    const current = [...get(paletteAtom)];
    const [moved] = current.splice(payload.fromIndex, 1);
    current.splice(payload.toIndex, 0, moved);
    set(paletteAtom, current);
  }
);

// Write-only atom: Add color
export const addColorAtom = atom(null, (get, set, atIndex?: number) => {
  const current = get(paletteAtom);
  if (current.length >= 8) return;

  const oklch = generateRandomOklch();
  const newItem: ColorItem = {
    id: `col-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    hex: oklchToHex(oklch),
    oklch,
    isLocked: false,
    name: getNearestColorName(oklch),
  };

  const next = [...current];
  const insertIndex = atIndex !== undefined ? atIndex : next.length;
  next.splice(insertIndex, 0, newItem);
  set(paletteAtom, next);
});

// Write-only atom: Remove color
export const removeColorAtom = atom(null, (get, set, colorId: string) => {
  const current = get(paletteAtom);
  if (current.length <= 2) return;

  set(
    paletteAtom,
    current.filter((item) => item.id !== colorId)
  );
});

// Write-only atom: Remove last color
export const removeLastColorAtom = atom(null, (get, set) => {
  const current = get(paletteAtom);
  if (current.length <= 2) return;
  set(paletteAtom, current.slice(0, current.length - 1));
});

// Currently hovered or active color column
export const hoveredColorIdAtom = atom<string | null>(null);

// Write-only atom: Toggle lock by index (0 to length-1, triggered by keys 1-9)
export const toggleLockByIndexAtom = atom(null, (get, set, index: number) => {
  const current = get(paletteAtom);
  if (index < 0 || index >= current.length) return;
  const targetId = current[index].id;
  set(
    paletteAtom,
    current.map((item) =>
      item.id === targetId ? { ...item, isLocked: !item.isLocked } : item
    )
  );
});

// Write-only atom: Toggle lock on the currently hovered column
export const toggleLockHoveredAtom = atom(null, (get, set) => {
  const current = get(paletteAtom);
  const hoveredId = get(hoveredColorIdAtom);
  if (hoveredId) {
    set(
      paletteAtom,
      current.map((item) =>
        item.id === hoveredId ? { ...item, isLocked: !item.isLocked } : item
      )
    );
  }
});

// Write-only atom: Undo
export const undoAtom = atom(null, (get, set) => {
  const { past, future } = get(historyAtom);
  if (past.length === 0) return;

  const previous = past[past.length - 1];
  const newPast = past.slice(0, past.length - 1);
  const current = get(paletteAtom);

  set(historyAtom, {
    past: newPast,
    future: [current, ...future],
  });
  set(paletteAtom, previous);
});

// Write-only atom: Redo
export const redoAtom = atom(null, (get, set) => {
  const { past, future } = get(historyAtom);
  if (future.length === 0) return;

  const next = future[0];
  const newFuture = future.slice(1);
  const current = get(paletteAtom);

  set(historyAtom, {
    past: [...past, current],
    future: newFuture,
  });
  set(paletteAtom, next);
});
