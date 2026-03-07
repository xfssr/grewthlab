import Image from "next/image";

type HeroProps = {
  title: string;
  subtitle: string;
  heroImage: string;
};

export function Hero({ title, subtitle, heroImage }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#0a0b10]">
      <div className="mx-auto grid min-h-[58vh] w-full max-w-6xl items-center gap-8 px-6 py-16 md:grid-cols-2 md:py-24">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Business Growth System</p>
          <h1 className="text-3xl font-semibold leading-tight text-zinc-100 md:text-5xl">{title}</h1>
          <p className="max-w-xl text-sm text-zinc-300 md:text-base">{subtitle}</p>
        </div>

        <div className="relative mx-auto aspect-[16/10] w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70 shadow-2xl">
          {heroImage ? (
            <Image src={heroImage} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-400">Add hero image from admin</div>
          )}
        </div>
      </div>
    </section>
  );
}

