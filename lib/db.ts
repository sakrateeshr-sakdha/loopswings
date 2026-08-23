import "server-only";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { Pool } from "pg";
import type { Brand, Lead, SocialLink, Testimonial } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

type Collections = {
  brands: Brand;
  testimonials: Testimonial;
  leads: Lead;
  social: SocialLink;
};

type Name = keyof Collections;

// Serialise writes to prevent concurrent mutation conflicts
const writeQueue = new Map<Name, Promise<unknown>>();

// Initialize Postgres connection pool if environment variables are set
let pool: Pool | null = null;
const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (dbUrl) {
  pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  // Create tables asynchronously
  ensureTables().catch((err) => {
    console.error("Failed to initialize database tables:", err);
  });
}

function fileFor(name: Name) {
  return path.join(DATA_DIR, `${name}.json`);
}

async function ensureTables() {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      quote TEXT,
      author TEXT NOT NULL,
      role TEXT,
      company TEXT,
      location TEXT,
      avatar TEXT,
      videourl TEXT,
      orientation TEXT,
      featured BOOLEAN DEFAULT FALSE,
      "order" INTEGER DEFAULT 0,
      published BOOLEAN DEFAULT TRUE,
      createdat TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS brands (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      logo TEXT NOT NULL,
      website TEXT NOT NULL,
      "order" INTEGER DEFAULT 0,
      published BOOLEAN DEFAULT TRUE,
      createdat TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      agency TEXT NOT NULL,
      city TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      adsstatus TEXT NOT NULL,
      message TEXT,
      createdat TEXT NOT NULL,
      read BOOLEAN DEFAULT FALSE
    );

    CREATE TABLE IF NOT EXISTS social (
      id TEXT PRIMARY KEY,
      platform TEXT NOT NULL,
      url TEXT NOT NULL,
      label TEXT,
      "order" INTEGER DEFAULT 0,
      published BOOLEAN DEFAULT TRUE,
      createdat TEXT NOT NULL
    );
  `);
}

function mapRow<N extends Name>(name: N, row: any): Collections[N] {
  if (name === "brands") {
    return {
      id: row.id,
      name: row.name,
      location: row.location || "",
      logo: row.logo || "",
      website: row.website || "",
      order: Number(row.order ?? 0),
      published: Boolean(row.published),
      createdAt: row.createdat,
    } as any;
  }
  if (name === "testimonials") {
    return {
      id: row.id,
      type: row.type,
      quote: row.quote || "",
      author: row.author,
      role: row.role || "",
      company: row.company || "",
      location: row.location || "",
      avatar: row.avatar || "",
      videoUrl: row.videourl || "",
      orientation: row.orientation || "landscape",
      featured: Boolean(row.featured),
      order: Number(row.order ?? 0),
      published: Boolean(row.published),
      createdAt: row.createdat,
    } as any;
  }
  if (name === "leads") {
    return {
      id: row.id,
      name: row.name,
      agency: row.agency,
      city: row.city || "",
      email: row.email,
      phone: row.phone,
      adsStatus: row.adsstatus || "",
      message: row.message || "",
      createdAt: row.createdat,
      read: Boolean(row.read),
    } as any;
  }
  // social
  return {
    id: row.id,
    platform: row.platform,
    url: row.url,
    label: row.label || "",
    order: Number(row.order ?? 0),
    published: Boolean(row.published),
    createdAt: row.createdat,
  } as any;
}

export async function readAll<N extends Name>(name: N): Promise<Collections[N][]> {
  if (pool) {
    const res = await pool.query(`SELECT * FROM "${name}"`);
    return res.rows.map((row) => mapRow(name, row));
  }

  try {
    const raw = await fs.readFile(fileFor(name), "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Collections[N][]) : [];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeAll<N extends Name>(name: N, rows: Collections[N][]) {
  if (pool) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(`DELETE FROM "${name}"`);

      if (name === "brands") {
        const q = `INSERT INTO brands (id, name, location, logo, website, "order", published, createdat) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
        for (const r of rows as Brand[]) {
          await client.query(q, [r.id, r.name, r.location, r.logo, r.website, r.order, r.published, r.createdAt]);
        }
      } else if (name === "testimonials") {
        const q = `INSERT INTO testimonials (id, type, quote, author, role, company, location, avatar, videourl, orientation, featured, "order", published, createdat) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`;
        for (const r of rows as Testimonial[]) {
          await client.query(q, [r.id, r.type, r.quote, r.author, r.role, r.company, r.location, r.avatar, r.videoUrl, r.orientation, r.featured, r.order, r.published, r.createdAt]);
        }
      } else if (name === "leads") {
        const q = `INSERT INTO leads (id, name, agency, city, email, phone, adsstatus, message, createdat, read) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
        for (const r of rows as Lead[]) {
          await client.query(q, [r.id, r.name, r.agency, r.city, r.email, r.phone, r.adsStatus, r.message, r.createdAt, r.read]);
        }
      } else if (name === "social") {
        const q = `INSERT INTO social (id, platform, url, label, "order", published, createdat) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
        for (const r of rows as SocialLink[]) {
          await client.query(q, [r.id, r.platform, r.url, r.label, r.order, r.published, r.createdAt]);
        }
      }
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
    return;
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(fileFor(name), JSON.stringify(rows, null, 2), "utf8");
}

/** Read-modify-write, serialized against other mutations of the same file/table. */
export function mutate<N extends Name, R>(
  name: N,
  fn: (rows: Collections[N][]) => R | Promise<R>,
): Promise<R> {
  const run = async (): Promise<R> => {
    const rows = await readAll(name);
    const result = await fn(rows);
    await writeAll(name, rows);
    return result;
  };
  const chained = (writeQueue.get(name) ?? Promise.resolve()).then(run, run);
  writeQueue.set(name, chained.catch(() => undefined));
  return chained;
}

export function newId(prefix: string) {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
}

export function sortByOrder<T extends { order: number; createdAt: string }>(rows: T[]) {
  return [...rows].sort(
    (a, b) => a.order - b.order || a.createdAt.localeCompare(b.createdAt),
  );
}

export async function getPublishedSocial() {
  return sortByOrder((await readAll("social")).filter((s) => s.published && s.url));
}

export async function getPublishedBrands() {
  return sortByOrder((await readAll("brands")).filter((b) => b.published));
}

export async function getPublishedTestimonials(type?: Testimonial["type"]) {
  const rows = (await readAll("testimonials")).filter(
    (t) => t.published && (!type || t.type === type),
  );
  return sortByOrder(rows);
}
