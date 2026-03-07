"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [nextPath, setNextPath] = useState("/admin/dashboard");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    if (next && next.startsWith("/admin")) {
      setNextPath(next);
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error || "Login failed.");
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#090b10] px-4">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0f1219] p-6">
        <h1 className="text-xl font-semibold text-zinc-100">Admin sign in</h1>
        <p className="mt-1 text-sm text-zinc-400">Use the admin password to access the dashboard.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm text-zinc-300">Password</span>
            <input
              type="password"
              required
              minLength={5}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none ring-0 placeholder:text-zinc-500 focus:border-white/30"
            />
          </label>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 transition hover:bg-white disabled:opacity-60"
          >
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
