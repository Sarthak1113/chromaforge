import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Curated Color Palettes Library — 2,100+ Harmonic Palettes",
  description:
    "Explore 2,100+ hand-crafted harmonic OKLCH color palettes with style filters (Warm, Cold, Bright, Dark, Pastel, Vintage, Monochromatic, Gradient, Rainbow, Neon, Earthy, Minimal, Luxury, Sunset) and size filters (2 to 8 colors). One-click export for Tailwind CSS v4, CSS custom properties, and Hex.",
  alternates: {
    canonical: "https://color-mint.sarthakranjanhota.site/explore",
  },
  openGraph: {
    title: "Curated Color Palettes Library — 2,100+ Palettes | Color-Mint",
    description:
      "Explore 2,100+ hand-crafted harmonic OKLCH color palettes with style filters and size filters (2 to 8 colors). One-click export for Tailwind CSS v4, CSS vars, and Hex.",
    url: "https://color-mint.sarthakranjanhota.site/explore",
    siteName: "Color-Mint",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Curated Color Palettes Library — 2,100+ Palettes | Color-Mint",
    description:
      "2,100+ curated color systems ready for web design, product branding, and UI tokens.",
  },
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
