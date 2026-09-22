import Link from "next/link";
import MoveToTop from "./MoveToTop";
import WhatsAppButton from "./WhatsAppButton";
import { getPublishedSocial } from "@/lib/db";
import { SocialIcon, PLATFORM_LABELS } from "./SocialLinks";

export default async function SiteFooter() {
  const social = await getPublishedSocial();
  const whatsappUrl =
    social.find((s) => s.platform === "whatsapp")?.url || "https://wa.me/8574859685";

  return (
    <>
      <footer className="dark-footer">
        <div className="wrap">
          <div className="dark-footer-grid">
            {/* Brand column */}
            <div className="dark-footer-brand">
              <div className="dark-footer-brand-header">
                <div className="dark-footer-logo-badge" aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="dark-footer-logo-img"
                    src="/images/logo.png"
                    alt="LoopWings"
                  />
                </div>
                <Link href="/" className="dark-footer-brand-logo-link">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="dark-footer-wordmark-img"
                    src="/images/loopwings-white.png"
                    alt="loopwings"
                    width={140}
                    height={43}
                  />
                </Link>
              </div>
              <p className="dark-footer-tagline">
                Meta Ads for Travel Agencies
                <br />
                More Quality Leads. Less Junk.
              </p>
            </div>

            {/* Vertical divider */}
            <div className="dark-footer-divider" aria-hidden="true" />

            {/* Explore column */}
            <div className="dark-footer-col dark-footer-explore-col">
              <h4 className="dark-footer-col-title">Explore</h4>
              <ul className="dark-footer-nav-list">
                <li>
                  <a href="/#system">How it works</a>
                </li>
                <li>
                  <a href="/#problems">Who it&rsquo;s for</a>
                </li>
                <li>
                  <a href="/#faq">FAQ</a>
                </li>
                <li>
                  <Link href="/testimonials">Testimonials</Link>
                </li>
              </ul>
            </div>

            {/* Vertical divider */}
            <div className="dark-footer-divider" aria-hidden="true" />

            {/* Connect column (Social Media links from Admin Panel) */}
            <div className="dark-footer-col dark-footer-connect-col">
              <h4 className="dark-footer-col-title">Connect</h4>
              {social.length > 0 ? (
                <ul className="dark-footer-social-list">
                  {social.map((link) => {
                    const name =
                      link.label || PLATFORM_LABELS[link.platform] || link.platform;
                    const isInternalScheme = link.url.startsWith("mailto:");
                    return (
                      <li key={link.id}>
                        <a
                          className="dark-footer-social-btn"
                          href={link.url}
                          aria-label={name}
                          title={name}
                          {...(isInternalScheme
                            ? {}
                            : { target: "_blank", rel: "noreferrer me" })}
                        >
                          <SocialIcon platform={link.platform} />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p style={{ color: "#71717a", fontSize: 13, margin: 0 }}>
                  No social links published.
                </p>
              )}
            </div>

            {/* Chalkboard artwork box on the right */}
            <div className="dark-footer-chalk-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/footer-travel-agencies.jpg"
                alt="Helping Indian Travel Agencies Go Further."
                className="dark-footer-chalk-img"
                width={1024}
                height={720}
              />
            </div>
          </div>

          {/* Bottom row */}
          <div className="dark-footer-bottom">
            <p>&copy; 2026 loopwings. All rights reserved.</p>
            <div className="dark-footer-legal">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of conditions</a>
            </div>
          </div>
        </div>
      </footer>
      <MoveToTop />
      <WhatsAppButton url={whatsappUrl} />
    </>
  );
}
