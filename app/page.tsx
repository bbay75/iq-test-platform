"use client";

import Link from "next/link";
import ProfileCard from "@/components/ProfileCard";
import { useLang } from "@/lib/LanguageProvider";

export default function HomePage() {
  const { t } = useLang();

  const tests = [
    {
      name: t("home_personal_color_title"),
      desc: t("home_personal_color_desc"),
      href: "/personal-color",
    },
    {
      name: t("home_iq_title"),
      desc: t("home_iq_desc"),
      href: "/iq-test",
    },
    {
      name: t("home_mbti_title"),
      desc: t("home_mbti_desc"),
      href: "/mbti-test",
    },
    {
      name: t("home_love_title"),
      desc: t("home_love_desc"),
      href: "/love-test",
    },
    {
      name: t("home_numerology_title"),
      desc: t("home_numerology_desc"),
      href: "/numerology",
    },
    {
      name: t("home_palm_title"),
      desc: t("home_palm_desc"),
      href: "/palm-reading",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* HERO */}
      <div className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
          {t("discover_title")}
        </h1>

        <p className="mt-4 text-base text-gray-600 dark:text-gray-300 sm:text-lg">
          {t("discover_desc")}
        </p>

        <Link
          href="/personal-color"
          className="mt-8 inline-block rounded-xl bg-blue-600 px-7 py-3 text-base font-semibold text-white transition hover:bg-blue-700"
        >
          {t("start_personal_color")}
        </Link>

        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          {t("unlock_anytime")}
        </p>
      </div>

      <div className="mx-auto max-w-3xl px-6 pb-10">
        <ProfileCard />
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {tests.map((test) => {
            const isPopular = test.href === "/personal-color";

            return (
              <Link
                key={test.name}
                href={test.href}
                className={isPopular ? "lg:col-span-1" : ""}
              >
                {isPopular ? (
                  <div className="relative rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-5 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
                    <span className="absolute right-3 top-3 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
                      {t("popular")}
                    </span>

                    <h2 className="pr-20 text-3xl font-bold text-white">
                      {test.name}
                    </h2>

                    <p className="mt-3 text-sm text-white/85">{test.desc}</p>

                    <div className="mt-6 text-base font-semibold text-white">
                      {t("start_arrow")}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {test.name}
                    </h2>

                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                      {test.desc}
                    </p>

                    <div className="mt-6 text-base font-medium text-blue-600 dark:text-blue-400">
                      {t("start_arrow")}
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
