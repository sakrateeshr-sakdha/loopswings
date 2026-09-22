import type { Metadata } from "next";
import Image from "next/image";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import QuoteCard from "@/components/QuoteCard";
import BrandGrid from "@/components/BrandGrid";
import VideoTestimonial from "@/components/VideoTestimonial";
import Rail from "@/components/Rail";
import { getPublishedBrands,
  getPublishedSocial,
  getPublishedTestimonials,
} from "@/lib/db";
import { BreadcrumbSchema, OrganizationSchema } from "@/components/StructuredData";

export const dynamic = "force-dynamic";

const TITLE = "Travel Agency Testimonials";
const DESCRIPTION =
  "Travel agency founders on working with LoopWings: written testimonials, video testimonials and the agencies worked with so far.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/testimonials" },
  openGraph: {
    type: "website",
    siteName: "LoopWings",
    title: `${TITLE} — LoopWings`,
    description: DESCRIPTION,
    url: "/testimonials",
    locale: "en_IN",
    images: [{ url: "/images/logo.png", width: 1672, height: 941, alt: "LoopWings" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} — LoopWings`,
    description: DESCRIPTION,
    images: ["/images/logo.png"],
  },
};

export default async function TestimonialsPage() {
  const [brands, written, videos, social] = await Promise.all([
    getPublishedBrands(),
    getPublishedTestimonials("written"),
    getPublishedTestimonials("video"),
    getPublishedSocial(),
  ]);
  const socialUrls = social.map((s) => s.url).filter((u) => u.startsWith("http"));
  const whatsappUrl =
    social.find((s) => s.platform === "whatsapp")?.url || "https://wa.me/8574859685";

  return (
    <>
      <OrganizationSchema sameAs={socialUrls} />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Testimonials", path: "/testimonials" },
        ]}
      />
      <SiteNav variant="page" whatsappUrl={whatsappUrl} />

      <header className="page-hero">
        <div className="wrap">
          <span className="kicker">Proof from travel agency founders</span>
          <h1 style={{ margin: "0 auto" }}>
            What travel agencies say in <span className="marker">their words.</span>
          </h1>
          <p className="lead">
            A simple collection of agencies worked with so far, written testimonials, and founder
            video testimonials.
          </p>
        </div>
      </header>

      <section>
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">Travel agencies worked with so far</span>
            <h2>Agencies that trusted LoopWings.</h2>
          </div>
          <BrandGrid brands={brands} />
        </div>
      </section>

      <section id="written">
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">Written testimonials</span>
            <h2>
              <span className="marker">Their words.</span>
            </h2>
            <p>
              Short founder-led proof, presented like handwritten notes rather than generic review
              cards.
            </p>
          </div>
          {written.length ? (
            // Same rule as the videos: two cards fit side by side on desktop so
            // it stays static there, while a phone shows one and can swipe.
            written.length > 1 ? (
              <Rail label="written testimonials">
                {written.map((item) => (
                  <QuoteCard key={item.id} item={item} />
                ))}
              </Rail>
            ) : (
              <div className="quotes">
                {written.map((item) => (
                  <QuoteCard key={item.id} item={item} />
                ))}
              </div>
            )
          ) : (
            <div className="empty-note">
              No written testimonials published yet. Add them from the admin panel.
            </div>
          )}
        </div>
      </section>

      <section id="video">
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">Video testimonials</span>
            <h2>Hear it directly from the founders.</h2>
            <p>
              Founder videos, with the name and agency immediately below each one.
            </p>
          </div>
          {videos.length ? (
            // More than one video is always a carousel. Two cards fit side by
            // side on desktop so it simply doesn't scroll there, while a phone
            // shows one at a time and can be swiped.
            videos.length > 1 ? (
              <Rail label="video testimonials">
                {videos.map((item) => (
                  <VideoTestimonial key={item.id} item={item} />
                ))}
              </Rail>
            ) : (
              <div className="videos">
                {videos.map((item) => (
                  <VideoTestimonial key={item.id} item={item} />
                ))}
              </div>
            )
          ) : (
            <div className="empty-note">
              No video testimonials published yet. Add them from the admin panel.
            </div>
          )}
        </div>
      </section>

      <section id="apply" className="grow-agency-section">
        <div className="wrap">
          <div className="grow-agency-card">
            <div className="grow-content">
              <div style={{ marginBottom: 16 }}>
                <span className="kicker">Let&rsquo;s grow your travel agency</span>
              </div>

              <h2 className="grow-heading">
                Get More Quality
                <br />
                Leads From Meta Ads.
              </h2>

              <p className="grow-copy">
                Tell me about your travel agency and your current Meta Ads. I&rsquo;ll look at what&rsquo;s
                happening and see where your lead quality can improve.
              </p>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="grow-whatsapp-btn"
                aria-label="Talk to Me on WhatsApp"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2a9.9 9.9 0 00-8.5 15L2 22l5.2-1.4A9.9 9.9 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-3 .8.8-3-.2-.3A8 8 0 1112 20zm4.5-5.9c-.2-.1-1.4-.7-1.7-.8s-.4-.1-.5.1-.6.8-.7 1-.3.2-.5.1a6.5 6.5 0 01-3.2-2.8c-.2-.4.2-.4.6-1.2.1-.2 0-.3 0-.5s-.5-1.3-.7-1.7-.4-.4-.5-.4h-.5a1 1 0 00-.7.3A3 3 0 006 9.6c0 1.8 1.3 3.5 1.5 3.7a10 10 0 003.8 3.4c1.4.6 2 .6 2.7.5a2.5 2.5 0 001.6-1.2 2 2 0 00.1-1.1z" />
                </svg>
                <span>Talk to Me on WhatsApp &rarr;</span>
              </a>

              <div className="grow-trust-row">
                <span className="grow-trust-item">
                  <span aria-hidden="true">🔒</span> No obligation
                </span>
                <span className="grow-trust-sep" aria-hidden="true">|</span>
                <span className="grow-trust-item">Quick response</span>
                <span className="grow-trust-sep" aria-hidden="true">|</span>
                <span className="grow-trust-item">Let&rsquo;s grow together</span>
              </div>
            </div>

            <div className="grow-illustration-wrap">
              <Image
                src="/images/agency-growth.jpg"
                alt="Suitcase and travel destination signpost for better leads, more bookings, and growth"
                width={512}
                height={398}
                className="grow-illustration-img"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
