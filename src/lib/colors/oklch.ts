import { OKLCHColor, RGBColor, HSLColor, CMYKColor } from "@/types/color";

/**
 * High-performance, perceptual OKLCH color space mathematics
 * Based on Björn Ottosson's Oklab color model specification (2020).
 */

function srgbTransferFunction(c: number): number {
  return c <= 0.0031308
    ? 12.92 * c
    : 1.055 * Math.pow(Math.max(0, c), 1.0 / 2.4) - 0.055;
}

function srgbInverseTransferFunction(c: number): number {
  return c <= 0.04045
    ? c / 12.92
    : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Converts OKLCH to standard RGB (0-255)
 */
export function oklchToRgb(oklch: OKLCHColor): RGBColor {
  const { l, c, h } = oklch;
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  const l_ = Math.pow(l + 0.3963377774 * a + 0.2158037573 * b, 3);
  const m_ = Math.pow(l - 0.1055613458 * a - 0.0638541728 * b, 3);
  const s_ = Math.pow(l - 0.0894841775 * a - 1.2914855480 * b, 3);

  const rLinear = +4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
  const gLinear = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
  const bLinear = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_;

  const r = Math.min(255, Math.max(0, Math.round(srgbTransferFunction(rLinear) * 255)));
  const g = Math.min(255, Math.max(0, Math.round(srgbTransferFunction(gLinear) * 255)));
  const b_val = Math.min(255, Math.max(0, Math.round(srgbTransferFunction(bLinear) * 255)));

  return { r, g, b: b_val };
}

/**
 * Converts standard RGB (0-255) to OKLCH
 */
export function rgbToOklch(rgb: RGBColor): OKLCHColor {
  const rLinear = srgbInverseTransferFunction(rgb.r / 255);
  const gLinear = srgbInverseTransferFunction(rgb.g / 255);
  const bLinear = srgbInverseTransferFunction(rgb.b / 255);

  const l = Math.cbrt(0.4122214708 * rLinear + 0.5363325363 * gLinear + 0.0514459929 * bLinear);
  const m = Math.cbrt(0.2119034982 * rLinear + 0.6806995451 * gLinear + 0.1073969566 * bLinear);
  const s = Math.cbrt(0.0883024619 * rLinear + 0.2817188376 * gLinear + 0.6299787005 * bLinear);

  const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
  const b = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;

  const C = Math.sqrt(a * a + b * b);
  let H = (Math.atan2(b, a) * 180) / Math.PI;
  if (H < 0) H += 360;

  return {
    l: Math.max(0, Math.min(1, Number(L.toFixed(4)))),
    c: Math.max(0, Number(C.toFixed(4))),
    h: Math.round(H),
  };
}

/**
 * Converts OKLCH to Hex string (e.g. #3b82f6)
 */
export function oklchToHex(oklch: OKLCHColor): string {
  const { r, g, b } = oklchToRgb(oklch);
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Converts Hex string to OKLCH
 */
export function hexToOklch(hex: string): OKLCHColor {
  const cleanHex = hex.replace("#", "").trim();
  const fullHex =
    cleanHex.length === 3
      ? cleanHex.split("").map((c) => c + c).join("")
      : cleanHex;

  const r = parseInt(fullHex.slice(0, 2), 16) || 0;
  const g = parseInt(fullHex.slice(2, 4), 16) || 0;
  const b = parseInt(fullHex.slice(4, 6), 16) || 0;

  return rgbToOklch({ r, g, b });
}

/**
 * Converts RGB to HSL
 */
export function rgbToHsl(rgb: RGBColor): HSLColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Converts RGB to CMYK
 */
export function rgbToCmyk(rgb: RGBColor): CMYKColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const k = 1 - Math.max(r, g, b);
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}
