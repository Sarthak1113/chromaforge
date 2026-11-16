import { hexToOklch, oklchToHex } from "./oklch";
import { OKLCHColor } from "@/types/color";

export interface GradientColorStop {
  id: string;
  color: string;
  position: number;
}

export interface GradientRenderOptions {
  stops: GradientColorStop[];
  angle: number;
  gradientType: "linear" | "radial" | "conic" | "mesh";
  ratio: "16:9" | "1:1" | "4:3" | "9:16";
  isAdvancedEnabled: boolean;
  gradientMode: string;
  warpShape: string;
  warp: number; // 0 to 100
  warpSize: number; // 10 to 100
  noise: number; // 0 to 100
  gridW?: number; // e.g. 648
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

function hexToRgbFast(hex: string): RGB {
  const clean = hex.replace("#", "");
  const num = parseInt(clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean, 16) || 0;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function lerpRgb(c1: RGB, c2: RGB, t: number): RGB {
  return {
    r: Math.round(c1.r + (c2.r - c1.r) * t),
    g: Math.round(c1.g + (c2.g - c1.g) * t),
    b: Math.round(c1.b + (c2.b - c1.b) * t),
  };
}

function lerpOklchFast(c1Hex: string, c2Hex: string, t: number): RGB {
  const o1 = hexToOklch(c1Hex);
  const o2 = hexToOklch(c2Hex);

  // Shortest hue arc interpolation
  let dHue = o2.h - o1.h;
  if (dHue > 180) dHue -= 360;
  if (dHue < -180) dHue += 360;

  const interpolated: OKLCHColor = {
    l: o1.l + (o2.l - o1.l) * t,
    c: o1.c + (o2.c - o1.c) * t,
    h: (o1.h + dHue * t + 360) % 360,
  };

  return hexToRgbFast(oklchToHex(interpolated));
}

// Pseudo-random noise generator
function pseudoNoise(x: number, y: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

/**
 * Calculates mathematical 2D coordinate displacement based on warpShape
 */
export function getWarpDisplacement(
  u: number,
  v: number,
  shape: string,
  warpIntensity: number,
  warpSize: number
): { u: number; v: number } {
  if (warpIntensity <= 0) return { u, v };

  const intensity = (warpIntensity / 100) * 0.45;
  const freq = (warpSize / 100) * 12 + 2;

  let du = 0;
  let dv = 0;

  switch (shape) {
    case "Voronoi Noise": {
      // Cellular distance metric
      const cx = Math.sin(u * freq) * 0.5 + 0.5;
      const cy = Math.cos(v * freq) * 0.5 + 0.5;
      const dist = Math.sqrt((u - cx) ** 2 + (v - cy) ** 2);
      du = Math.sin(dist * 14) * intensity;
      dv = Math.cos(dist * 14) * intensity;
      break;
    }

    case "Worley Noise": {
      const d1 = Math.abs(Math.sin(u * freq * 1.5) - Math.cos(v * freq * 1.5));
      du = Math.cos(d1 * 8) * intensity;
      dv = Math.sin(d1 * 8) * intensity;
      break;
    }

    case "Domain Warping": {
      const qu = Math.sin(u * freq + v * 3);
      const qv = Math.cos(v * freq - u * 3);
      du = intensity * Math.sin(u * 5 + 4 * qu);
      dv = intensity * Math.cos(v * 5 + 4 * qv);
      break;
    }

    case "FBM Noise": {
      du = intensity * (0.6 * Math.sin(u * freq + v * (freq * 0.8)) + 0.4 * Math.sin(u * (freq * 2) - v * freq));
      dv = intensity * (0.6 * Math.cos(v * freq - u * (freq * 0.8)) + 0.4 * Math.cos(v * (freq * 2) + u * freq));
      break;
    }

    case "Simplex Noise":
    case "Smooth Noise": {
      du = intensity * Math.sin(u * freq * 0.8 + 0.5) * Math.cos(v * freq * 0.8);
      dv = intensity * Math.cos(u * freq * 0.8) * Math.sin(v * freq * 0.8 + 0.5);
      break;
    }

    case "Waves": {
      du = intensity * Math.sin(v * freq * 2);
      dv = intensity * Math.sin(u * freq * 2);
      break;
    }

    case "Circular": {
      const dx = u - 0.5;
      const dy = v - 0.5;
      const r = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) + intensity * 6 * Math.cos(r * freq);
      du = Math.cos(angle) * r - dx;
      dv = Math.sin(angle) * r - dy;
      break;
    }

    case "Oval": {
      du = intensity * Math.sin((u - 0.5) ** 2 * 20 * (warpSize / 50));
      dv = intensity * Math.cos((v - 0.5) ** 2 * 28 * (warpSize / 50));
      break;
    }

    case "Rows": {
      du = intensity * Math.sin(v * freq * 3);
      dv = 0;
      break;
    }

    case "Columns": {
      du = 0;
      dv = intensity * Math.sin(u * freq * 3);
      break;
    }

    case "Gravity": {
      du = intensity * 0.5 * Math.sin(u * freq) * v;
      dv = intensity * (v * v);
      break;
    }

    case "Value Noise": {
      const n1 = pseudoNoise(Math.floor(u * freq), Math.floor(v * freq));
      du = (n1 - 0.5) * intensity * 1.5;
      dv = (pseudoNoise(Math.floor(u * freq) + 1, Math.floor(v * freq)) - 0.5) * intensity * 1.5;
      break;
    }

    case "Flat":
    default:
      du = 0;
      dv = 0;
      break;
  }

  return {
    u: Math.min(1, Math.max(0, u + du)),
    v: Math.min(1, Math.max(0, v + dv)),
  };
}

/**
 * Applies Bézier or interpolation transfer curves
 */
export function applyInterpolationCurve(t: number, mode: string): number {
  const clamped = Math.min(1, Math.max(0, t));
  switch (mode) {
    case "Sharp Bézier": {
      // High-contrast sigmoid transition
      return 1 / (1 + Math.exp(-12 * (clamped - 0.5)));
    }
    case "Soft Bézier": {
      // Smooth Hermite cubic S-curve
      return clamped * clamped * (3 - 2 * clamped);
    }
    case "Mesh Grid":
    case "Mesh Static": {
      // Multi-frequency wave blend
      return 0.5 + 0.5 * Math.sin((clamped - 0.5) * Math.PI);
    }
    case "Simple (sRGB)":
    case "OKLCH Perceptual":
    default:
      return clamped;
  }
}

/**
 * Multi-stop color interpolator supporting 2, 3, or 4 stops
 */
function sampleMultiStops(sortedStops: GradientColorStop[], t: number, isOklch: boolean): RGB {
  const normT = Math.min(1, Math.max(0, t)) * 100;
  if (normT <= sortedStops[0].position) {
    return hexToRgbFast(sortedStops[0].color);
  }
  if (normT >= sortedStops[sortedStops.length - 1].position) {
    return hexToRgbFast(sortedStops[sortedStops.length - 1].color);
  }

  for (let i = 0; i < sortedStops.length - 1; i++) {
    const s1 = sortedStops[i];
    const s2 = sortedStops[i + 1];
    if (normT >= s1.position && normT <= s2.position) {
      const span = s2.position - s1.position || 1;
      const localT = (normT - s1.position) / span;
      if (isOklch) {
        return lerpOklchFast(s1.color, s2.color, localT);
      }
      return lerpRgb(hexToRgbFast(s1.color), hexToRgbFast(s2.color), localT);
    }
  }

  return hexToRgbFast(sortedStops[0].color);
}

/**
 * Renders full procedural gradient with active warp shape, Bézier interpolation, and noise grain to an HTML5 canvas.
 */
export function renderGradientToCanvas(
  canvas: HTMLCanvasElement,
  options: GradientRenderOptions
): void {
  const {
    stops,
    angle,
    gradientType,
    isAdvancedEnabled,
    gradientMode,
    warpShape,
    warp,
    warpSize,
    noise,
  } = options;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  const sortedStops = [...stops].sort((a, b) => a.position - b.position);
  if (sortedStops.length < 2) return;

  // If advanced is OFF, use native fast 2D canvas gradients for 100% clean output
  if (!isAdvancedEnabled) {
    let grad: CanvasGradient;
    if (gradientType === "radial") {
      grad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 2);
    } else if (gradientType === "conic" && ctx.createConicGradient) {
      grad = ctx.createConicGradient((angle * Math.PI) / 180, width / 2, height / 2);
    } else {
      const rad = ((angle - 90) * Math.PI) / 180;
      const x2 = width / 2 + Math.cos(rad) * (width / 2);
      const y2 = height / 2 + Math.sin(rad) * (height / 2);
      const x1 = width / 2 - Math.cos(rad) * (width / 2);
      const y1 = height / 2 - Math.sin(rad) * (height / 2);
      grad = ctx.createLinearGradient(x1, y1, x2, y2);
    }

    sortedStops.forEach((s) => {
      grad.addColorStop(s.position / 100, s.color);
    });

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    return;
  }

  // ADVANCED PROCEDURAL ENGINE:
  // Render mesh warp and noise pixel grid
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  const rad = ((angle - 90) * Math.PI) / 180;
  const cosA = Math.cos(rad);
  const sinA = Math.sin(rad);

  const isOklch = gradientMode === "OKLCH Perceptual";

  const grainFactor = (noise / 100) * 36;

  // Render every pixel with domain warping and Bézier curves
  for (let y = 0; y < height; y++) {
    const rawV = y / height;
    for (let x = 0; x < width; x++) {
      const rawU = x / width;

      // Apply warp shape coordinate displacement
      const { u, v } = getWarpDisplacement(rawU, rawV, warpShape, warp, warpSize);

      let t = 0;
      if (gradientType === "radial") {
        const dx = u - 0.5;
        const dy = v - 0.5;
        t = Math.sqrt(dx * dx + dy * dy) * 1.414;
      } else if (gradientType === "conic") {
        const dx = u - 0.5;
        const dy = v - 0.5;
        t = (Math.atan2(dy, dx) / (2 * Math.PI) + 0.5 + angle / 360) % 1;
      } else {
        // Linear along angle vector
        const centeredU = u - 0.5;
        const centeredV = v - 0.5;
        t = centeredU * cosA + centeredV * sinA + 0.5;
      }

      // Apply Bézier curve interpolation
      const shapedT = applyInterpolationCurve(t, gradientMode);

      // Color sampling across 2, 3, or 4 stops
      const pixelRgb = sampleMultiStops(sortedStops, shapedT, isOklch);

      // Apply post-processing noise grain
      let nr = 0;
      let ng = 0;
      let nb = 0;
      if (noise > 0) {
        const grain = (pseudoNoise(x, y) - 0.5) * grainFactor;
        nr = grain;
        ng = grain;
        nb = grain;
      }

      const idx = (y * width + x) * 4;
      data[idx] = Math.min(255, Math.max(0, pixelRgb.r + nr));
      data[idx + 1] = Math.min(255, Math.max(0, pixelRgb.g + ng));
      data[idx + 2] = Math.min(255, Math.max(0, pixelRgb.b + nb));
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
}
