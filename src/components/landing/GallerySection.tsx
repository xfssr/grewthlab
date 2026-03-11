"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import { AnimatePresence, motion } from "framer-motion";

import { fadeUp, revealWhileInView, staggerParent, useReducedMotionPreference } from "@/components/landing/motion";
import { SectionHeading } from "@/components/landing/ui/SectionHeading";
import { SectionShell } from "@/components/landing/ui/SectionShell";
import { SurfaceCard } from "@/components/landing/ui/SurfaceCard";
import type { LocalizedMediaAsset } from "@/core/site.types";

type GallerySectionProps = {
  title: string;
  description: string;
  isRtl: boolean;
  items: LocalizedMediaAsset[];
};

function MediaPlaceholder({ alt }: { alt: string }) {
  return (
    <div className="flex h-full min-h-[180px] items-center justify-center bg-gradient-to-br from-[#3a3128] via-[#231e1a] to-[#171413] p-4 text-center text-sm text-[#f4ece2]">
      {alt}
    </div>
  );
}

type StoryTheme = "restaurant" | "beauty" | "real-estate" | "hotel" | "business" | "general";

function detectStoryTheme(tags: string[]): StoryTheme {
  const normalized = tags.map((tag) => tag.toLowerCase());
  if (normalized.some((tag) => ["restaurant", "menu", "food", "cafe", "bar", "catering"].includes(tag))) {
    return "restaurant";
  }
  if (normalized.some((tag) => ["beauty", "wellness", "portrait", "salon"].includes(tag))) {
    return "beauty";
  }
  if (normalized.some((tag) => ["real-estate", "property", "architecture"].includes(tag))) {
    return "real-estate";
  }
  if (normalized.some((tag) => ["hotel", "room", "hospitality"].includes(tag))) {
    return "hotel";
  }
  if (normalized.some((tag) => ["business", "service", "campaign", "planning", "strategy"].includes(tag))) {
    return "business";
  }
  return "general";
}

function buildGalleryStory(item: LocalizedMediaAsset, isHebrewUi: boolean) {
  const theme = detectStoryTheme(item.tags);
  const topic = item.tier?.trim() || item.title?.trim() || item.alt;
  const what = isHebrewUi
    ? `${item.type === "video" ? "קטע וידאו" : "נכס ויזואלי"} בנושא ${topic}.`
    : `${item.type === "video" ? "Video asset" : "Visual asset"} focused on ${topic}.`;

  const heByTheme: Record<StoryTheme, { problem: string; result: string }> = {
    restaurant: {
      problem: "לקוחות לא מבינים את האיכות והחוויה לפני הגעה.",
      result: "מעלה אמון ומייצר יותר הודעות להזמנה.",
    },
    beauty: {
      problem: "קשה להמחיש תוצאה ולהניע לתיאום תור.",
      result: "מחזק אמינות ומגדיל פניות רלוונטיות.",
    },
    "real-estate": {
      problem: "הנכס לא מוצג מספיק ברור כדי לייצר עניין.",
      result: "יותר צפיות איכותיות ויותר בקשות סיור.",
    },
    hotel: {
      problem: "האירוח נראה גנרי ולא יוצר רצון להזמין.",
      result: "תדמית פרימיום שמובילה ליותר הזמנות.",
    },
    business: {
      problem: "המסר מפוזר וקשה להבין מה העסק מציע.",
      result: "ערך ברור שמוביל לשיחה מהירה יותר.",
    },
    general: {
      problem: "יש חשיפה אבל בלי הקשר עסקי ברור.",
      result: "תוכן שמחבר בין עניין לפעולה.",
    },
  };

  const enByTheme: Record<StoryTheme, { problem: string; result: string }> = {
    restaurant: {
      problem: "Guests do not feel the quality before visiting.",
      result: "Builds trust and drives more booking inquiries.",
    },
    beauty: {
      problem: "Results are hard to communicate before contact.",
      result: "Improves trust and appointment intent.",
    },
    "real-estate": {
      problem: "The listing is visible but not compelling enough.",
      result: "Increases qualified views and tour requests.",
    },
    hotel: {
      problem: "Hospitality quality is not reflected online.",
      result: "Creates premium perception and more bookings.",
    },
    business: {
      problem: "Offer is unclear across channels.",
      result: "Clearer value and faster inquiry decisions.",
    },
    general: {
      problem: "Attention exists without clear conversion path.",
      result: "Connects visibility to actionable inquiries.",
    },
  };

  return isHebrewUi ? { what, ...heByTheme[theme] } : { what, ...enByTheme[theme] };
}

export function GallerySection({ title, description, isRtl, items }: GallerySectionProps) {
  const [activeMedia, setActiveMedia] = useState<LocalizedMediaAsset | null>(null);
  const [failedIds, setFailedIds] = useState<Record<string, boolean>>({});

  const mediaCloseRef = useRef<HTMLButtonElement>(null);
  const mediaTriggerRef = useRef<HTMLElement | null>(null);
  const hasOpenedMediaRef = useRef(false);

  const isHebrewUi = isRtl;
  const closeLabel = isHebrewUi ? "סגירה" : "Close";
  const galleryEyebrow = isHebrewUi ? "הוכחה מהשטח" : "Proof assets";
  const whatLabel = isHebrewUi ? "מה רואים" : "What is shown";
  const problemLabel = isHebrewUi ? "איזה חסם זה פותר" : "What problem it supports";
  const resultLabel = isHebrewUi ? "איזו תוצאה זה מקדם" : "What result it helps create";
  const videoBadge = isHebrewUi ? "וידאו" : "Video";

  const galleryItems = useMemo(() => {
    const grouped = new Map<string, LocalizedMediaAsset>();
    for (const item of items) {
      const key = item.tier.trim() || item.title.trim() || item.id;
      if (!grouped.has(key)) {
        grouped.set(key, item);
      }
    }
    return Array.from(grouped.values()).slice(0, 8);
  }, [items]);

  const reduceMotion = useReducedMotionPreference();
  const reveal = revealWhileInView(reduceMotion, 0.2);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && activeMedia) {
        setActiveMedia(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeMedia]);

  useEffect(() => {
    if (activeMedia) {
      hasOpenedMediaRef.current = true;
      const timer = window.setTimeout(() => mediaCloseRef.current?.focus(), 0);
      return () => window.clearTimeout(timer);
    }

    if (hasOpenedMediaRef.current) {
      mediaTriggerRef.current?.focus();
      hasOpenedMediaRef.current = false;
    }
  }, [activeMedia]);

  return (
    <>
      <SectionShell
        id="gallery"
        className="relative overflow-hidden border-b border-stroke-subtle py-12 sm:py-14"
        ariaLabelledBy="gallery-title"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <Image
            src="/images/generated/case-result.webp"
            alt={isHebrewUi ? "הוכחות מתוך תוכן ותוצאות" : "Proof gallery and outcomes"}
            fill
            sizes="100vw"
            className="object-cover object-center opacity-[0.3]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(104deg,rgba(8,11,17,0.92)_8%,rgba(10,13,20,0.86)_46%,rgba(11,14,22,0.84)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_0%,rgba(217,162,96,0.19),transparent_34%),radial-gradient(circle_at_84%_100%,rgba(86,109,158,0.2),transparent_36%)]" />
        </div>

        <div className="relative z-10">
          <SectionHeading id="gallery-title" eyebrow={galleryEyebrow} title={title} description={description} />
          <motion.ul variants={staggerParent} {...reveal} className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((item, index) => {
              const story = buildGalleryStory(item, isHebrewUi);
              const eagerLoad = index < 2;

              return (
                <motion.li key={item.id} variants={fadeUp}>
                  <SurfaceCard className="group overflow-hidden rounded-[1.5rem] border-white/12 bg-black/18 text-start transition hover:-translate-y-1">
                    <button
                      type="button"
                      onClick={(event) => {
                        mediaTriggerRef.current = event.currentTarget;
                        setActiveMedia(item);
                      }}
                      className="block w-full text-start"
                    >
                      <div className="relative h-56 overflow-hidden">
                        {item.type === "image" ? (
                          failedIds[item.id] ? (
                            <MediaPlaceholder alt={item.alt} />
                          ) : (
                            <img
                              src={item.src}
                              alt={item.alt}
                              loading={eagerLoad ? "eager" : "lazy"}
                              fetchPriority={eagerLoad ? "high" : "auto"}
                              sizes="(max-width: 768px) 96vw, (max-width: 1280px) 48vw, 32vw"
                              decoding="async"
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                              onError={() => setFailedIds((prev) => ({ ...prev, [item.id]: true }))}
                            />
                          )
                        ) : (
                          <>
                            {!failedIds[item.id] ? (
                              <img
                                src={item.poster || item.src}
                                alt={item.alt}
                                loading={eagerLoad ? "eager" : "lazy"}
                                fetchPriority={eagerLoad ? "high" : "auto"}
                                sizes="(max-width: 768px) 96vw, (max-width: 1280px) 48vw, 32vw"
                                decoding="async"
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                onError={() => setFailedIds((prev) => ({ ...prev, [item.id]: true }))}
                              />
                            ) : (
                              <MediaPlaceholder alt={item.alt} />
                            )}
                            <span className="absolute inset-0 flex items-center justify-center bg-black/35 text-white">
                              <span className="rounded-full border border-white/40 bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]">
                                {videoBadge}
                              </span>
                            </span>
                          </>
                        )}
                      </div>
                      <div className="px-4 pt-3">
                        <p className="line-clamp-1 text-xs uppercase tracking-[0.14em] text-text-soft">{item.tier || item.title || item.alt}</p>
                      </div>
                    </button>
                    <div className="space-y-2 px-4 pb-4 pt-2">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-soft">{whatLabel}</p>
                        <p className="mt-1 text-sm text-text-muted">{story.what}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-soft">{problemLabel}</p>
                        <p className="mt-1 text-sm text-text-muted">{story.problem}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-soft">{resultLabel}</p>
                        <p className="mt-1 text-sm text-text-muted">{story.result}</p>
                      </div>
                    </div>
                  </SurfaceCard>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>
      </SectionShell>

      <AnimatePresence>
        {activeMedia ? (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/72 p-4"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveMedia(null)}
          >
            <motion.div
              className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/15 bg-[#11131a] shadow-2xl"
              initial={{ y: 20, opacity: 0.8, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0.7, scale: 0.98 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <p className="text-sm text-white/80">{activeMedia.alt}</p>
                <button
                  ref={mediaCloseRef}
                  type="button"
                  onClick={() => setActiveMedia(null)}
                  className="rounded-md px-2 py-1 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                >
                  {closeLabel}
                </button>
              </div>
              <div className="bg-black">
                {activeMedia.type === "image" ? (
                  <img src={activeMedia.src} alt={activeMedia.alt} className="max-h-[75vh] w-full object-contain" />
                ) : (
                  <video
                    src={activeMedia.src}
                    poster={activeMedia.poster}
                    controls
                    autoPlay
                    playsInline
                    preload="metadata"
                    className="max-h-[75vh] w-full"
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
