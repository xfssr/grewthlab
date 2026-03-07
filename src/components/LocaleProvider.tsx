"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { getSiteContent } from "@/core/site.content";
import type { Locale, SiteContentViewModel } from "@/core/site.types";

const LOCALE_STORAGE_KEY = "landing-locale";

type LocaleContextValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  content: SiteContentViewModel;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function isLocale(value: string | null): value is Locale {
  return value === "en" || value === "he";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("he");
  const [content, setContent] = useState<SiteContentViewModel>(() => getSiteContent("he"));

  useEffect(() => {
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(saved)) {
      setLocale(saved);
    }
  }, []);

  useEffect(() => {
    // Keep immediate local fallback so UI stays responsive.
    setContent(getSiteContent(locale));
  }, [locale]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadServerContent() {
      try {
        const response = await fetch(`/api/site-content?locale=${locale}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as { content?: SiteContentViewModel };
        if (payload.content) {
          setContent(payload.content);
        }
      } catch {
        // Keep local content fallback when API is unavailable.
      }
    }

    void loadServerContent();
    return () => controller.abort();
  }, [locale]);

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = content.dir;
  }, [content.dir, locale]);

  const value = useMemo(
    () => ({
      locale,
      dir: content.dir,
      content,
      setLocale,
    }),
    [content, locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocaleContent() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocaleContent must be used inside LocaleProvider");
  }

  return context;
}
