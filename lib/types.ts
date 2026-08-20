export type Brand = {
  id: string;
  name: string;
  location: string;
  /** Path under /uploads, or "" to fall back to a text logo tile. */
  logo: string;
  website: string;
  order: number;
  published: boolean;
  createdAt: string;
};

export type Testimonial = {
  id: string;
  type: "written" | "video";
  quote: string;
  author: string;
  role: string;
  company: string;
  location: string;
  /** Path under /uploads. For video testimonials this doubles as the poster. */
  avatar: string;
  /** YouTube / Vimeo / direct .mp4 URL. Required for type "video". */
  videoUrl: string;
  /** Video shape: "portrait" for reels/shorts, "landscape" for 16:9. */
  orientation: "landscape" | "portrait";
  /** Featured written testimonials also appear on the landing page. */
  featured: boolean;
  order: number;
  published: boolean;
  createdAt: string;
};

export type Lead = {
  id: string;
  name: string;
  agency: string;
  city: string;
  /** Optional, but without it a notification can't be replied to. */
  email: string;
  phone: string;
  adsStatus: string;
  message: string;
  createdAt: string;
  read: boolean;
};

export type SocialPlatform =
  | "instagram"
  | "facebook"
  | "linkedin"
  | "youtube"
  | "x"
  | "whatsapp"
  | "email"
  | "website";

export type SocialLink = {
  id: string;
  platform: SocialPlatform;
  /** Full URL. WhatsApp numbers and bare emails are normalised on save. */
  url: string;
  /** Optional override for the accessible label, e.g. "@loopwings". */
  label: string;
  order: number;
  published: boolean;
  createdAt: string;
};
