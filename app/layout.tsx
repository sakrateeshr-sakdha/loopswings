import type { Metadata } from "next";
import Script from "next/script";
import { SITE_URL } from "@/lib/content";
import "./globals.css";

const TITLE = "Vishuvabharathi — Paid Ads & Lead Generation";
const DESCRIPTION =
  "Paid lead generation with Meta Ads and Google Ads. More relevant enquiries — not just more messages.";

export const metadata: Metadata = {
  // Makes every relative canonical and Open Graph image resolve to an absolute URL.
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s — Vishuvabharathi",
  },
  description: DESCRIPTION,
  applicationName: "Vishuvabharathi",
  keywords: [
    "Paid ads lead generation",
    "Meta Ads lead generation",
    "Google Ads lead generation",
    "business enquiries",
    "quality leads",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Vishuvabharathi",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    locale: "en_IN",
    images: [{ url: "/images/vishuvabharathi.png", width: 1024, height: 256, alt: "Vishuvabharathi" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/vishuvabharathi.png"],
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
      <head>
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-W9BPBD4F');`,
          }}
        />

        {/* Meta Pixel Code */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '2948572405337604');
fbq('track', 'PageView');`,
          }}
        />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W9BPBD4F"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Meta Pixel (noscript) */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2948572405337604&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        {children}
      </body>
    </html>
  );
}
