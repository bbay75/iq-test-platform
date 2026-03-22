"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ProfileCard from "@/components/ProfileCard";
import TestCard from "@/components/TestCard";
import Leaderboard from "@/components/Leaderboard";

type RecentResult = {
  id: string;
  test: string;
  value: string;
  createdAt: string;
};

export default function Home() {
  const [recentResults, setRecentResults] = useState<RecentResult[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem("recent_results");

    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setRecentResults(Array.isArray(parsed) ? parsed : []);
      } catch {
        setRecentResults([]);
      }
    }
  }, []);

  const scrollLeft = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: -320,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: 320,
      behavior: "smooth",
    });
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="inline-block rounded-full bg-gray-100 px-4 py-1 text-sm font-semibold text-blue-700 shadow-sm dark:bg-gray-700 dark:text-blue-300">
            Personality • Fun • Insight
          </p>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl">
            Discover Your Personality
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-gray-700 dark:text-gray-300">
            IQ, MBTI, Love Compatibility, Numerology болон Palm Reading
            тестүүдийг нэг дороос хийж өөрийгөө илүү сайн таньж мэдээрэй.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/iq-test"
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              🧠 IQ Test
            </Link>

            <Link
              href="/mbti-test"
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              🧩 MBTI Personality
            </Link>

            <Link
              href="/love-test"
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              ❤️ Love Compatibility
            </Link>

            <Link
              href="/numerology"
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              🔢 Numerology
            </Link>

            <Link
              href="/palm-reading"
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              ✋ Palm Reading
            </Link>
          </div>

          <div className="mx-auto mt-10 grid max-w-xl grid-cols-3 gap-4">
            <div className="rounded-xl bg-gray-50 p-4 shadow-sm dark:bg-gray-900">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                5+
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Tests</p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 shadow-sm dark:bg-gray-900">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                AI
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Palm Analysis
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 shadow-sm dark:bg-gray-900">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                100%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Fun</p>
            </div>
          </div>
        </section>

        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <ProfileCard />
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <Leaderboard />
          </div>
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              📊 Recent Results
            </h2>

            {recentResults.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={scrollLeft}
                  className="rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  ←
                </button>

                <button
                  onClick={scrollRight}
                  className="rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  →
                </button>
              </div>
            )}
          </div>

          {recentResults.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No results yet
            </p>
          ) : (
            <div
              ref={scrollRef}
              className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2"
            >
              {recentResults.map((item, index) => (
                <Link
                  href={`/result/${item.id || index}`}
                  key={`${item.id}-${index}`}
                  className="block"
                >
                  <div className="h-[190px] w-[320px] flex-shrink-0 snap-start rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      {item.test}
                    </p>

                    <p className="mt-3 line-clamp-2 overflow-hidden text-2xl font-bold text-blue-600 dark:text-blue-300">
                      {item.value}
                    </p>

                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                      {item.createdAt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <TestCard
            title="Love Test"
            link="/love-test"
            emoji="❤️"
            description="Check your romantic compatibility score"
          />

          <TestCard
            title="IQ Test"
            link="/iq-test"
            emoji="🧠"
            description="Measure your score with quick logic questions"
          />

          <TestCard
            title="MBTI Test"
            link="/mbti-test"
            emoji="🧩"
            description="Discover your personality type"
          />

          <TestCard
            title="Numerology"
            link="/numerology"
            emoji="🔢"
            description="Find your life path number"
          />

          <TestCard
            title="Palm Reading"
            link="/palm-reading"
            emoji="✋"
            description="Upload your palm and get a fun reading"
          />
          <TestCard
            title="Personal Color AI"
            link="/personal-color"
            emoji="🎨"
            description="Upload your photo and get AI recolored outfit previews"
          />
        </section>
      </div>
    </main>
  );
}
