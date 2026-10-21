"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const TABS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/brands", label: "Brands" },
  { href: "/admin/social", label: "Social" },
  { href: "/admin/leads", label: "Enquiries" },
];

export default function AdminTabs() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="adm-bar">
      <div className="adm-bar-left">
        <Link className="brand" href="/" aria-label="Vishuvabharathi">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand-logo-img" src="/images/trans.svg" alt="Vishuvabharathi" style={{ height: 26, width: "auto" }} />
        </Link>
        <nav className="adm-tabs">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={pathname === tab.href ? "active" : ""}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="adm-actions">
        <Link className="adm-btn" href="/" target="_blank">
          View site ↗
        </Link>
        <button className="adm-btn" type="button" onClick={logout}>
          Sign out
        </button>
      </div>
    </div>
  );
}
