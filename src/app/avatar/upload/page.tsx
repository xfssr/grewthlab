"use client";

import type { PutBlobResult } from "@vercel/blob";
import { useRef, useState } from "react";

export default function AvatarUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <main className="mx-auto w-full max-w-xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Upload Your Avatar</h1>

      <form
        className="mt-6 space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setError("");
          setBusy(true);

          try {
            if (!inputFileRef.current?.files?.length) {
              throw new Error("No file selected");
            }

            const file = inputFileRef.current.files[0];
            const response = await fetch(`/api/avatar/upload?filename=${encodeURIComponent(file.name)}`, {
              method: "POST",
              body: file,
            });

            if (!response.ok) {
              const payload = (await response.json().catch(() => null)) as { error?: string } | null;
              throw new Error(payload?.error || "Upload failed");
            }

            const newBlob = (await response.json()) as PutBlobResult;
            setBlob(newBlob);
          } catch (uploadError) {
            setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
          } finally {
            setBusy(false);
          }
        }}
      >
        <input ref={inputFileRef} type="file" accept="image/jpeg, image/png, image/webp" required />
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 disabled:opacity-60"
        >
          {busy ? "Uploading..." : "Upload"}
        </button>
      </form>

      {error ? <p className="mt-4 text-sm text-rose-400">{error}</p> : null}

      {blob ? (
        <p className="mt-6 text-sm">
          Blob url:{" "}
          <a className="text-blue-400 underline" href={blob.url} target="_blank" rel="noreferrer">
            {blob.url}
          </a>
        </p>
      ) : null}
    </main>
  );
}

