import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import LeadForm from "@/components/LeadForm";
import VideoTestimonial from "@/components/VideoTestimonial";
import BrandGrid from "@/components/BrandGrid";
import Rail from "@/components/Rail";
import {
  getPublishedBrands,
  getPublishedSocial,
  getPublishedTestimonials,
} from "@/lib/db";
import { FAQS } from "@/lib/content";
import { FaqSchema, OrganizationSchema } from "@/components/StructuredData";

// Content comes from the JSON files, which the CMS rewrites at runtime.
export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const [brands, videoTestimonials, social] = await Promise.all([
    getPublishedBrands(),
    getPublishedTestimonials("video"),
    getPublishedSocial(),
  ]);
  const featured = videoTestimonials.filter((t) => t.featured);
  const displayVideos = featured.length > 0 ? featured : videoTestimonials;
  // sameAs expects profile URLs, so mailto: and tel: links are left out.
  const socialUrls = social.map((s) => s.url).filter((u) => u.startsWith("http"));

  return (
    <>
      <OrganizationSchema sameAs={socialUrls} />
      <FaqSchema />
      <SiteNav />

      <header className="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="kicker">Meta Ads for travel agencies</span>
            <h1>
              Get <span className="marker">2X More High-Quality Travel Leads</span> in 90 Days
            </h1>
            <p className="lead">
              Meta Ads lead generation built specifically for travel agencies. I plan, create, run
              and optimize your Meta Ads to bring you{" "}
              <strong>more relevant travel enquiries</strong> — not just more messages.
            </p>
            <div className="hero-actions">
              <a className="btn gold" href="#apply">
                GET MORE QUALITY LEADS →
              </a>
              <span className="small">
                No long-term contract · Ad spend paid directly to Meta
              </span>
            </div>
          </div>
          <div className="doodle-card hero-doodle-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/founder.png"
              alt="Many enquiries filtered down to high-quality enquiries and more bookings"
            />
          </div>
        </div>
      </header>

      <section>
        <div className="wrap split">
          <div>
            <div className="section-head">
              <span className="kicker">The real problem</span>
              <h2>
                Getting Leads Isn&rsquo;t the Problem. Getting the{" "}
                <span className="marker">Right Leads</span> Is.
              </h2>
            </div>
            <p>You can generate 50 enquiries. But if most of them are:</p>
            <div className="problem-list">
              {[
                "Just checking the price",
                "Looking for the cheapest package",
                "Not ready to travel",
                "Not interested in your actual offer",
                "Ghosting after the first WhatsApp message",
              ].map((problem) => (
                <div className="problem" key={problem}>
                  <span className="x">×</span>
                  <div>
                    <strong>{problem}</strong>
                  </div>
                </div>
              ))}
            </div>
            <p className="statement">Those 50 leads don&rsquo;t mean much.</p>
            <p>
              You don&rsquo;t need another campaign optimized for the cheapest possible lead. You
              need Meta Ads built to attract{" "}
              <strong>travellers who are genuinely interested in what you&rsquo;re selling.</strong>
            </p>
          </div>
          <div className="doodle-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/doodle-1.png" alt="Many enquiries filtered down to high-quality enquiries and more bookings" />
          </div>
        </div>
      </section>

      <section id="system">
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">That&rsquo;s what I help you do</span>
            <h2>The 90-Day Travel Lead System</h2>
            <p>
              My goal is simple:{" "}
              <strong>
                increase the number of high-quality leads your travel agency receives from Meta Ads.
              </strong>{" "}
              I handle the advertising side from strategy → creative → campaign → optimization.
            </p>
          </div>
          <div className="system-box">
            <p className="statement">You focus on the conversations that matter.</p>
            <div className="flow">
              <div className="flow-item">Talk to travellers</div>
              <span className="arrow">→</span>
              <div className="flow-item">Close bookings</div>
              <span className="arrow">→</span>
              <div className="flow-item">Run trips</div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">How it works</span>
            <h2>One system. Five deliberate steps.</h2>
          </div>
          <div className="steps">
            <article className="step">
              <div className="step-num">01</div>
              <div>
                <h3>I Choose What to Advertise</h3>
                <p>
                  Not every package should be advertised the same way. I look at your{" "}
                  <strong>
                    Destination · Package · Price · Departure · Audience · Previous results
                  </strong>{" "}
                  and identify the offer I believe has the strongest potential.
                </p>
              </div>
              <div className="step-visual">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/doodle-7.png" alt="" />
              </div>
            </article>

            <article className="step">
              <div className="step-num">02</div>
              <div>
                <h3>I Build Ads That Pre-Qualify Travellers</h3>
                <p>
                  I use your package, pricing, positioning and messaging to help attract the{" "}
                  <strong>right type of traveller before they even message you.</strong> I create ad
                  angles, hooks, copy, static creatives, reels/video concepts and multiple
                  variations for testing.
                </p>
              </div>
              <div className="step-visual">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/doodle-3.png" alt="" />
              </div>
            </article>

            <article className="step">
              <div className="step-num">03</div>
              <div>
                <h3>I Build &amp; Launch Your Meta Campaign</h3>
                <p>
                  I handle campaign structure, audience strategy, conversion setup, WhatsApp / lead
                  setup, ad setup and tracking where applicable. Then I launch.
                </p>
              </div>
              <div className="step-visual">
                <svg className="doodle" viewBox="0 0 240 150">
                  <g fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round">
                    <path d="M26 107h188" />
                    <path d="M54 107V73M101 107V42M148 107V61M195 107V28" />
                    <path d="M40 48c53 6 90-8 151-26" stroke="#f4c431" strokeWidth="7" />
                  </g>
                </svg>
              </div>
            </article>

            <article className="step">
              <div className="step-num">04</div>
              <div>
                <h3>Meta Finds the People Most Likely to Enquire</h3>
                <p>
                  I don&rsquo;t rely on endlessly stacking random interests. I give Meta the right{" "}
                  <strong>Offer + Creative + Campaign Objective + Conversion Signal</strong> and
                  allow its system to learn who is most likely to respond.
                </p>
              </div>
              <div className="step-visual">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/doodle-5.png" alt="" />
              </div>
            </article>

            <article className="step">
              <div className="step-num">05</div>
              <div>
                <h3>I Optimize for Lead Quality</h3>
                <p>
                  <strong>Cheap leads aren&rsquo;t automatically good leads.</strong> I use campaign
                  data and your feedback on enquiry quality to improve{" "}
                  <strong>Creative → Messaging → Offer → Targeting → Campaign</strong> over time.
                </p>
              </div>
              <div className="step-visual">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/doodle-6.png" alt="" />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">What I handle for you</span>
            <h2>Your Meta Ads engine, handled end-to-end.</h2>
          </div>
          <div className="handle-grid">
            <div className="handle-card">
              <svg viewBox="0 0 90 90">
                <g fill="none" stroke="#111" strokeWidth="3">
                  <circle cx="45" cy="45" r="28" />
                  <path d="M45 10v70M10 45h70" />
                  <circle cx="45" cy="45" r="8" fill="#f4c431" />
                </g>
              </svg>
              <div>
                <h3>Ad Strategy</h3>
                <p>Campaign planning built around your travel offer and business objective.</p>
              </div>
            </div>
            <div className="handle-card">
              <svg viewBox="0 0 90 90">
                <g fill="none" stroke="#111" strokeWidth="3">
                  <rect x="16" y="19" width="58" height="50" rx="8" />
                  <path d="M24 60l18-18 12 12 11-9 9 10" />
                  <circle cx="58" cy="33" r="6" fill="#f4c431" />
                </g>
              </svg>
              <div>
                <h3>Ad Creatives</h3>
                <p>Creative concepts, hooks, copy and ad variations designed specifically to attract the right travellers on Meta.</p>
              </div>
            </div>
            <div className="handle-card">
              <svg viewBox="0 0 90 90">
                <g fill="none" stroke="#111" strokeWidth="3">
                  <rect x="18" y="20" width="54" height="52" rx="7" />
                  <path d="M30 34h30M30 46h30M30 58h19" />
                  <path d="M60 55l5 6 11-14" stroke="#f4c431" strokeWidth="6" />
                </g>
              </svg>
              <div>
                <h3>Campaign Setup</h3>
                <p>Campaigns, ad sets, and ads structured correctly from the start for optimal performance.</p>
              </div>
            </div>
            <div className="handle-card">
              <svg viewBox="0 0 90 90">
                <g fill="none" stroke="#111" strokeWidth="3">
                  <path d="M18 65l18-22 15 12 20-30" />
                  <circle cx="18" cy="65" r="4" />
                  <circle cx="36" cy="43" r="4" />
                  <circle cx="51" cy="55" r="4" />
                  <circle cx="71" cy="25" r="4" fill="#f4c431" />
                </g>
              </svg>
              <div>
                <h3>Ad Management</h3>
                <p>
                  I monitor performance and make optimization decisions throughout the campaign.
                </p>
              </div>
            </div>
            <div className="handle-card">
              <svg viewBox="0 0 90 90">
                <g fill="none" stroke="#111" strokeWidth="3">
                  <path d="M18 31h54M18 59h54" />
                  <circle cx="34" cy="31" r="8" fill="#f4c431" />
                  <circle cx="58" cy="59" r="8" />
                </g>
              </svg>
              <div>
                <h3>Creative Testing</h3>
                <p>
                  Different messages, angles and creatives tested instead of depending on one ad.
                </p>
              </div>
            </div>
            <div className="handle-card">
              <svg viewBox="0 0 90 90">
                <g fill="none" stroke="#111" strokeWidth="3">
                  <path d="M15 22h60L60 42v22H30V42z" />
                  <path d="M36 55l6 7 13-16" stroke="#f4c431" strokeWidth="6" />
                </g>
              </svg>
              <div>
                <h3>Lead Optimization</h3>
                <p>
                  Campaign performance + actual enquiry feedback used to improve incoming lead
                  quality.
                </p>
              </div>
            </div>
            <div className="handle-card">
              <svg viewBox="0 0 90 90">
                <g fill="none" stroke="#111" strokeWidth="3">
                  <rect x="15" y="16" width="60" height="58" rx="8" />
                  <path d="M27 58V45M43 58V34M59 58V27" stroke="#f4c431" strokeWidth="6" />
                </g>
              </svg>
              <div>
                <h3>Performance Report</h3>
                <p>Clear reporting on what&rsquo;s happening, what&rsquo;s working and what I&rsquo;m changing.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap split">
          <div>
            <span className="kicker">Why not just boost your posts?</span>
            <h2>Because reach, likes and cheap clicks aren&rsquo;t the objective.</h2>
            <p className="statement">Your objective is enquiries.</p>
            <p>I build your campaigns around the action you actually want travellers to take.</p>
            <div className="flow flow-stack">
              <div className="flow-item">See Ad</div>
              <span className="arrow">→</span>
              <div className="flow-item">Get Interested</div>
              <span className="arrow">→</span>
              <div className="flow-item">Enquire</div>
              <span className="arrow">→</span>
              <div className="flow-item">WhatsApp</div>
              <span className="arrow">→</span>
              <div className="flow-item">Your Team Converts</div>
            </div>
          </div>
          <div className="doodle-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/doodle-2.png" alt="Enquiries growing month over month" />
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="goal">
            <span className="kicker">The goal</span>
            <div className="goal-big">
              2X More High-Quality Leads
              <br />
              in 90 Days.
            </div>
            <p className="lead">
              Not 2X more random WhatsApp messages. Not 2X more clicks. Not vanity metrics.{" "}
              <strong>More of the enquiries your sales team actually wants to receive.</strong>
            </p>
            <p className="small">
              Your exact results depend on factors such as current lead volume, offer, destination,
              pricing, ad budget, season and sales process. I first understand where you are today
              and determine whether the 2X target is realistic for your agency.
            </p>
          </div>
        </div>
      </section>

      {(displayVideos.length > 0 || brands.length > 0) && (
        <section>
          <div className="wrap">
            <div className="section-head">
              <span className="kicker">Proof from travel agency founders</span>
              <h2>
                Agencies that <span className="marker nowrap">trusted LoopWings.</span>
              </h2>
            </div>
            {brands.length > 0 && <BrandGrid brands={brands.slice(0, 8)} />}
            {displayVideos.length > 0 && (
              displayVideos.length > 1 ? (
                <div style={{ marginTop: brands.length ? 22 : 0 }}>
                  <Rail label="video testimonials">
                    {displayVideos.map((item) => (
                      <VideoTestimonial key={item.id} item={item} />
                    ))}
                  </Rail>
                </div>
              ) : (
                <div className="videos" style={{ marginTop: brands.length ? 22 : 0 }}>
                  {displayVideos.map((item) => (
                    <VideoTestimonial key={item.id} item={item} />
                  ))}
                </div>
              )
            )}
            <div style={{ marginTop: 28 }}>
              <Link className="btn ghost" href="/testimonials">
                View all testimonials →
              </Link>
            </div>
          </div>
        </section>
      )}

      <section id="fit">
        <div className="wrap">
          <div className="two-col">
            <div className="list-card">
              <span className="badge">What you don&rsquo;t need to do</span>
              <h2 style={{ marginTop: 18 }}>I handle the advertising.</h2>
              <p className="statement">You handle the enquiries.</p>
              <ul>
                {[
                  "Learn Meta Ads",
                  "Figure out campaign structure",
                  "Decide which audiences to target",
                  "Write your own ad copy",
                  "Keep making random creatives",
                  "Check Ads Manager every day",
                ].map((item) => (
                  <li key={item}>
                    <span className="x">×</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="list-card" style={{ marginBottom: 22 }}>
                <span className="badge">Who this is for</span>
                <h3 style={{ marginTop: 16 }}>Indian travel agencies that:</h3>
                <ul>
                  {[
                    "Sell tour packages or planned departures",
                    "Want more enquiries through Meta Ads",
                    "Can respond to leads quickly on WhatsApp",
                    "Have an advertising budget",
                    "Want to improve lead quality — not simply chase the lowest CPL",
                    "Will share feedback about which leads are good and bad",
                  ].map((item) => (
                    <li key={item}>
                      <span className="check">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="list-card">
                <span className="badge">Who this is not for</span>
                <ul>
                  {[
                    "You want guaranteed bookings without handling the sales process",
                    "You expect Meta Ads to fix an uncompetitive package",
                    "You only care about getting the cheapest possible leads",
                    "You don’t have anyone available to follow up with enquiries",
                  ].map((item) => (
                    <li key={item}>
                      <span className="x">×</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap commit">
          <div>
            <span className="kicker">No long-term lock-in</span>
            <h2>You Don&rsquo;t Have to Commit Long-Term.</h2>
            <p className="lead">
              Start with me for <strong>90 days</strong>. That&rsquo;s enough time for me to launch,
              collect data, test different approaches and optimize the campaign based on what
              I&rsquo;m learning.
            </p>
            <p>At the end of the 90 days, I&rsquo;ll review the results with you.</p>
            <p className="statement">
              If it makes business sense to continue, I scale.
              <br />
              If it doesn&rsquo;t, you&rsquo;re not locked in.
            </p>
          </div>
          <div className="process-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/process.jpg" alt="The process I follow: Plan, Do, Check, Act" />
          </div>
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

      <section id="faq">
        <div className="wrap faq">
          <div className="section-head">
            <span className="kicker">Frequently asked questions</span>
            <h2>Before you start.</h2>
          </div>
          {FAQS.map((faq) => (
            <details key={faq.q}>
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="cta" style={{ background: "white" }}>
            <span className="kicker">One final thought</span>
            <h2>Stop Paying Meta for Leads Your Team Doesn&rsquo;t Want.</h2>
            <p>Build a campaign designed to bring your travel agency more relevant enquiries.</p>
            <a className="btn gold" href="#apply">
              GET MORE QUALITY LEADS →
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
