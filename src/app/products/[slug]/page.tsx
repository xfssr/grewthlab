import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { StructuredData } from "@/components/seo/StructuredData";
import { getSeoProductCard, getSeoProductPrice, seoProductBySlug } from "@/lib/seo-data";
import { absoluteUrl, siteName } from "@/lib/site";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return Array.from(seoProductBySlug.values()).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = seoProductBySlug.get(slug);
  const card = product ? getSeoProductCard(product.packageId) : null;

  if (!product || !card) {
    return {};
  }

  const title = `${product.title} | ${product.headline}`;
  const description = product.description;
  const url = absoluteUrl(`/products/${slug}`);

  return {
    title,
    description,
    keywords: product.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      images: [absoluteUrl("/og-image.jpg")],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/og-image.jpg")],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = seoProductBySlug.get(slug);

  if (!product) {
    notFound();
  }

  const card = getSeoProductCard(product.packageId);
  const basePrice = getSeoProductPrice(product.packageId);

  if (!card) {
    notFound();
  }

  const url = absoluteUrl(`/products/${slug}`);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: product.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: siteName,
    },
    category: "Digital marketing service package",
    image: absoluteUrl("/og-image.jpg"),
    url,
    offers: basePrice
      ? {
          "@type": "Offer",
          url,
          priceCurrency: "ILS",
          price: basePrice,
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
        }
      : undefined,
  };
  const breadcrumbSchema = {
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
        name: "Products",
        item: absoluteUrl("/products"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: url,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-bg-base text-text-primary">
      <StructuredData data={productSchema} />
      <StructuredData data={faqSchema} />
      <StructuredData data={breadcrumbSchema} />
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <p className="ui-kicker">SEO product page</p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl leading-[1.02] sm:text-5xl lg:text-6xl">{product.headline}</h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-text-muted sm:text-lg">{product.description}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {product.keywords.map((item) => (
            <span key={item} className="rounded-full border border-stroke-subtle bg-surface-base px-3 py-1.5 text-xs text-text-soft">
              {item}
            </span>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-[1.25rem] border border-stroke-subtle bg-surface-base p-5 md:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-soft">Package</p>
            <h2 className="mt-3 text-2xl font-semibold">{product.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">{product.searchIntent}</p>
            {basePrice ? <p className="mt-4 text-lg font-semibold text-accent-primary">Starting from ₪{basePrice.toLocaleString("en-US")}</p> : null}
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/#pricing" className="rounded-full bg-accent-primary px-5 py-2.5 text-sm font-semibold text-text-inverse transition hover:opacity-90">
                לקבלת מחיר
              </Link>
              <Link href="/" className="rounded-full border border-stroke-subtle px-5 py-2.5 text-sm font-semibold text-text-primary transition hover:border-stroke-strong">
                חזרה ללנדינג
              </Link>
            </div>
          </article>

          <article className="rounded-[1.25rem] border border-stroke-subtle bg-surface-base p-5 md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-soft">Problem</p>
            <p className="mt-2 text-base leading-relaxed text-text-muted">{card.problem}</p>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-text-soft">What is included</p>
            <div className="mt-2 whitespace-pre-line rounded-xl border border-stroke-subtle bg-surface-muted/40 p-4 text-sm leading-relaxed text-text-soft">
              {card.whatWeDo}
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-text-soft">Result</p>
            <p className="mt-2 text-base leading-relaxed text-text-muted">{card.outcome}</p>
          </article>
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">שאלות נפוצות על {product.title}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {product.faqs.map((item) => (
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
