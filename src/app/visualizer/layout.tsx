import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Palette Visualizer",
  description:
    "Preview your colors on real designs for a better visual understanding.",
  alternates: {
    canonical: "https://chromaforge.sarthakranjanhota.site/visualizer",
  },
  openGraph: {
    title: "Palette Visualizer — ChromaForge",
    description:
      "Preview your colors on real designs for a better visual understanding.",
    url: "https://chromaforge.sarthakranjanhota.site/visualizer",
    siteName: "ChromaForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Palette Visualizer — ChromaForge",
    description:
      "Preview your colors on real designs for a better visual understanding.",
  },
};

export default function VisualizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
