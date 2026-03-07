"use client";

import { FormEvent, useEffect, useState } from "react";

import { AdminForm } from "@/components/AdminForm";

type PagePayload = {
  slug: string;
  title: string;
  subtitle: string;
  heroImage: string;
};

export default function AdminPagesPage() {
  const [form, setForm] = useState<PagePayload>({
    slug: "home",
    title: "",
    subtitle: "",
    heroImage: "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
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
      }));
    }

    void load();
  }, []);

  async function handleUpload(file: File) {
    setUploading(true);
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

      setForm((prev) => ({ ...prev, heroImage: payload.url || "" }));
    } catch (error) {
      const text = error instanceof Error ? error.message : "Upload failed.";
      setMessage(text);
    } finally {
      setUploading(false);
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

      setMessage("Page updated.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Pages</h1>
        <p className="mt-1 text-sm text-zinc-400">Edit home hero content.</p>
      </header>

      <AdminForm title="Home Page" description="Hero title, subtitle, and hero image.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm text-zinc-300">Hero Title</span>
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              required
              className="w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-white/30"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-zinc-300">Hero Subtitle</span>
            <textarea
              value={form.subtitle}
              onChange={(event) => setForm((prev) => ({ ...prev, subtitle: event.target.value }))}
              rows={3}
              className="w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-white/30"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-zinc-300">Hero Image URL</span>
            <input
              value={form.heroImage}
              onChange={(event) => setForm((prev) => ({ ...prev, heroImage: event.target.value }))}
              className="w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-white/30"
              placeholder="https://..."
            />
          </label>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm text-zinc-300 hover:border-white/25">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void handleUpload(file);
                }
              }}
            />
            {uploading ? "Uploading..." : "Upload Image"}
          </label>

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

