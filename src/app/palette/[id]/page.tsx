"use client";

import React, { use, useEffect } from "react";
import { useSetAtom } from "jotai";
import { paletteAtom } from "@/atoms/palette.atoms";
import { slugToPalette, unpackPaletteFromBase62 } from "@/lib/url/base62";
import { hexToOklch } from "@/lib/colors/oklch";
import { getNearestColorName } from "@/lib/colors/names";
import Home from "../../page";

interface PalettePageProps {
  params: Promise<{ id: string }>;
}

export default function PalettePage({ params }: PalettePageProps) {
  const resolvedParams = use(params);
  const setPalette = useSetAtom(paletteAtom);

  useEffect(() => {
    if (!resolvedParams?.id) return;
    const rawId = resolvedParams.id;

    let hexes: string[] = [];
    if (rawId.includes("-")) {
      hexes = slugToPalette(rawId);
    } else {
      hexes = unpackPaletteFromBase62(rawId);
      if (hexes.length === 0) {
        hexes = slugToPalette(rawId);
      }
    }

    if (hexes.length >= 2) {
      const items = hexes.map((hex, idx) => {
        const oklch = hexToOklch(hex);
        return {
          id: `col-url-${idx}-${Date.now()}`,
          hex,
          oklch,
          isLocked: false,
          name: getNearestColorName(oklch),
        };
      });
      setPalette(items);
    }
  }, [resolvedParams, setPalette]);

  return <Home />;
}
