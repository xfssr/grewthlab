"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { AdminForm } from "@/components/AdminForm";

type GalleryItem = {
  id: string;
  title: string;
  tier: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  createdAt: string;
};

type GalleryDraft = {
  title: string;
  tier: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
};

type UploadTarget = "imageUrl" | "videoUrl";
type MediaMode = "photo" | "video";

const initialDraft: GalleryDraft = {
  title: "",
  tier: "",
  description: "",
  imageUrl: "",
  videoUrl: "",
};

function getMediaMode(value: Pick<GalleryDraft, "videoUrl">): MediaMode {
  return value.videoUrl.trim() ? "video" : "photo";
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [draft, setDraft] = useState<GalleryDraft>(initialDraft);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploadingField, setUploadingField] = useState<UploadTarget | null>(null);
  const [editingUploadField, setEditingUploadField] = useState<UploadTarget | null>(null);
  const [message, setMessage] = useState("");

  const tierOptions = useMemo(() => {
    return Array.from(
      new Set(
        items
          .map((item) => item.tier.trim() || item.title.trim())
          .filter(Boolean),
      ),
    ).sort((a, b) => a.localeCompare(b));
  }, [items]);

  async function refresh() {
    const response = await fetch("/api/gallery", { cache: "no-store" });
    const payload = (await response.json()) as { items: GalleryItem[] };
    setItems(payload.items || []);
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function uploadAsset(file: File) {
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body });
    const payload = (await response.json()) as { url?: string; error?: string };
    if (!response.ok || !payload.url) {
      throw new Error(payload.error || "Upload failed.");
    }
    return payload.url;
  }

  async function uploadDraftAsset(file: File, field: UploadTarget) {
    setUploadingField(field);
    setMessage("");
    try {
      const url = await uploadAsset(file);
      setDraft((prev) => ({ ...prev, [field]: url }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploadingField(null);
    }
  }

  async function uploadEditingAsset(file: File, field: UploadTarget) {
    if (!editing) {
      return;
    }
    setEditingUploadField(field);
    setMessage("");
    try {
      const url = await uploadAsset(file);
      setEditing((prev) => (prev ? { ...prev, [field]: url } : prev));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setEditingUploadField(null);
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
        setMessage(payload.error || "Gallery item creation failed.");
        return;
      }
      setDraft(initialDraft);
      await refresh();
      setMessage("Gallery item created.");
    } finally {
      setBusy(false);
    }
  }

  async function saveEditingItem() {
    if (!editing) {
      return;
    }

    const response = await fetch("/api/gallery", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      setMessage(payload.error || "Gallery item update failed.");
      return;
    }

    setEditing(null);
    await refresh();
    setMessage("Gallery item updated.");
  }

  async function deleteItem(id: string) {
    const response = await fetch(`/api/gallery?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      setMessage(payload.error || "Gallery item deletion failed.");
      return;
    }
    if (editing?.id === id) {
      setEditing(null);
    }
    await refresh();
    setMessage("Gallery item deleted.");
  }

  const draftMediaMode = getMediaMode(draft);
  const editingMediaMode = editing ? getMediaMode(editing) : "photo";

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Gallery</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Редактируйте карточки из עבודות נבחרות через модалку: фото/видео 9:16 и категория tier.
        </p>
      </header>

      <AdminForm title="Create Gallery Item">
        <form onSubmit={createItem} className="grid gap-3 md:grid-cols-2">
          <input
            required
            value={draft.title}
            onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
            className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
            placeholder="Card title"
          />
          <div>
            <input
              value={draft.tier}
              onChange={(event) => setDraft((prev) => ({ ...prev, tier: event.target.value }))}
              list="tier-options"
              className="w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
              placeholder="Tier category"
            />
          </div>
          <select
            value={draftMediaMode}
            onChange={(event) =>
              setDraft((prev) =>
                event.target.value === "photo" ? { ...prev, videoUrl: "" } : prev,
              )
            }
            className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
          >
            <option value="photo">Фото</option>
            <option value="video">Видео</option>
          </select>
          <input
            value={draft.videoUrl}
            onChange={(event) => setDraft((prev) => ({ ...prev, videoUrl: event.target.value }))}
            className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
            placeholder="Video URL (9:16)"
          />
          <input
            value={draft.imageUrl}
            onChange={(event) => setDraft((prev) => ({ ...prev, imageUrl: event.target.value }))}
            className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
            placeholder="Image URL (9:16 poster/photo)"
          />
          <textarea
            value={draft.description}
            onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))}
            rows={3}
            className="md:col-span-2 rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
            placeholder="Description / alt text"
          />
          <div className="md:col-span-2 flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer items-center justify-center rounded-md border border-white/15 px-3 py-2 text-sm text-zinc-300 hover:border-white/25">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void uploadDraftAsset(file, "imageUrl");
                  }
                }}
              />
              {uploadingField === "imageUrl" ? "Uploading image..." : "Upload image"}
            </label>
            <label className="inline-flex cursor-pointer items-center justify-center rounded-md border border-white/15 px-3 py-2 text-sm text-zinc-300 hover:border-white/25">
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void uploadDraftAsset(file, "videoUrl");
                  }
                }}
              />
              {uploadingField === "videoUrl" ? "Uploading video..." : "Upload video"}
            </label>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="md:col-span-2 rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 disabled:opacity-60"
          >
            {busy ? "Saving..." : "Create item"}
          </button>
        </form>
      </AdminForm>

      <AdminForm title="Manage Gallery Items">
        <div className="space-y-3">
          {items.map((item) => (
            <article key={item.id} className="rounded-md border border-white/10 p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-zinc-100">{item.title}</p>
                  <p className="text-xs text-zinc-400">Tier: {item.tier || item.title}</p>
                  <p className="text-xs text-zinc-500">{item.videoUrl ? "Видео 9:16" : "Фото 9:16"}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(item)}
                    className="rounded-md border border-white/20 px-3 py-1.5 text-sm hover:border-white/35"
                  >
                    Edit modal
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteItem(item.id)}
                    className="rounded-md border border-rose-300/40 px-3 py-1.5 text-sm text-rose-200 hover:border-rose-300/60"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
          {items.length === 0 ? <p className="text-sm text-zinc-400">No gallery items yet.</p> : null}
        </div>
      </AdminForm>

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-xl border border-white/15 bg-[#0f1219] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-100">Edit gallery card</p>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-md border border-white/20 px-2 py-1 text-xs text-zinc-300"
              >
                Close
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <input
                value={editing.title}
                onChange={(event) => setEditing((prev) => (prev ? { ...prev, title: event.target.value } : prev))}
                className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
                placeholder="Card title"
              />
              <input
                value={editing.tier}
                onChange={(event) => setEditing((prev) => (prev ? { ...prev, tier: event.target.value } : prev))}
                list="tier-options"
                className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
                placeholder="Tier category"
              />
              <select
                value={editingMediaMode}
                onChange={(event) =>
                  setEditing((prev) =>
                    prev ? (event.target.value === "photo" ? { ...prev, videoUrl: "" } : prev) : prev,
                  )
                }
                className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
              >
                <option value="photo">Фото</option>
                <option value="video">Видео</option>
              </select>
              <input
                value={editing.videoUrl}
                onChange={(event) => setEditing((prev) => (prev ? { ...prev, videoUrl: event.target.value } : prev))}
                className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
                placeholder="Video URL (9:16)"
              />
              <input
                value={editing.imageUrl}
                onChange={(event) => setEditing((prev) => (prev ? { ...prev, imageUrl: event.target.value } : prev))}
                className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
                placeholder="Image URL (9:16 poster/photo)"
              />
              <textarea
                value={editing.description}
                onChange={(event) => setEditing((prev) => (prev ? { ...prev, description: event.target.value } : prev))}
                rows={3}
                className="md:col-span-2 rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm"
                placeholder="Description / alt text"
              />
              <div className="md:col-span-2 flex flex-wrap gap-2">
                <label className="inline-flex cursor-pointer items-center justify-center rounded-md border border-white/15 px-3 py-2 text-sm text-zinc-300 hover:border-white/25">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        void uploadEditingAsset(file, "imageUrl");
                      }
                    }}
                  />
                  {editingUploadField === "imageUrl" ? "Uploading image..." : "Replace image"}
                </label>
                <label className="inline-flex cursor-pointer items-center justify-center rounded-md border border-white/15 px-3 py-2 text-sm text-zinc-300 hover:border-white/25">
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        void uploadEditingAsset(file, "videoUrl");
                      }
                    }}
                  />
                  {editingUploadField === "videoUrl" ? "Uploading video..." : "Replace video"}
                </label>
              </div>
              <div className="md:col-span-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => void saveEditingItem()}
                  className="rounded-md border border-white/20 px-3 py-1.5 text-sm hover:border-white/35"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-md border border-white/20 px-3 py-1.5 text-sm hover:border-white/35"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <datalist id="tier-options">
        {tierOptions.map((tier) => (
          <option key={tier} value={tier} />
        ))}
      </datalist>

      {message ? <p className="text-sm text-zinc-300">{message}</p> : null}
    </div>
  );
}
