import type { Config } from "@netlify/functions";
import { getUser } from "@netlify/identity";
import { db } from "../../db/index.js";
import { picks, profiles } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export default async (req: Request) => {
  const user = await getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  if (req.method === "GET") {
    const rows = await db.select().from(picks).where(eq(picks.userId, user.id));
    if (rows.length === 0) {
      return Response.json({ userId: user.id, groupOrder: null, third8: null, knockoutPicks: null, score: 0 });
    }
    return Response.json(rows[0]);
  }

  if (req.method === "POST") {
    const { groupOrder, third8, knockoutPicks, score } = await req.json();
    const [row] = await db
      .insert(picks)
      .values({ userId: user.id, groupOrder, third8, knockoutPicks, score: score || 0, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: picks.userId,
        set: { groupOrder, third8, knockoutPicks, score: score || 0, updatedAt: new Date() },
      })
      .returning();

    await db
      .insert(profiles)
      .values({ id: user.id, username: user.name || user.email?.split("@")[0] || "Player" })
      .onConflictDoNothing();

    return Response.json(row);
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = { path: "/api/picks" };
