import { requireAuth } from "@/lib/auth";
import { mutate } from "@/lib/db";
import { socialFromBody } from "@/lib/shape";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return Response.json({ error: "Invalid JSON" }, { status: 400 });

  const fields = socialFromBody(body);
  if (!fields.url) {
    return Response.json({ error: "Enter a valid link for this platform." }, { status: 400 });
  }

  const updated = await mutate("social", (rows) => {
    const i = rows.findIndex((r) => r.id === id);
    if (i === -1) return null;
    rows[i] = { ...rows[i], ...fields };
    return rows[i];
  });

  if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(updated);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { id } = await params;
  const removed = await mutate("social", (rows) => {
    const i = rows.findIndex((r) => r.id === id);
    if (i === -1) return false;
    rows.splice(i, 1);
    return true;
  });

  if (!removed) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ ok: true });
}
