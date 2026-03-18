"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ResultCard from "@/components/ResultCard";
import { calculateLifePath } from "@/data/numerology";
import { recordCompletedTest } from "@/lib/rewardSystem";
import ResultPaywall from "@/components/ResultPaywall";
export default function NumerologyTest() {
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [savedResult, setSavedResult] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("numerologyResult");
    if (saved !== null) {
      const parsed = Number(saved);
      if (!isNaN(parsed)) {
        setSavedResult(parsed);
      }
    }
  }, []);

  const handleSubmit = () => {
    if (!birthDate) return;

    const number = calculateLifePath(birthDate);
    setResult(number);
    localStorage.setItem("numerologyResult", String(number));
    setSavedResult(number);
    recordCompletedTest();
  };

  if (result !== null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-100 p-6 dark:bg-gray-900">
        <Link
          href="/"
          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-300"
        >
          ← Back to Home
        </Link>

        <ResultPaywall result={result} testName="Numerology" />

        <button
          onClick={() => setResult(null)}
          className="rounded-lg bg-gray-600 px-6 py-2 text-white transition hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          Буцах
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-100 p-6 dark:bg-gray-900">
      <Link
        href="/"
        className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-300"
      >
        ← Back to Home
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Numerology Test
        </h1>

        <div className="flex flex-col gap-4">
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-purple-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />

          <button
            onClick={handleSubmit}
            className="rounded-lg bg-purple-500 px-6 py-3 text-white transition hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-500"
          >
            Үр дүн гаргах
          </button>
        </div>

        {savedResult !== null && (
          <div className="mt-8">
            <h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
              Previous Result
            </h2>

            <ResultCard
              title="Numerology"
              result={savedResult}
              description="Таны өмнөх хадгалсан үр дүн"
            />
          </div>
        )}
      </div>
    </div>
  );
}
