import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gradient Studio",
  description: "Generate custom mesh, Voronoi, and Bézier gradients.",
  alternates: {
    canonical: "https://color-mint.sarthakranjanhota.site/gradients",
  },
  openGraph: {
    title: "Gradient Studio — Color-Mint",
    description: "Generate custom mesh, Voronoi, and Bézier gradients.",
    url: "https://color-mint.sarthakranjanhota.site/gradients",
    siteName: "Color-Mint",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gradient Studio — Color-Mint",
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
