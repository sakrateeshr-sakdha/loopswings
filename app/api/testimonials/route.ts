import { requireAuth } from "@/lib/auth";
import { mutate, newId, readAll, sortByOrder } from "@/lib/db";
import { testimonialFromBody } from "@/lib/shape";
import type { Testimonial } from "@/lib/types";

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;
  return Response.json(sortByOrder(await readAll("testimonials")));
}

export async function POST(req: Request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  if (!body) return Response.json({ error: "Invalid JSON" }, { status: 400 });

  const fields = testimonialFromBody(body);
  if (!fields.author) {
    return Response.json({ error: "Author name is required" }, { status: 400 });
  }
  if (fields.type === "written" && !fields.quote) {
    return Response.json({ error: "A written testimonial needs a quote" }, { status: 400 });
  }
  if (fields.type === "video" && !fields.videoUrl) {
    return Response.json({ error: "A video testimonial needs a video URL" }, { status: 400 });
  }

  const row: Testimonial = {
    id: newId("tst"),
    ...fields,
    createdAt: new Date().toISOString(),
  };

  await mutate("testimonials", (rows) => {
    if (!row.order) row.order = rows.length + 1;
    rows.push(row);
  });

  return Response.json(row, { status: 201 });
}
