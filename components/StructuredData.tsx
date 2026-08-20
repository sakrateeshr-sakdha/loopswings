import { FAQS, SITE_URL } from "@/lib/content";

/**
 * JSON-LD for search and answer engines. Rendered server-side so crawlers that
 * don't execute JavaScript still see it.
 */
export function OrganizationSchema({ sameAs = [] }: { sameAs?: string[] } = {}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#organization`,
    name: "LoopWings",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    image: `${SITE_URL}/images/logo.png`,
    description:
      "Meta Ads lead generation built specifically for Indian travel agencies — strategy, creative, campaign build and lead-quality optimization.",
    slogan: "Get 2X More High-Quality Travel Leads in 90 Days",
    // Social profiles strengthen the entity graph for search and AI engines.
    ...(sameAs.length ? { sameAs } : {}),
    areaServed: { "@type": "Country", name: "India" },
    serviceType: "Meta Ads lead generation for travel agencies",
    knowsAbout: [
      "Meta Ads",
      "Facebook Ads",
      "Instagram Ads",
      "Travel agency marketing",
      "Lead generation",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Meta Ads services",
      itemListElement: [
        "Meta Ads Strategy",
        "Ad Creatives",
        "Campaign Setup",
        "Campaign Management",
        "Creative Testing",
        "Lead Quality Optimization",
        "Performance Reporting",
      ].map((name) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FaqSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbSchema({ items }: { items: { name: string; path: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
