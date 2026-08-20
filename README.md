# LoopWings

Marketing site for LoopWings (Meta Ads lead generation for travel agencies), built with
Next.js (App Router, TypeScript). Testimonials, brands and enquiries are stored as JSON
files and edited through a built-in admin CMS — no external database.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

### Environment

`.env.local` is created for local development. Before deploying, set both values:

```
ADMIN_PASSWORD=your-own-password
AUTH_SECRET=<random 32-byte hex string>
```

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Changing `AUTH_SECRET` signs everyone out.

### SEO

Set your real domain before deploying — canonical tags, Open Graph image URLs,
`robots.txt` and `sitemap.xml` are all built from it:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Without it these fall back to `http://localhost:3000`, which would publish broken canonicals.

`/robots.txt` and `/sitemap.xml` are generated automatically from `app/robots.ts` and
`app/sitemap.ts`. `/admin` and `/login` are `noindex` and disallowed for crawlers.

The FAQ text lives in `lib/content.ts` and feeds both the visible accordion and the
FAQPage structured data, so the two can't drift apart. Edit it in one place.

### Email notifications

Enquiries are emailed via SMTP (nodemailer). Set these to turn it on:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@example.com
SMTP_PASS=your-smtp-password
SMTP_FROM_EMAIL=you@example.com
SMTP_FROM_NAME=LoopWings
ENQUIRY_TO_EMAIL=where-to-send@example.com   # optional
```

`ENQUIRY_TO_EMAIL` is where notifications land; it falls back to `SMTP_FROM_EMAIL`, then
`SMTP_USER`. Port 465 is treated as implicit TLS, anything else uses STARTTLS.

For Gmail you need an **App Password** (with 2-step verification enabled), not your normal
account password.

Sending is best effort by design: the enquiry is written to `data/leads.json` first, and a
mail failure is logged to the server console rather than shown to the visitor as a failed
submission. Nothing is lost if email breaks — every enquiry is still in `/admin/leads`.

To check the setup without emailing anyone, sign into the admin and open
`/api/mail/verify`. It connects and authenticates against the SMTP server and reports the
resolved recipient, but sends no message.

## Pages

| Route           | What it is                                                  |
| --------------- | ----------------------------------------------------------- |
| `/`             | Landing page. Pulls featured testimonials and the brand grid |
| `/testimonials` | Brand grid, written testimonials, video testimonials         |
| `/login`        | Admin sign in                                                |
| `/admin`        | CMS dashboard                                                |

## The CMS

Sign in at `/login`, then manage content from `/admin`:

- **Testimonials** — written and video. Each has a name, role, agency, location, optional
  photo, publish toggle and sort order. Written ones can be marked **Featured**, which also
  shows them on the landing page. Video testimonials take a YouTube, Vimeo or direct `.mp4`
  URL and only load the player after a visitor clicks play. Each video also has a
  **Video shape** setting — *Landscape (16:9)* or *Portrait (9:16)* for reels and shorts —
  so vertical videos aren't letterboxed into a wide box.
- **Brands** — the agency logo grid. Upload a logo (transparent PNG or SVG works best); an
  agency without a logo falls back to its name as a text tile.
- **Social media** — the icon strip shown above the footer on every page. Pick a platform,
  paste a link, set the order. WhatsApp accepts a plain phone number and email a plain
  address; both are turned into working links on save. The strip disappears entirely when
  nothing is published, and the profile URLs also feed the `sameAs` field of the site's
  Organization schema, which helps search and AI engines connect the accounts to the brand.
- **Enquiries** — everything submitted through the enquiry forms, with read/unread and delete.
  Each one also arrives by email when SMTP is configured. Email addresses are click-to-mail
  and WhatsApp numbers link straight to a chat.

Unpublished items disappear from the public site immediately but stay editable in the admin.

Both testimonial rows show two cards per view on desktop and one on mobile. Past that they
turn into a horizontal rail — scroll, swipe or drag sideways for the rest — so adding more
testimonials never stretches the page vertically.

## Data

JSON files under `data/`:

- `data/testimonials.json`
- `data/brands.json`
- `data/leads.json`
- `data/social.json`

Uploaded images go to `public/uploads/` and are served from `/uploads/<file>`.

Notes:

- Writes are serialized per file, so two saves at once can't overwrite each other.
- Pages that read this data are rendered on demand (`dynamic = "force-dynamic"`), so edits
  appear on the site right away.
- `data/` is committed; `public/uploads/` is gitignored apart from `.gitkeep`. Back up both.

## Deploying

`data/` and `public/uploads/` must be a **persistent, writable disk**. This rules out
read-only or ephemeral filesystems — on Vercel's serverless runtime, for example, writes do
not survive between invocations, so the CMS would appear to save and then lose the change.
A VPS, a container with a mounted volume, Railway, Render or Fly.io with a persistent
volume all work.

```bash
npm run build
npm start
```

### Build output

Next.js has no `build/` or `dist/` folder — the compiled app is written to a dot-folder,
which editors often hide because it's gitignored:

| Command | Output folder |
| --- | --- |
| `npm run dev` | `.next` |
| `npm run build` / `npm start` | `.next-build` |

They are deliberately separate. Both default to `.next`, and building while the dev server
is running used to leave one process reading chunks the other had just replaced — which
shows up as `Cannot find module './996.js'` or a page rendered with no CSS. With separate
folders the two can run side by side safely. `scripts/next-prod.mjs` sets `NEXT_DIST_DIR`
for the production commands; `next.config.mjs` reads it.

If you ever do see that error, delete both folders and start again:

```bash
rm -rf .next .next-build
```

Deploying needs `.next-build` plus `package.json`, `node_modules`, `public/` and `data/` —
`.next-build` alone is not runnable. For a single self-contained folder, add
`output: "standalone"` to `next.config.mjs`.

## Content that still needs replacing

The two seeded testimonials for Abdul Ali TP are **placeholders and start unpublished**, so
nothing fake shows on the live site. Replace the text with the real testimonial, add the
video URL, then publish them from `/admin/testimonials`.
