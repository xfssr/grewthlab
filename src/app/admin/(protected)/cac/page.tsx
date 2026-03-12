"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { AdminForm } from "@/components/AdminForm";
import type { AcquisitionChannel } from "@/core/site.types";

type CacEntry = {
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

type MetricsRow = {
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

type MetricsTotals = {
  leads: number;
  spendIls: number;
  dealsWon: number;
  revenueIls: number;
  cpl: number | null;
  cac: number | null;
  closeRate: number | null;
  roasLike: number | null;
};

type CacMetricsResponse = {
  month: string;
  rows: MetricsRow[];
  totals: MetricsTotals;
};

const channelOptions: Array<{ id: AcquisitionChannel; label: string }> = [
  { id: "outbound_instagram_whatsapp", label: "Outbound Instagram/WhatsApp" },
  { id: "partnerships", label: "Partnerships" },
  { id: "marketplaces_fiverr_upwork", label: "Marketplaces (Fiverr/Upwork)" },
  { id: "experts_wix_squarespace", label: "Experts (Wix/Squarespace)" },
  { id: "paid_ads", label: "Paid ads" },
  { id: "other", label: "Other" },
];

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function formatIls(value: number | null): string {
  if (value === null || Number.isNaN(value)) {
    return "-";
  }
  return `\u20AA${Math.round(value).toLocaleString("en-US")}`;
}

function formatPct(value: number | null): string {
  if (value === null || Number.isNaN(value)) {
    return "-";
  }
  return `${(value * 100).toFixed(1)}%`;
}

function channelLabel(channel: AcquisitionChannel): string {
  return channelOptions.find((option) => option.id === channel)?.label || channel;
}

export default function AdminCacPage() {
  const [month, setMonth] = useState(currentMonth);
  const [entries, setEntries] = useState<CacEntry[]>([]);
  const [metrics, setMetrics] = useState<CacMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [message, setMessage] = useState("");
  const [draft, setDraft] = useState({
    month: currentMonth(),
    channel: "outbound_instagram_whatsapp" as AcquisitionChannel,
    spendIls: "",
    dealsWon: "",
    revenueIls: "",
    notes: "",
  });

  async function refresh(targetMonth: string) {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`/api/cac?month=${encodeURIComponent(targetMonth)}`, { cache: "no-store" });
      const payload = (await response.json()) as {
        entries?: CacEntry[];
        metrics?: CacMetricsResponse;
        error?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error || "Failed to load CAC data.");
      }

      setEntries(payload.entries || []);
      setMetrics(payload.metrics || null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load CAC data.");
      setEntries([]);
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh(month);
  }, [month]);

  const monthEntries = useMemo(() => entries.filter((entry) => entry.month === month), [entries, month]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/cac", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          month: draft.month,
          channel: draft.channel,
          spendIls: Number(draft.spendIls || 0),
          dealsWon: Number(draft.dealsWon || 0),
          revenueIls: Number(draft.revenueIls || 0),
          notes: draft.notes || undefined,
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || "Failed to save CAC entry.");
      }

      setMessage("CAC entry saved.");
      setMonth(draft.month);
      await refresh(draft.month);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save CAC entry.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setMessage("");

    try {
      const response = await fetch(`/api/cac?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || "Failed to delete entry.");
      }
      setMessage("CAC entry deleted.");
      await refresh(month);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to delete entry.");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">CAC</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Monthly spend and deals by acquisition channel, with lead aggregation and efficiency metrics.
        </p>
      </header>

      <AdminForm title="Month Filter" description="Change month to review aggregated leads and CAC by channel.">
        <label className="block max-w-[240px]">
          <span className="mb-2 block text-sm text-zinc-300">Month (YYYY-MM)</span>
          <input
            type="month"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
            className="w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
          />
        </label>
      </AdminForm>

      <AdminForm title="Add Monthly Channel Input" description="Manual inputs for spend, won deals, and revenue.">
        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm text-zinc-300">Month</span>
            <input
              type="month"
              value={draft.month}
              onChange={(event) => setDraft((prev) => ({ ...prev, month: event.target.value }))}
              className="w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-zinc-300">Channel</span>
            <select
              value={draft.channel}
              onChange={(event) => setDraft((prev) => ({ ...prev, channel: event.target.value as AcquisitionChannel }))}
              className="w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
            >
              {channelOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-zinc-300">Spend (ILS)</span>
            <input
              type="number"
              min={0}
              value={draft.spendIls}
              onChange={(event) => setDraft((prev) => ({ ...prev, spendIls: event.target.value }))}
              className="w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-zinc-300">Deals won</span>
            <input
              type="number"
              min={0}
              value={draft.dealsWon}
              onChange={(event) => setDraft((prev) => ({ ...prev, dealsWon: event.target.value }))}
              className="w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-zinc-300">Revenue (ILS)</span>
            <input
              type="number"
              min={0}
              value={draft.revenueIls}
              onChange={(event) => setDraft((prev) => ({ ...prev, revenueIls: event.target.value }))}
              className="w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-1 block text-sm text-zinc-300">Notes</span>
            <textarea
              rows={2}
              value={draft.notes}
              onChange={(event) => setDraft((prev) => ({ ...prev, notes: event.target.value }))}
              className="w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="md:col-span-2 rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save monthly input"}
          </button>
        </form>
      </AdminForm>

      <AdminForm title="Computed CAC Metrics" description="Auto lead aggregation + channel metrics for selected month.">
        {loading ? (
          <p className="text-sm text-zinc-400">Loading metrics...</p>
        ) : metrics && metrics.rows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-zinc-400">
                  <th className="px-2 py-2">Channel</th>
                  <th className="px-2 py-2">Leads</th>
                  <th className="px-2 py-2">Spend</th>
                  <th className="px-2 py-2">Deals</th>
                  <th className="px-2 py-2">Revenue</th>
                  <th className="px-2 py-2">CPL</th>
                  <th className="px-2 py-2">CAC</th>
                  <th className="px-2 py-2">Close rate</th>
                  <th className="px-2 py-2">ROAS-like</th>
                </tr>
              </thead>
              <tbody>
                {metrics.rows.map((row) => (
                  <tr key={row.channel} className="border-b border-white/5 text-zinc-200">
                    <td className="px-2 py-2">{channelLabel(row.channel)}</td>
                    <td className="px-2 py-2">{row.leads}</td>
                    <td className="px-2 py-2">{formatIls(row.spendIls)}</td>
                    <td className="px-2 py-2">{row.dealsWon}</td>
                    <td className="px-2 py-2">{formatIls(row.revenueIls)}</td>
                    <td className="px-2 py-2">{formatIls(row.cpl)}</td>
                    <td className="px-2 py-2">{formatIls(row.cac)}</td>
                    <td className="px-2 py-2">{formatPct(row.closeRate)}</td>
                    <td className="px-2 py-2">{row.roasLike === null ? "-" : row.roasLike.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="font-semibold text-zinc-100">
                  <td className="px-2 py-2">Total</td>
                  <td className="px-2 py-2">{metrics.totals.leads}</td>
                  <td className="px-2 py-2">{formatIls(metrics.totals.spendIls)}</td>
                  <td className="px-2 py-2">{metrics.totals.dealsWon}</td>
                  <td className="px-2 py-2">{formatIls(metrics.totals.revenueIls)}</td>
                  <td className="px-2 py-2">{formatIls(metrics.totals.cpl)}</td>
                  <td className="px-2 py-2">{formatIls(metrics.totals.cac)}</td>
                  <td className="px-2 py-2">{formatPct(metrics.totals.closeRate)}</td>
                  <td className="px-2 py-2">{metrics.totals.roasLike === null ? "-" : metrics.totals.roasLike.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-zinc-400">No CAC metrics yet for this month.</p>
        )}
      </AdminForm>

      <AdminForm title="Saved Monthly Inputs" description="Manual CAC entries stored for all channels.">
        <div className="space-y-3">
          {monthEntries.length > 0 ? (
            monthEntries.map((entry) => (
              <article key={entry.id} className="rounded-md border border-white/10 p-3 text-sm">
                <p className="font-medium text-zinc-100">
                  {entry.month} | {channelLabel(entry.channel)}
                </p>
                <p className="mt-1 text-zinc-300">
                  Spend: {formatIls(entry.spendIls)} | Deals: {entry.dealsWon} | Revenue: {formatIls(entry.revenueIls)}
                </p>
                {entry.notes ? <p className="mt-1 text-zinc-400">{entry.notes}</p> : null}
                <button
                  type="button"
                  onClick={() => void handleDelete(entry.id)}
                  disabled={deletingId === entry.id}
                  className="mt-2 rounded-md border border-rose-300/40 px-3 py-1 text-xs text-rose-200 hover:border-rose-300/60 disabled:opacity-60"
                >
                  {deletingId === entry.id ? "Deleting..." : "Delete"}
                </button>
              </article>
            ))
          ) : (
            <p className="text-sm text-zinc-400">No saved entries for {month}.</p>
          )}
        </div>
      </AdminForm>

      {message ? <p className="text-sm text-zinc-300">{message}</p> : null}
    </div>
  );
}
