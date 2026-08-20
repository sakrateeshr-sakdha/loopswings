import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import LeadForm from "@/components/LeadForm";
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

  return (
    <>
      <OrganizationSchema sameAs={socialUrls} />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Testimonials", path: "/testimonials" },
        ]}
      />
      <SiteNav variant="page" />

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

      <section id="apply">
        <div className="wrap">
          <div className="cta">
            <span className="kicker">Ready to get better travel leads?</span>
            <h2>Let&rsquo;s See If I Can 2X Your High-Quality Leads in the Next 90 Days.</h2>
            <p>
              Tell me about your travel agency, what you&rsquo;re currently advertising and the kind
              of enquiries you&rsquo;re looking for. I&rsquo;ll assess whether my Meta Ads system is
              a good fit for your agency.
            </p>
            <LeadForm />
            <div className="small" style={{ marginTop: 14 }}>
              For Indian travel agencies · Limited client capacity
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
