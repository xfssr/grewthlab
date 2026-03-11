import Image from "next/image";
import Link from "next/link";

import type { SeoBannerVariant } from "@/lib/seo-data";

type SeoIntentBannerProps = {
  variant: SeoBannerVariant;
};

export function SeoIntentBanner({ variant }: SeoIntentBannerProps) {
  return (
    <section className="group relative mt-10 overflow-hidden rounded-[1.65rem] border border-stroke-strong/90 bg-surface-base shadow-panel">
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={variant.imageSrc}
          alt={variant.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1120px"
          className="object-cover object-center opacity-[0.44] transition duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(102deg,rgba(8,11,17,0.95)_18%,rgba(10,13,20,0.9)_46%,rgba(11,14,22,0.72)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_0%,rgba(217,162,96,0.2),transparent_34%),radial-gradient(circle_at_84%_100%,rgba(86,109,158,0.22),transparent_36%)]" />
      </div>

      <div className="relative z-10 grid gap-6 p-6 sm:p-7 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
        <div>
          <p className="ui-kicker">SEO banner</p>
          <h2 className="mt-4 max-w-3xl font-display text-3xl leading-tight text-text-primary sm:text-4xl">{variant.title}</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-text-muted sm:text-lg">{variant.subtitle}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={variant.primaryCta.href}
              className="rounded-full border border-accent-primary bg-gradient-to-r from-accent-primary to-accent-secondary px-5 py-2.5 text-sm font-semibold text-text-inverse transition hover:brightness-105"
            >
              {variant.primaryCta.label}
            </Link>
            <Link
              href={variant.secondaryCta.href}
              className="rounded-full border border-stroke-strong bg-black/20 px-5 py-2.5 text-sm font-semibold text-text-primary transition hover:border-accent-primary/65"
            >
              {variant.secondaryCta.label}
            </Link>
            <Link
              href={variant.linkCta.href}
              className="inline-flex items-center px-2 py-2 text-sm font-semibold text-accent-primary transition hover:text-[#efbe80]"
            >
              {variant.linkCta.label}
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-white/15 bg-black/28 p-4 backdrop-blur-[2px]">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-text-soft">Conversion Flow</p>
          <div className="mt-3 space-y-2 text-sm text-text-primary/90">
            <p>1. קריאייטיב</p>
            <p>2. עמוד ממיר</p>
            <p>3. פנייה לוואטסאפ</p>
          </div>
        </div>
      </div>
    </section>
  );
}
