import Image from "next/image";

export type PublicSolution = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
};

type SolutionsProps = {
  items: PublicSolution[];
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function Solutions({ items }: SolutionsProps) {
  return (
    <section id="solutions" className="mx-auto w-full max-w-6xl px-6 pb-20 pt-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Service Packages</p>
        <h2 className="mt-2 text-2xl font-semibold text-zinc-100 md:text-3xl">Solutions</h2>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-sm text-zinc-400">
          No solutions added yet.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {items.map((item) => (
            <article
              key={item.id}
              className="grid overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] md:grid-cols-[180px_1fr]"
            >
              <div className="relative h-48 md:h-full">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="180px" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-zinc-900 text-xs text-zinc-500">No image</div>
                )}
              </div>
              <div className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-medium text-zinc-100">{item.title}</h3>
                  <span className="rounded-full bg-amber-300/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
                    {formatPrice(item.price)}
                  </span>
                </div>
                <p className="text-sm text-zinc-400">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

