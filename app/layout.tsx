import type { Metadata } from "next";
import { SITE_URL } from "@/lib/content";
import "./globals.css";

const TITLE = "LoopWings — Meta Ads Lead Generation for Travel Agencies";
const DESCRIPTION =
  "Meta Ads lead generation built specifically for Indian travel agencies. More relevant travel enquiries — not just more messages.";

export const metadata: Metadata = {
  // Makes every relative canonical and Open Graph image resolve to an absolute URL.
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s — LoopWings",
  },
  description: DESCRIPTION,
  applicationName: "LoopWings",
  keywords: [
    "Meta Ads for travel agencies",
    "travel agency lead generation",
    "Facebook Ads travel agency India",
    "Instagram Ads tour packages",
    "travel enquiry leads",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "LoopWings",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    locale: "en_IN",
    images: [{ url: "/images/logo.png", width: 1672, height: 941, alt: "LoopWings" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: {
    icon: "/images/favicon.png",
    apple: "/images/favicon.png",
    shortcut: "/images/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
