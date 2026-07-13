import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { translations, type Locale } from "../i18n/translations";

const STORAGE_KEY = "howzy-lang";

type LanguageContextValue = {
  locale: Locale;
  t: (typeof translations)[Locale];
  toggleLocale: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "pt" || stored === "en" ? stored : "en";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
  }, [locale]);

  const value: LanguageContextValue = {
    locale,
    t: translations[locale],
    toggleLocale: () => setLocale((prev) => (prev === "en" ? "pt" : "en")),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
