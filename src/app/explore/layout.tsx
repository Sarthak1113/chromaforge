import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Curated Harmonic Color Palettes & Color Schemes Library",
  description:
    "Explore 240+ hand-crafted, accessible color systems organized by mood, contrast, and aesthetic theme (Cyberpunk, Sunset, Pastel, Minimal, Corporate) with instant copy and export.",
  alternates: {
    canonical: "https://chromaforge.sarthakranjanhota.site/explore",
  },
  openGraph: {
    title: "Curated Harmonic Color Palettes Library — ChromaForge",
    description:
      "Explore 240+ hand-crafted, accessible color systems organized by mood and theme with instant copy and export.",
    url: "https://chromaforge.sarthakranjanhota.site/explore",
    siteName: "ChromaForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Curated Harmonic Color Palettes Library",
    description:
      "240+ curated color systems ready for web design, product branding, and UI tokens.",
  },
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
