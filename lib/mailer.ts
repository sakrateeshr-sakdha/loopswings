import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import type { Lead } from "./types";

let cached: Transporter | null = null;

function env(name: string) {
  const value = process.env[name];
  return value && value.trim() ? value.trim() : "";
}

/** SMTP is optional: without it the site still works, enquiries just aren't emailed. */
export function isMailConfigured() {
  return Boolean(env("SMTP_HOST") && env("SMTP_USER") && env("SMTP_PASS"));
}

export function getTransporter(): Transporter | null {
  if (!isMailConfigured()) return null;
  if (cached) return cached;

  const port = Number(env("SMTP_PORT")) || 587;
  cached = nodemailer.createTransport({
    host: env("SMTP_HOST"),
    port,
    // 465 is implicit TLS; 587 and 25 start plaintext and upgrade via STARTTLS.
    secure: port === 465,
    auth: { user: env("SMTP_USER"), pass: env("SMTP_PASS") },
  });
  return cached;
}

function fromAddress() {
  const email = env("SMTP_FROM_EMAIL") || env("SMTP_USER");
  const name = env("SMTP_FROM_NAME") || "LoopWings";
  return `"${name.replace(/"/g, "")}" <${email}>`;
}

function recipient() {
  // Defaults to the sending mailbox so a missing ENQUIRY_TO_EMAIL still reaches you.
  return env("ENQUIRY_TO_EMAIL") || env("SMTP_FROM_EMAIL") || env("SMTP_USER");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildBody(lead: Lead) {
  const rows: [string, string][] = [
    ["Name", lead.name],
    ["Agency", lead.agency],
    ["Email", lead.email || "—"],
    ["WhatsApp", lead.phone || "—"],
    ["City", lead.city || "—"],
    ["Meta Ads status", lead.adsStatus || "—"],
    ["Received", new Date(lead.createdAt).toLocaleString("en-IN")],
  ];

  const text = [
    "New enquiry from the LoopWings website",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Message:",
    lead.message || "(none)",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111;line-height:1.55">
      <h2 style="margin:0 0 4px;font-size:20px">New enquiry from the LoopWings website</h2>
      <p style="margin:0 0 18px;color:#666;font-size:13px">${escapeHtml(lead.agency)}</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px">
        ${rows
          .map(
            ([k, v]) => `<tr>
              <td style="padding:7px 18px 7px 0;color:#666;vertical-align:top">${k}</td>
              <td style="padding:7px 0"><strong>${escapeHtml(v)}</strong></td>
            </tr>`,
          )
          .join("")}
      </table>
      <div style="margin-top:18px;padding:16px;background:#fff4bf;border-radius:12px;font-size:14px;white-space:pre-wrap">${
        escapeHtml(lead.message) || "(no message)"
      }</div>
    </div>`;

  return { text, html };
}

/**
 * Best-effort notification. Never throws: the enquiry is already saved, so a
 * mail failure must not turn a successful submission into an error for the
 * visitor. Returns why it was skipped/failed so the caller can log it.
 */
export async function sendEnquiryNotification(
  lead: Lead,
): Promise<{ sent: boolean; reason?: string }> {
  const transporter = getTransporter();
  if (!transporter) return { sent: false, reason: "SMTP is not configured" };

  const to = recipient();
  if (!to) return { sent: false, reason: "No recipient address" };

  const { text, html } = buildBody(lead);

  try {
    await transporter.sendMail({
      from: fromAddress(),
      to,
      subject: `New enquiry — ${lead.agency || lead.name}`,
      text,
      html,
      // Hitting reply goes to the enquirer when they left an address.
      ...(lead.email ? { replyTo: lead.email } : {}),
    });
    return { sent: true };
  } catch (err) {
    return { sent: false, reason: err instanceof Error ? err.message : "Unknown error" };
  }
}
