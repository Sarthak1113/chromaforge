export interface PublicPalette {
  id: string;
  name: string;
  colors: string[]; // Hex codes
  likesCount: number;
  tags: string[];
  createdAt: Date;
}

export interface PaletteVote {
  id: string;
  paletteId: string;
  fingerprint: string;
  createdAt: Date;
}
