import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

import type { LeadRecord } from "@/core/site.types";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : [],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

type LeadStore = {
  items: LeadRecord[];
};

const runtimeDir = path.join(process.cwd(), "data", "runtime");
const dbFilePath = path.join(runtimeDir, "leads.json");

let writeQueue: Promise<void> = Promise.resolve();

async function ensureStore(): Promise<void> {
  await mkdir(runtimeDir, { recursive: true });

  try {
    await readFile(dbFilePath, "utf8");
  } catch {
    const initial: LeadStore = { items: [] };
    await writeFile(dbFilePath, JSON.stringify(initial, null, 2), "utf8");
  }
}

async function readStore(): Promise<LeadStore> {
  await ensureStore();
  const raw = await readFile(dbFilePath, "utf8");

  try {
    const parsed = JSON.parse(raw) as LeadStore;
    if (!Array.isArray(parsed.items)) {
      return { items: [] };
    }
    return parsed;
  } catch {
    return { items: [] };
  }
}

function withWriteLock<T>(operation: () => Promise<T>): Promise<T> {
  const nextTask = writeQueue.then(operation, operation);
  writeQueue = nextTask.then(
    () => undefined,
    () => undefined,
  );

  return nextTask;
}

export async function appendLead(record: LeadRecord): Promise<void> {
  await withWriteLock(async () => {
    const store = await readStore();
    store.items.unshift(record);
    await writeFile(dbFilePath, JSON.stringify(store, null, 2), "utf8");
  });
}

export async function listLeads(limit: number): Promise<LeadRecord[]> {
  const store = await readStore();
  return store.items.slice(0, limit);
}

export async function listAllLeads(): Promise<LeadRecord[]> {
  const store = await readStore();
  return store.items;
}
