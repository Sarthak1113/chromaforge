import { HarmonyType } from "@/types/color";
import { generateHarmonyPalette } from "./harmonies";
import { oklchToHex } from "./oklch";

export interface CuratedPalette {
  id: string;
  name: string;
  colors: string[];
  tags: string[];
}

const PALETTE_THEMES = [
  // 1. Cyberpunk & Neon
  {
    prefix: "Cyber",
    suffixes: ["Neon", "Matrix", "Tokyo", "Hacker", "Grid", "Laser", "Pulse", "Synthetix", "Circuit", "Overdrive", "Nightcity", "Glitch", "Protocol", "Arcade", "Nexus", "Voltage", "Chrome", "Rebel", "Phantom", "Horizon"],
    baseHues: [280, 190, 320, 170, 240],
    tags: ["neon", "cyberpunk", "vibrant", "futuristic"],
    harmony: "triadic" as HarmonyType,
  },
  // 2. Nature & Botanical
  {
    prefix: "Botanical",
    suffixes: ["Matcha", "Fern", "Canopy", "Moss", "Bamboo", "Rainforest", "Willow", "Meadow", "Flora", "Clover", "Herb", "Sage", "Eucalyptus", "Pecan", "Pine", "Valley", "Lichen", "Sprout", "Breeze", "Grove"],
    baseHues: [140, 110, 85, 160, 60],
    tags: ["nature", "green", "organic", "earthy"],
    harmony: "analogous" as HarmonyType,
  },
  // 3. Sunset & Warm Earth
  {
    prefix: "Sunset",
    suffixes: ["Dunes", "Sahara", "Terracotta", "Sedona", "Canyon", "Amber", "Blaze", "Horizon", "Paprika", "Solstice", "Clay", "Mirage", "Cinnamon", "Glow", "Oasis", "Desert", "Copper", "Flame", "Sienna", "Dusk"],
    baseHues: [25, 45, 15, 35, 55],
    tags: ["warm", "sunset", "orange", "earthy"],
    harmony: "analogous" as HarmonyType,
  },
  // 4. Coastal & Ocean
  {
    prefix: "Ocean",
    suffixes: ["Abyss", "Reef", "Lagoon", "Pacific", "Tide", "Deepwater", "Cerulean", "Coral Bay", "Azure", "Seabreeze", "Wave", "Fjord", "Glacier", "Atlantis", "Current", "Coast", "Nautical", "Driftwood", "Marina", "Harbor"],
    baseHues: [210, 230, 185, 195, 220],
    tags: ["cool", "ocean", "blue", "water"],
    harmony: "analogous" as HarmonyType,
  },
  // 5. Pastel Dreams
  {
    prefix: "Pastel",
    suffixes: ["Macaron", "Blush", "Cotton Candy", "Lilac", "Peach", "Gelato", "Marshmallow", "Buttercup", "Petal", "Dream", "Whimsical", "Feather", "Sorbet", "Cloud", "Vanilla", "Dewdrop", "Lavender", "Haze", "Candy", "Lullaby"],
    baseHues: [330, 260, 80, 180, 20],
    tags: ["pastel", "soft", "light", "delicate"],
    harmony: "pastel" as HarmonyType,
  },
  // 6. Deep Space & Cosmic
  {
    prefix: "Cosmic",
    suffixes: ["Nebula", "Starlight", "Supernova", "Eclipse", "Void", "Quasar", "Andromeda", "Pulsar", "Orbit", "Meteor", "Astral", "Constellation", "Galaxy", "Cosmos", "Zero-G", "Infinity", "Dark Matter", "Solar", "Event Horizon", "Zenith"],
    baseHues: [270, 290, 240, 210, 340],
    tags: ["space", "dark", "purple", "deep"],
    harmony: "deep" as HarmonyType,
  },
  // 7. Minimalist & Architectural
  {
    prefix: "Studio",
    suffixes: ["Monolith", "Concrete", "Brutalist", "Charcoal", "Limestone", "Alabaster", "Slate", "Obsidian", "Pebble", "Basalt", "Graphite", "Bauhaus", "Minimal", "Nordic", "Zen", "Porcelain", "Ash", "Ivory", "Steel", "Silhouette"],
    baseHues: [240, 210, 180, 120, 60],
    tags: ["minimal", "monochrome", "clean", "architecture"],
    harmony: "monochromatic" as HarmonyType,
  },
  // 8. Luxury & Jewel
  {
    prefix: "Royal",
    suffixes: ["Amethyst", "Emerald", "Sapphire", "Velvet", "Gilded", "Ruby", "Onyx", "Tanzanite", "Imperial", "Dynasty", "Crown", "Jade", "Baroque", "Palace", "Garnet", "Topaz", "Opulence", "Sovereign", "Majesty", "Treasury"],
    baseHues: [300, 150, 230, 10, 40],
    tags: ["luxury", "jewel", "rich", "elegant"],
    harmony: "triadic" as HarmonyType,
  },
  // 9. Retro & Vintage
  {
    prefix: "Vintage",
    suffixes: ["1970s", "Cassette", "Vinyl", "Polaroid", "Groovy", "Motel", "Kodak", "Diner", "Roller", "Mustang", "Woodstock", "Arcadia", "Record", "Sepia", "Nostalgia", "Velour", "Warmwave", "Gramophone", "Classic", "Heritage"],
    baseHues: [35, 75, 15, 190, 310],
    tags: ["vintage", "retro", "nostalgia", "warm"],
    harmony: "golden-ratio" as HarmonyType,
  },
  // 10. Golden Hour & Autumn
  {
    prefix: "Autumn",
    suffixes: ["Harvest", "Maple", "Acorn", "Foliage", "Chestnut", "Hickory", "Pumpkin", "Cider", "Golden Hour", "Russet", "Hearth", "Crisp", "Bonfire", "Fallen Leaf", "Timber", "Bosc Pear", "Cozy", "Wool", "Campfire", "Orchard"],
    baseHues: [30, 45, 15, 60, 20],
    tags: ["autumn", "warm", "gold", "fall"],
    harmony: "analogous" as HarmonyType,
  },
  // 11. Sweet Bakery & Cafe
  {
    prefix: "Cafe",
    suffixes: ["Espresso", "Biscotti", "Mocha", "Caramel", "Latte", "Chai", "Tiramisu", "Brioche", "Cappuccino", "Hazelnut", "Cinnamon Roll", "Croissant", "Toffee", "Vanilla Bean", "Cardamom", "Churro", "Cream", "Scone", "Barista", "Roast"],
    baseHues: [35, 45, 25, 50, 15],
    tags: ["coffee", "warm", "brown", "cozy"],
    harmony: "analogous" as HarmonyType,
  },
  // 12. Nordic Frost & Alpine
  {
    prefix: "Nordic",
    suffixes: ["Frost", "Alpine", "Blizzard", "Tundra", "Reykjavik", "Aurora", "Iceberg", "Snowfall", "Lofoten", "Midnight Sun", "Hygge", "Copenhagen", "Glacial", "Taiga", "Stockholm", "Oslo", "Pine Valley", "Permafrost", "Fjordland", "Subzero"],
    baseHues: [200, 220, 180, 250, 210],
    tags: ["nordic", "cool", "winter", "clean"],
    harmony: "golden-ratio" as HarmonyType,
  },
];

/**
 * Generates an extensive collection of 240 distinct, high-aesthetic curated palettes
 * using deterministic OKLCH color math and diverse design themes.
 */
export function generateCuratedPalettes(): CuratedPalette[] {
  const palettes: CuratedPalette[] = [];
  let counter = 1;

  for (const theme of PALETTE_THEMES) {
    for (let i = 0; i < theme.suffixes.length; i++) {
      const suffix = theme.suffixes[i];
      const baseHue = (theme.baseHues[i % theme.baseHues.length] + i * 7) % 360;

      // Seed OKLCH color
      const seedL = theme.harmony === "pastel" ? 0.82 : theme.harmony === "deep" ? 0.38 : 0.62;
      const seedC = theme.harmony === "pastel" ? 0.05 : theme.harmony === "monochromatic" ? 0.02 : 0.16;

      const oklchColors = generateHarmonyPalette(5, theme.harmony, {
        l: seedL,
        c: seedC,
        h: baseHue,
      });

      const colors = oklchColors.map((c) => oklchToHex(c));

      palettes.push({
        id: `cur-${counter}`,
        name: `${theme.prefix} ${suffix}`,
        colors,
        tags: [...theme.tags, suffix.toLowerCase().replace(/\s+/g, "-")],
      });

      counter++;
    }
  }

  return palettes;
}

// Pre-computed static list of 240 curated palettes
export const ALL_CURATED_PALETTES: CuratedPalette[] = generateCuratedPalettes();
