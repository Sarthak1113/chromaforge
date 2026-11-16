import { OKLCHColor } from "@/types/color";
import { oklchToHex } from "./oklch";

export interface ShadeStep {
  step: number; // e.g. 50, 100, 200, ... 900, 950
  l: number;
  c: number;
  h: number;
  hex: string;
}

const TAILWIND_STEPS = [
  { step: 50, l: 0.97 },
  { step: 100, l: 0.93 },
  { step: 200, l: 0.86 },
  { step: 300, l: 0.78 },
  { step: 400, l: 0.67 },
  { step: 500, l: 0.58 },
  { step: 600, l: 0.49 },
  { step: 700, l: 0.41 },
  { step: 800, l: 0.32 },
  { step: 900, l: 0.24 },
  { step: 950, l: 0.16 },
];

/**
 * Generates an OKLCH perceptual tint and shade scale (Tailwind 50-950 format).
 */
export function generateShadeRamp(baseOklch: OKLCHColor): ShadeStep[] {
  return TAILWIND_STEPS.map(({ step, l }) => {
    // Parabolic chroma attenuation toward pure white and pure black to prevent oversaturation
    const chromaFactor = Math.sin(l * Math.PI);
    const c = Math.max(0.01, Number((baseOklch.c * chromaFactor).toFixed(3)));
    const oklch: OKLCHColor = { l, c, h: baseOklch.h };

    return {
      step,
      l,
      c,
      h: baseOklch.h,
      hex: oklchToHex(oklch),
    };
  });
}
