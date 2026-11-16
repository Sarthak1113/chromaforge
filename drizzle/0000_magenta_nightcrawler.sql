CREATE TABLE `palette_votes` (
	`id` text PRIMARY KEY NOT NULL,
	`palette_id` text NOT NULL,
	`fingerprint` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`palette_id`) REFERENCES `public_palettes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `public_palettes` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`colors` text NOT NULL,
	`likes_count` integer DEFAULT 0 NOT NULL,
	`tags` text DEFAULT '[]' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
