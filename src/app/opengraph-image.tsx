import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Color-Mint — Perceptual Color Palette Generator & Design Suite";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const swatches = [
    { name: "Indigo", hex: "#6366F1", oklch: "oklch(60% 0.22 275)" },
    { name: "Rose", hex: "#EC4899", oklch: "oklch(65% 0.24 350)" },
    { name: "Amber", hex: "#F59E0B", oklch: "oklch(75% 0.18 75)" },
    { name: "Emerald", hex: "#10B981", oklch: "oklch(70% 0.17 160)" },
    { name: "Cyan", hex: "#06B6D4", oklch: "oklch(72% 0.15 220)" },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#09090b",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #1e1b4b 0%, #09090b 60%), radial-gradient(circle at 80% 80%, #0f172a 0%, #09090b 70%)",
          padding: "56px 64px",
          color: "#fafafa",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {/* Top Header Row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                backgroundColor: "#059669",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "900",
                fontSize: "22px",
                color: "#ffffff",
                boxShadow: "0 8px 24px rgba(5, 150, 105, 0.4)",
              }}
            >
              CM
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", letterSpacing: "-0.5px" }}>
              Color-Mint
            </div>
            <div
              style={{
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                color: "#6ee7b7",
                padding: "4px 12px",
                borderRadius: "9999px",
                fontSize: "13px",
                fontWeight: "700",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              OKLCH Engine
            </div>
          </div>

          <div style={{ color: "#a1a1aa", fontSize: "16px", fontWeight: "600" }}>
            color-mint.sarthakranjanhota.site
          </div>
        </div>

        {/* Hero Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "980px" }}>
          <div
            style={{
              fontSize: "52px",
              fontWeight: "900",
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
              color: "#ffffff",
            }}
          >
            Perceptual Color Palette Generator & Design Suite
          </div>
          <div style={{ fontSize: "22px", color: "#a1a1aa", lineHeight: 1.4, fontWeight: "400" }}>
            Engineered in OKLCH with real-time APCA / WCAG 2.1 AAA contrast matrices and procedural Bézier gradients.
          </div>
        </div>

        {/* Live Palette Swatches Preview */}
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "120px",
            borderRadius: "20px",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
          }}
        >
          {swatches.map((s, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                backgroundColor: s.hex,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: "16px",
                color: idx === 2 ? "#09090b" : "#ffffff",
              }}
            >
              <div style={{ fontWeight: "800", fontSize: "16px" }}>{s.hex}</div>
              <div style={{ fontSize: "12px", opacity: 0.85, fontWeight: "600" }}>{s.name}</div>
            </div>
          ))}
        </div>

        {/* Footer Meta */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "14px",
            color: "#71717a",
            fontWeight: "500",
          }}
        >
          <div>Free • Client-Side • WCAG AAA & APCA Verified • Zero Latency</div>
          <div>Created by Sarthak Ranjan Hota</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
