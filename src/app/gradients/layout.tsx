import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gradient Studio",
  description: "Generate custom mesh, Voronoi, and Bézier gradients.",
  alternates: {
    canonical: "https://chromaforge.sarthakranjanhota.site/gradients",
  },
  openGraph: {
    title: "Gradient Studio — ChromaForge",
    description: "Generate custom mesh, Voronoi, and Bézier gradients.",
    url: "https://chromaforge.sarthakranjanhota.site/gradients",
    siteName: "ChromaForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gradient Studio — ChromaForge",
    description: "Generate custom mesh, Voronoi, and Bézier gradients.",
  },
};

export default function GradientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
