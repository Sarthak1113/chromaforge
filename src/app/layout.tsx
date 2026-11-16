import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers/JotaiProvider";
import { JsonLd } from "@/components/common/JsonLd";

const siteUrl = "https://chromaforge.sarthakranjanhota.site";

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ChromaForge — OKLCH Color Palette Generator",
    template: "%s | ChromaForge",
  },
  description:
    "Generate harmonious OKLCH color palettes, verify WCAG & APCA contrast, and export procedural CSS gradients. Free, client-side, and lightning-fast.",
  keywords: [
    "OKLCH color generator",
    "color palette generator",
    "perceptual color palette",
    "WCAG contrast checker",
    "APCA contrast calculator",
    "CSS gradient generator",
    "Bézier gradient generator",
    "color blindness simulation",
    "UI color tokens",
    "accessible colors",
    "ChromaForge",
    "Sarthak Ranjan Hota",
  ],
  authors: [{ name: "Sarthak Ranjan Hota", url: "https://sarthakranjanhota.site" }],
  creator: "Sarthak Ranjan Hota",
  publisher: "ChromaForge",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/icon.svg"],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "ChromaForge — OKLCH Color Palette Generator",
    description:
      "Generate harmonious OKLCH color palettes, verify WCAG & APCA contrast, and export procedural CSS gradients. Free, client-side, and lightning-fast.",
    url: siteUrl,
    siteName: "ChromaForge",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChromaForge — OKLCH Color Palette Generator",
    description:
      "Generate harmonious OKLCH color palettes, test WCAG/APCA contrast, and export procedural Bézier gradients in real-time.",
    creator: "@sarthak",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Design Tools",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      "msvalidate.01": [process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || ""],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <JsonLd />
      </head>
      <body className="antialiased min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
