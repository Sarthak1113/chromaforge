import { ContrastResult, OKLCHColor, RGBColor } from "@/types/color";
import { oklchToRgb, hexToOklch } from "./oklch";

/**
 * Calculates WCAG 2.1 relative luminance for an sRGB color.
 */
export function getRelativeLuminance(rgb: RGBColor): number {
  const transform = (c: number) => {
    const val = c / 255;
    return val <= 0.04045 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  };

  const r = transform(rgb.r);
  const g = transform(rgb.g);
  const b = transform(rgb.b);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculates WCAG 2.1 contrast ratio between two colors (ranges 1.0 to 21.0)
 */
export function getContrastRatio(rgb1: RGBColor, rgb2: RGBColor): number {
  const lum1 = getRelativeLuminance(rgb1);
  const lum2 = getRelativeLuminance(rgb2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));
}

/**
 * Evaluates contrast against black and white, returning optimal text color and WCAG compliance.
 */
export function getOptimalTextColor(bgOklchOrHex: OKLCHColor | string): {
  textColor: "#000000" | "#ffffff";
  contrastRatio: number;
  contrastResult: ContrastResult;
} {
  const rgb =
    typeof bgOklchOrHex === "string"
      ? oklchToRgb(hexToOklch(bgOklchOrHex))
      : oklchToRgb(bgOklchOrHex);

  const whiteRgb: RGBColor = { r: 255, g: 255, b: 255 };
  const blackRgb: RGBColor = { r: 0, g: 0, b: 0 };

  const whiteContrast = getContrastRatio(rgb, whiteRgb);
  const blackContrast = getContrastRatio(rgb, blackRgb);

  const useWhite = whiteContrast >= blackContrast;
  const chosenRatio = useWhite ? whiteContrast : blackContrast;
  const textColor = useWhite ? "#ffffff" : "#000000";

  return {
    textColor,
    contrastRatio: chosenRatio,
    contrastResult: {
      ratio: chosenRatio,
      scoreAA: chosenRatio >= 4.5,
      scoreAAA: chosenRatio >= 7.0,
      scoreAALarge: chosenRatio >= 3.0,
      scoreAAALarge: chosenRatio >= 4.5,
      textColor,
    },
  };
}
