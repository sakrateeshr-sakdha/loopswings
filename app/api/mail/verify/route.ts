import { requireAuth } from "@/lib/auth";
import { getTransporter, isMailConfigured } from "@/lib/mailer";

/**
 * Connects and authenticates against the SMTP server without sending anything,
 * so the configuration can be checked without emailing anyone.
 */
export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;

  if (!isMailConfigured()) {
    return Response.json(
      { ok: false, error: "SMTP is not configured. Set SMTP_HOST, SMTP_USER and SMTP_PASS." },
      { status: 400 },
    );
  }

  const transporter = getTransporter();
  try {
    await transporter!.verify();
    return Response.json({
      ok: true,
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      recipient:
        process.env.ENQUIRY_TO_EMAIL || process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
    });
  } catch (err) {
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : "Could not connect" },
      { status: 502 },
    );
  }
}
