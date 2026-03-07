import Link from "next/link";

import { LogoutButton } from "@/components/admin/LogoutButton";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/solutions", label: "Solutions" },
];

export function AdminSidebar() {
  return (
    <aside className="sticky top-4 h-fit rounded-xl border border-white/10 bg-zinc-900/70 p-3">
      <p className="px-2 py-2 text-xs uppercase tracking-[0.2em] text-zinc-500">Admin</p>
      <nav className="grid gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-zinc-100"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-3 border-t border-white/10 pt-3">
        <LogoutButton />
      </div>
    </aside>
  );
}

