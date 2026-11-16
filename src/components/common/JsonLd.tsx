import React from "react";

export function JsonLd() {
  const baseUrl = "https://color-mint.sarthakranjanhota.site";

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Color-Mint",
    url: baseUrl,
    applicationCategory: "DesignApplication",
    operatingSystem: "All (Web Browser)",
    description:
      "Lightning-fast perceptual color palette generator and design engineering suite built on the OKLCH color space with APCA contrast matrix and procedural Bézier gradients.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    creator: {
      "@type": "Person",
      name: "Sarthak Ranjan Hota",
      url: "https://sarthakranjanhota.site",
      jobTitle: "Product Designer & Frontend Engineer",
    },
    featureList: [
      "Perceptually uniform OKLCH color palette generator",
      "Real-time WCAG 2.1 AA/AAA and APCA contrast compliance matrix",
      "Procedural Bézier & cellular mesh CSS gradient studio",
      "Live interactive UI component token previewer",
      "Ocular vision deficiency simulations (Protanopia, Deuteranopia, Tritanopia, Achromatopsia)",
      "Instant zero-latency Base62 URL palette sharing",
      "High-resolution PNG and cross-browser CSS export",
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is an OKLCH color palette generator?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An OKLCH color palette generator creates color schemes using the cylindrical OKLab color model (Lightness, Chroma, Hue). Unlike legacy sRGB or HSL models where yellow and blue have vastly different perceived brightness at 50% lightness, OKLCH provides true perceptual uniformity. This eliminates clashing hues, prevents muddy transitions, and guarantees consistent visual hierarchy.",
        },
      },
      {
        "@type": "Question",
        name: "How does Color-Mint evaluate WCAG 2.1 and APCA color contrast?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Color-Mint computes relative luminance ratios in real-time according to WCAG 2.1 Level AA (minimum 4.5:1 for body copy, 3:1 for large text) and Level AAA (7:1 for body text). It also calculates modern APCA (Accessible Perceptual Contrast Algorithm) metrics, evaluating font weight, spatial frequency, and polarity to prevent accessibility false positives.",
        },
      },
      {
        "@type": "Question",
        name: "Why do standard CSS gradients look muddy and gray in the middle?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Standard CSS linear gradients interpolate across sRGB, cutting straight through the desaturated center of the color cube. This creates a washed-out 'gray dead zone' between opposing hues. Color-Mint prevents this by calculating transitions along curved Bézier paths in OKLCH space, preserving chroma across the midpoint and exporting production-ready cross-browser CSS.",
        },
      },
      {
        "@type": "Question",
        name: "Can I simulate color blindness for UI design systems in Color-Mint?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Color-Mint features built-in ocular cone deficiency simulation matrices for Protanopia (red-blind), Deuteranopia (green-blind), Tritanopia (blue-blind), and Achromatopsia (monochrome), enabling frontend developers and product designers to verify token legibility before shipping.",
        },
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Color-Mint",
    url: baseUrl,
    description: "Perceptual Color Palette Generator & Design Suite",
    author: {
      "@type": "Person",
      name: "Sarthak Ranjan Hota",
      url: "https://sarthakranjanhota.site",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
