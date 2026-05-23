"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { useLang } from "@/lib/LanguageProvider";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);
  const { lang, switchLang, t } = useLang();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl"
            onClick={closeMenu}
          >
            Test Platform
          </Link>

          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle />

            <button
              onClick={switchLang}
              className="flex h-10 w-12 items-center justify-center rounded-lg border border-gray-300 bg-white shadow-sm transition hover:scale-105 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              title={
                lang === "mn" ? "Switch to English" : "Монгол хэл рүү шилжих"
              }
            >
              <img
                src={
                  lang === "mn"
                    ? "https://flagcdn.com/gb.svg"
                    : "https://flagcdn.com/mn.svg"
                }
                alt="lang"
                className="h-5 w-8 object-contain"
              />
            </button>

            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="/my-results"
                className="text-sm font-semibold text-gray-700 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-300"
              >
                {t("nav_results")}
              </Link>
            </nav>
            <button
              onClick={() => setOpen(!open)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-lg text-gray-700 shadow-sm transition hover:scale-105 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 md:hidden"
              aria-label="Toggle menu"
            >
              ☰
            </button>
          </div>
        </div>

        {open && (
          <div className="fixed inset-0 z-[60] md:hidden">
            {/* Backdrop */}
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={closeMenu}
            />

            {/* Popup menu */}
            <div className="absolute right-4 top-16 w-[220px] rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("menu")}
                </h2>

                <button
                  type="button"
                  onClick={closeMenu}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-lg text-gray-700 shadow-sm transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-700">
                <nav className="flex flex-col gap-2">
                  <Link
                    href="/my-results"
                    className="rounded-xl px-3 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
                    onClick={closeMenu}
                  >
                    {t("nav_results")}
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
