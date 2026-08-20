import "server-only";
import { bool, num, safeUrl, str } from "./validate";
import type { Brand, SocialLink, SocialPlatform, Testimonial } from "./types";

export function testimonialFromBody(
  body: Record<string, unknown>,
): Omit<Testimonial, "id" | "createdAt"> {
  return {
    type: body.type === "video" ? "video" : "written",
    quote: str(body.quote, 1200),
    author: str(body.author, 120),
    role: str(body.role, 120),
    company: str(body.company, 160),
    location: str(body.location, 120),
    avatar: safeUrl(body.avatar),
    videoUrl: safeUrl(body.videoUrl),
    orientation: body.orientation === "portrait" ? "portrait" : "landscape",
    featured: bool(body.featured),
    order: num(body.order, 0),
    published: bool(body.published, true),
  };
}

export function brandFromBody(body: Record<string, unknown>): Omit<Brand, "id" | "createdAt"> {
  return {
    name: str(body.name, 160),
    location: str(body.location, 120),
    logo: safeUrl(body.logo),
    website: safeUrl(body.website),
    order: num(body.order, 0),
    published: bool(body.published, true),
  };
}

const PLATFORMS: SocialPlatform[] = [
  "instagram",
  "facebook",
  "linkedin",
  "youtube",
  "x",
  "whatsapp",
  "email",
  "website",
];

/**
 * Accepts what someone naturally pastes — a bare phone number for WhatsApp, a
 * plain address for email, a domain without a scheme — and normalises it into a
 * usable href. Returns "" for anything that can't be made safe.
 */
export function normaliseSocialUrl(platform: SocialPlatform, raw: string) {
  const value = str(raw, 400);
  if (!value) return "";

  if (platform === "email") {
    const address = value.replace(/^mailto:/i, "").trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address) ? `mailto:${address}` : "";
  }

  if (platform === "whatsapp") {
    if (/^https?:\/\//i.test(value)) return value;
    const digits = value.replace(/[^0-9]/g, "");
    return digits.length >= 8 ? `https://wa.me/${digits}` : "";
  }

  if (/^https?:\/\//i.test(value)) return value;
  // A bare domain like "instagram.com/loopwings" is a link without a scheme.
  if (/^[\w-]+(\.[\w-]+)+\//.test(value) || /^[\w-]+(\.[\w-]+)+$/.test(value)) {
    return `https://${value}`;
  }
  return "";
}

export function socialFromBody(body: Record<string, unknown>): Omit<SocialLink, "id" | "createdAt"> {
  const platform = PLATFORMS.includes(body.platform as SocialPlatform)
    ? (body.platform as SocialPlatform)
    : "website";

  return {
    platform,
    url: normaliseSocialUrl(platform, str(body.url, 400)),
    label: str(body.label, 80),
    order: num(body.order, 0),
    published: bool(body.published, true),
  };
}
