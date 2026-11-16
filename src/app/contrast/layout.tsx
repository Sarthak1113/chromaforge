import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WCAG 2.1 & APCA Color Contrast Compliance Checker",
  description:
    "Evaluate relative luminance ratios and APCA lightness contrast in real-time. Ensure WCAG 2.1 Level AA and AAA accessibility compliance across normal and large typography.",
  alternates: {
    canonical: "https://chromaforge.sarthakranjanhota.site/contrast",
  },
  openGraph: {
    title: "WCAG 2.1 & APCA Color Contrast Compliance Checker — ChromaForge",
    description:
      "Evaluate relative luminance ratios and APCA lightness contrast in real-time. Ensure WCAG 2.1 Level AA and AAA accessibility compliance.",
    url: "https://chromaforge.sarthakranjanhota.site/contrast",
    siteName: "ChromaForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.1 & APCA Color Contrast Checker",
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
