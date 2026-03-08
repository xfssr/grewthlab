"use client";

import { FormEvent, useEffect, useState } from "react";

import { AdminForm } from "@/components/AdminForm";

type SolutionItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  createdAt: string;
};

type PricingSettings = {
  discountPercent: number;
};

type CreateDraft = {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
};

const initialDraft: CreateDraft = {
  title: "",
  description: "",
  price: "",
  imageUrl: "",
};

export default function AdminSolutionsPage() {
  const [items, setItems] = useState<SolutionItem[]>([]);
  const [customItems, setCustomItems] = useState<SolutionItem[]>([]);
  const [draft, setDraft] = useState<CreateDraft>(initialDraft);
  const [discountPercent, setDiscountPercent] = useState("0");
  const [loading, setLoading] = useState(true);
  const [savingSlug, setSavingSlug] = useState("");
  const [uploadingTarget, setUploadingTarget] = useState("");
  const [savingDiscount, setSavingDiscount] = useState(false);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");

  async function refresh() {
    setLoading(true);

    try {
      const [solutionsResponse, settingsResponse] = await Promise.all([
        fetch("/api/solutions", { cache: "no-store" }),
        fetch("/api/pricing-settings", { cache: "no-store" }),
      ]);

      const solutionsPayload = (await solutionsResponse.json()) as {
        items?: SolutionItem[];
        customItems?: SolutionItem[];
        error?: string;
      };
      const settingsPayload = (await settingsResponse.json()) as { settings?: PricingSettings };

      setItems(solutionsPayload.items || []);
      setCustomItems(solutionsPayload.customItems || []);
      setDiscountPercent(String(settingsPayload.settings?.discountPercent ?? 0));

      if (solutionsPayload.error) {
        setMessage(solutionsPayload.error);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function uploadImage(target: string, file: File, mode: "existing" | "draft") {
    setUploadingTarget(target);
    setMessage("");

    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body });
      const payload = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !payload.url) {
        throw new Error(payload.error || "Upload failed.");
      }

      if (mode === "draft") {
        setDraft((prev) => ({ ...prev, imageUrl: payload.url || "" }));
      } else {
        setItems((prev) => prev.map((item) => (item.slug === target ? { ...item, imageUrl: payload.url || "" } : item)));
        setCustomItems((prev) => prev.map((item) => (item.slug === target ? { ...item, imageUrl: payload.url || "" } : item)));
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploadingTarget("");
    }
  }

  async function createItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreating(true);
    setMessage("");

    try {
      const response = await fetch("/api/solutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draft.title,
          description: draft.description,
          price: Number(draft.price),
          imageUrl: draft.imageUrl,
        }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setMessage(payload.error || "Solution add failed.");
        return;
      }

      setDraft(initialDraft);
      await refresh();
      setMessage("Custom solution added.");
    } finally {
      setCreating(false);
    }
  }

  async function saveItem(item: SolutionItem) {
    setSavingSlug(item.slug);
    setMessage("");

    try {
      const response = await fetch("/api/solutions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: item.slug,
          title: item.title,
          description: item.description,
          price: item.price,
          imageUrl: item.imageUrl,
        }),
      });

      const payload = (await response.json()) as { error?: string; mode?: "replace" | "add" };
      if (!response.ok) {
        setMessage(payload.error || "Solution update failed.");
        return;
      }

      await refresh();
      setMessage(payload.mode === "add" ? `Solution "${item.slug}" saved.` : `Solution "${item.slug}" replaced.`);
    } finally {
      setSavingSlug("");
    }
  }

  async function deleteItem(slug: string) {
    setSavingSlug(slug);
    setMessage("");

    try {
      const response = await fetch(`/api/solutions?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setMessage(payload.error || "Solution delete failed.");
        return;
      }

      await refresh();
      setMessage(`Solution "${slug}" deleted.`);
    } finally {
      setSavingSlug("");
    }
  }

  async function saveDiscount() {
    setSavingDiscount(true);
    setMessage("");

    try {
      const response = await fetch("/api/pricing-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discountPercent: Number(discountPercent),
        }),
      });

      const payload = (await response.json()) as { error?: string; settings?: PricingSettings };
      if (!response.ok) {
        setMessage(payload.error || "Discount update failed.");
        return;
      }

      setDiscountPercent(String(payload.settings?.discountPercent ?? 0));
      setMessage("Global discount saved.");
    } finally {
      setSavingDiscount(false);
    }
  }

  function renderSolutionEditor(item: SolutionItem, isCustom: boolean) {
    return (
      <article key={item.slug} className="grid gap-2 rounded-md border border-white/10 p-3 md:grid-cols-2">
        <div className="md:col-span-2 text-xs uppercase tracking-[0.2em] text-zinc-500">{item.slug}</div>
        <input
          value={item.title}
          onChange={(event) => {
            const nextValue = event.target.value;
            if (isCustom) {
              setCustomItems((prev) => prev.map((row) => (row.slug === item.slug ? { ...row, title: nextValue } : row)));
            } else {
              setItems((prev) => prev.map((row) => (row.slug === item.slug ? { ...row, title: nextValue } : row)));
            }
          }}
          className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
          placeholder="Title"
        />
        <input
          type="number"
          min={0}
          step="1"
          value={item.price}
          onChange={(event) => {
            const nextValue = Number(event.target.value);
            if (isCustom) {
              setCustomItems((prev) => prev.map((row) => (row.slug === item.slug ? { ...row, price: nextValue } : row)));
            } else {
              setItems((prev) => prev.map((row) => (row.slug === item.slug ? { ...row, price: nextValue } : row)));
            }
          }}
          className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
          placeholder="Price"
        />
        <textarea
          value={item.description}
          onChange={(event) => {
            const nextValue = event.target.value;
            if (isCustom) {
              setCustomItems((prev) =>
                prev.map((row) => (row.slug === item.slug ? { ...row, description: nextValue } : row)),
              );
            } else {
              setItems((prev) => prev.map((row) => (row.slug === item.slug ? { ...row, description: nextValue } : row)));
            }
          }}
          rows={3}
          className="md:col-span-2 rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
          placeholder="Description"
        />
        <input
          value={item.imageUrl}
          onChange={(event) => {
            const nextValue = event.target.value;
            if (isCustom) {
              setCustomItems((prev) => prev.map((row) => (row.slug === item.slug ? { ...row, imageUrl: nextValue } : row)));
            } else {
              setItems((prev) => prev.map((row) => (row.slug === item.slug ? { ...row, imageUrl: nextValue } : row)));
            }
          }}
          className="md:col-span-2 rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
          placeholder="Image URL"
        />
        <div className="md:col-span-2 flex flex-wrap gap-2">
          <label className="inline-flex cursor-pointer items-center justify-center rounded-md border border-white/15 px-3 py-1.5 text-sm text-zinc-300 hover:border-white/25">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void uploadImage(item.slug, file, "existing");
                }
              }}
            />
            {uploadingTarget === item.slug ? "Uploading image..." : "Upload image"}
          </label>
          <button
            type="button"
            onClick={() => void saveItem(item)}
            disabled={savingSlug === item.slug}
            className="rounded-md border border-white/20 px-3 py-1.5 text-sm hover:border-white/35 disabled:opacity-60"
          >
            {savingSlug === item.slug ? "Saving..." : isCustom ? "Save added solution" : "Replace existing"}
          </button>
          {isCustom ? (
            <button
              type="button"
              onClick={() => void deleteItem(item.slug)}
              disabled={savingSlug === item.slug}
              className="rounded-md border border-rose-300/40 px-3 py-1.5 text-sm text-rose-200 hover:border-rose-300/60 disabled:opacity-60"
            >
              Delete
            </button>
          ) : null}
        </div>
      </article>
    );
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Solutions</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Replace fixed package cards, add custom solution cards, and apply one discount to all calculated prices.
        </p>
      </header>

      <AdminForm title="Global Discount" description="Applies to solution prices, calculator package prices, and add-ons.">
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <label className="flex-1">
            <span className="mb-2 block text-sm text-zinc-300">Discount percent</span>
            <input
              type="number"
              min={0}
              max={100}
              step="1"
              value={discountPercent}
              onChange={(event) => setDiscountPercent(event.target.value)}
              className="w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
            />
          </label>
          <button
            type="button"
            onClick={() => void saveDiscount()}
            disabled={savingDiscount}
            className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 disabled:opacity-60"
          >
            {savingDiscount ? "Saving..." : "Save discount"}
          </button>
        </div>
      </AdminForm>

      <AdminForm title="Add Solution" description="Creates an extra solution card without replacing the fixed package set.">
        <form onSubmit={(event) => void createItem(event)} className="grid gap-3 md:grid-cols-2">
          <input
            required
            value={draft.title}
            onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
            className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
            placeholder="Title"
          />
          <input
            required
            type="number"
            min={0}
            step="1"
            value={draft.price}
            onChange={(event) => setDraft((prev) => ({ ...prev, price: event.target.value }))}
            className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
            placeholder="Price"
          />
          <textarea
            value={draft.description}
            onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))}
            rows={3}
            className="md:col-span-2 rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
            placeholder="Description"
          />
          <input
            value={draft.imageUrl}
            onChange={(event) => setDraft((prev) => ({ ...prev, imageUrl: event.target.value }))}
            className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
            placeholder="Image URL"
          />
          <label className="inline-flex cursor-pointer items-center justify-center rounded-md border border-white/15 px-3 py-2 text-sm text-zinc-300 hover:border-white/25">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void uploadImage("draft", file, "draft");
                }
              }}
            />
            {uploadingTarget === "draft" ? "Uploading image..." : "Upload image"}
          </label>
          <button
            type="submit"
            disabled={creating}
            className="md:col-span-2 rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 disabled:opacity-60"
          >
            {creating ? "Adding..." : "Add solution"}
          </button>
        </form>
      </AdminForm>

      <AdminForm title="Replace Existing Solutions" description="These rows stay tied to the fixed package slugs used by the calculator.">
        <div className="space-y-3">
          {items.map((item) => renderSolutionEditor(item, false))}
          {!loading && items.length === 0 ? <p className="text-sm text-zinc-400">No fixed solutions available.</p> : null}
        </div>
      </AdminForm>

      <AdminForm title="Added Solutions" description="These are extra cards added on top of the default package set.">
        <div className="space-y-3">
          {customItems.map((item) => renderSolutionEditor(item, true))}
          {!loading && customItems.length === 0 ? <p className="text-sm text-zinc-400">No added solutions yet.</p> : null}
        </div>
      </AdminForm>

      {message ? <p className="text-sm text-zinc-300">{message}</p> : null}
    </div>
  );
}
