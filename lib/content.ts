/** Shared so the visible FAQ and its FAQPage schema can never drift apart. */
export const FAQS: { q: string; a: string }[] = [
  {
    q: "Do you guarantee 2X leads?",
    a: "2X is the target I work toward, not a blanket guarantee for every agency. Results depend on your existing performance, offer, pricing, destination, season, ad budget and other factors. Before starting, I'll look at your current situation and determine whether the target is realistic.",
  },
  {
    q: "Do I pay the Meta ad budget separately?",
    a: "Yes. Your advertising budget is separate from my service fee and is paid directly to Meta.",
  },
  {
    q: "Do you create the ads?",
    a: "Yes. I develop the advertising angles, copy and creatives required for the campaigns I manage.",
  },
  {
    q: "Where will I receive the leads?",
    a: "Depending on the campaign strategy, leads can be directed to channels such as WhatsApp or Meta's lead forms.",
  },
  {
    q: "Do you handle the leads after they enquire?",
    a: "Your team handles the sales conversations and bookings. I focus on bringing in and improving the quality of enquiries through Meta Ads.",
  },
  {
    q: "How long do I need to work with you?",
    a: "The initial engagement is 90 days. There is no requirement to sign a long-term contract beyond the agreed engagement.",
  },
  {
    q: "What happens after 90 days?",
    a: "I'll review the campaign performance, lead quality and opportunities for further improvement with you. If the numbers make sense for both sides, I can continue and scale the campaigns.",
  },
];

/** Absolute base URL, needed for canonicals, Open Graph images and the sitemap. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");
