import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Color-Mint is 100% client-side. We do not track your data, store personal identifiers, or use tracking cookies. Read our privacy commitment.",
  alternates: {
    canonical: "https://color-mint.sarthakranjanhota.site/privacy",
  },
  openGraph: {
    title: "Privacy Policy — Color-Mint",
    description:
      "Color-Mint is 100% client-side. We do not track your data, store personal identifiers, or use tracking cookies.",
    url: "https://color-mint.sarthakranjanhota.site/privacy",
    siteName: "Color-Mint",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy — Color-Mint",
    description:
      "Color-Mint is 100% client-side with zero tracking cookies and private in-browser computation.",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
