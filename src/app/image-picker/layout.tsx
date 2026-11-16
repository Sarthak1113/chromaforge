import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OKLCH Dominant Color Palette Extractor from Image",
  description:
    "Upload any photograph, graphic, or image to extract perceptually balanced color swatches and harmonic palettes mapped directly to the OKLCH color space.",
  alternates: {
    canonical: "https://chromaforge.sarthakranjanhota.site/image-picker",
  },
  openGraph: {
    title: "OKLCH Dominant Color Extractor from Image — ChromaForge",
    description:
      "Extract harmonious color swatches from uploaded images with automatic OKLCH gamut mapping and instant palette export.",
    url: "https://chromaforge.sarthakranjanhota.site/image-picker",
    siteName: "ChromaForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OKLCH Dominant Color Palette Extractor",
    description:
      "Turn any photo or UI mockup into an accessible OKLCH color palette with one click.",
  },
};

export default function ImagePickerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
