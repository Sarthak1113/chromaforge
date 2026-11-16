import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Extractor",
  description: "Extract beautiful palettes from your photos.",
  alternates: {
    canonical: "https://chromaforge.sarthakranjanhota.site/image-picker",
  },
  openGraph: {
    title: "Image Extractor — ChromaForge",
    description: "Extract beautiful palettes from your photos.",
    url: "https://chromaforge.sarthakranjanhota.site/image-picker",
    siteName: "ChromaForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Extractor — ChromaForge",
    description: "Extract beautiful palettes from your photos.",
  },
};

export default function ImagePickerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
