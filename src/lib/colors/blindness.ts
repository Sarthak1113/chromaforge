import { ColorBlindnessType, RGBColor } from "@/types/color";
import { oklchToRgb, rgbToOklch, oklchToHex } from "./oklch";

/**
 * Standard LMS projection transformation matrices for color blindness simulation
 * Based on Brettel, Viénot and Mollon (1997) and Machado et al.
 */
const MATRICES: Record<Exclude<ColorBlindnessType, "normal">, number[][]> = {
  protanopia: [
    [0.56667, 0.43333, 0.0],
    [0.55833, 0.44167, 0.0],
    [0.0, 0.24167, 0.75833],
  ],
  deuteranopia: [
    [0.625, 0.375, 0.0],
    [0.7, 0.3, 0.0],
    [0.0, 0.3, 0.7],
  ],
  tritanopia: [
    [0.95, 0.05, 0.0],
    [0.0, 0.43333, 0.56667],
    [0.0, 0.475, 0.525],
  ],
  achromatopsia: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
  ],
};

/**
 * Simulates how an RGB color appears under various vision deficiencies
 */
export function simulateColorBlindnessRgb(
  rgb: RGBColor,
  type: ColorBlindnessType
): RGBColor {
  if (type === "normal") return rgb;

  const matrix = MATRICES[type];
  const r = Math.min(255, Math.max(0, Math.round(matrix[0][0] * rgb.r + matrix[0][1] * rgb.g + matrix[0][2] * rgb.b)));
  const g = Math.min(255, Math.max(0, Math.round(matrix[1][0] * rgb.r + matrix[1][1] * rgb.g + matrix[1][2] * rgb.b)));
  const b = Math.min(255, Math.max(0, Math.round(matrix[2][0] * rgb.r + matrix[2][1] * rgb.g + matrix[2][2] * rgb.b)));

  return { r, g, b };
}

/**
 * Simulates color blindness and returns hex string
 */
export function simulateColorBlindnessHex(
  hex: string,
  type: ColorBlindnessType
): string {
  if (type === "normal") return hex;
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.slice(0, 2), 16) || 0;
  const g = parseInt(cleanHex.slice(2, 4), 16) || 0;
  const b = parseInt(cleanHex.slice(4, 6), 16) || 0;

  const simulated = simulateColorBlindnessRgb({ r, g, b }, type);
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(simulated.r)}${toHex(simulated.g)}${toHex(simulated.b)}`;
}
