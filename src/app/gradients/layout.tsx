import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Procedural CSS Gradient Studio",
  description:
    "Create fluid Bézier and mesh CSS gradients in OKLCH space without muddy gray midtones. Export production-ready cross-browser CSS and images.",
  alternates: {
    canonical: "https://chromaforge.sarthakranjanhota.site/gradients",
  },
  openGraph: {
    title: "Procedural CSS Gradient Studio — ChromaForge",
    description:
      "Create fluid Bézier and mesh CSS gradients in OKLCH space without muddy gray midtones. Export production-ready cross-browser CSS and images.",
    url: "https://chromaforge.sarthakranjanhota.site/gradients",
    siteName: "ChromaForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Procedural CSS Gradient Studio — ChromaForge",
    description:
      "Eliminate muddy gray middle transitions with OKLCH Bézier gradients and procedural Voronoi noise.",
  },
};

export default function GradientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
