"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    setBusy(true);
    try {
      await fetch("/api/login", { method: "DELETE" });
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={busy}
      className="rounded-md border border-white/15 px-3 py-2 text-left text-sm text-zinc-300 transition hover:border-white/30 hover:text-zinc-100 disabled:opacity-60"
    >
      {busy ? "Signing out..." : "Sign out"}
    </button>
  );
}
