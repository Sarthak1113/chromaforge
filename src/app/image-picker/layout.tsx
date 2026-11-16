import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Extract Palette from Image in OKLCH",
  description:
    "Upload photos and graphics to extract dominant harmonic palettes mapped directly to OKLCH perceptual color space. Free and 100% private.",
  alternates: {
    canonical: "https://chromaforge.sarthakranjanhota.site/image-picker",
  },
  openGraph: {
    title: "Extract Palette from Image in OKLCH — ChromaForge",
    description:
      "Upload photos and graphics to extract dominant harmonic palettes mapped directly to OKLCH perceptual color space. Free and 100% private.",
    url: "https://chromaforge.sarthakranjanhota.site/image-picker",
    siteName: "ChromaForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Extract Palette from Image in OKLCH — ChromaForge",
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
