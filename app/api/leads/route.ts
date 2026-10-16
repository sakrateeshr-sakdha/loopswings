import { requireAuth } from "@/lib/auth";
import { mutate, newId, readAll } from "@/lib/db";
import { str } from "@/lib/validate";
import { sendEnquiryNotification } from "@/lib/mailer";
import type { Lead } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;
  const rows = await readAll("leads");
  return Response.json([...rows].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
  });
}

/** Public — this is the enquiry form on the landing and testimonials pages. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return Response.json({ error: "Invalid JSON" }, { status: 400 });

  const email = str(body.email, 160);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "That email address doesn't look right" }, { status: 400 });
  }

  const advertisingPackage = str(body.advertisingPackage, 300);
  const leadProblems = Array.isArray(body.leadProblems)
    ? body.leadProblems.map((p: unknown) => str(p, 150)).filter(Boolean)
    : [];

  const rawMessage = str(body.message, 1500);

  // Format a comprehensive message for notification emails and admin viewing
  const messageParts: string[] = [];
  if (advertisingPackage) {
    messageParts.push(`Product / Service Advertising:\n${advertisingPackage}`);
  }
  if (body.adsStatus) {
    messageParts.push(`Currently Running Ads On:\n${body.adsStatus}`);
  }
  if (leadProblems.length > 0) {
    messageParts.push(`Biggest Problems with Leads:\n• ${leadProblems.join("\n• ")}`);
  }
  if (rawMessage) {
    messageParts.push(`Additional Notes:\n${rawMessage}`);
  }
  const formattedMessage = messageParts.join("\n\n");

  const lead: Lead = {
    id: newId("led"),
    name: str(body.name, 120),
    agency: str(body.agency, 160),
    city: str(body.city, 120),
    email,
    phone: str(body.phone, 40),
    adsStatus: str(body.adsStatus, 80),
    advertisingPackage,
    leadProblems,
    message: formattedMessage || rawMessage || "Lead Quality Audit Request",
    createdAt: new Date().toISOString(),
    read: false,
  };

  // Enforced here as well as in the markup — `required` attributes are trivially
  // bypassed by posting straight to the API.
  const missing = (
    [
      ["name", "your name"],
      ["agency", "business name"],
      ["phone", "WhatsApp number"],
      ["advertisingPackage", "what product or service you are advertising"],
      ["adsStatus", "where you are currently running ads"],
    ] as const
  ).filter(([key]) => !lead[key]);

  if (missing.length) {
    return Response.json(
      { error: `Please fill in ${missing.map(([, label]) => label).join(", ")}.` },
      { status: 400 },
    );
  }

  await mutate("leads", (rows) => {
    rows.push(lead);
  });

  // The enquiry is saved at this point. Emailing is best effort: a mail outage
  // must not tell the visitor their submission failed.
  const result = await sendEnquiryNotification(lead);
  if (!result.sent) {
    console.error(`[leads] notification not sent for ${lead.id}: ${result.reason}`);
  }

  return Response.json({ ok: true }, { status: 201 });
}
