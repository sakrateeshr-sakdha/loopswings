import "server-only";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import type { Brand, Lead, SocialLink, Testimonial } from "./types";

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

export async function readAll<N extends Name>(name: N): Promise<Collections[N][]> {
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
  await fs.mkdir(DATA_DIR, { recursive: true });
  // Written in place rather than via a temp file + rename: creating and removing
  // files inside the project makes the Next dev server rescan its route manifest,
  // which intermittently drops dynamic API routes until a restart. Writes are
  // serialized through `mutate`, so there is never more than one in flight.
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
  // Keep the queue alive even if this mutation rejected.
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
