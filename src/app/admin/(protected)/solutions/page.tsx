"use client";

import { useEffect, useState } from "react";

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

export default function AdminSolutionsPage() {
  const [items, setItems] = useState<SolutionItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState("0");
  const [loading, setLoading] = useState(true);
  const [savingSlug, setSavingSlug] = useState("");
  const [uploadingSlug, setUploadingSlug] = useState("");
  const [savingDiscount, setSavingDiscount] = useState(false);
  const [message, setMessage] = useState("");

  async function refresh() {
    setLoading(true);

    try {
      const [solutionsResponse, settingsResponse] = await Promise.all([
        fetch("/api/solutions", { cache: "no-store" }),
        fetch("/api/pricing-settings", { cache: "no-store" }),
      ]);

      const solutionsPayload = (await solutionsResponse.json()) as { items?: SolutionItem[]; error?: string };
      const settingsPayload = (await settingsResponse.json()) as { settings?: PricingSettings };

      setItems(solutionsPayload.items || []);
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

  async function uploadImage(slug: string, file: File) {
    setUploadingSlug(slug);
    setMessage("");

    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body });
      const payload = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !payload.url) {
        throw new Error(payload.error || "Upload failed.");
      }

      setItems((prev) => prev.map((item) => (item.slug === slug ? { ...item, imageUrl: payload.url || "" } : item)));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploadingSlug("");
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

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setMessage(payload.error || "Solution update failed.");
        return;
      }

      await refresh();
      setMessage(`Solution "${item.slug}" updated.`);
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

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Solutions</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Edit the existing solution packages, update their prices, and apply one discount to all calculated prices.
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

      <AdminForm title="Manage Existing Solutions" description="Each row is tied to a fixed package slug on the public site.">
        <div className="space-y-3">
          {items.map((item) => (
            <article key={item.slug} className="grid gap-2 rounded-md border border-white/10 p-3 md:grid-cols-2">
              <div className="md:col-span-2 text-xs uppercase tracking-[0.2em] text-zinc-500">{item.slug}</div>
              <input
                value={item.title}
                onChange={(event) =>
                  setItems((prev) => prev.map((row) => (row.slug === item.slug ? { ...row, title: event.target.value } : row)))
                }
                className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
                placeholder="Title"
              />
              <input
                type="number"
                min={0}
                step="1"
                value={item.price}
                onChange={(event) =>
                  setItems((prev) =>
                    prev.map((row) => (row.slug === item.slug ? { ...row, price: Number(event.target.value) } : row)),
                  )
                }
                className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
                placeholder="Price"
              />
              <textarea
                value={item.description}
                onChange={(event) =>
                  setItems((prev) =>
                    prev.map((row) => (row.slug === item.slug ? { ...row, description: event.target.value } : row)),
                  )
                }
                rows={3}
                className="md:col-span-2 rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
                placeholder="Description"
              />
              <input
                value={item.imageUrl}
                onChange={(event) =>
                  setItems((prev) => prev.map((row) => (row.slug === item.slug ? { ...row, imageUrl: event.target.value } : row)))
                }
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
                        void uploadImage(item.slug, file);
                      }
                    }}
                  />
                  {uploadingSlug === item.slug ? "Uploading image..." : "Upload image"}
                </label>
                <button
                  type="button"
                  onClick={() => void saveItem(item)}
                  disabled={savingSlug === item.slug}
                  className="rounded-md border border-white/20 px-3 py-1.5 text-sm hover:border-white/35 disabled:opacity-60"
                >
                  {savingSlug === item.slug ? "Saving..." : "Save"}
                </button>
              </div>
            </article>
          ))}

          {!loading && items.length === 0 ? <p className="text-sm text-zinc-400">No solutions available.</p> : null}
        </div>
      </AdminForm>

      {message ? <p className="text-sm text-zinc-300">{message}</p> : null}
    </div>
  );
}
