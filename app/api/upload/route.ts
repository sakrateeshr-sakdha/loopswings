import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { requireAuth } from "@/lib/auth";
import { put } from "@vercel/blob";

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB
const ALLOWED: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
  "image/gif": ".gif",
};

export async function POST(req: Request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "No file uploaded" }, { status: 400 });
  }

  const ext = ALLOWED[file.type];
  if (!ext) {
    return Response.json(
      { error: "Unsupported file type. Use PNG, JPG, WEBP, GIF or SVG." },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "File is larger than 4 MB" }, { status: 413 });
  }

  // Random name: the client-supplied filename never touches the filesystem.
  const name = `${crypto.randomBytes(10).toString("hex")}${ext}`;

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (blobToken) {
    const blob = await put(name, file, {
      access: "public",
      token: blobToken,
    });
    return Response.json({ url: blob.url }, { status: 201 });
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));

  return Response.json({ url: `/uploads/${name}` }, { status: 201 });
}
