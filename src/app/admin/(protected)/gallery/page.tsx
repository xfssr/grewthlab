"use client";

import { FormEvent, useEffect, useState } from "react";

import { AdminForm } from "@/components/AdminForm";

type GalleryItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  createdAt: string;
};

type GalleryDraft = {
  title: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
};

const initialDraft: GalleryDraft = {
  title: "",
  description: "",
  imageUrl: "",
  videoUrl: "",
};

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [draft, setDraft] = useState<GalleryDraft>(initialDraft);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function refresh() {
    const response = await fetch("/api/gallery", { cache: "no-store" });
    const payload = (await response.json()) as { items: GalleryItem[] };
    setItems(payload.items || []);
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function uploadImage(file: File) {
    setUploading(true);
    setMessage("");
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body });
      const payload = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !payload.url) {
        throw new Error(payload.error || "Upload failed.");
      }
      setDraft((prev) => ({ ...prev, imageUrl: payload.url || "" }));
    } catch (error) {
      const text = error instanceof Error ? error.message : "Upload failed.";
      setMessage(text);
    } finally {
      setUploading(false);
    }
  }

  async function createItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const response = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setMessage(payload.error || "Create failed.");
        return;
      }

      setDraft(initialDraft);
      await refresh();
      setMessage("Item added.");
    } finally {
      setBusy(false);
    }
  }

  async function updateItem(item: GalleryItem) {
    const response = await fetch("/api/gallery", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });

    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      setMessage(payload.error || "Update failed.");
      return;
    }

    setMessage("Item updated.");
    await refresh();
  }

  async function deleteItem(id: string) {
    const response = await fetch(`/api/gallery?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      setMessage(payload.error || "Delete failed.");
      return;
    }

    await refresh();
    setMessage("Item deleted.");
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Gallery</h1>
        <p className="mt-1 text-sm text-zinc-400">Add, edit and remove gallery items.</p>
      </header>

      <AdminForm title="Add Item">
        <form onSubmit={createItem} className="grid gap-3 md:grid-cols-2">
          <input
            required
            value={draft.title}
            onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
            className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
            placeholder="Title"
          />
          <input
            value={draft.videoUrl}
            onChange={(event) => setDraft((prev) => ({ ...prev, videoUrl: event.target.value }))}
            className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
            placeholder="Video URL (optional)"
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
                  void uploadImage(file);
                }
              }}
            />
            {uploading ? "Uploading..." : "Upload Image"}
          </label>

          <button
            type="submit"
            disabled={busy}
            className="md:col-span-2 rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 disabled:opacity-60"
          >
            {busy ? "Saving..." : "Add Item"}
          </button>
        </form>
      </AdminForm>

      <AdminForm title="Manage Items">
        <div className="space-y-3">
          {items.map((item) => (
            <article key={item.id} className="grid gap-2 rounded-md border border-white/10 p-3 md:grid-cols-2">
              <input
                value={item.title}
                onChange={(event) =>
                  setItems((prev) => prev.map((row) => (row.id === item.id ? { ...row, title: event.target.value } : row)))
                }
                className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
              />
              <input
                value={item.videoUrl}
                onChange={(event) =>
                  setItems((prev) => prev.map((row) => (row.id === item.id ? { ...row, videoUrl: event.target.value } : row)))
                }
                className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
              />
              <textarea
                value={item.description}
                onChange={(event) =>
                  setItems((prev) =>
                    prev.map((row) => (row.id === item.id ? { ...row, description: event.target.value } : row)),
                  )
                }
                rows={2}
                className="md:col-span-2 rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
              />
              <input
                value={item.imageUrl}
                onChange={(event) =>
                  setItems((prev) => prev.map((row) => (row.id === item.id ? { ...row, imageUrl: event.target.value } : row)))
                }
                className="md:col-span-2 rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
              />
              <div className="md:col-span-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => void updateItem(item)}
                  className="rounded-md border border-white/20 px-3 py-1.5 text-sm hover:border-white/35"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => void deleteItem(item.id)}
                  className="rounded-md border border-rose-300/40 px-3 py-1.5 text-sm text-rose-200 hover:border-rose-300/60"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}

          {items.length === 0 ? <p className="text-sm text-zinc-400">No items yet.</p> : null}
        </div>
      </AdminForm>

      {message ? <p className="text-sm text-zinc-300">{message}</p> : null}
    </div>
  );
}

