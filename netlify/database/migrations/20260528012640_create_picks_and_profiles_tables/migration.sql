CREATE TABLE "picks" (
	"user_id" text PRIMARY KEY,
	"group_order" jsonb,
	"third8" jsonb,
	"knockout_picks" jsonb,
	"score" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" text PRIMARY KEY,
	"username" text NOT NULL,
	"entered" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now()
);
