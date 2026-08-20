import { checkPassword, createSession } from "@/lib/auth";

export async function POST(req: Request) {
  let password = "";
  try {
    ({ password } = await req.json());
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  if (typeof password !== "string" || !checkPassword(password)) {
    return Response.json({ error: "Incorrect password" }, { status: 401 });
  }

  await createSession();
  return Response.json({ ok: true });
}
