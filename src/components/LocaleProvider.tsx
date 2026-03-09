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

type LocaleProviderProps = {
  children: ReactNode;
  initialLocale?: Locale;
  initialContent?: SiteContentViewModel;
};

export function LocaleProvider({ children, initialLocale = "he", initialContent }: LocaleProviderProps) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === "undefined") {
      return initialLocale;
    }
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(saved) ? saved : initialLocale;
  });
  const [contentByLocale, setContentByLocale] = useState<Partial<Record<Locale, SiteContentViewModel>>>(() => ({
    [initialLocale]: initialContent ?? getSiteContent(initialLocale),
  }));
  const content = contentByLocale[locale] ?? getSiteContent(locale);

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
          setContentByLocale((prev) => ({ ...prev, [locale]: payload.content }));
        }
      } catch {
        // Keep local content fallback when API is unavailable.
        setContentByLocale((prev) => {
          if (prev[locale]) {
            return prev;
          }
          return { ...prev, [locale]: getSiteContent(locale) };
        });
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
