import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive UI Component & Dashboard Token Visualizer",
  description:
    "Preview your color palettes in real-time across digital product interfaces: SaaS analytics dashboards, mobile app views, design system component libraries, and marketing pages.",
  alternates: {
    canonical: "https://chromaforge.sarthakranjanhota.site/visualizer",
  },
  openGraph: {
    title: "Interactive UI Component Token Visualizer — ChromaForge",
    description:
      "Preview color palettes across SaaS dashboards, mobile apps, and design system component libraries in real-time.",
    url: "https://chromaforge.sarthakranjanhota.site/visualizer",
    siteName: "ChromaForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interactive UI Component Token Visualizer",
    description:
      "Test how your color tokens behave inside realistic UI dashboards and component kits.",
  },
};

export default function VisualizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
