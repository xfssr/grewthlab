import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/auth";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#090b10] text-zinc-100">
      <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-4 md:grid-cols-[240px_1fr]">
        <AdminSidebar />
        <main className="rounded-xl border border-white/10 bg-[#0f1219] p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
