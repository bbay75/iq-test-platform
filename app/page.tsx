"use client";

import { useEffect, useState } from "react";
import TestCard from "@/components/TestCard";
import ResultCard from "@/components/ResultCard";
import Link from "next/link";
import Leaderboard from "@/components/Leaderboard";
import ProfileCard from "@/components/ProfileCard";
import { ensureSessionId } from "@/lib/rewardSystem";

export default function Home() {
  const [loveSaved, setLoveSaved] = useState<string | null>(null);
  const [iqSaved, setIqSaved] = useState<string | null>(null);
  const [mbtiSaved, setMbtiSaved] = useState<string | null>(null);
  const [numerologySaved, setNumerologySaved] = useState<string | null>(null);
  const [palmSaved, setPalmSaved] = useState<string | null>(null);

  useEffect(() => {
    ensureSessionId();

    setLoveSaved(localStorage.getItem("loveResult"));
    setIqSaved(localStorage.getItem("iqResult"));
    setMbtiSaved(localStorage.getItem("mbtiResult"));
    setNumerologySaved(localStorage.getItem("numerologyResult"));
    setPalmSaved(localStorage.getItem("palmResult"));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-16 text-center">
          <p className="inline-block rounded-full bg-gray-200 px-4 py-1 text-sm font-semibold text-blue-700 shadow-sm dark:bg-gray-800 dark:text-blue-300">
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
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              🧠 IQ Test
            </Link>

            <Link
              href="/mbti-test"
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              🧩 MBTI Personality
            </Link>

            <Link
              href="/love-test"
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              ❤️ Love Compatibility
            </Link>

            <Link
              href="/numerology"
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              🔢 Numerology
            </Link>

            <Link
              href="/palm-reading"
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              ✋ Palm Reading
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-xl mx-auto">
            <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                5+
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Tests</p>
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                AI
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Palm Analysis
              </p>
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                100%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Fun</p>
            </div>
          </div>
        </div>

        <div className="mb-16 flex justify-center">
          <div className="w-full max-w-md">
            <ProfileCard />
          </div>
        </div>

        <section className="mt-14">
          <div className="mb-6 flex flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Previous Results
            </h2>

            <button
              onClick={() => {
                localStorage.removeItem("loveResult");
                localStorage.removeItem("iqResult");
                localStorage.removeItem("mbtiResult");
                localStorage.removeItem("numerologyResult");
                localStorage.removeItem("palmResult");

                setLoveSaved(null);
                setIqSaved(null);
                setMbtiSaved(null);
                setNumerologySaved(null);
                setPalmSaved(null);
              }}
              className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Clear Results
            </button>
          </div>

          {!loveSaved &&
            !iqSaved &&
            !mbtiSaved &&
            !numerologySaved &&
            !palmSaved && (
              <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-gray-300 bg-white/70 p-8 text-center text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-200">
                Одоогоор хадгалсан үр дүн алга байна. Аль нэг тестийг хийгээд
                энд хараарай.
              </div>
            )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 justify-items-center">
            {loveSaved && (
              <div className="w-full max-w-sm">
                <ResultCard
                  title="Love Test Result"
                  result={loveSaved}
                  description="Your saved love compatibility result"
                />
              </div>
            )}

            {iqSaved && (
              <div className="w-full max-w-sm">
                <ResultCard
                  title="IQ Test Result"
                  result={iqSaved}
                  description="Your latest IQ test score"
                />
              </div>
            )}

            {mbtiSaved && (
              <div className="w-full max-w-sm">
                <ResultCard
                  title="MBTI Result"
                  result={mbtiSaved}
                  description="Your saved MBTI personality type"
                />
              </div>
            )}

            {numerologySaved && (
              <div className="w-full max-w-sm">
                <ResultCard
                  title="Numerology Result"
                  result={numerologySaved}
                  description="Your saved life path number"
                />
              </div>
            )}

            {palmSaved && (
              <div className="w-full max-w-sm">
                <ResultCard
                  title="Palm Reading Result"
                  result={palmSaved}
                  description="Your saved palm reading result"
                />
              </div>
            )}
          </div>
        </section>

        <div className="mt-8">
          <Leaderboard />
        </div>
      </section>
    </main>
  );
}
