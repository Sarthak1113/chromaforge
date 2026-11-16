export interface OKLCHColor {
  l: number; // 0 to 1 (Lightness)
  c: number; // 0 to ~0.37 (Chroma)
  h: number; // 0 to 360 (Hue angle in degrees)
}

export interface RGBColor {
  r: number; // 0 to 255
  g: number; // 0 to 255
  b: number; // 0 to 255
}

export interface HSLColor {
  h: number; // 0 to 360
  s: number; // 0 to 100
  l: number; // 0 to 100
}

export interface CMYKColor {
  c: number; // 0 to 100
  m: number; // 0 to 100
  y: number; // 0 to 100
  k: number; // 0 to 100
}

export interface ColorItem {
  id: string;
  hex: string;
  oklch: OKLCHColor;
  isLocked: boolean;
  name: string;
}

export type HarmonyType =
  | "random"
  | "analogous"
  | "monochromatic"
  | "triadic"
  | "complementary"
  | "split-complementary"
  | "tetradic"
  | "pastel"
  | "deep"
  | "golden-ratio";

export type ColorBlindnessType =
  | "normal"
  | "protanopia"
  | "deuteranopia"
  | "tritanopia"
  | "achromatopsia";

export interface ContrastResult {
  ratio: number;
  scoreAA: boolean;
  scoreAAA: boolean;
  scoreAALarge: boolean;
  scoreAAALarge: boolean;
  textColor: string;
}
