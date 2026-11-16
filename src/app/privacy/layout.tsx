import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "ChromaForge is 100% client-side. We do not track your data, store personal identifiers, or use tracking cookies. Read our privacy commitment.",
  alternates: {
    canonical: "https://chromaforge.sarthakranjanhota.site/privacy",
  },
  openGraph: {
    title: "Privacy Policy — ChromaForge",
    description:
      "ChromaForge is 100% client-side. We do not track your data, store personal identifiers, or use tracking cookies.",
    url: "https://chromaforge.sarthakranjanhota.site/privacy",
    siteName: "ChromaForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy — ChromaForge",
    description:
      "ChromaForge is 100% client-side with zero tracking cookies and private in-browser computation.",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
