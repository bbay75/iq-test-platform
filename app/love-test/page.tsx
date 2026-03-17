"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ResultCard from "@/components/ResultCard";
import { recordCompletedTest } from "@/lib/rewardSystem";
import ResultPaywall from "@/components/ResultPaywall";
// Simple love algorithm
const loveAlgorithm = (name1: string, name2: string) => {
  const safeName1 = name1.trim();
  const safeName2 = name2.trim();

  if (!safeName1 || !safeName2) return 0;

  const sum = safeName1.length + safeName2.length;
  const code = sum * (safeName1.charCodeAt(0) + safeName2.charCodeAt(0));

  return code % 101; // 0–100%
};

export default function LoveTest() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [savedResult, setSavedResult] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("loveResult");
    if (saved !== null) {
      const parsed = Number(saved);
      if (!isNaN(parsed)) {
        setSavedResult(parsed);
      }
    }
  }, []);

  const handleSubmit = () => {
    const score = loveAlgorithm(name1, name2);
    setResult(score);
    localStorage.setItem("loveResult", String(score));
    setSavedResult(score);
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

        <ResultPaywall result={`${result}%`} />

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
          Love Compatibility Test
        </h1>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Таны нэр"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-pink-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />

          <input
            type="text"
            placeholder="Хүний нэр"
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-pink-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />

          <button
            onClick={handleSubmit}
            className="rounded-lg bg-pink-500 px-6 py-3 text-white transition hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-500"
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
              title="Love Test"
              result={`${savedResult}%`}
              description="Таны өмнөх хадгалсан үр дүн"
            />
          </div>
        )}
      </div>
    </div>
  );
}
