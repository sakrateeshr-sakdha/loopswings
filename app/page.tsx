import Link from "next/link";
import Image from "next/image";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import LeadForm from "@/components/LeadForm";
import FeaturedTestimonialCard from "@/components/FeaturedTestimonialCard";
import ProofBrandsMarquee from "@/components/ProofBrandsMarquee";

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
  const whatsappUrl =
    social.find((s) => s.platform === "whatsapp")?.url || "https://wa.me/8574859685";

  return (
    <>
      <OrganizationSchema sameAs={socialUrls} />
      <FaqSchema />
      <SiteNav whatsappUrl={whatsappUrl} />

      <header className="hero">
        <div className="wrap hero-grid">
          <div className="hero-content">
            <span className="kicker">Lead Generation</span>
            <h1 className="hero-title">
              Getting <span className="hero-travel-pill">Travel</span>
              <br />
              Leads, But Most
              <br />
              Are Junk?
            </h1>
            <p className="hero-lead">
              I help businesses get more quality leads with Meta Ads and Google Ads.
              By identifying what&apos;s attracting the wrong prospects, fixing the underlying
              issues, and continuously improving campaigns, I help generate more enquiries
              worth pursuing.
              {/* I help travel agencies get more quality leads with Meta Ads. By finding what&apos;s
              bringing the wrong travellers, fix it at the source, and optimize your ads to bring
              more relevant enquiries to your WhatsApp. */}
            </p>
            <div className="hero-actions-column">
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
              <span className="hero-sub-note">
                See where your lead quality is breaking down — and what to fix first.
              </span>
            </div>
          </div>
          <div className="hero-visual-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/ownerpic.png"
              alt="Vishuvabharathi - Travel Marketing"
              width={582}
              height={638}
              className="hero-founder-img"
            />
          </div>
        </div>
      </header>

      <section id="who" className="problem-section">
        <div id="problems" />
        <div className="wrap">
          <div style={{ marginBottom: 20 }}>
            <span className="kicker">The Real Problem</span>
          </div>

          <h2 className="problem-heading">
            Getting Leads Isn&rsquo;t the Problem.
            <br />
            Getting <span className="quality-marker">Quality Leads</span> Is.
          </h2>

          <p className="problem-subhead">
            You can get 50 enquiries. But if most of them are&hellip;
          </p>

          <div className="speech-bubble-grid">
            {[
              "Aren't the right fit for what you sell",
              "Don't have the budget to buy",
              "Ask for the price — then disappear",
              "Enquire with little or no real buying intent",
              "Stop replying once the conversation starts",
            ].map((problem) => (
              <div className="speech-bubble-card" key={problem}>
                <span className="bubble-badge" aria-hidden="true">✕</span>
                <p className="bubble-text">{problem}</p>
              </div>
            ))}
          </div>

          <p className="problem-footer-note">
            More leads don&rsquo;t mean better results. What matters is getting more of the right
            prospects — people who fit what you package and have a genuine chance of becoming customers.
          </p>
        </div>
      </section>

      <section className="reason-section">
        <div className="wrap">
          <div className="reason-grid">
            <div className="reason-left">
              <div style={{ marginBottom: 18 }}>
                <span className="kicker">The Real Reason</span>
              </div>

              <h2 className="reason-heading">
                Junk Leads Don&rsquo;t Start on WhatsApp. They Start{" "}
                <span className="reason-marker">Before the Click.</span>
              </h2>

              <div className="reason-copy">
                <p>
                  Junk leads aren&rsquo;t always a targeting problem. The wrong prospects can be attracted by your offer, message, targeting, or how easily someone can become a lead.
                </p>
                <p>
                  That&rsquo;s why simply changing the audience, keywords or budget doesn&rsquo;t always fix lead quality.
                </p>
                <p>
                  The real fix is finding where lead quality is breaking down &mdash; and fixing it at the source.
                </p>
              </div>

              <div className="reason-divider" aria-hidden="true" />

              <div className="reason-statement">
                <p className="reason-statement-white">Don&rsquo;t just optimize for more leads.</p>
                <p className="reason-statement-gold">Optimize for more of the right leads.</p>
              </div>
            </div>

            <div className="reason-right">
              <div className="reason-card">
                <Image
                  src="/images/marketing-targeting-strategy.png"
                  alt="Marketing Targeting Strategy Infographic — Offer, Message, Targeting, Qualification"
                  width={520}
                  height={520}
                  className="reason-card-img"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="system" className="tlqs-section">
        <div className="wrap">
          <div style={{ marginBottom: 18 }}>
            <span className="kicker">What I work On</span>
          </div>

          <h2 className="tlqs-heading">Lead Quality System</h2>

          <p className="tlqs-subhead">
            I work across four areas that influence which prospects your campaigns attract, who enquires, and how many of those enquiries are actually worth pursuing.
          </p>

          <div className="tlqs-grid">
            <article className="tlqs-card tlqs-card-yellow">
              <div className="tlqs-card-top">
                <div className="tlqs-num-wrap">
                  <span className="tlqs-num">01</span>
                  <div className="tlqs-bar tlqs-bar-yellow" aria-hidden="true" />
                </div>
                <div className="tlqs-icon-blob tlqs-blob-yellow" aria-hidden="true">
                  <svg width="46" height="46" viewBox="0 0 52 52" fill="none">
                    <path d="M21 16V12C21 10.34 22.34 9 24 9H28C29.66 9 31 10.34 31 12V16" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
                    <rect x="13" y="16" width="26" height="24" rx="4" fill="#facc15" stroke="#111" strokeWidth="2.5" />
                    <line x1="26" y1="16" x2="26" y2="40" stroke="#111" strokeWidth="2" strokeDasharray="2 2" />
                    <path d="M15 21L10 26L13 29L18 24" fill="#ffffff" stroke="#111" strokeWidth="2" strokeLinejoin="round" />
                    <circle cx="16" cy="22" r="1" fill="#111" />
                    <path d="M16 20L19 16" stroke="#111" strokeWidth="1.5" />
                    <path d="M43 14L45 12M46 17L49 17" stroke="#111" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <h3 className="tlqs-title">OFFER</h3>
              <p className="tlqs-headline">Give the right prospect a reason to enquire.</p>
              <p className="tlqs-body">
                Position what you sell, its value, price and key details clearly so the offer attracts people who&rsquo;re a genuine fit.
              </p>
            </article>

            <article className="tlqs-card tlqs-card-blue">
              <div className="tlqs-card-top">
                <div className="tlqs-num-wrap">
                  <span className="tlqs-num">02</span>
                  <div className="tlqs-bar tlqs-bar-blue" aria-hidden="true" />
                </div>
                <div className="tlqs-icon-blob tlqs-blob-blue" aria-hidden="true">
                  <svg width="46" height="46" viewBox="0 0 52 52" fill="none">
                    <path d="M13 14H37C39.2 14 41 15.8 41 18V30C41 32.2 39.2 34 37 34H20L13 40V34C11.3 34 10 32.7 10 31V18C10 15.8 11.8 14 13 14Z" fill="#ffffff" stroke="#111" strokeWidth="2.5" strokeLinejoin="round" />
                    <circle cx="20" cy="24" r="2" fill="#3b82f6" />
                    <circle cx="26" cy="24" r="2" fill="#3b82f6" />
                    <circle cx="32" cy="24" r="2" fill="#3b82f6" />
                    <path d="M44 14L47 11M45 20L48 20" stroke="#111" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <h3 className="tlqs-title">MESSAGE</h3>
              <p className="tlqs-headline">Make the right prospect respond.</p>
              <p className="tlqs-body">
                Build the creative and message around the customer&rsquo;s problem, desire and what matters to them &mdash;
                while clearly communicating the details they need to decide.
              </p>
            </article>

            <article className="tlqs-card tlqs-card-green">
              <div className="tlqs-card-top">
                <div className="tlqs-num-wrap">
                  <span className="tlqs-num">03</span>
                  <div className="tlqs-bar tlqs-bar-green" aria-hidden="true" />
                </div>
                <div className="tlqs-icon-blob tlqs-blob-green" aria-hidden="true">
                  <svg width="46" height="46" viewBox="0 0 52 52" fill="none">
                    <circle cx="16" cy="20" r="4.5" stroke="#111" strokeWidth="2.5" fill="#ffffff" />
                    <path d="M10 34C10 29.5 13 27 16 27C17.8 27 19.3 27.8 20.2 29" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="36" cy="20" r="4.5" stroke="#111" strokeWidth="2.5" fill="#ffffff" />
                    <path d="M42 34C42 29.5 39 27 36 27C34.2 27 32.7 27.8 31.8 29" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="26" cy="17" r="5.5" stroke="#111" strokeWidth="2.5" fill="#ffffff" />
                    <path d="M18 35C18 29.5 21.5 26.5 26 26.5C30.5 26.5 34 29.5 34 35" stroke="#111" strokeWidth="2.5" strokeLinecap="round" fill="#10b981" fillOpacity="0.15" />
                    <path d="M41 12L44 9M43 17L46 17" stroke="#111" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <h3 className="tlqs-title">TARGETING</h3>
              <p className="tlqs-headline">Reach the right prospects.</p>
              <p className="tlqs-body">
                Use the right targeting signals for each platform &mdash; such as audiences,
                locations, keywords and search intent &mdash; so your campaigns have better
                conditions to reach relevant prospects.
              </p>
            </article>

            <article className="tlqs-card tlqs-card-coral">
              <div className="tlqs-card-top">
                <div className="tlqs-num-wrap">
                  <span className="tlqs-num">04</span>
                  <div className="tlqs-bar tlqs-bar-coral" aria-hidden="true" />
                </div>
                <div className="tlqs-icon-blob tlqs-blob-coral" aria-hidden="true">
                  <svg width="46" height="46" viewBox="0 0 52 52" fill="none">
                    <path d="M11 15H41L29 29V38C29 39 28 40 27 40H25C24 40 23 39 23 38V29L11 15Z" fill="#f43f5e" fillOpacity="0.15" stroke="#111" strokeWidth="2.5" strokeLinejoin="round" />
                    <ellipse cx="26" cy="15" rx="15" ry="3" fill="#ffffff" stroke="#111" strokeWidth="2.5" />
                    <path d="M26 44C26 44 24 46 24 47C24 48.1 24.9 49 26 49C27.1 49 28 48.1 28 47C28 46 26 44 26 44Z" fill="#f43f5e" />
                    <path d="M43 14L46 12M45 19L48 19" stroke="#111" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <h3 className="tlqs-title">QUALIFICATION</h3>
              <p className="tlqs-headline">Separate genuine opportunities from poor-fit enquiries.</p>
              <p className="tlqs-body">
                Define what a quality lead means for your business and use the right qualification criteria and enquiry flow to identify which leads are actually worth pursuing.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* HOW I OPERATE IT - Continuous Learning & Improvement Loop */}
      {/* ========================================================================= */}
      <section id="operate" className="operate-section">
        <div className="wrap">
          <div className="operate-header">
            <div style={{ marginBottom: 18 }}>
              <span className="kicker">How I Operate It</span>
            </div>
            <h2 className="operate-heading">
              Lead Quality Isn&rsquo;t a One-Time Setup.
            </h2>
            <p className="operate-subhead">
              Qualified lead generation is a continuous learning and improvement loop between me, Meta and your sales team.
            </p>
          </div>

          <div className="operate-diagram">
            {/* Infinity loop graphic displayed on tablet and above */}
            <div className="operate-loop-wrap" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/loop final.svg"
                alt=""
                className="operate-loop-img"
                width={888}
                height={410}
              />
            </div>

            <div className="operate-grid">
              {/* Card 01 - BUILD */}
              <article className="operate-card operate-card-01">
                <div className="operate-card-step">
                  <span className="operate-step-num">01</span>
                  <span className="operate-step-sep">—</span>
                  <span className="operate-step-name">BUILD</span>
                </div>
                <h3 className="operate-card-title">I build the right campaign inputs.</h3>
                {/* <p className="operate-card-body">
                  I work on the offer, message, targeting and qualification to give Meta the right conditions to find more relevant travellers.
                </p> */}
              </article>

              {/* Card 03 - QUALIFY */}
              <article className="operate-card operate-card-03">
                <div className="operate-card-step">
                  <span className="operate-step-num">03</span>
                  <span className="operate-step-sep">—</span>
                  <span className="operate-step-name">QUALIFY</span>
                </div>
                <h3 className="operate-card-title">Your sales team qualifies the leads.</h3>
                {/* <p className="operate-card-body">
                  Your team speaks with the enquiries and classifies them as Qualified, Unqualified, No Response or Pending — including the reason when a lead isn&rsquo;t qualified.
                </p> */}
              </article>

              {/* Card 04 - IMPROVE */}
              <article className="operate-card operate-card-04">
                <div className="operate-card-step">
                  <span className="operate-step-num">04</span>
                  <span className="operate-step-sep">—</span>
                  <span className="operate-step-name">IMPROVE</span>
                </div>
                <h3 className="operate-card-title">I use the results to improve the next loop.</h3>
                {/* <p className="operate-card-body">
                  I analyse the actual lead outcomes, identify the biggest lead-quality problem, make the most relevant change and run the next loop.
                </p> */}
              </article>

              {/* Card 02 - RUN */}
              <article className="operate-card operate-card-02">
                <div className="operate-card-step">
                  <span className="operate-step-num">02</span>
                  <span className="operate-step-sep">—</span>
                  <span className="operate-step-name">RUN</span>
                </div>
                <h3 className="operate-card-title">Meta learns and delivers.</h3>
                {/* <p className="operate-card-body">
                  Meta uses the campaign inputs, along with time, budget and performance signals, to learn and generate leads.
                </p> */}
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="handle-section">
        <div className="wrap">
          <div className="handle-split">
            <div className="handle-left">
              <div style={{ marginBottom: 18 }}>
                <span className="kicker">What I handle for you</span>
              </div>
              <h2 className="handle-heading">
                Your Paid Lead Generation,
                <br />
                Handled End-to-End.
              </h2>
              <p className="handle-lead">
                From analysing the package to improving lead quality — I handle the complete Meta
                Ads process with one focus: bringing you more enquiries worth pursuing.
              </p>

            </div>

            <div className="handle-timeline">
              {[
                {
                  num: "01",
                  title: "Offer & Campaign Strategy",
                  desc: "I analyse what you sell, your market, customer, pricing and offer to decide what should be promoted, where and how.",
                },
                {
                  num: "02",
                  title: "Persona & Creative Strategy",
                  desc: "I develop the personas, angles, messages and creative approaches most relevant to your offer and campaign.",
                },
                {
                  num: "03",
                  title: "Ad Creatives & Copy",
                  desc: "From Meta ad creatives and copy to Google ad messaging, I develop ads designed to attract the right prospects and reduce obvious mismatches.",
                },
                {
                  num: "04",
                  title: "Campaign Setup & Management",
                  desc: "I manage Meta Ads, Google Ads or the right combination based on your business — including targeting, keywords, budgets, optimization and performance.",
                },
                {
                  num: "05",
                  title: "Lead Quality Optimization",
                  starred: true,
                  desc: "I track which leads are qualified, understand why others aren't, identify the biggest lead-quality problem and use those findings to improve the campaigns.",
                },
                {
                  num: "06",
                  title: "Performance & Learning Reports",
                  desc: "Clear reporting on spend, leads, qualified leads, cost per qualified lead, what worked, what didn't and what gets improved next.",
                },
              ].map((step) => (
                <div className="timeline-item" key={step.num}>
                  <div className="timeline-track">
                    <div className="timeline-node" aria-hidden="true" />
                    <span className="timeline-pill">{step.num}</span>
                  </div>
                  <div className="timeline-content">
                    <h3 className="timeline-title">
                      {step.title}
                      {step.starred && (
                        <span className="timeline-star" aria-label="featured">
                          ★
                        </span>
                      )}
                    </h3>
                    <p className="timeline-desc">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="handle-banner">
            <div className="handle-banner-icon" aria-hidden="true">
              <svg width="34" height="34" viewBox="0 0 32 32" fill="none" style={{ transform: "rotate(-8deg)" }}>
                <path
                  d="M5 13H8L17 7V25L8 19H5C3.89543 19 3 18.1046 3 17V15C3 13.8954 3.89543 13 5 13Z"
                  fill="#ffffff"
                  stroke="#111111"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 12C22.5 13.2 23.5 14.5 23.5 16C23.5 17.5 22.5 18.8 21 20"
                  stroke="#111111"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M25 9C27.5 11.2 28.5 13.5 28.5 16C28.5 18.5 27.5 20.8 25 23"
                  stroke="#111111"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path d="M8 19L10 26" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="handle-banner-divider" aria-hidden="true" />
            <p className="handle-banner-text">
              <strong>I improve the system that brings you enquiries.</strong> You or your sales team handles the conversation, follow-up and sale.
            </p>
          </div>
        </div>
      </section>





      <section id="proof" className="proof-section">
        <div className="wrap">
          <div className="proof-header">
            <div style={{ marginBottom: 18 }}>
              <span className="kicker">Proof</span>
            </div>
            <h2 className="proof-heading">
              Businesses I&rsquo;ve Worked With.
              {/* <br />
              About Working With Me. */}
            </h2>
          </div>

          <div className="proof-agencies-wrap">
            <p className="proof-sublabel">SELECTED CLIENTS & PROJECTS</p>
            <ProofBrandsMarquee brands={brands} />
          </div>

          <FeaturedTestimonialCard items={displayVideos} />

          <div className="proof-action">
            {/* <Link className="proof-btn" href="/testimonials">
              View All Results &amp; Testimonials &rarr;
            </Link> */}
          </div>
        </div>
      </section>



      {/*
      <section id="grow" className="grow-agency-section">
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
              />
            </div>
          </div>
        </div>
      </section>
      */}

      {/* ========================================================================= */}
      {/* APPLY / CONTACT SECTION - Lead Quality Audit Form */}
      {/* ========================================================================= */}
      <section id="apply" className="apply-showcase-section">
        {/* Bottom-Right Dark Pill Badge */}
        <div className="apply-brush-banner" aria-hidden="true">
          <span>Let&rsquo;s Grow Your Business</span>
        </div>

        <div className="wrap apply-wrap">
          <div className="apply-grid">
            {/* Left Column */}
            <div className="apply-left">
              <div className="apply-badge">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                  <path d="M4 19h16v2H4v-2zm2-7h3v5H6v-5zm5-4h3v9h-3V8zm5-4h3v13h-3V4z" />
                </svg>
                <span>FREE LEAD QUALITY AUDIT</span>
              </div>

              <h2 className="apply-heading">
                Find Out What&rsquo;s
                <br />
                Bringing You
                <br />
                <span className="apply-pill-marker">Junk Leads.</span>
              </h2>

              <p className="apply-desc">
                Share your current campaign and a few details about the leads you&rsquo;re getting. I&rsquo;ll review your offer, message, targeting and qualification to identify where your lead-quality problem may be coming from &mdash; and what to fix first.
              </p>
            </div>

            {/* Right Column: Floating Form Card */}
            <div className="apply-right">
              <div className="apply-card">
                <div className="apply-card-header">
                  <div className="apply-card-icon-wrap" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#111111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="apply-card-title">Free Lead Quality Audit</h3>
                    <p className="apply-card-subtitle">Takes less than 60 seconds</p>
                  </div>
                </div>

                <LeadForm whatsappUrl={whatsappUrl} />
              </div>
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
              {faq.a.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </details>
          ))}
        </div>
      </section>


      <SiteFooter />
    </>
  );
}
