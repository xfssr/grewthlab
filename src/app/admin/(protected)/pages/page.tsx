"use client";

import { FormEvent, useEffect, useState } from "react";

import { AdminForm } from "@/components/AdminForm";

type PagePayload = {
  slug: string;
  title: string;
  subtitle: string;
  heroImage: string;
  heroVideo: string;
};

export default function AdminPagesPage() {
  const [form, setForm] = useState<PagePayload>({
    slug: "home",
    title: "",
    subtitle: "",
    heroImage: "",
    heroVideo: "",
  });
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<"heroImage" | "heroVideo" | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/pages?slug=home", { cache: "no-store" });
      if (!response.ok) {
        return;
      }
      const payload = (await response.json()) as { page?: Partial<PagePayload> | null };
      if (!payload.page) {
        return;
      }
      setForm((prev) => ({
        ...prev,
        title: payload.page?.title || "",
        subtitle: payload.page?.subtitle || "",
        heroImage: payload.page?.heroImage || "",
        heroVideo: payload.page?.heroVideo || "",
      }));
    }

    void load();
  }, []);

  async function handleUpload(file: File, field: "heroImage" | "heroVideo") {
    setUploadingField(field);
    setMessage("");
    try {
      const data = new FormData();
      data.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const payload = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !payload.url) {
        throw new Error(payload.error || "Upload failed.");
      }

      setForm((prev) => ({ ...prev, [field]: payload.url || "" }));
    } catch (error) {
      const text = error instanceof Error ? error.message : "Upload failed.";
      setMessage(text);
    } finally {
      setUploadingField(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/pages", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setMessage(payload.error || "Save failed.");
        return;
      }

      setMessage("Home page fallback copy and hero media were updated.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Pages</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Manage the shared home-page hero media. Localized HE/EN copy is edited in the Localized Content tab.
        </p>
      </header>

      <AdminForm
        title="Home Page Hero"
        description="These title and description fields are shared fallbacks. Image and video are rendered directly on the public site."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm text-zinc-300">Fallback hero title</span>
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              required
              className="w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-white/30"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-zinc-300">Fallback hero description</span>
            <textarea
              value={form.subtitle}
              onChange={(event) => setForm((prev) => ({ ...prev, subtitle: event.target.value }))}
              rows={3}
              className="w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-white/30"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-zinc-300">Hero image URL</span>
            <input
              value={form.heroImage}
              onChange={(event) => setForm((prev) => ({ ...prev, heroImage: event.target.value }))}
              className="w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-white/30"
              placeholder="https://..."
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-zinc-300">Hero video URL</span>
            <input
              value={form.heroVideo}
              onChange={(event) => setForm((prev) => ({ ...prev, heroVideo: event.target.value }))}
              className="w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-white/30"
              placeholder="https://..."
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm text-zinc-300 hover:border-white/25">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void handleUpload(file, "heroImage");
                  }
                }}
              />
              {uploadingField === "heroImage" ? "Uploading image..." : "Upload image"}
            </label>

            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm text-zinc-300 hover:border-white/25">
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void handleUpload(file, "heroVideo");
                  }
                }}
              />
              {uploadingField === "heroVideo" ? "Uploading video..." : "Upload video"}
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-white disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            {message ? <p className="text-sm text-zinc-300">{message}</p> : null}
          </div>
        </form>
      </AdminForm>
    </div>
  );
}
