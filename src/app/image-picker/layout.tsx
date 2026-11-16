import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Extractor",
  description: "Extract beautiful palettes from your photos.",
  alternates: {
    canonical: "https://color-mint.sarthakranjanhota.site/image-picker",
  },
  openGraph: {
    title: "Image Extractor — Color-Mint",
    description: "Extract beautiful palettes from your photos.",
    url: "https://color-mint.sarthakranjanhota.site/image-picker",
    siteName: "Color-Mint",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Extractor — Color-Mint",
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
