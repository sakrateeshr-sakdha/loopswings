import { requireAuth } from "@/lib/auth";
import { mutate, newId, readAll, sortByOrder } from "@/lib/db";
import { brandFromBody } from "@/lib/shape";
import type { Brand } from "@/lib/types";

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;
  return Response.json(sortByOrder(await readAll("brands")));
}

export async function POST(req: Request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  if (!body) return Response.json({ error: "Invalid JSON" }, { status: 400 });

  const fields = brandFromBody(body);
  if (!fields.name) return Response.json({ error: "Agency name is required" }, { status: 400 });

  const row: Brand = {
    id: newId("brd"),
    ...fields,
    createdAt: new Date().toISOString(),
  };

  await mutate("brands", (rows) => {
    if (!row.order) row.order = rows.length + 1;
    rows.push(row);
  });

  return Response.json(row, { status: 201 });
}
