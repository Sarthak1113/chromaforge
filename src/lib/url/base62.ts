/**
 * Base62 URL Packing and Unpacking Engine for ChromaForge Palettes
 * Enables zero-latency, stateless URL sharing without database calls.
 */

const BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function toBase62(num: bigint): string {
  if (num === 0n) return "0";
  let result = "";
  let n = num;
  while (n > 0n) {
    const rem = Number(n % 62n);
    result = BASE62_CHARS[rem] + result;
    n = n / 62n;
  }
  return result;
}

export function fromBase62(str: string): bigint {
  let result = 0n;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const val = BigInt(BASE62_CHARS.indexOf(char));
    if (val === -1n) {
      throw new Error(`Invalid Base62 character: ${char}`);
    }
    result = result * 62n + val;
  }
  return result;
}

/**
 * Encodes an array of Hex strings into a compressed Base62 string.
 * Converts each 24-bit RGB color into a bitstream, then converts to Base62.
 */
export function packPaletteToBase62(hexColors: string[]): string {
  if (hexColors.length === 0) return "";

  // Normalize hex codes to 6 chars without #
  const cleaned = hexColors.map((h) => h.replace("#", "").toLowerCase().padStart(6, "0"));

  // Form a BigInt from the concatenated 24-bit hex chunks, plus a 4-bit header for count
  const count = cleaned.length;
  let hexStream = count.toString(16).padStart(2, "0");
  for (const c of cleaned) {
    hexStream += c;
  }

  const bigIntValue = BigInt("0x" + hexStream);
  return toBase62(bigIntValue);
}

/**
 * Decodes a compressed Base62 string back into an array of Hex strings.
 */
export function unpackPaletteFromBase62(base62Str: string): string[] {
  if (!base62Str) return [];

  try {
    const bigIntValue = fromBase62(base62Str);
    let hexStream = bigIntValue.toString(16);

    // Re-pad if odd length
    if (hexStream.length % 2 !== 0) {
      hexStream = "0" + hexStream;
    }

    const count = parseInt(hexStream.slice(0, 2), 16);
    const colors: string[] = [];
    let offset = 2;

    for (let i = 0; i < count; i++) {
      const colorHex = hexStream.slice(offset, offset + 6).padStart(6, "0");
      if (colorHex.length === 6) {
        colors.push(`#${colorHex}`);
      }
      offset += 6;
    }

    return colors;
  } catch {
    return [];
  }
}

/**
 * Encodes palette as clean URL slug (e.g., "1a1a1a-ffffff-ff0000")
 */
export function paletteToSlug(hexColors: string[]): string {
  return hexColors.map((h) => h.replace("#", "").toLowerCase()).join("-");
}

/**
 * Decodes clean URL slug back to hex array
 */
export function slugToPalette(slug: string): string[] {
  if (!slug) return [];
  return slug
    .split("-")
    .filter((s) => /^[0-9a-fA-F]{3,6}$/.test(s))
    .map((s) => `#${s.padStart(6, "0")}`);
}
