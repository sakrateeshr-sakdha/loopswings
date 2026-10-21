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
                <Link href="/" className="dark-footer-brand-logo-link" aria-label="Vishuvabharathi">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="dark-footer-wordmark-img"
                    src="/images/trans.svg"
                    alt="Vishuvabharathi"
                    width={180}
                    height={32}
                  />
                </Link>
              </div>
              <p className="dark-footer-tagline">
                Paid Lead Generation &amp; Ads
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
                  <a href="/#operate">My Approach</a>
                </li>
                <li>
                  <a href="/#proof">Proof</a>
                </li>
                <li>
                  <a href="/#faq">FAQ</a>
                </li>
                {/* <li>
                  <Link href="/testimonials">Testimonials</Link>
                </li> */}
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
          </div>

          {/* Bottom row */}
          <div className="dark-footer-bottom">
            <p>&copy; 2026 Vishuvabharathi. All rights reserved.</p>
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
