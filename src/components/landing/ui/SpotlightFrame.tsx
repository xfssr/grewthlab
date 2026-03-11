import type { ReactNode } from "react";
import Image from "next/image";

type SpotlightFrameProps = {
  imageSrc: string;
  imageAlt: string;
  children: ReactNode;
  aside?: ReactNode;
  asideClassName?: string;
  className?: string;
  imageOpacityClassName?: string;
  contentClassName?: string;
};

export function SpotlightFrame({
  imageSrc,
  imageAlt,
  children,
  aside,
  asideClassName,
  className,
  imageOpacityClassName = "opacity-[0.42]",
  contentClassName,
}: SpotlightFrameProps) {
  return (
    <article
      className={`group relative overflow-hidden rounded-[1.65rem] border border-stroke-strong/90 bg-surface-base shadow-panel ${
        className ?? ""
      }`}
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1120px"
          className={`object-cover object-center transition duration-700 group-hover:scale-[1.04] ${imageOpacityClassName}`}
        />
        <div className="absolute inset-0 bg-[linear-gradient(102deg,rgba(8,11,17,0.95)_18%,rgba(10,13,20,0.9)_46%,rgba(11,14,22,0.72)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_0%,rgba(217,162,96,0.2),transparent_34%),radial-gradient(circle_at_84%_100%,rgba(86,109,158,0.22),transparent_36%)]" />
      </div>

      <div
        className={`relative z-10 grid gap-6 p-6 sm:p-7 ${
          aside ? "lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end" : ""
        } ${contentClassName ?? ""}`}
      >
        <div>{children}</div>
        {aside ? (
          <aside
            className={`rounded-2xl border border-white/15 bg-black/28 p-4 backdrop-blur-[2px] ${asideClassName ?? ""}`}
          >
            {aside}
          </aside>
        ) : null}
      </div>
    </article>
  );
}
