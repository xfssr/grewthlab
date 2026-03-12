import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { AcquisitionChannel, LeadRecord } from "@/core/site.types";

export type CacEntry = {
  id: string;
  month: string;
  channel: AcquisitionChannel;
  spendIls: number;
  dealsWon: number;
  revenueIls: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

type CacStore = {
  entries: CacEntry[];
};

const runtimeDir = path.join(process.cwd(), "data", "runtime");
const cacFilePath = path.join(runtimeDir, "cac.json");

let writeQueue: Promise<void> = Promise.resolve();

function withWriteLock<T>(operation: () => Promise<T>): Promise<T> {
  const nextTask = writeQueue.then(operation, operation);
  writeQueue = nextTask.then(
    () => undefined,
    () => undefined,
  );

  return nextTask;
}

async function ensureStore(): Promise<void> {
  await mkdir(runtimeDir, { recursive: true });

  try {
    await readFile(cacFilePath, "utf8");
  } catch {
    const initial: CacStore = { entries: [] };
    await writeFile(cacFilePath, JSON.stringify(initial, null, 2), "utf8");
  }
}

async function readStore(): Promise<CacStore> {
  await ensureStore();
  const raw = await readFile(cacFilePath, "utf8");

  try {
    const parsed = JSON.parse(raw) as CacStore;
    if (!Array.isArray(parsed.entries)) {
      return { entries: [] };
    }
    return parsed;
  } catch {
    return { entries: [] };
  }
}

export async function listCacEntries(): Promise<CacEntry[]> {
  const store = await readStore();
  return [...store.entries].sort((a, b) => (a.month < b.month ? 1 : -1));
}

export async function upsertCacEntry(
  input: Omit<CacEntry, "id" | "createdAt" | "updatedAt"> & { id?: string },
): Promise<CacEntry> {
  return withWriteLock(async () => {
    const store = await readStore();
    const now = new Date().toISOString();

    const normalized = {
      ...input,
      spendIls: Math.max(0, Math.round(input.spendIls)),
      dealsWon: Math.max(0, Math.round(input.dealsWon)),
      revenueIls: Math.max(0, Math.round(input.revenueIls)),
      notes: input.notes?.trim() || undefined,
    };

    const existingIndex = normalized.id
      ? store.entries.findIndex((entry) => entry.id === normalized.id)
      : store.entries.findIndex((entry) => entry.month === normalized.month && entry.channel === normalized.channel);

    if (existingIndex >= 0) {
      const existing = store.entries[existingIndex];
      const updated: CacEntry = {
        ...existing,
        month: normalized.month,
        channel: normalized.channel,
        spendIls: normalized.spendIls,
        dealsWon: normalized.dealsWon,
        revenueIls: normalized.revenueIls,
        notes: normalized.notes,
        updatedAt: now,
      };
      store.entries[existingIndex] = updated;
      await writeFile(cacFilePath, JSON.stringify(store, null, 2), "utf8");
      return updated;
    }

    const created: CacEntry = {
      id: `cac_${normalized.month.replace("-", "")}_${normalized.channel}_${Math.random().toString(36).slice(2, 8)}`,
      month: normalized.month,
      channel: normalized.channel,
      spendIls: normalized.spendIls,
      dealsWon: normalized.dealsWon,
      revenueIls: normalized.revenueIls,
      notes: normalized.notes,
      createdAt: now,
      updatedAt: now,
    };
    store.entries.unshift(created);
    await writeFile(cacFilePath, JSON.stringify(store, null, 2), "utf8");
    return created;
  });
}

export async function deleteCacEntry(id: string): Promise<boolean> {
  return withWriteLock(async () => {
    const store = await readStore();
    const next = store.entries.filter((entry) => entry.id !== id);
    const changed = next.length !== store.entries.length;
    if (!changed) {
      return false;
    }
    await writeFile(cacFilePath, JSON.stringify({ entries: next }, null, 2), "utf8");
    return true;
  });
}

export type CacChannelMetrics = {
  channel: AcquisitionChannel;
  leads: number;
  spendIls: number;
  dealsWon: number;
  revenueIls: number;
  cpl: number | null;
  cac: number | null;
  closeRate: number | null;
  roasLike: number | null;
};

export function computeCacMetricsForMonth(month: string, entries: CacEntry[], leads: LeadRecord[]) {
  const monthlyEntries = entries.filter((entry) => entry.month === month);
  const monthlyLeads = leads.filter((lead) => lead.createdAt.slice(0, 7) === month);

  const channelSet = new Set<AcquisitionChannel>();
  for (const entry of monthlyEntries) {
    channelSet.add(entry.channel);
  }
  for (const lead of monthlyLeads) {
    channelSet.add(lead.acquisitionChannel || "other");
  }

  const rows: CacChannelMetrics[] = Array.from(channelSet.values()).map((channel) => {
    const leadCount = monthlyLeads.filter((lead) => (lead.acquisitionChannel || "other") === channel).length;
    const channelEntries = monthlyEntries.filter((entry) => entry.channel === channel);
    const spendIls = channelEntries.reduce((sum, entry) => sum + entry.spendIls, 0);
    const dealsWon = channelEntries.reduce((sum, entry) => sum + entry.dealsWon, 0);
    const revenueIls = channelEntries.reduce((sum, entry) => sum + entry.revenueIls, 0);

    return {
      channel,
      leads: leadCount,
      spendIls,
      dealsWon,
      revenueIls,
      cpl: leadCount > 0 ? spendIls / leadCount : null,
      cac: dealsWon > 0 ? spendIls / dealsWon : null,
      closeRate: leadCount > 0 ? dealsWon / leadCount : null,
      roasLike: spendIls > 0 ? revenueIls / spendIls : null,
    };
  });

  const totals = rows.reduce(
    (acc, row) => ({
      leads: acc.leads + row.leads,
      spendIls: acc.spendIls + row.spendIls,
      dealsWon: acc.dealsWon + row.dealsWon,
      revenueIls: acc.revenueIls + row.revenueIls,
    }),
    { leads: 0, spendIls: 0, dealsWon: 0, revenueIls: 0 },
  );

  return {
    month,
    rows,
    totals: {
      ...totals,
      cpl: totals.leads > 0 ? totals.spendIls / totals.leads : null,
      cac: totals.dealsWon > 0 ? totals.spendIls / totals.dealsWon : null,
      closeRate: totals.leads > 0 ? totals.dealsWon / totals.leads : null,
      roasLike: totals.spendIls > 0 ? totals.revenueIls / totals.spendIls : null,
    },
  };
}
