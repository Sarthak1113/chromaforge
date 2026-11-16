import { NextResponse } from "next/server";
import { db } from "@/db";
import { publicPalettes, paletteVotes } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

/**
 * GET /api/palettes - Retrieves public community palettes for the discovery feed
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "trending"; // trending, popular, latest
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "24")));

    const orderByClause =
      sort === "popular"
        ? desc(publicPalettes.likesCount)
        : desc(publicPalettes.createdAt);

    const palettes = await db
      .select()
      .from(publicPalettes)
      .orderBy(orderByClause)
      .limit(limit);

    return NextResponse.json({
      palettes: palettes.map((p) => ({
        ...p,
        colors: JSON.parse(p.colors),
        tags: JSON.parse(p.tags),
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch palettes", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/palettes - Publishes an anonymous palette to the public discovery feed
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, colors, tags } = body;

    if (!colors || !Array.isArray(colors) || colors.length < 2) {
      return NextResponse.json({ error: "Invalid colors array" }, { status: 400 });
    }

    const id = `pal_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    await db.insert(publicPalettes).values({
      id,
      name: name || "Untitled Palette",
      colors: JSON.stringify(colors),
      tags: JSON.stringify(tags || []),
      likesCount: 0,
    });

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to publish palette", details: String(error) },
      { status: 500 }
    );
  }
}
