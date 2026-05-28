import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { picks, profiles } from "../../db/schema.js";
import { eq, desc } from "drizzle-orm";

export default async (req: Request) => {
  if (req.method !== "GET") return new Response("Method not allowed", { status: 405 });

  const rows = await db
    .select({
      userId: picks.userId,
      score: picks.score,
      knockoutPicks: picks.knockoutPicks,
      groupOrder: picks.groupOrder,
      username: profiles.username,
      entered: profiles.entered,
    })
    .from(picks)
    .innerJoin(profiles, eq(picks.userId, profiles.id))
    .orderBy(desc(picks.score));

  return Response.json(rows);
};

export const config: Config = { path: "/api/leaderboard" };
