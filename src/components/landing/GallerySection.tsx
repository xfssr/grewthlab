"use client";
/* eslint-disable @next/next/no-img-element */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type TouchEvent,
  type WheelEvent,
} from "react";

import { AnimatePresence, motion } from "framer-motion";

import { fadeUp, revealWhileInView, staggerParent, useReducedMotionPreference } from "@/components/landing/motion";
import { BrandButton } from "@/components/landing/ui/BrandButton";
import { SectionHeading } from "@/components/landing/ui/SectionHeading";
import { SectionShell } from "@/components/landing/ui/SectionShell";
import { SurfaceCard } from "@/components/landing/ui/SurfaceCard";
import type { ContentArchiveModule, LocalizedMediaAsset } from "@/core/site.types";

type GallerySectionProps = {
  title: string;
  description: string;
  detailsCta: string;
  cardNote: string;
  items: LocalizedMediaAsset[];
  archive: {
    eyebrow: string;
    title: string;
    description: string;
    emptyLabel: string;
    modules: ContentArchiveModule[];
  };
};

function MediaPlaceholder({ alt }: { alt: string }) {
  return (
    <div className="flex h-full min-h-[180px] items-center justify-center bg-gradient-to-br from-[#3a3128] via-[#231e1a] to-[#171413] p-4 text-center text-sm text-[#f4ece2]">
      {alt}
    </div>
  );
}

const ARCHIVE_AUTOPLAY_MS = 4200;

export function GallerySection({ title, description, detailsCta, cardNote, items, archive }: GallerySectionProps) {
  const [activeMedia, setActiveMedia] = useState<LocalizedMediaAsset | null>(null);
  const [failedIds, setFailedIds] = useState<Record<string, boolean>>({});

  const [archiveOpen, setArchiveOpen] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(archive.modules[0]?.id ?? null);
  const [activeArchiveId, setActiveArchiveId] = useState<string | null>(null);
  const [archiveAutoplayPaused, setArchiveAutoplayPaused] = useState(false);
  const [archiveAutoplayProgress, setArchiveAutoplayProgress] = useState(0);

  const mediaCloseRef = useRef<HTMLButtonElement>(null);
  const archiveCloseRef = useRef<HTMLButtonElement>(null);
  const mediaTriggerRef = useRef<HTMLElement | null>(null);
  const archiveTriggerRef = useRef<HTMLElement | null>(null);
  const hasOpenedMediaRef = useRef(false);
  const hasOpenedArchiveRef = useRef(false);
  const dragStartXRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const lastWheelTsRef = useRef(0);
  const autoplayResumeTimerRef = useRef<number | null>(null);

  const isHebrewUi = /[\u0590-\u05FF]/.test(`${title} ${archive.title} ${archive.description}`);
  const closeLabel = isHebrewUi ? "\u05e1\u05d2\u05d9\u05e8\u05d4" : "Close";
  const workflowTitle = isHebrewUi
    ? "\u05d0\u05d9\u05da \u05e0\u05d1\u05e0\u05d4 \u05d4\u05ea\u05d5\u05db\u05df \u05d1\u05e4\u05d5\u05e2\u05dc"
    : "How this content is produced";
  const workflowLeftTitle = isHebrewUi ? "\u05e9\u05dc\u05d1\u05d9\u05dd 1-3" : "Steps 1-3";
  const workflowRightTitle = isHebrewUi ? "\u05e9\u05dc\u05d1\u05d9\u05dd 4-6" : "Steps 4-6";
  const previousContentLabel = isHebrewUi ? "\u05ea\u05d5\u05db\u05df \u05e7\u05d5\u05d3\u05dd" : "Previous content";
  const nextContentLabel = isHebrewUi ? "\u05ea\u05d5\u05db\u05df \u05d4\u05d1\u05d0" : "Next content";
  const previousArrowGlyph = isHebrewUi ? ">" : "<";
  const nextArrowGlyph = isHebrewUi ? "<" : ">";
  const previousCardSideClass = "left-0";
  const nextCardSideClass = "right-0";
  const previousArrowSideClass = "-left-10";
  const nextArrowSideClass = "-right-10";
  const swipeHintLabel = isHebrewUi
    ? "\u05d2\u05dc\u05d9\u05dc\u05d4 \u05d0\u05d5 \u05d2\u05e8\u05d9\u05e8\u05d4 \u05db\u05d3\u05d9 \u05dc\u05e2\u05d1\u05d5\u05e8 \u05d1\u05d9\u05df \u05d4\u05ea\u05db\u05e0\u05d9\u05dd"
    : "Scroll or swipe to browse content";
  const autoplayLabel = isHebrewUi ? "\u05e0\u05d9\u05d2\u05d5\u05df \u05d0\u05d5\u05d8\u05d5\u05de\u05d8\u05d9" : "Autoplay";

  const galleryItems = useMemo(() => {
    const grouped = new Map<string, LocalizedMediaAsset>();
    for (const item of items) {
      const key = item.tier.trim() || item.title.trim() || item.id;
      if (!grouped.has(key)) {
        grouped.set(key, item);
      }
    }
    return Array.from(grouped.values()).slice(0, 10);
  }, [items]);
  const reduceMotion = useReducedMotionPreference();
  const reveal = revealWhileInView(reduceMotion, 0.2);

  const resolvedActiveModuleId = useMemo(() => {
    if (!archive.modules.length) {
      return null;
    }
    return archive.modules.some((module) => module.id === activeModuleId) ? activeModuleId : archive.modules[0].id;
  }, [archive.modules, activeModuleId]);

  const activeModule = useMemo(
    () => archive.modules.find((module) => module.id === resolvedActiveModuleId) ?? null,
    [archive.modules, resolvedActiveModuleId],
  );

  const archiveItems = useMemo(() => {
    if (!activeModule) {
      return [];
    }

    return activeModule.items;
  }, [activeModule]);

  const resolvedActiveArchiveId = useMemo(() => {
    if (!archiveItems.length) {
      return null;
    }
    return archiveItems.some((item) => item.id === activeArchiveId) ? activeArchiveId : archiveItems[0].id;
  }, [archiveItems, activeArchiveId]);

  const activeArchiveItem = useMemo(
    () => archiveItems.find((item) => item.id === resolvedActiveArchiveId) || null,
    [archiveItems, resolvedActiveArchiveId],
  );
  const activeArchiveIndex = useMemo(() => {
    if (!archiveItems.length || !resolvedActiveArchiveId) {
      return -1;
    }

    return archiveItems.findIndex((item) => item.id === resolvedActiveArchiveId);
  }, [archiveItems, resolvedActiveArchiveId]);
  const workflowSteps = useMemo(() => activeModule?.workflowSteps ?? [], [activeModule]);
  const workflowLeftSteps = useMemo(() => (activeModule?.workflowSteps ?? []).slice(0, 3), [activeModule]);
  const workflowRightSteps = useMemo(() => (activeModule?.workflowSteps ?? []).slice(3, 6), [activeModule]);
  const leftCarouselItem = useMemo(() => {
    if (!archiveItems.length || activeArchiveIndex < 0) {
      return null;
    }
    const index = (activeArchiveIndex - 1 + archiveItems.length) % archiveItems.length;
    return archiveItems[index] ?? null;
  }, [archiveItems, activeArchiveIndex]);
  const rightCarouselItem = useMemo(() => {
    if (!archiveItems.length || activeArchiveIndex < 0) {
      return null;
    }
    const index = (activeArchiveIndex + 1) % archiveItems.length;
    return archiveItems[index] ?? null;
  }, [archiveItems, activeArchiveIndex]);
  const visibleAutoplayProgress =
    archiveOpen && !archiveAutoplayPaused && !reduceMotion && archiveItems.length >= 2 ? archiveAutoplayProgress : 0;

  const closeMediaModal = () => setActiveMedia(null);
  const closeArchiveModal = () => setArchiveOpen(false);

  const openArchiveForCard = (cardId: string, trigger?: HTMLElement | null) => {
    const matchedModule = archive.modules.find((module) => module.sourceCardId === cardId) ?? archive.modules[0] ?? null;
    setActiveModuleId(matchedModule?.id ?? null);
    setActiveArchiveId(matchedModule?.items[0]?.id ?? null);
    if (trigger) {
      archiveTriggerRef.current = trigger;
    }
    setArchiveOpen(true);
  };

  const cycleArchiveItem = useCallback((direction: 1 | -1) => {
    if (!archiveItems.length || activeArchiveIndex < 0) {
      return;
    }

    const nextIndex = (activeArchiveIndex + direction + archiveItems.length) % archiveItems.length;
    setActiveArchiveId(archiveItems[nextIndex]?.id ?? null);
  }, [archiveItems, activeArchiveIndex]);

  const pauseArchiveAutoplay = useCallback((resumeAfterMs?: number) => {
    setArchiveAutoplayPaused(true);
    if (autoplayResumeTimerRef.current !== null) {
      window.clearTimeout(autoplayResumeTimerRef.current);
      autoplayResumeTimerRef.current = null;
    }
    if (resumeAfterMs && resumeAfterMs > 0) {
      autoplayResumeTimerRef.current = window.setTimeout(() => {
        setArchiveAutoplayPaused(false);
        autoplayResumeTimerRef.current = null;
      }, resumeAfterMs);
    }
  }, []);

  const navigateArchiveItem = useCallback(
    (direction: 1 | -1, resumeAfterMs = 2600) => {
      pauseArchiveAutoplay(resumeAfterMs);
      cycleArchiveItem(direction);
    },
    [pauseArchiveAutoplay, cycleArchiveItem],
  );

  const switchByDelta = (deltaX: number) => {
    if (Math.abs(deltaX) < 44) {
      return;
    }
    navigateArchiveItem(deltaX > 0 ? -1 : 1);
  };

  const handlePreviewPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }
    dragStartXRef.current = event.clientX;
  };

  const handlePreviewPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartXRef.current === null) {
      return;
    }
    const delta = event.clientX - dragStartXRef.current;
    dragStartXRef.current = null;
    switchByDelta(delta);
  };

  const handlePreviewTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
  };

  const handlePreviewTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null) {
      return;
    }
    const endX = event.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const delta = endX - touchStartXRef.current;
    touchStartXRef.current = null;
    switchByDelta(delta);
  };

  const handlePreviewWheel = (event: WheelEvent<HTMLDivElement>) => {
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : 0;
    if (Math.abs(delta) < 14) {
      return;
    }
    const now = performance.now();
    if (now - lastWheelTsRef.current < 260) {
      return;
    }
    lastWheelTsRef.current = now;
    event.preventDefault();
    switchByDelta(-delta * 4);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        if (!archiveOpen) {
          return;
        }

        if (event.key === "ArrowLeft") {
          event.preventDefault();
          navigateArchiveItem(-1);
          return;
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          navigateArchiveItem(1);
        }
        return;
      }

      if (archiveOpen) {
        setArchiveOpen(false);
        return;
      }

      if (activeMedia) {
        setActiveMedia(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [archiveOpen, activeMedia, navigateArchiveItem]);

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

  useEffect(() => {
    if (archiveOpen) {
      hasOpenedArchiveRef.current = true;
      const timer = window.setTimeout(() => archiveCloseRef.current?.focus(), 0);
      return () => window.clearTimeout(timer);
    }

    if (hasOpenedArchiveRef.current) {
      archiveTriggerRef.current?.focus();
      hasOpenedArchiveRef.current = false;
    }
  }, [archiveOpen]);

  useEffect(() => {
    return () => {
      if (autoplayResumeTimerRef.current !== null) {
        window.clearTimeout(autoplayResumeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!archiveOpen || archiveAutoplayPaused || reduceMotion || archiveItems.length < 2) {
      return;
    }

    let animationFrameId = 0;
    const startTs = performance.now();
    const tick = (ts: number) => {
      const progress = Math.min((ts - startTs) / ARCHIVE_AUTOPLAY_MS, 1);
      setArchiveAutoplayProgress(progress);
      if (progress >= 1) {
        cycleArchiveItem(1);
        return;
      }
      animationFrameId = window.requestAnimationFrame(tick);
    };

    animationFrameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [archiveOpen, archiveAutoplayPaused, reduceMotion, archiveItems.length, activeArchiveIndex, cycleArchiveItem]);

  return (
    <>
      <SectionShell id="gallery" className="border-b border-stroke-subtle py-14 sm:py-16" ariaLabelledBy="gallery-title">
        <SectionHeading id="gallery-title" eyebrow="Selected work" title={title} description={description} />
        <motion.ul variants={staggerParent} {...reveal} className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item) => (
            <motion.li key={item.id} variants={fadeUp}>
              <SurfaceCard className="group overflow-hidden rounded-[1.5rem] border-stroke-subtle bg-surface-base text-start transition hover:-translate-y-1">
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
                          loading="lazy"
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
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            onError={() => setFailedIds((prev) => ({ ...prev, [item.id]: true }))}
                          />
                        ) : (
                          <MediaPlaceholder alt={item.alt} />
                        )}
                        <span className="absolute inset-0 flex items-center justify-center bg-black/35 text-white">
                          <span className="rounded-full border border-white/40 bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]">
                            Video
                          </span>
                        </span>
                      </>
                    )}
                  </div>
                  <div className="px-4 pt-3">
                    <p className="line-clamp-2 text-sm text-text-muted">{item.tier || item.title || item.alt}</p>
                  </div>
                </button>
                <div className="px-4 pb-4 pt-2">
                  <p className="text-xs text-text-soft">{cardNote}</p>
                  <BrandButton
                    onClick={(event) => openArchiveForCard(item.id, event.currentTarget)}
                    variant="outline"
                    size="sm"
                    className="mt-3 rounded-xl"
                  >
                    {detailsCta}
                  </BrandButton>
                </div>
              </SurfaceCard>
            </motion.li>
          ))}
        </motion.ul>
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
            onClick={closeMediaModal}
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
                  onClick={closeMediaModal}
                  className="rounded-md px-2 py-1 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                >
                  {closeLabel}
                </button>
              </div>
              <div className="bg-black">
                {activeMedia.type === "image" ? (
                  <img src={activeMedia.src} alt={activeMedia.alt} className="max-h-[75vh] w-full object-contain" />
                ) : (
                  <video src={activeMedia.src} poster={activeMedia.poster} controls autoPlay className="max-h-[75vh] w-full" />
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {archiveOpen ? (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/76 p-4"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeArchiveModal}
          >
            <motion.div
              className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/15 bg-[#11131a] shadow-2xl"
              initial={{ y: 24, opacity: 0.8, scale: 0.985 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0.8, scale: 0.985 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#f3c47a]">{archive.eyebrow}</p>
                  <p className="text-sm font-semibold text-white">{archive.title}</p>
                  <p className="line-clamp-1 max-w-3xl text-xs leading-relaxed text-white/70">{archive.description}</p>
                </div>
                <button
                  ref={archiveCloseRef}
                  type="button"
                  onClick={closeArchiveModal}
                  className="rounded-md px-2 py-1 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                >
                  {closeLabel}
                </button>
              </div>

              <div className="max-h-[74vh] overflow-y-auto p-4 sm:p-5">
                {archiveItems.length ? (
                  <div className="grid items-start gap-4 lg:grid-cols-[220px_minmax(0,1fr)_220px]">
                    <div className="order-1 lg:order-2">
                      {activeArchiveItem ? (
                        <>
                          <div
                            className="relative mx-auto w-full max-w-[780px] cursor-grab touch-pan-y px-4 active:cursor-grabbing sm:px-8 lg:px-0"
                            onMouseEnter={() => pauseArchiveAutoplay()}
                            onMouseLeave={() => setArchiveAutoplayPaused(false)}
                            onFocusCapture={() => pauseArchiveAutoplay()}
                            onBlurCapture={() => setArchiveAutoplayPaused(false)}
                            onPointerDown={handlePreviewPointerDown}
                            onPointerUp={handlePreviewPointerUp}
                            onTouchStart={handlePreviewTouchStart}
                            onTouchEnd={handlePreviewTouchEnd}
                            onWheel={handlePreviewWheel}
                            role="region"
                            aria-label={swipeHintLabel}
                          >
                            <div className="pointer-events-none absolute inset-x-12 top-1/2 h-48 -translate-y-1/2 rounded-full bg-[#d5b07a]/15 blur-3xl" />
                            {leftCarouselItem ? (
                              <motion.button
                                type="button"
                                onClick={() => navigateArchiveItem(-1)}
                                aria-label={previousContentLabel}
                                className={`absolute bottom-0 z-10 hidden rounded-xl lg:block ${previousCardSideClass}`}
                                initial={reduceMotion ? false : { opacity: 0.45, x: -6 }}
                                animate={reduceMotion ? undefined : { opacity: 0.6, x: 0 }}
                              >
                                <div className="w-[200px] overflow-hidden rounded-xl border border-white/15 bg-black/70 opacity-60 blur-[1.8px] transition duration-300 hover:opacity-80">
                                  <img
                                    src={leftCarouselItem.poster || leftCarouselItem.src}
                                    alt={leftCarouselItem.alt}
                                    loading="lazy"
                                    decoding="async"
                                    className="aspect-[9/16] w-full object-cover"
                                  />
                                </div>
                              </motion.button>
                            ) : null}
                            {rightCarouselItem ? (
                              <motion.button
                                type="button"
                                onClick={() => navigateArchiveItem(1)}
                                aria-label={nextContentLabel}
                                className={`absolute bottom-0 z-10 hidden rounded-xl lg:block ${nextCardSideClass}`}
                                initial={reduceMotion ? false : { opacity: 0.45, x: 6 }}
                                animate={reduceMotion ? undefined : { opacity: 0.6, x: 0 }}
                              >
                                <div className="w-[200px] overflow-hidden rounded-xl border border-white/15 bg-black/70 opacity-60 blur-[1.8px] transition duration-300 hover:opacity-80">
                                  <img
                                    src={rightCarouselItem.poster || rightCarouselItem.src}
                                    alt={rightCarouselItem.alt}
                                    loading="lazy"
                                    decoding="async"
                                    className="aspect-[9/16] w-full object-cover"
                                  />
                                </div>
                              </motion.button>
                            ) : null}

                            <div className="relative z-20 mx-auto w-full max-w-[250px]">
                              {archiveItems.length > 1 ? (
                                <button
                                  type="button"
                                  onClick={() => navigateArchiveItem(-1)}
                                  aria-label={previousContentLabel}
                                  className={`absolute top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/25 bg-black/35 p-2.5 text-white/90 backdrop-blur-md transition hover:border-white/50 hover:bg-black/50 ${previousArrowSideClass}`}
                                >
                                  <span className="block text-sm leading-none">{previousArrowGlyph}</span>
                                </button>
                              ) : null}
                              {archiveItems.length > 1 ? (
                                <button
                                  type="button"
                                  onClick={() => navigateArchiveItem(1)}
                                  aria-label={nextContentLabel}
                                  className={`absolute top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/25 bg-black/35 p-2.5 text-white/90 backdrop-blur-md transition hover:border-white/50 hover:bg-black/50 ${nextArrowSideClass}`}
                                >
                                  <span className="block text-sm leading-none">{nextArrowGlyph}</span>
                                </button>
                              ) : null}

                              <AnimatePresence mode="wait">
                                <motion.div
                                  key={activeArchiveItem.id}
                                  className="relative w-full overflow-hidden rounded-[1.1rem] border border-white/20 bg-black shadow-[0_20px_60px_-24px_rgba(0,0,0,0.9)]"
                                  initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.97 }}
                                  animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                                  exit={reduceMotion ? undefined : { opacity: 0, y: -8, scale: 0.97 }}
                                  transition={{ duration: 0.24, ease: "easeOut" }}
                                >
                                  {activeArchiveItem.mediaType === "video" ? (
                                    <video
                                      src={activeArchiveItem.src}
                                      poster={activeArchiveItem.poster}
                                      controls
                                      autoPlay
                                      className="aspect-[9/16] w-full object-cover"
                                    />
                                  ) : (
                                    <img
                                      src={activeArchiveItem.src}
                                      alt={activeArchiveItem.alt}
                                      decoding="async"
                                      className="aspect-[9/16] w-full object-cover"
                                    />
                                  )}
                                </motion.div>
                              </AnimatePresence>
                            </div>
                          </div>
                          <div className="mx-auto mt-3 w-full max-w-[560px] rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                            <div className="flex flex-wrap items-center justify-center gap-2">
                              <span className="rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[11px] text-white/75">
                                {activeArchiveItem.duration}
                              </span>
                              <span className="rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[11px] text-white/75">
                                {activeArchiveItem.platform}
                              </span>
                            </div>
                            <p className="mt-2 text-sm font-semibold text-white">{activeArchiveItem.title}</p>
                            <p className="mt-1 text-xs text-white/75">{activeArchiveItem.caption}</p>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-[10px] uppercase tracking-[0.14em] text-white/45">
                                {activeArchiveIndex >= 0 ? activeArchiveIndex + 1 : 0}/{archiveItems.length}
                              </span>
                              <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/15">
                                <div
                                  className="h-full rounded-full bg-[#d5b07a] transition-[width] duration-75 ease-linear"
                                  style={{
                                    width: `${Math.round(visibleAutoplayProgress * 100)}%`,
                                    opacity: archiveAutoplayPaused || reduceMotion || archiveItems.length < 2 ? 0.55 : 1,
                                  }}
                                />
                              </div>
                              <span className="text-[10px] uppercase tracking-[0.14em] text-white/45">{autoplayLabel}</span>
                            </div>
                            <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-white/45">{swipeHintLabel}</p>
                          </div>
                        </>
                      ) : null}
                    </div>

                    <aside className="order-2 rounded-xl border border-white/10 bg-white/5 p-3.5 lg:hidden">
                      <p className="text-[11px] font-semibold text-white">{workflowTitle}</p>
                      <ol className="mt-2 space-y-2">
                        {workflowSteps.map((step, index) => (
                          <li key={`workflow-mobile-${index + 1}`} className="flex items-start gap-2 text-[11px] text-white/80">
                            <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#d5b07a] text-[10px] font-semibold text-[#3b2a12]">
                              {index + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </aside>

                    <aside className="order-2 hidden rounded-xl border border-white/10 bg-white/5 p-3.5 lg:order-1 lg:block">
                      <p className="text-[11px] font-semibold text-white">{workflowTitle}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/55">{workflowLeftTitle}</p>
                      <ol className="mt-2 space-y-2">
                        {workflowLeftSteps.map((step, index) => (
                          <li key={`workflow-left-${index + 1}`} className="flex items-start gap-2 text-[11px] text-white/80">
                            <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#d5b07a] text-[10px] font-semibold text-[#3b2a12]">
                              {index + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </aside>

                    <aside className="order-3 hidden rounded-xl border border-white/10 bg-white/5 p-3.5 lg:block">
                      <p className="text-[11px] font-semibold text-white">{workflowTitle}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/55">{workflowRightTitle}</p>
                      <ol className="mt-2 space-y-2">
                        {workflowRightSteps.map((step, index) => (
                          <li key={`workflow-right-${index + 4}`} className="flex items-start gap-2 text-[11px] text-white/80">
                            <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#d5b07a] text-[10px] font-semibold text-[#3b2a12]">
                              {index + 4}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </aside>
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl border border-dashed border-white/20 bg-white/5 px-5 py-8 text-center text-sm text-white/80">
                    {archive.emptyLabel}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

