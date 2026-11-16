import { OKLCHColor, HarmonyType } from "@/types/color";
import { oklchToHex } from "./oklch";

/**
 * Generates an aesthetically pleasing random OKLCH color.
 * Lightness and chroma are constrained to vivid, accessible ranges in sRGB gamut.
 */
export function generateRandomOklch(): OKLCHColor {
  const l = Number((0.35 + Math.random() * 0.55).toFixed(3)); // 0.35 - 0.90
  const c = Number((0.08 + Math.random() * 0.16).toFixed(3)); // 0.08 - 0.24
  const h = Math.round(Math.random() * 360);
  return { l, c, h };
}

/**
 * Generates a palette of N colors based on OKLCH perceptual harmony models
 */
export function generateHarmonyPalette(
  count: number = 5,
  harmony: HarmonyType = "random",
  baseColor?: OKLCHColor
): OKLCHColor[] {
  const seed = baseColor || generateRandomOklch();
  const colors: OKLCHColor[] = [];

  switch (harmony) {
    case "analogous": {
      const step = 30 / Math.max(1, count - 1);
      for (let i = 0; i < count; i++) {
        const offset = (i - Math.floor(count / 2)) * step;
        const h = (seed.h + offset + 360) % 360;
        const l = Math.min(0.92, Math.max(0.3, seed.l + (i % 2 === 0 ? 0.05 : -0.05)));
        colors.push({ l: Number(l.toFixed(3)), c: seed.c, h: Math.round(h) });
      }
      break;
    }

    case "monochromatic": {
      const minL = 0.25;
      const maxL = 0.90;
      const stepL = (maxL - minL) / (count - 1 || 1);
      for (let i = 0; i < count; i++) {
        const l = minL + i * stepL;
        // Natural chroma curve: chroma peaks at mid-lightness, tapers at extreme dark/light
        const cFactor = 1 - Math.abs(l - 0.55) * 1.4;
        const c = Math.max(0.02, Number((seed.c * Math.max(0.3, cFactor)).toFixed(3)));
        colors.push({ l: Number(l.toFixed(3)), c, h: seed.h });
      }
      break;
    }

    case "triadic": {
      const triadAngles = [0, 120, 240];
      for (let i = 0; i < count; i++) {
        const angle = triadAngles[i % 3] + Math.floor(i / 3) * 20;
        const h = (seed.h + angle) % 360;
        const l = Math.min(0.9, Math.max(0.35, seed.l + (i % 2 === 0 ? 0.08 : -0.06)));
        colors.push({ l: Number(l.toFixed(3)), c: seed.c, h: Math.round(h) });
      }
      break;
    }

    case "complementary": {
      for (let i = 0; i < count; i++) {
        const isComplement = i % 2 === 1;
        const h = isComplement ? (seed.h + 180) % 360 : seed.h;
        const lMod = ((i * 0.12) % 0.4) - 0.2;
        const l = Math.min(0.92, Math.max(0.28, seed.l + lMod));
        colors.push({ l: Number(l.toFixed(3)), c: seed.c, h: Math.round(h) });
      }
      break;
    }

    case "split-complementary": {
      const angles = [0, 150, 210];
      for (let i = 0; i < count; i++) {
        const angle = angles[i % 3];
        const h = (seed.h + angle + (Math.floor(i / 3) * 15)) % 360;
        const l = Math.min(0.9, Math.max(0.35, seed.l + ((i * 0.08) % 0.3) - 0.1));
        colors.push({ l: Number(l.toFixed(3)), c: seed.c, h: Math.round(h) });
      }
      break;
    }

    case "tetradic": {
      const angles = [0, 90, 180, 270];
      for (let i = 0; i < count; i++) {
        const angle = angles[i % 4];
        const h = (seed.h + angle) % 360;
        colors.push({ l: seed.l, c: seed.c, h: Math.round(h) });
      }
      break;
    }

    case "pastel": {
      for (let i = 0; i < count; i++) {
        const h = (seed.h + (i * 360) / count) % 360;
        const l = Number((0.78 + Math.random() * 0.12).toFixed(3));
        const c = Number((0.04 + Math.random() * 0.05).toFixed(3));
        colors.push({ l, c, h: Math.round(h) });
      }
      break;
    }

    case "deep": {
      for (let i = 0; i < count; i++) {
        const h = (seed.h + (i * 360) / count) % 360;
        const l = Number((0.28 + Math.random() * 0.2).toFixed(3));
        const c = Number((0.12 + Math.random() * 0.1).toFixed(3));
        colors.push({ l, c, h: Math.round(h) });
      }
      break;
    }

    case "golden-ratio": {
      // Golden angle approx 137.508 degrees
      const goldenAngle = 137.508;
      for (let i = 0; i < count; i++) {
        const h = (seed.h + i * goldenAngle) % 360;
        const l = Math.min(0.88, Math.max(0.35, 0.45 + ((i * 0.13) % 0.45)));
        const c = Number((0.10 + ((i * 0.03) % 0.12)).toFixed(3));
        colors.push({ l: Number(l.toFixed(3)), c, h: Math.round(h) });
      }
      break;
    }

    case "random":
    default: {
      colors.push(seed);
      for (let i = 1; i < count; i++) {
        colors.push(generateRandomOklch());
      }
      break;
    }
  }

  return colors;
}
