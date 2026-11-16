import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WCAG & APCA Color Contrast Checker",
  description:
    "Calculate real-time relative luminance and APCA contrast ratios. Verify WCAG 2.1 AA and AAA accessibility compliance for typography.",
  alternates: {
    canonical: "https://chromaforge.sarthakranjanhota.site/contrast",
  },
  openGraph: {
    title: "WCAG & APCA Color Contrast Checker — ChromaForge",
    description:
      "Calculate real-time relative luminance and APCA contrast ratios. Verify WCAG 2.1 AA and AAA accessibility compliance for typography.",
    url: "https://chromaforge.sarthakranjanhota.site/contrast",
    siteName: "ChromaForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG & APCA Color Contrast Checker — ChromaForge",
    description:
      "Verify color accessibility with live WCAG 2.1 AA/AAA and APCA scores for accessible design systems.",
  },
};

export default function ContrastLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
