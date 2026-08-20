"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PLATFORM_LABELS } from "@/components/SocialLinks";
import type { SocialLink, SocialPlatform } from "@/lib/types";

type Draft = Omit<SocialLink, "id" | "createdAt">;

const BLANK: Draft = {
  platform: "instagram",
  url: "",
  label: "",
  order: 0,
  published: true,
};

const PLACEHOLDERS: Record<SocialPlatform, string> = {
  instagram: "https://instagram.com/yourhandle",
  facebook: "https://facebook.com/yourpage",
  linkedin: "https://linkedin.com/company/yourcompany",
  youtube: "https://youtube.com/@yourchannel",
  x: "https://x.com/yourhandle",
  whatsapp: "+91 90000 00000",
  email: "hello@yourdomain.com",
  website: "https://yourdomain.com",
};

const HINTS: Partial<Record<SocialPlatform, string>> = {
  whatsapp: "A phone number is fine — it becomes a wa.me chat link.",
  email: "Just the address — the mailto: prefix is added for you.",
};

function toDraft(item: SocialLink): Draft {
  const { id: _id, createdAt: _createdAt, ...rest } = item;
  return rest;
}

export default function SocialManager({ initial }: { initial: SocialLink[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function startCreate() {
    setEditingId("new");
    setDraft({ ...BLANK, order: items.length + 1 });
    setError("");
  }

  function startEdit(item: SocialLink) {
    setEditingId(item.id);
    setDraft(toDraft(item));
    setError("");
  }

  function cancel() {
    setEditingId(null);
    setDraft(null);
    setError("");
  }

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }

  async function refresh() {
    const res = await fetch("/api/social");
    if (res.ok) setItems(await res.json());
    router.refresh();
  }

  async function save() {
    if (!draft) return;
    setBusy(true);
    setError("");
    try {
      const creating = editingId === "new";
      const res = await fetch(creating ? "/api/social" : `/api/social/${editingId}`, {
        method: creating ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Could not save");
      await refresh();
      cancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  async function remove(item: SocialLink) {
    if (!confirm(`Remove the ${PLATFORM_LABELS[item.platform]} link?`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/social/${item.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not delete");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete");
    } finally {
      setBusy(false);
    }
  }

  async function togglePublished(item: SocialLink) {
    setBusy(true);
    try {
      await fetch(`/api/social/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...toDraft(item), published: !item.published }),
      });
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  const editor = draft && (
    <div className="adm-card">
      <h2>{editingId === "new" ? "New social link" : "Edit social link"}</h2>
      <div className="adm-form" style={{ marginTop: 16 }}>
        <div className="adm-field">
          <label htmlFor="platform">Platform</label>
          <select
            id="platform"
            value={draft.platform}
            onChange={(e) => set("platform", e.target.value as SocialPlatform)}
          >
            {(Object.keys(PLATFORM_LABELS) as SocialPlatform[]).map((p) => (
              <option key={p} value={p}>
                {PLATFORM_LABELS[p]}
              </option>
            ))}
          </select>
        </div>
        <div className="adm-field">
          <label htmlFor="order">Order</label>
          <input
            id="order"
            type="number"
            value={draft.order}
            onChange={(e) => set("order", Number(e.target.value))}
          />
          <span className="adm-hint">Lower numbers appear first.</span>
        </div>

        <div className="adm-field wide">
          <label htmlFor="url">
            {draft.platform === "whatsapp"
              ? "Number or link"
              : draft.platform === "email"
                ? "Email address"
                : "Profile URL"}
          </label>
          <input
            id="url"
            type="text"
            value={draft.url}
            onChange={(e) => set("url", e.target.value)}
            placeholder={PLACEHOLDERS[draft.platform]}
          />
          <span className="adm-hint">
            {HINTS[draft.platform] ?? "Paste the full link to your profile."}
          </span>
        </div>

        <div className="adm-field wide">
          <label htmlFor="label">Label (optional)</label>
          <input
            id="label"
            type="text"
            value={draft.label}
            onChange={(e) => set("label", e.target.value)}
            placeholder={`@loopwings — defaults to "${PLATFORM_LABELS[draft.platform]}"`}
          />
          <span className="adm-hint">
            Used as the accessible name and tooltip for the icon.
          </span>
        </div>

        <div className="adm-field wide">
          <label className="adm-check">
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(e) => set("published", e.target.checked)}
            />
            Published
          </label>
        </div>

        {error && <p className="adm-error wide">{error}</p>}

        <div className="adm-actions wide">
          <button className="adm-btn primary" type="button" onClick={save} disabled={busy}>
            {busy ? "Saving…" : "Save"}
          </button>
          <button className="adm-btn" type="button" onClick={cancel} disabled={busy}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Social media</h1>
          <p>The icons shown in the strip above the footer on every page.</p>
        </div>
        <button className="adm-btn primary" type="button" onClick={startCreate}>
          + Add link
        </button>
      </div>

      {editingId === "new" && editor}

      {items.length === 0 && !draft && (
        <div className="adm-empty">
          No social links yet. Add one and it appears above the footer straight away.
        </div>
      )}

      {items.map((item) =>
        editingId === item.id ? (
          <div key={item.id}>{editor}</div>
        ) : (
          <div className="adm-card" key={item.id}>
            <div className="adm-row">
              <div className="adm-row-main">
                <div>
                  <span className={`adm-pill ${item.published ? "on" : "off"}`}>
                    {item.published ? "Published" : "Draft"}
                  </span>
                  <span className="adm-pill">{PLATFORM_LABELS[item.platform]}</span>
                </div>
                <p className="adm-meta" style={{ marginTop: 8 }}>
                  <strong style={{ fontSize: 15, color: "var(--ink)" }}>
                    {item.label || PLATFORM_LABELS[item.platform]}
                  </strong>
                </p>
                <p className="adm-meta">{item.url}</p>
              </div>
              <div className="adm-actions">
                <button className="adm-btn" type="button" onClick={() => startEdit(item)}>
                  Edit
                </button>
                <button
                  className="adm-btn"
                  type="button"
                  onClick={() => togglePublished(item)}
                  disabled={busy}
                >
                  {item.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  className="adm-btn danger"
                  type="button"
                  onClick={() => remove(item)}
                  disabled={busy}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ),
      )}
    </>
  );
}
