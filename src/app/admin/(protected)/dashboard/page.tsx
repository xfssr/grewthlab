import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

async function safeCount(operation: Promise<number>) {
  try {
    return await operation;
  } catch {
    return 0;
  }
}

export default async function AdminDashboardPage() {
  const [pagesCount, galleryCount, solutionsCount, localizedContentCount] = await Promise.all([
    safeCount(prisma.page.count()),
    safeCount(prisma.galleryItem.count()),
    safeCount(prisma.solution.count()),
    safeCount(prisma.siteContentOverride.count()),
  ]);

  const cards = [
    { label: "Pages", value: pagesCount },
    { label: "Gallery items", value: galleryCount },
    { label: "Solutions", value: solutionsCount },
    { label: "Locale overrides", value: localizedContentCount },
  ];

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Manage localized copy, hero media, gallery assets, and solution cards that render on the public site.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
