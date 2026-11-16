import { OKLCHColor } from "@/types/color";
import { oklchToRgb, hexToOklch } from "./oklch";

interface NamedColor {
  name: string;
  hex: string;
}

const COLOR_NAMES: NamedColor[] = [
  { name: "Black", hex: "#000000" },
  { name: "Charcoal", hex: "#333333" },
  { name: "Slate Grey", hex: "#708090" },
  { name: "Silver", hex: "#c0c0c0" },
  { name: "Snow White", hex: "#ffffff" },
  { name: "Crimson", hex: "#dc143c" },
  { name: "Ruby Red", hex: "#e0115f" },
  { name: "Coral", hex: "#ff7f50" },
  { name: "Tangerine", hex: "#f28500" },
  { name: "Amber", hex: "#ffbf00" },
  { name: "Sunflower Yellow", hex: "#ffd700" },
  { name: "Lime Punch", hex: "#dfff00" },
  { name: "Emerald Green", hex: "#50c878" },
  { name: "Mint Fresh", hex: "#3eb489" },
  { name: "Teal", hex: "#008080" },
  { name: "Aqua Cyan", hex: "#00ffff" },
  { name: "Sky Blue", hex: "#87ceeb" },
  { name: "Electric Blue", hex: "#007fff" },
  { name: "Sapphire", hex: "#0f52ba" },
  { name: "Midnight Navy", hex: "#000080" },
  { name: "Indigo", hex: "#4b0082" },
  { name: "Deep Violet", hex: "#8a2be2" },
  { name: "Amethyst", hex: "#9966cc" },
  { name: "Magenta", hex: "#ff00ff" },
  { name: "Blush Pink", hex: "#ff69b4" },
  { name: "Rose Gold", hex: "#b76e79" },
  { name: "Warm Terracotta", hex: "#e2725b" },
  { name: "Golden Sand", hex: "#f4a460" },
  { name: "Espresso", hex: "#4e3629" },
  { name: "Forest Pine", hex: "#228b22" },
];

/**
 * Finds the nearest friendly name for a given OKLCH color using Euclidean RGB distance
 */
export function getNearestColorName(oklch: OKLCHColor): string {
  const currentRgb = oklchToRgb(oklch);
  let bestDist = Infinity;
  let bestName = "Custom Color";

  for (const item of COLOR_NAMES) {
    const itemOklch = hexToOklch(item.hex);
    const itemRgb = oklchToRgb(itemOklch);

    const dist =
      Math.pow(currentRgb.r - itemRgb.r, 2) +
      Math.pow(currentRgb.g - itemRgb.g, 2) +
      Math.pow(currentRgb.b - itemRgb.b, 2);

    if (dist < bestDist) {
      bestDist = dist;
      bestName = item.name;
    }
  }

  return bestName;
}
