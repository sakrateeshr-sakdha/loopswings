/** Shared so the visible FAQ and its FAQPage schema can never drift apart. */
export const FAQS: { q: string; a: string }[] = [
  {
    q: "What do you mean by a “quality lead”?",
    a: "A quality lead is an enquiry that matches the important requirements of your trip — such as destination, budget, travel dates, departure location and genuine travel intent. We define these criteria together before the campaign starts.",
  },
  {
    q: "Do you guarantee quality leads or bookings?",
    a: "No. No Meta Ads campaign can guarantee that every enquiry will be qualified or that every qualified lead will book.\n\nMy focus is to reduce irrelevant and poor-fit enquiries and continuously improve the proportion of qualified leads your campaigns generate.",
  },
  {
    q: "Do you create the ad creatives too?",
    a: "Yes. I create the static, carousel and video creatives needed for your Meta Ads, along with the copy, angles and messaging.",
  },
  {
    q: "What if I'm not running Meta Ads right now?",
    a: "That's fine. I can start from scratch — from your offer and campaign strategy through creatives, setup, launch and ongoing optimization.",
  },
  {
    q: "Is the Meta ad budget separate?",
    a: "Yes. Your ad spend is separate from my service fee and is paid directly to Meta. The advertising budget is agreed before the campaign starts.",
  },
  {
    q: "Do you handle the leads after they enquire?",
    a: "No. I handle the Meta Ads and lead-generation process. Once the enquiry reaches your sales process, your team handles the conversation, follow-up and booking.",
  },
  {
    q: "How long do I need to work with you?",
    a: "There's no fixed long-term commitment. We work month to month, and you can continue as long as the service is delivering value for your agency.\n\nI recommend giving campaigns enough time and budget to collect useful data, identify the main causes of poor-quality enquiries and improve them.",
  },
];

/** Absolute base URL, needed for canonicals, Open Graph images and the sitemap. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");
