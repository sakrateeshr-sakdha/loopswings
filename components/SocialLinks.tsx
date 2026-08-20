import type { SocialLink, SocialPlatform } from "@/lib/types";

export const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  x: "X",
  whatsapp: "WhatsApp",
  email: "Email",
  website: "Website",
};

/** Single-path icons, drawn to sit on the same 24px grid as each other. */
function Icon({ platform }: { platform: SocialPlatform }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
    focusable: "false" as const,
  };

  switch (platform) {
    case "instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.9">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common} fill="currentColor">
          <path d="M14 9V7.2c0-.8.2-1.2 1.3-1.2H17V3.1C16.6 3 15.6 3 14.5 3 12 3 10.4 4.5 10.4 7v2H8v3h2.4v9h3.3v-9h2.5l.4-3H14z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common} fill="currentColor">
          <path d="M4.98 3.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3-.02-2.96-1.8-2.96-1.8 0-2.08 1.4-2.08 2.86V21h-4z" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common} fill="currentColor">
          <path d="M22.5 7.2a2.7 2.7 0 00-1.9-1.9C18.9 4.8 12 4.8 12 4.8s-6.9 0-8.6.5A2.7 2.7 0 001.5 7.2C1 8.9 1 12 1 12s0 3.1.5 4.8a2.7 2.7 0 001.9 1.9c1.7.5 8.6.5 8.6.5s6.9 0 8.6-.5a2.7 2.7 0 001.9-1.9c.5-1.7.5-4.8.5-4.8s0-3.1-.5-4.8zM9.8 15.3V8.7l5.7 3.3z" />
        </svg>
      );
    case "x":
      return (
        <svg {...common} fill="currentColor">
          <path d="M17.5 3h3.2l-7 8L22 21h-6.4l-4.6-6-5.3 6H2.5l7.5-8.6L2.3 3h6.5l4.2 5.5zm-1.1 16h1.8L7.7 4.9H5.8z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...common} fill="currentColor">
          <path d="M12 2a9.9 9.9 0 00-8.5 15L2 22l5.2-1.4A9.9 9.9 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-3 .8.8-3-.2-.3A8 8 0 1112 20zm4.5-5.9c-.2-.1-1.4-.7-1.7-.8s-.4-.1-.5.1-.6.8-.7 1-.3.2-.5.1a6.5 6.5 0 01-3.2-2.8c-.2-.4.2-.4.6-1.2.1-.2 0-.3 0-.5s-.5-1.3-.7-1.7-.4-.4-.5-.4h-.5a1 1 0 00-.7.3A3 3 0 006 9.6c0 1.8 1.3 3.5 1.5 3.7a10 10 0 003.8 3.4c1.4.6 2 .6 2.7.5a2.5 2.5 0 001.6-1.2 2 2 0 00.1-1.1z" />
        </svg>
      );
    case "email":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.9">
          <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
          <path d="M3.5 7l8.5 6 8.5-6" />
        </svg>
      );
    default:
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.9">
          <circle cx="12" cy="12" r="9" />
          <path d="M3.5 12h17M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
        </svg>
      );
  }
}

export default function SocialLinks({ links }: { links: SocialLink[] }) {
  if (!links.length) return null;

  return (
    <div className="social">
      <div className="wrap social-inner">
        <span className="social-title">Follow LoopWings</span>
        <ul className="social-list">
          {links.map((link) => {
            const name = link.label || PLATFORM_LABELS[link.platform];
            const isInternalScheme = link.url.startsWith("mailto:");
            return (
              <li key={link.id}>
                <a
                  className="social-btn"
                  href={link.url}
                  aria-label={name}
                  title={name}
                  {...(isInternalScheme ? {} : { target: "_blank", rel: "noreferrer me" })}
                >
                  <Icon platform={link.platform} />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
