import Image from "next/image";

export type PublicGalleryItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
};

type GalleryProps = {
  items: PublicGalleryItem[];
};

export function Gallery({ items }: GalleryProps) {
  return (
    <section id="gallery" className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Portfolio</p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-100 md:text-3xl">Gallery</h2>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-sm text-zinc-400">
          No gallery items yet.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition hover:border-white/20"
            >
              <div className="relative aspect-[4/5] w-full bg-zinc-900">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-zinc-500">No image</div>
                )}
              </div>
              <div className="space-y-2 p-4">
                <h3 className="text-base font-medium text-zinc-100">{item.title}</h3>
                <p className="line-clamp-3 text-sm text-zinc-400">{item.description}</p>
                {item.videoUrl ? (
                  <a
                    href={item.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-xs font-medium text-amber-300 hover:text-amber-200"
                  >
                    Watch video
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

