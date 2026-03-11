import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { StructuredData } from "@/components/seo/StructuredData";
import { SeoIntentBanner } from "@/components/seo/SeoIntentBanner";
import { getSeoBannerVariant, productSlugByPackageId, seoProblemBySlug, seoProducts } from "@/lib/seo-data";
import { absoluteUrl } from "@/lib/site";

type ProblemPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return Array.from(seoProblemBySlug.values()).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: ProblemPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = seoProblemBySlug.get(slug);

  if (!page) {
    return {};
  }

  const url = absoluteUrl(`/problems/${slug}`);

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title: page.title,
      description: page.description,
      images: [absoluteUrl("/og-image.jpg")],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [absoluteUrl("/og-image.jpg")],
    },
  };
}

export default async function ProblemPage({ params }: ProblemPageProps) {
  const { slug } = await params;
  const page = seoProblemBySlug.get(slug);
  const bannerVariant = getSeoBannerVariant(`problems:${slug}`);

  if (!page) {
    notFound();
  }

  const relatedSlug = productSlugByPackageId.get(page.mappedPackageId);
  const relatedProduct = seoProducts.find((item) => item.packageId === page.mappedPackageId) ?? null;
  const url = absoluteUrl(`/problems/${slug}`);

  return (
    <main className="relative min-h-screen overflow-hidden bg-bg-base text-text-primary">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_15%_0%,rgba(217,162,96,0.2),transparent_42%),radial-gradient(circle_at_84%_10%,rgba(92,114,158,0.18),transparent_40%)]" />
        <div className="absolute -left-20 top-28 h-72 w-72 rounded-full bg-[#d9a260]/11 blur-3xl" />
        <div className="absolute -right-24 top-36 h-80 w-80 rounded-full bg-[#4f6998]/15 blur-3xl" />
      </div>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: page.faqs.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }}
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: absoluteUrl("/"),
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Problems",
              item: absoluteUrl("/problems"),
            },
            {
              "@type": "ListItem",
              position: 3,
              name: page.title,
              item: url,
            },
          ],
        }}
      />
      <section className="relative z-10 mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <p className="ui-kicker">SEO problem page</p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl leading-[1.02] sm:text-5xl lg:text-6xl">{page.title}</h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-text-muted sm:text-lg">{page.description}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {page.keywords.map((item) => (
            <span key={item} className="rounded-full border border-stroke-subtle bg-surface-base px-3 py-1.5 text-xs text-text-soft">
              {item}
            </span>
          ))}
        </div>

        <SeoIntentBanner variant={bannerVariant} />

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-[1.25rem] border border-stroke-subtle bg-surface-base p-5 md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-soft">Symptoms</p>
            <ul className="mt-3 space-y-2 text-sm text-text-muted">
              {page.symptoms.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span aria-hidden="true" className="mt-[0.38rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-text-soft">Why it happens</p>
            <p className="mt-2 text-base leading-relaxed text-text-muted">{page.whyItHappens}</p>
          </article>

          <article className="rounded-[1.25rem] border border-stroke-subtle bg-surface-base p-5 md:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-soft">Recommended solution</p>
            <h2 className="mt-3 text-2xl font-semibold">{relatedProduct?.title ?? "Business solution"}</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {relatedProduct?.description ?? "Structured package that fixes the broken step in the client journey."}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {relatedSlug ? (
                <Link href={`/products/${relatedSlug}`} className="rounded-full bg-accent-primary px-5 py-2.5 text-sm font-semibold text-text-inverse transition hover:opacity-90">
                  לצפייה בפתרון
                </Link>
              ) : null}
              <Link href="/#pricing" className="rounded-full border border-stroke-subtle px-5 py-2.5 text-sm font-semibold text-text-primary transition hover:border-stroke-strong">
                למחיר מהיר
              </Link>
            </div>
          </article>
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">שאלות נפוצות</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {page.faqs.map((item) => (
              <article key={item.question} className="rounded-[1.25rem] border border-stroke-subtle bg-surface-base p-5">
                <h3 className="text-lg font-semibold">{item.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
