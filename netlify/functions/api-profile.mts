import type { Config } from "@netlify/functions";
import { getUser } from "@netlify/identity";
import { db } from "../../db/index.js";
import { profiles } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export default async (req: Request) => {
  const user = await getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  if (req.method === "GET") {
    const rows = await db.select().from(profiles).where(eq(profiles.id, user.id));
    if (rows.length === 0) {
      return Response.json({ id: user.id, username: user.name || user.email?.split("@")[0] || "Player", entered: false });
    }
    return Response.json(rows[0]);
  }

  if (req.method === "POST") {
    const { username } = await req.json();
    const [row] = await db
      .insert(profiles)
      .values({ id: user.id, username: username || user.name || user.email?.split("@")[0] || "Player", entered: false })
      .onConflictDoUpdate({
        target: profiles.id,
        set: { username: username || user.name || user.email?.split("@")[0] || "Player" },
      })
      .returning();
    return Response.json(row);
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = { path: "/api/profile" };
