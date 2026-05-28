import type { Config } from "@netlify/functions";
import { getUser } from "@netlify/identity";
import { db } from "../../db/index.js";
import { profiles } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export default async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const user = await getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  await db
    .update(profiles)
    .set({ entered: true })
    .where(eq(profiles.id, user.id));

  return Response.json({ ok: true });
};

export const config: Config = { path: "/api/enter" };
