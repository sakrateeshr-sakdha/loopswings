import { requireAuth } from "@/lib/auth";
import { mutate, newId, readAll, sortByOrder } from "@/lib/db";
import { socialFromBody } from "@/lib/shape";
import type { SocialLink } from "@/lib/types";

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;
  return Response.json(sortByOrder(await readAll("social")));
}

export async function POST(req: Request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  if (!body) return Response.json({ error: "Invalid JSON" }, { status: 400 });

  const fields = socialFromBody(body);
  if (!fields.url) {
    return Response.json(
      { error: "Enter a valid link (or a phone number for WhatsApp, an address for email)." },
      { status: 400 },
    );
  }

  const row: SocialLink = { id: newId("soc"), ...fields, createdAt: new Date().toISOString() };

  await mutate("social", (rows) => {
    if (!row.order) row.order = rows.length + 1;
    rows.push(row);
  });

  return Response.json(row, { status: 201 });
}
