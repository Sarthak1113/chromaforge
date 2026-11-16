import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contrast Checker",
  description:
    "Calculate the contrast ratio of text and background colors.",
  alternates: {
    canonical: "https://chromaforge.sarthakranjanhota.site/contrast",
  },
  openGraph: {
    title: "Contrast Checker — ChromaForge",
    description:
      "Calculate the contrast ratio of text and background colors.",
    url: "https://chromaforge.sarthakranjanhota.site/contrast",
    siteName: "ChromaForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contrast Checker — ChromaForge",
    description:
      "Calculate the contrast ratio of text and background colors.",
  },
};

export default function ContrastLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
