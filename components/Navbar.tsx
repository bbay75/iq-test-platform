"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 dark:text-white"
            onClick={closeMenu}
          >
            Test Platform
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="/iq-test"
                className="text-sm font-semibold text-gray-700 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-300"
              >
                IQ
              </Link>
              <Link
                href="/mbti-test"
                className="text-sm font-semibold text-gray-700 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-300"
              >
                MBTI
              </Link>
              <Link
                href="/love-test"
                className="text-sm font-semibold text-gray-700 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-300"
              >
                Love
              </Link>
              <Link
                href="/numerology"
                className="text-sm font-semibold text-gray-700 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-300"
              >
                Numerology
              </Link>
              <Link
                href="/palm-reading"
                className="text-sm font-semibold text-gray-700 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-300"
              >
                Palm
              </Link>
            </nav>

            <button
              onClick={() => setOpen(!open)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800 md:hidden"
              aria-label="Toggle menu"
            >
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {open && (
          <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:hidden">
            <div className="mb-4">
              <ThemeToggle />
            </div>

            <nav className="flex flex-col gap-3">
              <Link
                href="/iq-test"
                onClick={closeMenu}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                🧠 IQ Test
              </Link>

              <Link
                href="/mbti-test"
                onClick={closeMenu}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                🧩 MBTI Test
              </Link>

              <Link
                href="/love-test"
                onClick={closeMenu}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                ❤️ Love Test
              </Link>

              <Link
                href="/numerology"
                onClick={closeMenu}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                🔢 Numerology
              </Link>

              <Link
                href="/palm-reading"
                onClick={closeMenu}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                ✋ Palm Reading
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
