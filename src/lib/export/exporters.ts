import { ColorItem } from "@/types/color";

export function exportAsCssVariables(colors: ColorItem[]): string {
  const vars = colors
    .map((c, i) => `  --color-${i + 1}: ${c.hex}; /* ${c.name} (oklch(${c.oklch.l} ${c.oklch.c} ${c.oklch.h})) */`)
    .join("\n");
  return `:root {\n${vars}\n}`;
}

export function exportAsTailwindV4Theme(colors: ColorItem[]): string {
  const tokens = colors
    .map((c, i) => `  --color-brand-${i + 1}: ${c.hex};`)
    .join("\n");
  return `@theme {\n${tokens}\n}`;
}

export function exportAsScss(colors: ColorItem[]): string {
  return colors
    .map((c, i) => `$color-${i + 1}: ${c.hex}; // ${c.name}`)
    .join("\n");
}

export function exportAsJson(colors: ColorItem[]): string {
  return JSON.stringify(
    colors.map((c) => ({
      name: c.name,
      hex: c.hex,
      oklch: c.oklch,
    })),
    null,
    2
  );
}

export function exportAsSvg(colors: ColorItem[]): string {
  const width = 1200;
  const height = 600;
  const colWidth = width / colors.length;

  const rects = colors
    .map(
      (c, i) =>
        `  <rect x="${i * colWidth}" y="0" width="${colWidth}" height="${height}" fill="${c.hex}" />`
    )
    .join("\n");

  const texts = colors
    .map(
      (c, i) =>
        `  <text x="${i * colWidth + 20}" y="${height - 40}" fill="#ffffff" font-family="monospace" font-size="22" font-weight="bold">${c.hex.toUpperCase()}</text>
  <text x="${i * colWidth + 20}" y="${height - 70}" fill="#ffffff" opacity="0.8" font-family="sans-serif" font-size="14">${c.name}</text>`
    )
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">\n${rects}\n${texts}\n</svg>`;
}

export function downloadSvgFile(colors: ColorItem[], filename = "chromaforge-palette.svg"): void {
  const svgContent = exportAsSvg(colors);
  const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
