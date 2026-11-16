import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers/JotaiProvider";

export const metadata: Metadata = {
  title: "ChromaForge — Perceptual Color Palette Generator & Design Suite",
  description:
    "Lightning-fast, modern color palette generator built on OKLCH perceptual color space with atomic state, instant spacebar generation, and zero-latency URL sharing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
