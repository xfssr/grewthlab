import type { Metadata } from "next";
import Link from "next/link";

import { seoProblems } from "@/lib/seo-data";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "SEO Problem Pages",
  description: "Index of hidden SEO problem pages for local-business search intent.",
  alternates: {
    canonical: absoluteUrl("/problems"),
  },
};

export default function ProblemsIndexPage() {
  return (
    <main className="min-h-screen bg-bg-base text-text-primary">
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <p className="ui-kicker">SEO problems</p>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl">Problem pages</h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-text-muted">
          Search-intent pages built around business problems, symptoms, and the matching solution package.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {seoProblems.map((item) => (
            <Link
              key={item.slug}
              href={`/problems/${item.slug}`}
              className="rounded-[1.25rem] border border-stroke-subtle bg-surface-base p-5 transition hover:border-stroke-strong"
            >
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
