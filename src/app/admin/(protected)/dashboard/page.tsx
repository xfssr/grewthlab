import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [pagesCount, galleryCount, solutionsCount] = await Promise.all([
    prisma.page.count(),
    prisma.galleryItem.count(),
    prisma.solution.count(),
  ]);

  const cards = [
    { label: "Pages", value: pagesCount },
    { label: "Gallery Items", value: galleryCount },
    { label: "Solutions", value: solutionsCount },
  ];

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-400">Compact admin panel for website content management.</p>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        {cards.map((card) => (
          <article key={card.label} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold">{card.value}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

