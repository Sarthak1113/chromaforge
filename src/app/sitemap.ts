import type { MetadataRoute } from "next";
import { STYLE_OPTIONS, COLOR_COUNT_OPTIONS } from "@/lib/colors/presets";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://color-mint.sarthakranjanhota.site";
  const now = new Date();

  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/gradients`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contrast`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/visualizer`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/image-picker`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // High-intent aesthetic style URLs for direct Google/Bing search indexing
  const styleFilterRoutes: MetadataRoute.Sitemap = STYLE_OPTIONS.map((style) => ({
    url: `${baseUrl}/explore?style=${style.toLowerCase()}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  // Palette size filter URLs (2 to 8 colors)
  const sizeFilterRoutes: MetadataRoute.Sitemap = COLOR_COUNT_OPTIONS.map((count) => ({
    url: `${baseUrl}/explore?colors=${count}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...coreRoutes, ...styleFilterRoutes, ...sizeFilterRoutes];
}
