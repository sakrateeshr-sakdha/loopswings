import "server-only";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { put, list } from "@vercel/blob";
import type { Brand, Lead, SocialLink, Testimonial } from "./types";

// Static JSON imports to ensure Next.js bundles the seed data in serverless environments
import testimonialsSeed from "../data/testimonials.json";
import brandsSeed from "../data/brands.json";
import socialSeed from "../data/social.json";

const leadsSeed: any[] = [];

const DATA_DIR = path.join(process.cwd(), "data");

type Collections = {
  brands: Brand;
  testimonials: Testimonial;
  leads: Lead;
  social: SocialLink;
};

type Name = keyof Collections;

/**
 * Writes are serialized per collection so two concurrent admin saves can't
 * interleave a read-modify-write and drop one of the changes.
 */
const writeQueue = new Map<Name, Promise<unknown>>();

function fileFor(name: Name) {
  return path.join(DATA_DIR, `${name}.json`);
}

function getSeedData<N extends Name>(name: N): Collections[N][] {
  if (name === "brands") return brandsSeed as any;
  if (name === "testimonials") return testimonialsSeed as any;
  if (name === "leads") return leadsSeed as any;
  return socialSeed as any;
}

export async function readAll<N extends Name>(name: N): Promise<Collections[N][]> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (token) {
    try {
      const prefix = `data/${name}.json`;
      const { blobs } = await list({ prefix, token });
      const exactMatch = blobs.find((b) => b.pathname === prefix);
      if (exactMatch) {
        const res = await fetch(exactMatch.url, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          return Array.isArray(data) ? (data as Collections[N][]) : [];
        }
      }

      // If no blob exists in the cloud store yet, upload seed file using static imports
      console.log(`Blob ${prefix} not found. Uploading seed file.`);
      const rows = getSeedData(name);

      await put(prefix, JSON.stringify(rows, null, 2), {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        token,
      });

      return rows;
    } catch (err) {
      console.error(`Error reading ${name}.json from Vercel Blob:`, err);
    }
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
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (token) {
    try {
      await put(`data/${name}.json`, JSON.stringify(rows, null, 2), {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        token,
      });
      return;
    } catch (err) {
      console.error(`Error writing ${name}.json to Vercel Blob:`, err);
      throw err;
    }
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(fileFor(name), JSON.stringify(rows, null, 2), "utf8");
}

/** Read-modify-write, serialized against other mutations of the same file. */
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
