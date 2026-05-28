import { pgTable, text, boolean, integer, jsonb, timestamp } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: text().primaryKey(),
  username: text().notNull(),
  entered: boolean().notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const picks = pgTable("picks", {
  userId: text("user_id").primaryKey(),
  groupOrder: jsonb("group_order"),
  third8: jsonb("third8"),
  knockoutPicks: jsonb("knockout_picks"),
  score: integer().notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});
