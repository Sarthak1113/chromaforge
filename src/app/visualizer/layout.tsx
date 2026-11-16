import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UI Color Token Visualizer",
  description:
    "Preview color palettes live across mock analytics dashboards, mobile apps, typography systems, and UI component kits before shipping.",
  alternates: {
    canonical: "https://chromaforge.sarthakranjanhota.site/visualizer",
  },
  openGraph: {
    title: "UI Color Token Visualizer — ChromaForge",
    description:
      "Preview color palettes live across mock analytics dashboards, mobile apps, typography systems, and UI component kits before shipping.",
    url: "https://chromaforge.sarthakranjanhota.site/visualizer",
    siteName: "ChromaForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UI Color Token Visualizer — ChromaForge",
    description:
      "Test how your color tokens behave inside realistic UI dashboards and component kits in real-time.",
  },
};

export default function VisualizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
