import Link from "next/link";
import { readAll } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [testimonials, brands, leads, social] = await Promise.all([
    readAll("testimonials"),
    readAll("brands"),
    readAll("leads"),
    readAll("social"),
  ]);

  const stats = [
    { value: testimonials.filter((t) => t.published).length, label: "Published testimonials" },
    { value: testimonials.filter((t) => t.type === "video").length, label: "Video testimonials" },
    { value: brands.filter((b) => b.published).length, label: "Published brands" },
    { value: social.filter((s) => s.published).length, label: "Social links" },
    { value: leads.filter((l) => !l.read).length, label: "New enquiries" },
  ];

  const recent = [...leads]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Dashboard</h1>
          <p>Content for the LoopWings site is stored as JSON files in the project.</p>
        </div>
      </div>

      <div className="adm-stats">
        {stats.map((stat) => (
          <div className="adm-stat" key={stat.label}>
            <b>{stat.value}</b>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="adm-card">
        <h2>Manage content</h2>
        <div className="adm-actions" style={{ marginTop: 14 }}>
          <Link className="adm-btn primary" href="/admin/testimonials">
            Testimonials
          </Link>
          <Link className="adm-btn primary" href="/admin/brands">
            Brands
          </Link>
          <Link className="adm-btn primary" href="/admin/social">
            Social media
          </Link>
          <Link className="adm-btn" href="/admin/leads">
            Enquiries
          </Link>
          <Link className="adm-btn" href="/testimonials" target="_blank">
            Preview testimonials page ↗
          </Link>
        </div>
      </div>

      <div className="adm-card">
        <h2>Latest enquiries</h2>
        {recent.length ? (
          <div style={{ marginTop: 12 }}>
            {recent.map((lead) => (
              <p className="adm-meta" key={lead.id} style={{ marginBottom: 8 }}>
                <strong style={{ color: "var(--ink)" }}>{lead.name}</strong> — {lead.agency}
                {lead.city ? ` · ${lead.city}` : ""}
                {!lead.read && <span className="adm-pill on" style={{ marginLeft: 8 }}>New</span>}
              </p>
            ))}
            <Link className="adm-btn" href="/admin/leads" style={{ marginTop: 8, display: "inline-block" }}>
              View all
            </Link>
          </div>
        ) : (
          <p className="adm-meta" style={{ marginTop: 10 }}>
            No enquiries yet.
          </p>
        )}
      </div>
    </>
  );
}
