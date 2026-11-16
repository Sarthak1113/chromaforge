import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Curated Color Palettes Library",
  description:
    "Browse 240+ hand-crafted harmonic color palettes tagged by mood, theme, and contrast. One-click copy for Tailwind CSS v4, Hex, and CSS vars.",
  alternates: {
    canonical: "https://color-mint.sarthakranjanhota.site/explore",
  },
  openGraph: {
    title: "Curated Color Palettes Library — Color-Mint",
    description:
      "Browse 240+ hand-crafted harmonic color palettes tagged by mood, theme, and contrast. One-click copy for Tailwind CSS v4, Hex, and CSS vars.",
    url: "https://color-mint.sarthakranjanhota.site/explore",
    siteName: "Color-Mint",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Curated Color Palettes Library — Color-Mint",
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
