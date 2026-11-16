import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

/**
 * Public discovery palettes table
 * Strictly public, anonymous community palettes with tags and like counts.
 * No user identity, auth, or session columns.
 */
export const publicPalettes = sqliteTable("public_palettes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  colors: text("colors").notNull(), // JSON string array of hex codes e.g. ["#ff0000","#00ff00"]
  likesCount: integer("likes_count").notNull().default(0),
  tags: text("tags").notNull().default("[]"), // JSON string array of tags e.g. ["warm","sunset"]
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

/**
 * Anonymous upvotes table
 * Prevents spam voting using anonymous device hashes/fingerprints.
 */
export const paletteVotes = sqliteTable("palette_votes", {
  id: text("id").primaryKey(),
  paletteId: text("palette_id")
    .notNull()
    .references(() => publicPalettes.id, { onDelete: "cascade" }),
  fingerprint: text("fingerprint").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
