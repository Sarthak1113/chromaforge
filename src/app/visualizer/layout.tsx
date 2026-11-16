import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Palette Visualizer",
  description:
    "Preview your colors on real designs for a better visual understanding.",
  alternates: {
    canonical: "https://color-mint.sarthakranjanhota.site/visualizer",
  },
  openGraph: {
    title: "Palette Visualizer — Color-Mint",
    description:
      "Preview your colors on real designs for a better visual understanding.",
    url: "https://color-mint.sarthakranjanhota.site/visualizer",
    siteName: "Color-Mint",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Palette Visualizer — Color-Mint",
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
