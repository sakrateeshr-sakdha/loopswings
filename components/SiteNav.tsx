"use client";

import { useState } from "react";
import Link from "next/link";

interface SiteNavProps {
  variant?: "home" | "page";
  whatsappUrl?: string;
}

/**
 * Navigation bar matching reference design:
 * Dark black backdrop, yellow infinity wings + white loopwings wordmark,
 * links for How it works, Who it's for, FAQ, Testimonials,
 * and a gold pill WhatsApp button.
 */
export default function SiteNav({
  variant = "home",
  whatsappUrl = "https://wa.me/8574859685",
}: SiteNavProps) {
  const [open, setOpen] = useState(false);
  const prefix = variant === "home" ? "" : "/";
  const close = () => setOpen(false);

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link className="brand" href="/" onClick={close} aria-label="Vishuvabharathi">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="brand-logo-img"
            src="/images/trans.svg"
            alt="Vishuvabharathi"
            width={180}
            height={32}
          />
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={open ? "nav-bars open" : "nav-bars"} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>

        <div className={open ? "nav-links open" : "nav-links"} id="site-menu">
          <a href={`${prefix}#operate`} onClick={close}>
            My Approach
          </a>
          <a href={`${prefix}#proof`} onClick={close}>
            Proof
          </a>
          <a href={`${prefix}#faq`} onClick={close}>
            FAQ
          </a>
          {/* <Link href="/testimonials" onClick={close}>
            Testimonials
          </Link> */}
          <a
            className="nav-whatsapp-btn"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2a9.9 9.9 0 00-8.5 15L2 22l5.2-1.4A9.9 9.9 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-3 .8.8-3-.2-.3A8 8 0 1112 20zm4.5-5.9c-.2-.1-1.4-.7-1.7-.8s-.4-.1-.5.1-.6.8-.7 1-.3.2-.5.1a6.5 6.5 0 01-3.2-2.8c-.2-.4.2-.4.6-1.2.1-.2 0-.3 0-.5s-.5-1.3-.7-1.7-.4-.4-.5-.4h-.5a1 1 0 00-.7.3A3 3 0 006 9.6c0 1.8 1.3 3.5 1.5 3.7a10 10 0 003.8 3.4c1.4.6 2 .6 2.7.5a2.5 2.5 0 001.6-1.2 2 2 0 00.1-1.1z" />
            </svg>
            <span>Get My FREE Audit &rarr;</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
