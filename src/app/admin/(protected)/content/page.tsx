"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AdminForm } from "@/components/AdminForm";
import type { Locale, SiteContentViewModel } from "@/core/site.types";

type SiteContentPayload = {
  editableContent?: Partial<SiteContentViewModel> | null;
  error?: string;
};

type EditableContentForm = {
  brandName: string;
  whatsappPhoneDigits: string;
  navQuoteCta: string;
  navLinks: SiteContentViewModel["navLinks"];
  hero: {
    eyebrow: string;
    title: string;
    accent: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
  industryEyebrow: string;
  industries: Array<{
    title: string;
    caption: string;
  }>;
  process: SiteContentViewModel["process"];
  solutions: Omit<SiteContentViewModel["solutions"], "diagnostics" | "cards">;
  gallery: Omit<SiteContentViewModel["gallery"], "items">;
  contentArchive: Omit<SiteContentViewModel["contentArchive"], "modules">;
  pricing: Omit<
    SiteContentViewModel["pricing"],
    "niches" | "packageOptions" | "deliveryModes" | "addonOptions"
  >;
  cases: Pick<SiteContentViewModel["cases"], "title">;
  faq: SiteContentViewModel["faq"];
  quote: SiteContentViewModel["quote"];
  footer: SiteContentViewModel["footer"];
};

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

type TextAreaFieldProps = TextFieldProps & {
  rows?: number;
};

const localeOptions: Locale[] = ["he", "en"];

const sectionLinks = [
  { id: "general", label: "General" },
  { id: "hero", label: "Hero" },
  { id: "industries", label: "Industries" },
  { id: "process", label: "Process" },
  { id: "solutions", label: "Solutions" },
  { id: "gallery", label: "Gallery" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
  { id: "quote", label: "Quote Form" },
  { id: "footer", label: "Footer" },
] as const;

function TextField({ label, value, onChange, placeholder }: TextFieldProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-zinc-300">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-white/30"
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange, placeholder, rows = 3 }: TextAreaFieldProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-zinc-300">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-white/30"
      />
    </label>
  );
}

function normalizeEditableContent(content?: Partial<SiteContentViewModel> | null): EditableContentForm {
  return {
    brandName: content?.brandName || "",
    whatsappPhoneDigits: content?.whatsappPhoneDigits || "",
    navQuoteCta: content?.navQuoteCta || "",
    navLinks: (content?.navLinks || []).map((item) => ({
      label: item.label || "",
      href: item.href || "#",
      sectionId: item.sectionId || "top",
    })),
    hero: {
      eyebrow: content?.hero?.eyebrow || "",
      title: content?.hero?.title || "",
      accent: content?.hero?.accent || "",
      description: content?.hero?.description || "",
      primaryCta: content?.hero?.primaryCta || "",
      secondaryCta: content?.hero?.secondaryCta || "",
    },
    industryEyebrow: content?.industryEyebrow || "",
    industries: (content?.industries || []).map((item) => ({
      title: item.title || "",
      caption: item.caption || "",
    })),
    process: {
      title: content?.process?.title || "",
      steps: (content?.process?.steps || []).map((step) => ({
        title: step.title || "",
        subtitle: step.subtitle || "",
      })),
    },
    solutions: {
      title: content?.solutions?.title || "",
      description: content?.solutions?.description || "",
      chainTitle: content?.solutions?.chainTitle || "",
      chainStages: content?.solutions?.chainStages || [],
      diagnosticsTitle: content?.solutions?.diagnosticsTitle || "",
      diagnosticsDescription: content?.solutions?.diagnosticsDescription || "",
      strategicStatement: {
        title: content?.solutions?.strategicStatement?.title || "",
        body: content?.solutions?.strategicStatement?.body || "",
        highlight: content?.solutions?.strategicStatement?.highlight || "",
      },
      packagePanelTitle: content?.solutions?.packagePanelTitle || "",
      packagePanelCta: content?.solutions?.packagePanelCta || "",
    },
    gallery: {
      title: content?.gallery?.title || "",
      description: content?.gallery?.description || "",
      detailsCta: content?.gallery?.detailsCta || "",
      cardNote: content?.gallery?.cardNote || "",
    },
    contentArchive: {
      eyebrow: content?.contentArchive?.eyebrow || "",
      title: content?.contentArchive?.title || "",
      description: content?.contentArchive?.description || "",
      filters: {
        all: content?.contentArchive?.filters?.all || "",
        reel: content?.contentArchive?.filters?.reel || "",
        short: content?.contentArchive?.filters?.short || "",
        photo: content?.contentArchive?.filters?.photo || "",
      },
      productionFilters: {
        all: content?.contentArchive?.productionFilters?.all || "",
        ugc: content?.contentArchive?.productionFilters?.ugc || "",
        lighting: content?.contentArchive?.productionFilters?.lighting || "",
        ai: content?.contentArchive?.productionFilters?.ai || "",
      },
      emptyLabel: content?.contentArchive?.emptyLabel || "",
    },
    pricing: {
      title: content?.pricing?.title || "",
      description: content?.pricing?.description || "",
      vatNote: content?.pricing?.vatNote || "",
      labels: {
        niche: content?.pricing?.labels?.niche || "",
        packageType: content?.pricing?.labels?.packageType || "",
        deliveryMode: content?.pricing?.labels?.deliveryMode || "",
        estimate: content?.pricing?.labels?.estimate || "",
        addons: content?.pricing?.labels?.addons || "",
        notes: content?.pricing?.labels?.notes || "",
        breakdown: content?.pricing?.labels?.breakdown || "",
      },
      openWhatsAppCta: content?.pricing?.openWhatsAppCta || "",
      saveLeadCta: content?.pricing?.saveLeadCta || "",
      notesPlaceholder: content?.pricing?.notesPlaceholder || "",
      stats: (content?.pricing?.stats || []).map((item) => ({
        label: item.label || "",
        value: item.value || "",
      })),
    },
    cases: {
      title: content?.cases?.title || "",
    },
    faq: {
      title: content?.faq?.title || "",
      items: (content?.faq?.items || []).map((item) => ({
        question: item.question || "",
        answer: item.answer || "",
      })),
    },
    quote: {
      title: content?.quote?.title || "",
      nameLabel: content?.quote?.nameLabel || "",
      phoneLabel: content?.quote?.phoneLabel || "",
      businessLabel: content?.quote?.businessLabel || "",
      messageLabel: content?.quote?.messageLabel || "",
      submitLabel: content?.quote?.submitLabel || "",
      successMessage: content?.quote?.successMessage || "",
      errorMessage: content?.quote?.errorMessage || "",
    },
    footer: {
      note: content?.footer?.note || "",
      copyright: content?.footer?.copyright || "",
      navTitle: content?.footer?.navTitle || "",
      contactTitle: content?.footer?.contactTitle || "",
      ctaTitle: content?.footer?.ctaTitle || "",
      ctaButton: content?.footer?.ctaButton || "",
      email: content?.footer?.email || "",
      phone: content?.footer?.phone || "",
      location: content?.footer?.location || "",
    },
  };
}

export default function AdminContentPage() {
  const [locale, setLocale] = useState<Locale>("he");
  const [form, setForm] = useState<EditableContentForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setMessage("");

      try {
        const response = await fetch(`/api/site-content?locale=${locale}`, { cache: "no-store" });
        const payload = (await response.json()) as SiteContentPayload;
        if (!response.ok) {
          throw new Error(payload.error || "Failed to load localized content.");
        }

        if (!cancelled) {
          setForm(normalizeEditableContent(payload.editableContent));
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(error instanceof Error ? error.message : "Failed to load localized content.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [locale, refreshToken]);

  async function handleSave() {
    if (!form) {
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/site-content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locale, content: form }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || "Failed to save localized content.");
      }

      setMessage(`Locale ${locale.toUpperCase()} content was saved.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save localized content.");
    } finally {
      setSaving(false);
    }
  }

  async function handleResetOverrides() {
    setResetting(true);
    setMessage("");

    try {
      const response = await fetch("/api/site-content?scope=all", {
        method: "DELETE",
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || "Failed to reset localized overrides.");
      }

      setMessage("HE/EN overrides were reset to base content.");
      setRefreshToken((prev) => prev + 1);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to reset localized overrides.");
    } finally {
      setResetting(false);
    }
  }

  if (loading && !form) {
    return (
      <div className="space-y-5">
        <header>
          <h1 className="text-2xl font-semibold">Localized Content</h1>
          <p className="mt-1 text-sm text-zinc-400">Loading the current site content for editing.</p>
        </header>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="space-y-5">
        <header>
          <h1 className="text-2xl font-semibold">Localized Content</h1>
          <p className="mt-1 text-sm text-zinc-400">Unable to load the content editor.</p>
        </header>
        {message ? <p className="text-sm text-rose-300">{message}</p> : null}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="space-y-3">
        <div>
          <h1 className="text-2xl font-semibold">Localized Content</h1>
          <p className="mt-1 text-sm text-zinc-400">
            This page is preloaded with the current content from the live site. Edit text here, and use the dedicated
            tabs for media and solution cards.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {localeOptions.map((option) => {
            const active = option === locale;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setLocale(option)}
                className={`rounded-md border px-3 py-2 text-sm transition ${
                  active
                    ? "border-zinc-100 bg-zinc-100 text-zinc-900"
                    : "border-white/15 bg-black/20 text-zinc-300 hover:border-white/30"
                }`}
              >
                {option.toUpperCase()}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2">
          {sectionLinks.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition hover:border-white/30"
            >
              {section.label}
            </a>
          ))}
        </div>
      </header>

      <AdminForm
        title="Related Editors"
        description="Media assets and solution cards are managed in separate tabs so they stay synced with the database."
      >
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/admin/pages" className="rounded-md border border-white/15 px-3 py-2 text-zinc-300 hover:border-white/30">
            Hero media
          </Link>
          <Link href="/admin/gallery" className="rounded-md border border-white/15 px-3 py-2 text-zinc-300 hover:border-white/30">
            Gallery items
          </Link>
          <Link href="/admin/solutions" className="rounded-md border border-white/15 px-3 py-2 text-zinc-300 hover:border-white/30">
            Solution cards
          </Link>
        </div>
      </AdminForm>

      <AdminForm title="General" description="Brand name, WhatsApp number, and top navigation labels.">
        <div id="general" className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Brand name"
            value={form.brandName}
            onChange={(value) => setForm((prev) => (prev ? { ...prev, brandName: value } : prev))}
          />
          <TextField
            label="WhatsApp digits"
            value={form.whatsappPhoneDigits}
            onChange={(value) => setForm((prev) => (prev ? { ...prev, whatsappPhoneDigits: value } : prev))}
            placeholder="972..."
          />
          <TextField
            label="Quote CTA"
            value={form.navQuoteCta}
            onChange={(value) => setForm((prev) => (prev ? { ...prev, navQuoteCta: value } : prev))}
          />
          <div className="md:col-span-2 grid gap-3 md:grid-cols-2">
            {form.navLinks.map((item, index) => (
              <TextField
                key={`${item.href}-${index}`}
                label={`Navigation label ${index + 1}`}
                value={item.label}
                onChange={(value) =>
                  setForm((prev) =>
                    prev
                      ? {
                          ...prev,
                          navLinks: prev.navLinks.map((link, linkIndex) =>
                            linkIndex === index ? { ...link, label: value } : link,
                          ),
                        }
                      : prev,
                  )
                }
              />
            ))}
          </div>
        </div>
      </AdminForm>

      <AdminForm title="Hero" description="Main hero text shown on the first screen.">
        <div id="hero" className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Eyebrow"
            value={form.hero.eyebrow}
            onChange={(value) => setForm((prev) => (prev ? { ...prev, hero: { ...prev.hero, eyebrow: value } } : prev))}
          />
          <TextField
            label="Accent line"
            value={form.hero.accent}
            onChange={(value) => setForm((prev) => (prev ? { ...prev, hero: { ...prev.hero, accent: value } } : prev))}
          />
          <div className="md:col-span-2">
            <TextField
              label="Main title"
              value={form.hero.title}
              onChange={(value) => setForm((prev) => (prev ? { ...prev, hero: { ...prev.hero, title: value } } : prev))}
            />
          </div>
          <div className="md:col-span-2">
            <TextAreaField
              label="Description"
              value={form.hero.description}
              onChange={(value) =>
                setForm((prev) => (prev ? { ...prev, hero: { ...prev.hero, description: value } } : prev))
              }
              rows={4}
            />
          </div>
          <TextField
            label="Primary CTA"
            value={form.hero.primaryCta}
            onChange={(value) =>
              setForm((prev) => (prev ? { ...prev, hero: { ...prev.hero, primaryCta: value } } : prev))
            }
          />
          <TextField
            label="Secondary CTA"
            value={form.hero.secondaryCta}
            onChange={(value) =>
              setForm((prev) => (prev ? { ...prev, hero: { ...prev.hero, secondaryCta: value } } : prev))
            }
          />
        </div>
      </AdminForm>

      <AdminForm title="Industries" description="Category cards shown below the solutions section.">
        <div id="industries" className="space-y-4">
          <TextField
            label="Section eyebrow"
            value={form.industryEyebrow}
            onChange={(value) => setForm((prev) => (prev ? { ...prev, industryEyebrow: value } : prev))}
          />
          <div className="grid gap-4 md:grid-cols-2">
            {form.industries.map((item, index) => (
              <div key={`industry-${index + 1}`} className="rounded-lg border border-white/10 p-4">
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-zinc-500">Industry {index + 1}</p>
                <div className="space-y-3">
                  <TextField
                    label="Title"
                    value={item.title}
                    onChange={(value) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              industries: prev.industries.map((industry, industryIndex) =>
                                industryIndex === index ? { ...industry, title: value } : industry,
                              ),
                            }
                          : prev,
                      )
                    }
                  />
                  <TextAreaField
                    label="Caption"
                    value={item.caption}
                    onChange={(value) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              industries: prev.industries.map((industry, industryIndex) =>
                                industryIndex === index ? { ...industry, caption: value } : industry,
                              ),
                            }
                          : prev,
                      )
                    }
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminForm>

      <AdminForm title="Process" description="Step-by-step flow shown on the landing page.">
        <div id="process" className="space-y-4">
          <TextField
            label="Section title"
            value={form.process.title}
            onChange={(value) => setForm((prev) => (prev ? { ...prev, process: { ...prev.process, title: value } } : prev))}
          />
          <div className="grid gap-4 md:grid-cols-2">
            {form.process.steps.map((step, index) => (
              <div key={`step-${index + 1}`} className="rounded-lg border border-white/10 p-4">
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-zinc-500">Step {index + 1}</p>
                <div className="space-y-3">
                  <TextField
                    label="Step title"
                    value={step.title}
                    onChange={(value) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              process: {
                                ...prev.process,
                                steps: prev.process.steps.map((item, itemIndex) =>
                                  itemIndex === index ? { ...item, title: value } : item,
                                ),
                              },
                            }
                          : prev,
                      )
                    }
                  />
                  <TextAreaField
                    label="Step description"
                    value={step.subtitle}
                    onChange={(value) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              process: {
                                ...prev.process,
                                steps: prev.process.steps.map((item, itemIndex) =>
                                  itemIndex === index ? { ...item, subtitle: value } : item,
                                ),
                              },
                            }
                          : prev,
                      )
                    }
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminForm>

      <AdminForm title="Solutions Section" description="Headings and strategic copy above the solution cards.">
        <div id="solutions" className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Section title"
            value={form.solutions.title}
            onChange={(value) => setForm((prev) => (prev ? { ...prev, solutions: { ...prev.solutions, title: value } } : prev))}
          />
          <TextField
            label="Client chain title"
            value={form.solutions.chainTitle}
            onChange={(value) =>
              setForm((prev) => (prev ? { ...prev, solutions: { ...prev.solutions, chainTitle: value } } : prev))
            }
          />
          <div className="md:col-span-2">
            <TextAreaField
              label="Section description"
              value={form.solutions.description}
              onChange={(value) =>
                setForm((prev) => (prev ? { ...prev, solutions: { ...prev.solutions, description: value } } : prev))
              }
              rows={3}
            />
          </div>
          <div className="md:col-span-2">
            <TextAreaField
              label="Client chain stages (one per line)"
              value={form.solutions.chainStages.join("\n")}
              onChange={(value) =>
                setForm((prev) =>
                  prev
                    ? {
                        ...prev,
                        solutions: {
                          ...prev.solutions,
                          chainStages: value.split("\n").map((item) => item.trim()).filter(Boolean),
                        },
                      }
                    : prev,
                )
              }
              rows={4}
            />
          </div>
          <TextField
            label="Diagnostics title"
            value={form.solutions.diagnosticsTitle}
            onChange={(value) =>
              setForm((prev) => (prev ? { ...prev, solutions: { ...prev.solutions, diagnosticsTitle: value } } : prev))
            }
          />
          <TextAreaField
            label="Diagnostics description"
            value={form.solutions.diagnosticsDescription}
            onChange={(value) =>
              setForm((prev) =>
                prev ? { ...prev, solutions: { ...prev.solutions, diagnosticsDescription: value } } : prev
              )
            }
            rows={3}
          />
          <TextField
            label="Strategic statement title"
            value={form.solutions.strategicStatement.title}
            onChange={(value) =>
              setForm((prev) =>
                prev
                  ? {
                      ...prev,
                      solutions: {
                        ...prev.solutions,
                        strategicStatement: { ...prev.solutions.strategicStatement, title: value },
                      },
                    }
                  : prev,
              )
            }
          />
          <TextField
            label="Strategic highlight"
            value={form.solutions.strategicStatement.highlight}
            onChange={(value) =>
              setForm((prev) =>
                prev
                  ? {
                      ...prev,
                      solutions: {
                        ...prev.solutions,
                        strategicStatement: { ...prev.solutions.strategicStatement, highlight: value },
                      },
                    }
                  : prev,
              )
            }
          />
          <div className="md:col-span-2">
            <TextAreaField
              label="Strategic statement body"
              value={form.solutions.strategicStatement.body}
              onChange={(value) =>
                setForm((prev) =>
                  prev
                    ? {
                        ...prev,
                        solutions: {
                          ...prev.solutions,
                          strategicStatement: { ...prev.solutions.strategicStatement, body: value },
                        },
                      }
                    : prev,
                )
              }
              rows={4}
            />
          </div>
          <TextField
            label="Package panel title"
            value={form.solutions.packagePanelTitle}
            onChange={(value) =>
              setForm((prev) => (prev ? { ...prev, solutions: { ...prev.solutions, packagePanelTitle: value } } : prev))
            }
          />
          <TextField
            label="Package panel CTA"
            value={form.solutions.packagePanelCta}
            onChange={(value) =>
              setForm((prev) => (prev ? { ...prev, solutions: { ...prev.solutions, packagePanelCta: value } } : prev))
            }
          />
        </div>
      </AdminForm>

      <AdminForm title="Gallery Section" description="Titles and labels around the showcase gallery.">
        <div id="gallery" className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Gallery title"
            value={form.gallery.title}
            onChange={(value) => setForm((prev) => (prev ? { ...prev, gallery: { ...prev.gallery, title: value } } : prev))}
          />
          <TextField
            label="Details CTA"
            value={form.gallery.detailsCta}
            onChange={(value) =>
              setForm((prev) => (prev ? { ...prev, gallery: { ...prev.gallery, detailsCta: value } } : prev))
            }
          />
          <div className="md:col-span-2">
            <TextAreaField
              label="Gallery description"
              value={form.gallery.description}
              onChange={(value) =>
                setForm((prev) => (prev ? { ...prev, gallery: { ...prev.gallery, description: value } } : prev))
              }
              rows={3}
            />
          </div>
          <div className="md:col-span-2">
            <TextField
              label="Card note"
              value={form.gallery.cardNote}
              onChange={(value) =>
                setForm((prev) => (prev ? { ...prev, gallery: { ...prev.gallery, cardNote: value } } : prev))
              }
            />
          </div>
          <div className="md:col-span-2 rounded-lg border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-zinc-200">Gallery Cards Editor (9:16 Photo / Video + Tier category)</p>
            <p className="mt-1 text-xs text-zinc-400">
              Use the gallery editor to manage existing cards from &quot;עבודות נבחרות&quot; and define each card&apos;s tier.
            </p>
            <Link
              href="/admin/gallery"
              className="mt-3 inline-flex rounded-md border border-white/20 px-3 py-2 text-sm text-zinc-200 hover:border-white/35"
            >
              Open gallery cards editor
            </Link>
          </div>
        </div>
      </AdminForm>

      <AdminForm title="Pricing" description="Calculator labels, section copy, and pricing stat chips.">
        <div id="pricing" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Section title"
              value={form.pricing.title}
              onChange={(value) => setForm((prev) => (prev ? { ...prev, pricing: { ...prev.pricing, title: value } } : prev))}
            />
            <TextField
              label="VAT note"
              value={form.pricing.vatNote}
              onChange={(value) =>
                setForm((prev) => (prev ? { ...prev, pricing: { ...prev.pricing, vatNote: value } } : prev))
              }
            />
            <div className="md:col-span-2">
              <TextAreaField
                label="Section description"
                value={form.pricing.description}
                onChange={(value) =>
                  setForm((prev) => (prev ? { ...prev, pricing: { ...prev.pricing, description: value } } : prev))
                }
                rows={3}
              />
            </div>
            <TextField
              label="Field label: niche"
              value={form.pricing.labels.niche}
              onChange={(value) =>
                setForm((prev) =>
                  prev ? { ...prev, pricing: { ...prev.pricing, labels: { ...prev.pricing.labels, niche: value } } } : prev,
                )
              }
            />
            <TextField
              label="Field label: package"
              value={form.pricing.labels.packageType}
              onChange={(value) =>
                setForm((prev) =>
                  prev
                    ? { ...prev, pricing: { ...prev.pricing, labels: { ...prev.pricing.labels, packageType: value } } }
                    : prev,
                )
              }
            />
            <TextField
              label="Field label: delivery"
              value={form.pricing.labels.deliveryMode}
              onChange={(value) =>
                setForm((prev) =>
                  prev
                    ? { ...prev, pricing: { ...prev.pricing, labels: { ...prev.pricing.labels, deliveryMode: value } } }
                    : prev,
                )
              }
            />
            <TextField
              label="Field label: estimate"
              value={form.pricing.labels.estimate}
              onChange={(value) =>
                setForm((prev) =>
                  prev ? { ...prev, pricing: { ...prev.pricing, labels: { ...prev.pricing.labels, estimate: value } } } : prev,
                )
              }
            />
            <TextField
              label="Field label: add-ons"
              value={form.pricing.labels.addons}
              onChange={(value) =>
                setForm((prev) =>
                  prev ? { ...prev, pricing: { ...prev.pricing, labels: { ...prev.pricing.labels, addons: value } } } : prev,
                )
              }
            />
            <TextField
              label="Field label: notes"
              value={form.pricing.labels.notes}
              onChange={(value) =>
                setForm((prev) =>
                  prev ? { ...prev, pricing: { ...prev.pricing, labels: { ...prev.pricing.labels, notes: value } } } : prev,
                )
              }
            />
            <TextField
              label="Field label: breakdown"
              value={form.pricing.labels.breakdown}
              onChange={(value) =>
                setForm((prev) =>
                  prev
                    ? { ...prev, pricing: { ...prev.pricing, labels: { ...prev.pricing.labels, breakdown: value } } }
                    : prev,
                )
              }
            />
            <TextField
              label="WhatsApp CTA"
              value={form.pricing.openWhatsAppCta}
              onChange={(value) =>
                setForm((prev) => (prev ? { ...prev, pricing: { ...prev.pricing, openWhatsAppCta: value } } : prev))
              }
            />
            <TextField
              label="Lead form CTA"
              value={form.pricing.saveLeadCta}
              onChange={(value) =>
                setForm((prev) => (prev ? { ...prev, pricing: { ...prev.pricing, saveLeadCta: value } } : prev))
              }
            />
            <div className="md:col-span-2">
              <TextAreaField
                label="Notes placeholder"
                value={form.pricing.notesPlaceholder}
                onChange={(value) =>
                  setForm((prev) => (prev ? { ...prev, pricing: { ...prev.pricing, notesPlaceholder: value } } : prev))
                }
                rows={3}
              />
            </div>
          </div>
        </div>
      </AdminForm>

      <AdminForm title="FAQ" description="Questions and answers shown near the quote form.">
        <div id="faq" className="space-y-4">
          <TextField
            label="FAQ section title"
            value={form.faq.title}
            onChange={(value) => setForm((prev) => (prev ? { ...prev, faq: { ...prev.faq, title: value } } : prev))}
          />
          <div className="space-y-3">
            {form.faq.items.map((item, index) => (
              <div key={`faq-${index + 1}`} className="rounded-lg border border-white/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">FAQ {index + 1}</p>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              faq: { ...prev.faq, items: prev.faq.items.filter((_, itemIndex) => itemIndex !== index) },
                            }
                          : prev,
                      )
                    }
                    className="rounded-md border border-rose-300/40 px-2 py-1 text-xs text-rose-200 hover:border-rose-300/60"
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-3 space-y-3">
                  <TextField
                    label="Question"
                    value={item.question}
                    onChange={(value) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              faq: {
                                ...prev.faq,
                                items: prev.faq.items.map((faqItem, faqIndex) =>
                                  faqIndex === index ? { ...faqItem, question: value } : faqItem,
                                ),
                              },
                            }
                          : prev,
                      )
                    }
                  />
                  <TextAreaField
                    label="Answer"
                    value={item.answer}
                    onChange={(value) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              faq: {
                                ...prev.faq,
                                items: prev.faq.items.map((faqItem, faqIndex) =>
                                  faqIndex === index ? { ...faqItem, answer: value } : faqItem,
                                ),
                              },
                            }
                          : prev,
                      )
                    }
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              setForm((prev) =>
                prev
                  ? {
                      ...prev,
                      faq: { ...prev.faq, items: [...prev.faq.items, { question: "", answer: "" }] },
                    }
                  : prev,
              )
            }
            className="rounded-md border border-white/20 px-3 py-2 text-sm text-zinc-300 hover:border-white/35"
          >
            Add FAQ item
          </button>
        </div>
      </AdminForm>

      <AdminForm title="Quote Form" description="Labels and messages for the contact form.">
        <div id="quote" className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Form title"
            value={form.quote.title}
            onChange={(value) => setForm((prev) => (prev ? { ...prev, quote: { ...prev.quote, title: value } } : prev))}
          />
          <TextField
            label="Submit button"
            value={form.quote.submitLabel}
            onChange={(value) => setForm((prev) => (prev ? { ...prev, quote: { ...prev.quote, submitLabel: value } } : prev))}
          />
          <TextField
            label="Name label"
            value={form.quote.nameLabel}
            onChange={(value) => setForm((prev) => (prev ? { ...prev, quote: { ...prev.quote, nameLabel: value } } : prev))}
          />
          <TextField
            label="Phone label"
            value={form.quote.phoneLabel}
            onChange={(value) => setForm((prev) => (prev ? { ...prev, quote: { ...prev.quote, phoneLabel: value } } : prev))}
          />
          <TextField
            label="Business label"
            value={form.quote.businessLabel}
            onChange={(value) =>
              setForm((prev) => (prev ? { ...prev, quote: { ...prev.quote, businessLabel: value } } : prev))
            }
          />
          <TextField
            label="Message label"
            value={form.quote.messageLabel}
            onChange={(value) =>
              setForm((prev) => (prev ? { ...prev, quote: { ...prev.quote, messageLabel: value } } : prev))
            }
          />
          <TextField
            label="Success message"
            value={form.quote.successMessage}
            onChange={(value) =>
              setForm((prev) => (prev ? { ...prev, quote: { ...prev.quote, successMessage: value } } : prev))
            }
          />
          <TextField
            label="Error message"
            value={form.quote.errorMessage}
            onChange={(value) =>
              setForm((prev) => (prev ? { ...prev, quote: { ...prev.quote, errorMessage: value } } : prev))
            }
          />
        </div>
      </AdminForm>

      <AdminForm title="Footer" description="Footer text, contact labels, and business details.">
        <div id="footer" className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <TextAreaField
              label="Footer note"
              value={form.footer.note}
              onChange={(value) => setForm((prev) => (prev ? { ...prev, footer: { ...prev.footer, note: value } } : prev))}
              rows={3}
            />
          </div>
          <TextField
            label="Copyright"
            value={form.footer.copyright}
            onChange={(value) =>
              setForm((prev) => (prev ? { ...prev, footer: { ...prev.footer, copyright: value } } : prev))
            }
          />
          <TextField
            label="Cases title"
            value={form.cases.title}
            onChange={(value) => setForm((prev) => (prev ? { ...prev, cases: { ...prev.cases, title: value } } : prev))}
          />
          <TextField
            label="Footer nav title"
            value={form.footer.navTitle}
            onChange={(value) =>
              setForm((prev) => (prev ? { ...prev, footer: { ...prev.footer, navTitle: value } } : prev))
            }
          />
          <TextField
            label="Footer contact title"
            value={form.footer.contactTitle}
            onChange={(value) =>
              setForm((prev) => (prev ? { ...prev, footer: { ...prev.footer, contactTitle: value } } : prev))
            }
          />
          <TextField
            label="Footer CTA title"
            value={form.footer.ctaTitle}
            onChange={(value) =>
              setForm((prev) => (prev ? { ...prev, footer: { ...prev.footer, ctaTitle: value } } : prev))
            }
          />
          <TextField
            label="Footer CTA button"
            value={form.footer.ctaButton}
            onChange={(value) =>
              setForm((prev) => (prev ? { ...prev, footer: { ...prev.footer, ctaButton: value } } : prev))
            }
          />
          <TextField
            label="Email"
            value={form.footer.email}
            onChange={(value) => setForm((prev) => (prev ? { ...prev, footer: { ...prev.footer, email: value } } : prev))}
          />
          <TextField
            label="Phone"
            value={form.footer.phone}
            onChange={(value) => setForm((prev) => (prev ? { ...prev, footer: { ...prev.footer, phone: value } } : prev))}
          />
          <TextField
            label="Location"
            value={form.footer.location}
            onChange={(value) =>
              setForm((prev) => (prev ? { ...prev, footer: { ...prev.footer, location: value } } : prev))
            }
          />
        </div>
      </AdminForm>

      <div className="sticky bottom-4 z-20 flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-[#0f1219]/95 p-4 backdrop-blur">
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving || resetting || loading}
          className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-white disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save localized content"}
        </button>
        <button
          type="button"
          onClick={() => void handleResetOverrides()}
          disabled={saving || resetting || loading}
          className="rounded-md border border-amber-300/40 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-100 transition hover:border-amber-300/60 hover:bg-amber-400/15 disabled:opacity-60"
        >
          {resetting ? "Resetting..." : "Reset HE/EN overrides"}
        </button>
        {message ? <p className="text-sm text-zinc-300">{message}</p> : null}
      </div>
    </div>
  );
}
