import type { ReactNode } from "react";

type AdminFormProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function AdminForm({ title, description, children }: AdminFormProps) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <header className="mb-4 space-y-1">
        <h2 className="text-lg font-semibold text-zinc-100">{title}</h2>
        {description ? <p className="text-sm text-zinc-400">{description}</p> : null}
      </header>
      {children}
    </section>
  );
}

