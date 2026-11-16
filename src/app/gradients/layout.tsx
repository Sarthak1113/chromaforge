import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Procedural Bézier & Mesh CSS Gradient Studio",
  description:
    "Generate fluid procedural mesh gradients and non-linear Bézier transitions in OKLCH space without gray dead zones. Export production-ready cross-browser CSS and high-resolution PNGs.",
  alternates: {
    canonical: "https://chromaforge.sarthakranjanhota.site/gradients",
  },
  openGraph: {
    title: "Procedural Bézier & Mesh CSS Gradient Studio — ChromaForge",
    description:
      "Generate fluid procedural mesh gradients and non-linear Bézier transitions in OKLCH space without gray dead zones. Export production-ready cross-browser CSS.",
    url: "https://chromaforge.sarthakranjanhota.site/gradients",
    siteName: "ChromaForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Procedural Bézier & Mesh CSS Gradient Studio",
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
