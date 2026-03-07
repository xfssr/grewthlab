"use client";

import { useEffect, useState } from "react";

import { AdminForm } from "@/components/AdminForm";
import type { Locale } from "@/core/site.types";

type SiteContentPayload = {
  editableContent?: Record<string, unknown> | null;
  error?: string;
};

const localeOptions: Locale[] = ["he", "en"];

export default function AdminContentPage() {
  const [locale, setLocale] = useState<Locale>("he");
  const [editorValue, setEditorValue] = useState("{}");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setMessage("");

      try {
        const response = await fetch(`/api/site-content?locale=${locale}`, { cache: "no-store" });
        const payload = (await response.json()) as SiteContentPayload;
        if (!response.ok) {
          throw new Error(payload.error || "Failed to load localized content.");
        }

        if (!cancelled) {
          setEditorValue(JSON.stringify(payload.editableContent || {}, null, 2));
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(error instanceof Error ? error.message : "Failed to load localized content.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  async function handleSave() {
    setSaving(true);
    setMessage("");

    try {
      const content = JSON.parse(editorValue) as Record<string, unknown>;
      const response = await fetch("/api/site-content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locale, content }),
      });

      const payload = (await response.json()) as { error?: string; editableContent?: Record<string, unknown> | null };
      if (!response.ok) {
        throw new Error(payload.error || "Failed to save localized content.");
      }

      setMessage(`Localized ${locale.toUpperCase()} content saved.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save localized content.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Localized Content</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Edit public-site copy for the Hebrew and English versions. Media assets and card collections stay synced from the
          Pages, Gallery, and Solutions tabs.
        </p>
      </header>

      <AdminForm
        title="HE / EN Site Copy"
        description="This editor stores locale-specific content in the database. Database-managed media arrays are stripped automatically so gallery and solution sync stays intact."
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {localeOptions.map((option) => {
              const active = option === locale;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setLocale(option)}
                  className={`rounded-md border px-3 py-2 text-sm transition ${
                    active
                      ? "border-zinc-100 bg-zinc-100 text-zinc-900"
                      : "border-white/15 bg-black/20 text-zinc-300 hover:border-white/30"
                  }`}
                >
                  {option.toUpperCase()}
                </button>
              );
            })}
          </div>

          <textarea
            value={editorValue}
            onChange={(event) => setEditorValue(event.target.value)}
            spellCheck={false}
            className="min-h-[560px] w-full rounded-md border border-white/15 bg-black/30 px-3 py-3 font-mono text-sm text-zinc-100 outline-none focus:border-white/30"
          />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving || loading}
              className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-white disabled:opacity-60"
            >
              {saving ? "Saving..." : loading ? "Loading..." : "Save localized content"}
            </button>
            {message ? <p className="text-sm text-zinc-300">{message}</p> : null}
          </div>
        </div>
      </AdminForm>
    </div>
  );
}
