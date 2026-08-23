"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * `home` renders the landing-page section anchors; every other page links back
 * to the landing page for those sections. Below 900px the links collapse into
 * a toggle menu instead of being hidden.
 */
export default function SiteNav({ variant = "home" }: { variant?: "home" | "page" }) {
  const [open, setOpen] = useState(false);
  const prefix = variant === "home" ? "" : "/";
  const close = () => setOpen(false);

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link className="brand" href="/" onClick={close}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand-logo" src="/images/logo.png" alt="" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand-text" src="/images/logo-text.png" alt="LoopWings" />
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
          <a href={`${prefix}#system`} onClick={close}>
            How it works
          </a>
          <a href={`${prefix}#fit`} onClick={close}>
            Who it&rsquo;s for
          </a>
          <Link href="/testimonials" onClick={close}>
            Testimonials
          </Link>
          <a href={`${prefix}#faq`} onClick={close}>
            FAQ
          </a>
          <a className="btn gold" href={`${prefix}#apply`} onClick={close}>
            Get more quality leads &rarr;
          </a>
        </div>
      </div>
    </nav>
  );
}
