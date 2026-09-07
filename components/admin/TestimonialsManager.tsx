"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "./ImageUpload";
import { useToast } from "./ToastContext";
import type { Testimonial } from "@/lib/types";

type Draft = Omit<Testimonial, "id" | "createdAt">;

const BLANK: Draft = {
  type: "written",
  quote: "",
  author: "",
  role: "Founder",
  company: "",
  location: "",
  avatar: "",
  videoUrl: "",
  orientation: "landscape",
  featured: false,
  order: 0,
  published: true,
};

function toDraft(item: Testimonial): Draft {
  const { id: _id, createdAt: _createdAt, ...rest } = item;
  return rest;
}

export default function TestimonialsManager({ initial }: { initial: Testimonial[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [items, setItems] = useState(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setItems(initial);
  }, [initial]);

  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "unpublished">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "written" | "video">("all");

  const filteredItems = items.filter((item) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && item.published) ||
      (statusFilter === "unpublished" && !item.published);
    const matchesType =
      typeFilter === "all" || item.type === typeFilter;
    return matchesStatus && matchesType;
  });

  function startCreate() {
    setEditingId("new");
    setDraft({ ...BLANK, order: items.length + 1 });
    setError("");
  }

  function startEdit(item: Testimonial) {
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
    try {
      const res = await fetch(`/api/testimonials?t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) setItems(await res.json());
      router.refresh();
    } catch {
      router.refresh();
    }
  }

  async function save() {
    if (!draft) return;
    setBusy(true);
    setError("");
    try {
      const creating = editingId === "new";
      const res = await fetch(
        creating ? "/api/testimonials" : `/api/testimonials/${editingId}`,
        {
          method: creating ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        },
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Could not save");
      toast.success(creating ? "Testimonial created successfully" : "Testimonial updated successfully");
      await refresh();
      cancel();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not save";
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  async function remove(item: Testimonial) {
    if (!confirm(`Delete the testimonial from ${item.author}? This cannot be undone.`)) return;
    setBusy(true);
    setError("");

    // Optimistically update list so the item is removed immediately
    const prevItems = items;
    setItems((prev) => prev.filter((i) => i.id !== item.id));

    try {
      const res = await fetch(`/api/testimonials/${encodeURIComponent(item.id)}`, {
        method: "DELETE",
        headers: { "Cache-Control": "no-cache" },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Could not delete");
      }
      toast.success(`Testimonial from ${item.author} deleted successfully`);
      await refresh();
    } catch (err) {
      // Revert if delete failed
      setItems(prevItems);
      const msg = err instanceof Error ? err.message : "Could not delete";
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  async function togglePublished(item: Testimonial) {
    setBusy(true);
    try {
      const nextPublished = !item.published;
      const res = await fetch(`/api/testimonials/${encodeURIComponent(item.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...toDraft(item), published: nextPublished }),
      });
      if (!res.ok) throw new Error("Could not update status");
      toast.success(nextPublished ? "Testimonial published" : "Testimonial unpublished");
      await refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not update status";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  const editor = draft && (
    <div className="adm-card">
      <h2>{editingId === "new" ? "New testimonial" : "Edit testimonial"}</h2>
      <div className="adm-form" style={{ marginTop: 16 }}>
        <div className="adm-field">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            value={draft.type}
            onChange={(e) => set("type", e.target.value as Draft["type"])}
          >
            <option value="written">Written</option>
            <option value="video">Video</option>
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

        <div className="adm-field">
          <label htmlFor="author">Name</label>
          <input
            id="author"
            type="text"
            value={draft.author}
            onChange={(e) => set("author", e.target.value)}
          />
        </div>
        <div className="adm-field">
          <label htmlFor="role">Role</label>
          <input
            id="role"
            type="text"
            value={draft.role}
            onChange={(e) => set("role", e.target.value)}
            placeholder="Founder &amp; CEO"
          />
        </div>
        <div className="adm-field">
          <label htmlFor="company">Agency</label>
          <input
            id="company"
            type="text"
            value={draft.company}
            onChange={(e) => set("company", e.target.value)}
          />
        </div>
        <div className="adm-field">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            value={draft.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="Kerala"
          />
        </div>

        {draft.type === "written" ? (
          <div className="adm-field wide">
            <label htmlFor="quote">Testimonial</label>
            <textarea
              id="quote"
              value={draft.quote}
              onChange={(e) => set("quote", e.target.value)}
              placeholder="What changed for them, in their own words."
            />
          </div>
        ) : (
          <>
            <div className="adm-field wide">
              <label htmlFor="videoUrl">Video URL</label>
              <input
                id="videoUrl"
                type="url"
                value={draft.videoUrl}
                onChange={(e) => set("videoUrl", e.target.value)}
                placeholder="https://www.youtube.com/watch?v=…"
              />
              <span className="adm-hint">
                YouTube, Vimeo or a direct .mp4 link. The video only loads when a visitor clicks
                play.
              </span>
            </div>
            <div className="adm-field">
              <label htmlFor="orientation">Video shape</label>
              <select
                id="orientation"
                value={draft.orientation}
                onChange={(e) => set("orientation", e.target.value as Draft["orientation"])}
              >
                <option value="landscape">Landscape (16:9)</option>
                <option value="portrait">Portrait (9:16 — reels, shorts)</option>
              </select>
              <span className="adm-hint">
                Match this to how the video was filmed so it isn&rsquo;t letterboxed.
              </span>
            </div>
          </>
        )}

        <ImageUpload
          label={draft.type === "video" ? "Video thumbnail" : "Photo (optional)"}
          value={draft.avatar}
          onChange={(url) => set("avatar", url)}
          hint="PNG, JPG, WEBP, GIF or SVG up to 4 MB."
        />

        <div className="adm-field">
          <label className="adm-check">
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(e) => set("published", e.target.checked)}
            />
            Published
          </label>
        </div>
        <div className="adm-field">
          <label className="adm-check">
            <input
              type="checkbox"
              checked={draft.featured}
              onChange={(e) => set("featured", e.target.checked)}
            />
            Feature on the landing page
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
          <h1>Testimonials</h1>
          <p>Written and video testimonials shown on the testimonials page.</p>
        </div>
        <button className="adm-btn primary" type="button" onClick={startCreate}>
          + Add testimonial
        </button>
      </div>

      <div className="adm-filters" style={{ display: "flex", gap: "24px", marginBottom: "20px", flexWrap: "wrap", borderBottom: "1.5px solid #eee", paddingBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "13px", fontWeight: 800, color: "#666" }}>Status:</span>
          <div className="adm-tabs">
            <button
              type="button"
              className={statusFilter === "all" ? "active" : ""}
              onClick={() => setStatusFilter("all")}
            >
              All
            </button>
            <button
              type="button"
              className={statusFilter === "published" ? "active" : ""}
              onClick={() => setStatusFilter("published")}
            >
              Published
            </button>
            <button
              type="button"
              className={statusFilter === "unpublished" ? "active" : ""}
              onClick={() => setStatusFilter("unpublished")}
            >
              Unpublished
            </button>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "13px", fontWeight: 800, color: "#666" }}>Type:</span>
          <div className="adm-tabs">
            <button
              type="button"
              className={typeFilter === "all" ? "active" : ""}
              onClick={() => setTypeFilter("all")}
            >
              All
            </button>
            <button
              type="button"
              className={typeFilter === "written" ? "active" : ""}
              onClick={() => setTypeFilter("written")}
            >
              Written
            </button>
            <button
              type="button"
              className={typeFilter === "video" ? "active" : ""}
              onClick={() => setTypeFilter("video")}
            >
              Video
            </button>
          </div>
        </div>
      </div>

      {error && !draft && (
        <div className="adm-card" style={{ borderColor: "#b3261e", background: "#fff5f5", marginBottom: 20 }}>
          <p className="adm-error" style={{ margin: 0 }}>{error}</p>
        </div>
      )}

      {editingId === "new" && editor}

      {items.length === 0 && !draft && (
        <div className="adm-empty">No testimonials yet. Add your first one.</div>
      )}

      {items.length > 0 && filteredItems.length === 0 && !draft && (
        <div className="adm-empty">No testimonials found matching the filter.</div>
      )}

      {filteredItems.map((item) =>
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
                  <span className="adm-pill">{item.type}</span>
                  {item.type === "video" && (
                    <span className="adm-pill">{item.orientation ?? "landscape"}</span>
                  )}
                  {item.featured && <span className="adm-pill on">Featured</span>}
                </div>
                <p className="adm-meta">
                  <strong>{item.author}</strong>
                  {[item.role, item.company, item.location].filter(Boolean).length > 0 && " — "}
                  {[item.role, item.company, item.location].filter(Boolean).join(" · ")}
                </p>
                {item.type === "written" ? (
                  <p className="adm-quote">&ldquo;{item.quote}&rdquo;</p>
                ) : (
                  <p className="adm-meta">{item.videoUrl || "No video URL set"}</p>
                )}
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
