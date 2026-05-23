"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "./i18n";

type Lang = "mn" | "en";

type LanguageContextType = {
  lang: Lang;
  switchLang: () => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("mn");

  useEffect(() => {
    const saved = localStorage.getItem("site_lang") as Lang | null;
    if (saved === "mn" || saved === "en") {
      setLang(saved);
    }
  }, []);

  const switchLang = () => {
    const nextLang: Lang = lang === "mn" ? "en" : "mn";
    setLang(nextLang);
    localStorage.setItem("site_lang", nextLang);
  };

  const t = (key: string): string => {
    const dict = translations[lang] as Record<string, string>;
    return dict[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLang must be used inside LanguageProvider");
  }
  return ctx;
}
