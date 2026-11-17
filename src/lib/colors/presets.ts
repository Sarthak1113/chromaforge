import { HarmonyType, OKLCHColor } from "@/types/color";
import { generateHarmonyPalette } from "./harmonies";
import { oklchToHex } from "./oklch";

export interface CuratedPalette {
  id: string;
  name: string;
  colors: string[]; // 2 to 8 hex strings
  style: string;    // e.g. "Warm", "Cold", "Bright", "Dark", "Pastel", "Vintage", "Monochromatic", "Gradient", "Rainbow", etc.
  colorCount: number; // 2..8
  colorNames: string[]; // e.g. ["Emerald", "Mint", "Teal", ...]
  tags: string[];   // For search backwards compatibility
}

export const STYLE_OPTIONS = [
  "Warm",
  "Cold",
  "Bright",
  "Dark",
  "Pastel",
  "Vintage",
  "Monochromatic",
  "Gradient",
  "Rainbow",
  "Neon",
  "Earthy",
  "Minimal",
  "Luxury",
  "Sunset",
] as const;

export type StyleType = typeof STYLE_OPTIONS[number];

export const COLOR_COUNT_OPTIONS = [2, 3, 4, 5, 6, 7, 8] as const;

/**
 * Fast, deterministic perceptual color namer for sub-millisecond search indexing
 */
export function getFriendlyColorName(l: number, c: number, h: number): string {
  if (c < 0.04) {
    if (l < 0.22) return "Black";
    if (l > 0.88) return "White";
    return "Grey";
  }

  // Hue angle ranges (0-360)
  if (h >= 345 || h < 18) {
    if (l < 0.38) return "Maroon";
    if (l > 0.78) return "Pink";
    return "Red";
  }
  if (h >= 18 && h < 48) {
    if (l < 0.38) return "Brown";
    if (l > 0.76) return "Peach";
    return "Orange";
  }
  if (h >= 48 && h < 75) {
    if (l > 0.80) return "Cream";
    if (l < 0.45) return "Olive";
    return "Yellow";
  }
  if (h >= 75 && h < 165) {
    if (l > 0.78) return "Mint";
    if (l < 0.35) return "Forest Green";
    return "Green";
  }
  if (h >= 165 && h < 205) {
    return "Teal";
  }
  if (h >= 205 && h < 240) {
    if (l > 0.78) return "Sky Blue";
    return "Cyan";
  }
  if (h >= 240 && h < 275) {
    if (l < 0.35) return "Navy";
    if (l > 0.78) return "Ice Blue";
    return "Blue";
  }
  if (h >= 275 && h < 315) {
    if (l < 0.35) return "Deep Violet";
    if (l > 0.78) return "Lavender";
    return "Purple";
  }
  if (h >= 315 && h < 345) {
    if (l > 0.75) return "Blush";
    return "Magenta";
  }

  return "Accent";
}

interface StyleConfig {
  style: StyleType;
  prefix: string;
  descriptors: string[];
  baseHues: number[];
  harmony: HarmonyType;
  seedLightness: (idx: number) => number;
  seedChroma: (idx: number) => number;
}

const STYLE_CONFIGS: StyleConfig[] = [
  // 1. Warm
  {
    style: "Warm",
    prefix: "Warm",
    descriptors: [
      "Amber", "Terracotta", "Sedona", "Sahara", "Copper", "Paprika", "Cinnamon", "Hearth",
      "Desert", "Solstice", "Clay", "Tuscan", "Mesa", "Saffron", "Rust", "Oasis", "Spice",
      "Sienna", "Adobe", "Blaze", "Flame", "Marigold", "Chili", "Dune", "Canyon"
    ],
    baseHues: [25, 40, 15, 35, 55, 60],
    harmony: "analogous",
    seedLightness: (i) => 0.58 + (i % 5) * 0.04,
    seedChroma: () => 0.16,
  },
  // 2. Cold
  {
    style: "Cold",
    prefix: "Cold",
    descriptors: [
      "Glacier", "Arctic", "Abyss", "Azure", "Deepwater", "Cobalt", "Iceberg", "Subzero",
      "Fjord", "Polar", "Seabreeze", "Alpine", "Boreal", "Frost", "Marina", "Wave",
      "Harbor", "Lagoon", "Cerulean", "Tide", "Atlantic", "Fjordland", "Blizzard", "Ice", "Ocean"
    ],
    baseHues: [210, 230, 195, 240, 185, 220],
    harmony: "analogous",
    seedLightness: (i) => 0.54 + (i % 5) * 0.05,
    seedChroma: () => 0.14,
  },
  // 3. Bright
  {
    style: "Bright",
    prefix: "Bright",
    descriptors: [
      "Radiant", "Vivid", "Prism", "Electric", "Kinetic", "Solaris", "Luminous", "Flash",
      "Daylight", "Zing", "Aura", "Flare", "Chroma", "Spectra", "Ignite", "Hyper",
      "Spark", "Sunburst", "Volt", "Lucid", "Beaming", "Verve", "Dazzle", "Glow", "Brilliance"
    ],
    baseHues: [120, 180, 240, 300, 360, 60],
    harmony: "triadic",
    seedLightness: (i) => 0.68 + (i % 4) * 0.04,
    seedChroma: () => 0.22,
  },
  // 4. Dark
  {
    style: "Dark",
    prefix: "Dark",
    descriptors: [
      "Obsidian", "Charcoal", "Midnight", "Eclipse", "Onyx", "Basalt", "Shadow", "Void",
      "Phantom", "Graphite", "Carbon", "Abyssal", "Slate", "Nocturne", "Stygian", "Raven",
      "Vesper", "Umbra", "Dark Matter", "Cosmos", "Iron", "Shade", "Pebble", "Pitch", "Gothic"
    ],
    baseHues: [240, 270, 210, 290, 180, 330],
    harmony: "deep",
    seedLightness: (i) => 0.32 + (i % 4) * 0.03,
    seedChroma: () => 0.09,
  },
  // 5. Pastel
  {
    style: "Pastel",
    prefix: "Pastel",
    descriptors: [
      "Macaron", "Blush", "Lilac", "Peach", "Gelato", "Marshmallow", "Cotton Candy", "Petal",
      "Dewdrop", "Whimsical", "Feather", "Sorbet", "Cloud", "Vanilla", "Buttercup", "Lullaby",
      "Lavender", "Blossom", "Powder", "Mint Cream", "Haze", "Silk", "Foam", "Melon", "Chiffon"
    ],
    baseHues: [330, 260, 80, 180, 20, 140],
    harmony: "pastel",
    seedLightness: (i) => 0.82 + (i % 4) * 0.02,
    seedChroma: () => 0.06,
  },
  // 6. Vintage
  {
    style: "Vintage",
    prefix: "Vintage",
    descriptors: [
      "1970s", "Cassette", "Polaroid", "Vinyl", "Woodstock", "Diner", "Sepia", "Kodak",
      "Velour", "Motel", "Gramophone", "Nostalgia", "Heritage", "Mustang", "Groovy", "Brass",
      "Record", "Warmwave", "Arcadia", "Parchment", "Revival", "Classic", "Filament", "Retro", "Folk"
    ],
    baseHues: [35, 75, 15, 190, 310, 50],
    harmony: "golden-ratio",
    seedLightness: (i) => 0.58 + (i % 4) * 0.04,
    seedChroma: () => 0.12,
  },
  // 7. Monochromatic
  {
    style: "Monochromatic",
    prefix: "Mono",
    descriptors: [
      "Slate", "Emerald", "Indigo", "Amber", "Ruby", "Cyan", "Violet", "Sand",
      "Charcoal", "Teal", "Rose", "Forest", "Bronze", "Sapphire", "Graphite", "Gold",
      "Steel", "Mauve", "Cobalt", "Ochre", "Plum", "Sage", "Copper", "Aqua", "Zinc"
    ],
    baseHues: [210, 145, 270, 45, 15, 190, 320, 85],
    harmony: "monochromatic",
    seedLightness: () => 0.60,
    seedChroma: () => 0.14,
  },
  // 8. Gradient
  {
    style: "Gradient",
    prefix: "Gradient",
    descriptors: [
      "Cascade", "Horizon", "Transition", "Flow", "Drift", "Glide", "Continuum", "Sweep",
      "Swell", "Tide", "Waveform", "Arc", "Ripple", "Stream", "Meld", "Shift",
      "Infusion", "Dispersion", "Mirage", "Prismatic", "Passage", "Confluence", "Aurora", "Glide", "Veil"
    ],
    baseHues: [160, 200, 240, 280, 320, 40],
    harmony: "analogous",
    seedLightness: (i) => 0.62 + (i % 4) * 0.03,
    seedChroma: () => 0.18,
  },
  // 9. Rainbow
  {
    style: "Rainbow",
    prefix: "Rainbow",
    descriptors: [
      "Spectrum", "Prism", "Kaleido", "Diffraction", "Iris", "Chroma Flow", "Technicolor", "Poly-Hue",
      "Carnival", "Festival", "Multi-Glow", "Color Wheel", "Optic", "Dispersion", "Borealis", "Prismatic",
      "Gamut", "Sundial", "Lighthouse", "Arcade", "Vibrant Run", "Full Spread", "Chroma Shift", "Radiance", "Miracle"
    ],
    baseHues: [0, 60, 120, 180, 240, 300],
    harmony: "golden-ratio",
    seedLightness: (i) => 0.65 + (i % 3) * 0.04,
    seedChroma: () => 0.20,
  },
  // 10. Neon
  {
    style: "Neon",
    prefix: "Neon",
    descriptors: [
      "Matrix", "Tokyo", "Cyber", "Laser", "Voltage", "Pulse", "Grid", "Hacker",
      "Synthetix", "Circuit", "Nightcity", "Glitch", "Protocol", "Arcade", "Nexus", "Overdrive",
      "Chrome", "Rebel", "Phantom", "Horizon", "Wireframe", "District", "Afterdark", "Cybernetic", "Synapse"
    ],
    baseHues: [280, 190, 320, 170, 240, 140],
    harmony: "triadic",
    seedLightness: (i) => 0.66 + (i % 3) * 0.05,
    seedChroma: () => 0.24,
  },
  // 11. Earthy
  {
    style: "Earthy",
    prefix: "Earthy",
    descriptors: [
      "Matcha", "Moss", "Canopy", "Rainforest", "Bamboo", "Willow", "Meadow", "Sage",
      "Eucalyptus", "Pecan", "Pine", "Valley", "Lichen", "Clover", "Herb", "Soil",
      "Olive", "Forest", "Flora", "Timber", "Cedar", "Bark", "Grove", "Breeze", "Sprout"
    ],
    baseHues: [140, 110, 85, 160, 60, 120],
    harmony: "analogous",
    seedLightness: (i) => 0.52 + (i % 4) * 0.04,
    seedChroma: () => 0.11,
  },
  // 12. Minimal
  {
    style: "Minimal",
    prefix: "Minimal",
    descriptors: [
      "Brutalist", "Monolith", "Concrete", "Limestone", "Alabaster", "Bauhaus", "Porcelain", "Ash",
      "Ivory", "Steel", "Silhouette", "Zen", "Studio", "Structure", "Silence", "Pure",
      "Muted", "Parchment", "Architect", "Nordic Clean", "Canvas", "Neutral", "Chalk", "Marble", "Stone"
    ],
    baseHues: [240, 210, 180, 120, 60, 30],
    harmony: "monochromatic",
    seedLightness: () => 0.65,
    seedChroma: () => 0.03,
  },
  // 13. Luxury
  {
    style: "Luxury",
    prefix: "Luxury",
    descriptors: [
      "Royal", "Amethyst", "Emerald", "Sapphire", "Velvet", "Gilded", "Ruby", "Onyx",
      "Tanzanite", "Imperial", "Dynasty", "Crown", "Jade", "Baroque", "Palace", "Garnet",
      "Topaz", "Opulence", "Sovereign", "Majesty", "Treasury", "Diamond", "Platinum", "Gold Leaf", "Regal"
    ],
    baseHues: [300, 150, 230, 10, 40, 280],
    harmony: "triadic",
    seedLightness: (i) => 0.52 + (i % 4) * 0.05,
    seedChroma: () => 0.17,
  },
  // 14. Sunset
  {
    style: "Sunset",
    prefix: "Sunset",
    descriptors: [
      "Twilight", "Dusk", "Golden Hour", "Solstice", "Afterglow", "Coral Bay", "Crepuscular", "Evening Sky",
      "Mirage", "Sunburst", "Glow", "Sundown", "Crimson Sky", "Sedona Sunset", "Amber Dusk", "Horizon",
      "Daybreak", "Flamingo", "Sunkissed", "Blush Sky", "Campfire", "Orchard", "Dunes", "Harvest", "Equinox"
    ],
    baseHues: [30, 15, 345, 45, 60, 25],
    harmony: "analogous",
    seedLightness: (i) => 0.62 + (i % 4) * 0.04,
    seedChroma: () => 0.18,
  },
];

/**
 * Deterministically generates 2,100 high-quality curated OKLCH palettes across 14 styles
 * and 7 color counts (2, 3, 4, 5, 6, 7, 8).
 */
export function generateCuratedPalettes(): CuratedPalette[] {
  const palettes: CuratedPalette[] = [];
  let globalId = 1;

  // 14 styles × 150 palettes each = 2,100 total palettes
  const PALETTES_PER_STYLE = 150;
  const counts: readonly number[] = [2, 3, 4, 5, 6, 7, 8];

  for (const cfg of STYLE_CONFIGS) {
    for (let i = 0; i < PALETTES_PER_STYLE; i++) {
      // Deterministic color count: cycles through 2, 3, 4, 5, 6, 7, 8
      const colorCount = counts[i % counts.length];
      const descriptor = cfg.descriptors[i % cfg.descriptors.length];
      const descriptorVariant = Math.floor(i / cfg.descriptors.length) + 1;

      // Unique palette name
      const name =
        descriptorVariant === 1
          ? `${cfg.prefix} ${descriptor}`
          : `${cfg.prefix} ${descriptor} ${descriptorVariant}`;

      // Calculate base hue deterministically
      const baseHueIndex = (i + Math.floor(i / cfg.baseHues.length)) % cfg.baseHues.length;
      const hueShift = ((i * 11) % 40) - 20;
      const baseHue = (cfg.baseHues[baseHueIndex] + hueShift + 360) % 360;

      const seedL = cfg.seedLightness(i);
      const seedC = cfg.seedChroma(i);

      // Generate palette colors using OKLCH math
      const oklchColors: OKLCHColor[] = generateHarmonyPalette(colorCount, cfg.harmony, {
        l: seedL,
        c: seedC,
        h: baseHue,
      });

      const colors = oklchColors.map((c) => oklchToHex(c));

      // Extract unique friendly color names for search indexing
      const colorNames = Array.from(
        new Set(oklchColors.map((c) => getFriendlyColorName(c.l, c.c, c.h)))
      );

      palettes.push({
        id: `cur-${globalId}`,
        name,
        colors,
        style: cfg.style,
        colorCount,
        colorNames,
        tags: [
          cfg.style.toLowerCase(),
          `${colorCount}-colors`,
          descriptor.toLowerCase().replace(/\s+/g, "-"),
          ...colorNames.map((n) => n.toLowerCase()),
        ],
      });

      globalId++;
    }
  }

  return palettes;
}

// Pre-computed in-memory static list of 2,100 curated palettes
export const ALL_CURATED_PALETTES: CuratedPalette[] = generateCuratedPalettes();
