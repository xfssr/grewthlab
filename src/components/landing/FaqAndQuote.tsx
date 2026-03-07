"use client";

import { useState } from "react";

import { motion } from "framer-motion";

import { fadeUp, revealWhileInView, staggerParent, useReducedMotionPreference } from "@/components/landing/motion";
import { BrandButton } from "@/components/landing/ui/BrandButton";
import { SectionHeading } from "@/components/landing/ui/SectionHeading";
import { SectionShell } from "@/components/landing/ui/SectionShell";
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
    <SectionShell id="faq" className="border-b border-stroke-subtle py-14 sm:py-16" ariaLabelledBy="faq-title">
      <div className="grid gap-6 lg:grid-cols-12">
        <SurfaceCard as="div" className="rounded-[1.5rem] border-stroke-subtle bg-surface-base p-6 lg:col-span-8">
          <SectionHeading id="faq-title" eyebrow="FAQ" title={faqTitle} className="max-w-3xl" />
          <motion.ul variants={staggerParent} {...reveal} className="mt-5 divide-y divide-stroke-subtle">
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
          className="rounded-[1.5rem] border-stroke-subtle bg-gradient-to-b from-surface-base to-[#101621] p-6 lg:col-span-4"
        >
          <h2 id="quote-title" className="font-display text-4xl leading-tight text-text-primary lg:text-3xl">
            {quoteTitle}
          </h2>
          <form className="mt-4 space-y-3" aria-label="Quick quote form" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.13em] text-text-soft">{nameLabel}</span>
              <input
                type="text"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="w-full rounded-2xl border border-stroke-subtle bg-[#0f1520] px-4 py-3 text-base text-text-primary outline-none ring-offset-2 focus:ring-2 focus:ring-accent-primary"
                placeholder={nameLabel}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.13em] text-text-soft">{phoneLabel}</span>
              <input
                type="tel"
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                className="w-full rounded-2xl border border-stroke-subtle bg-[#0f1520] px-4 py-3 text-base text-text-primary outline-none ring-offset-2 focus:ring-2 focus:ring-accent-primary"
                placeholder={phoneLabel}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.13em] text-text-soft">{businessLabel}</span>
              <input
                type="text"
                value={form.business}
                onChange={(event) => setForm((prev) => ({ ...prev, business: event.target.value }))}
                className="w-full rounded-2xl border border-stroke-subtle bg-[#0f1520] px-4 py-3 text-base text-text-primary outline-none ring-offset-2 focus:ring-2 focus:ring-accent-primary"
                placeholder={businessLabel}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.13em] text-text-soft">{messageLabel}</span>
              <textarea
                rows={3}
                value={form.message}
                onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                className="w-full rounded-2xl border border-stroke-subtle bg-[#0f1520] px-4 py-3 text-base outline-none ring-offset-2 focus:ring-2 focus:ring-accent-primary"
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
    </SectionShell>
  );
}
