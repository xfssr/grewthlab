"use client";

import { useState } from "react";

import { motion } from "framer-motion";

import { fadeUp, revealWhileInView, staggerParent, useReducedMotionPreference } from "@/components/landing/motion";
import { BrandButton } from "@/components/landing/ui/BrandButton";
import { SectionHeading } from "@/components/landing/ui/SectionHeading";
import { SectionShell } from "@/components/landing/ui/SectionShell";
import { SpotlightFrame } from "@/components/landing/ui/SpotlightFrame";
import { SurfaceCard } from "@/components/landing/ui/SurfaceCard";

type FaqAndQuoteProps = {
  faqTitle: string;
  faqItems: Array<{ question: string; answer: string }>;
  quoteTitle: string;
  nameLabel: string;
  phoneLabel: string;
  businessLabel: string;
  messageLabel: string;
  submitLabel: string;
  successMessage: string;
  errorMessage: string;
  onSubmitLead: (payload: { name: string; phone: string; business: string; message: string }) => Promise<void>;
};

export function FaqAndQuote({
  faqTitle,
  faqItems,
  quoteTitle,
  nameLabel,
  phoneLabel,
  businessLabel,
  messageLabel,
  submitLabel,
  successMessage,
  errorMessage,
  onSubmitLead,
}: FaqAndQuoteProps) {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string>("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    business: "",
    message: "",
  });

  const reduceMotion = useReducedMotionPreference();
  const reveal = revealWhileInView(reduceMotion, 0.2);
  const isHebrewUi = /[\u0590-\u05FF]/u.test(faqTitle);
  const faqEyebrow = isHebrewUi ? "\u05e9\u05d0\u05dc\u05d5\u05ea \u05e0\u05e4\u05d5\u05e6\u05d5\u05ea" : "FAQ";
  const formAriaLabel = isHebrewUi ? "\u05d8\u05d5\u05e4\u05e1 \u05d4\u05e6\u05e2\u05ea \u05de\u05d7\u05d9\u05e8 \u05de\u05d4\u05d9\u05e8\u05d4" : "Quick quote form";
  const summaryTitle = isHebrewUi ? "\u05de\u05e1\u05dc\u05d5\u05dc \u05e7\u05e9\u05e8" : "Contact flow";
  const summaryLineOne = isHebrewUi ? "1. \u05de\u05de\u05dc\u05d0\u05d9\u05dd \u05e4\u05e8\u05d8\u05d9\u05dd" : "1. Fill the short form";
  const summaryLineTwo = isHebrewUi ? "2. \u05de\u05e7\u05d1\u05dc\u05d9\u05dd \u05de\u05e1\u05dc\u05d5\u05dc \u05de\u05ea\u05d0\u05d9\u05dd" : "2. Get the right route";
  const summaryLineThree = isHebrewUi ? "3. \u05de\u05e9\u05d9\u05e7\u05d9\u05dd \u05d1\u05e4\u05d5\u05e2\u05dc" : "3. Launch and collect leads";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setFeedback(errorMessage);
      setFeedbackType("error");
      return;
    }

    setLoading(true);
    setFeedback("");
    setFeedbackType(null);

    try {
      await onSubmitLead(form);
      setFeedback(successMessage);
      setFeedbackType("success");
      setForm((prev) => ({ ...prev, message: "" }));
    } catch {
      setFeedback(errorMessage);
      setFeedbackType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionShell id="faq" className="border-b border-stroke-subtle py-12 sm:py-14" ariaLabelledBy="faq-title">
      <SpotlightFrame
        imageSrc="/images/generated/case-result.webp"
        imageAlt={isHebrewUi ? "\u05e9\u05d0\u05dc\u05d5\u05ea \u05d5\u05e4\u05e0\u05d9\u05d4" : "FAQ and quote section"}
        aside={
          <>
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-text-soft">{summaryTitle}</p>
            <div className="mt-3 space-y-2 text-sm text-text-primary/90">
              <p>{summaryLineOne}</p>
              <p>{summaryLineTwo}</p>
              <p>{summaryLineThree}</p>
            </div>
          </>
        }
      >
        <div className="grid gap-6 lg:grid-cols-12">
          <SurfaceCard as="div" className="rounded-[1.5rem] border-white/12 bg-black/16 p-6 lg:col-span-8">
            <SectionHeading id="faq-title" eyebrow={faqEyebrow} title={faqTitle} className="max-w-3xl" />
            <motion.ul variants={staggerParent} {...reveal} className="mt-5 divide-y divide-white/10">
              {faqItems.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                  <motion.li key={item.question} variants={fadeUp} className="py-2">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-3 py-2 text-start text-lg font-semibold text-text-primary"
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      aria-expanded={isOpen}
                    >
                      <span>{item.question}</span>
                      <span className={`text-text-soft transition ${isOpen ? "rotate-45" : ""}`}>+</span>
                    </button>
                    <div
                      className={`grid transition-all duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="pb-3 text-sm leading-relaxed text-text-muted">{item.answer}</p>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
          </SurfaceCard>

          <SurfaceCard
            as="aside"
            id="quote"
            className="rounded-[1.5rem] border-white/12 bg-black/18 p-6 lg:col-span-4"
          >
            <h2 id="quote-title" className="font-display text-4xl leading-tight text-text-primary lg:text-3xl">
              {quoteTitle}
            </h2>
            <form className="mt-4 space-y-3" aria-label={formAriaLabel} onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.13em] text-text-soft">{nameLabel}</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full rounded-2xl border border-white/12 bg-black/24 px-4 py-3 text-base text-text-primary outline-none ring-offset-2 focus:ring-2 focus:ring-accent-primary"
                  placeholder={nameLabel}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.13em] text-text-soft">{phoneLabel}</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                  className="w-full rounded-2xl border border-white/12 bg-black/24 px-4 py-3 text-base text-text-primary outline-none ring-offset-2 focus:ring-2 focus:ring-accent-primary"
                  placeholder={phoneLabel}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.13em] text-text-soft">{businessLabel}</span>
                <input
                  type="text"
                  value={form.business}
                  onChange={(event) => setForm((prev) => ({ ...prev, business: event.target.value }))}
                  className="w-full rounded-2xl border border-white/12 bg-black/24 px-4 py-3 text-base text-text-primary outline-none ring-offset-2 focus:ring-2 focus:ring-accent-primary"
                  placeholder={businessLabel}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.13em] text-text-soft">{messageLabel}</span>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                  className="w-full rounded-2xl border border-white/12 bg-black/24 px-4 py-3 text-base outline-none ring-offset-2 focus:ring-2 focus:ring-accent-primary"
                  placeholder={messageLabel}
                />
              </label>
              <BrandButton type="submit" disabled={loading} className="w-full disabled:opacity-60">
                {loading ? "..." : submitLabel}
              </BrandButton>
              {feedback ? (
                <p className={`text-sm ${feedbackType === "success" ? "text-emerald-400" : "text-rose-400"}`}>{feedback}</p>
              ) : null}
            </form>
          </SurfaceCard>
        </div>
      </SpotlightFrame>
    </SectionShell>
  );
}
