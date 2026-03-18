"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";

type RecentResult = {
  id: string;
  test: string;
  value: string;
  createdAt: string;
};

export default function ResultPaywall({
  result,
  testName,
  children,
}: {
  result: string | number;
  testName: string;
  children?: ReactNode;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    const savedProgress = Number(localStorage.getItem("results_unlocked") || 0);
    const savedCredits = Number(
      localStorage.getItem("free_result_credits") || 0,
    );

    setProgress(savedProgress);
    setCredits(savedCredits);
  }, []);

  const fullResult = result?.toString() || "No result";

  const previewText = useMemo(() => {
    if (fullResult.length <= 10) return fullResult;
    return fullResult.slice(0, Math.ceil(fullResult.length * 0.6)) + "•••";
  }, [fullResult]);

  const unlockResult = () => {
    let unlockedCount = Number(localStorage.getItem("results_unlocked") || 0);
    let freeCredits = Number(localStorage.getItem("free_result_credits") || 0);

    if (freeCredits > 0) {
      freeCredits -= 1;
      localStorage.setItem("free_result_credits", String(freeCredits));
    } else {
      unlockedCount += 1;

      if (unlockedCount >= 3) {
        freeCredits += 1;
        unlockedCount -= 3;
      }

      localStorage.setItem("results_unlocked", String(unlockedCount));
      localStorage.setItem("free_result_credits", String(freeCredits));
    }

    const existingHistory = localStorage.getItem("recent_results");

    let history: RecentResult[] = [];

    if (existingHistory) {
      try {
        const parsed = JSON.parse(existingHistory);
        history = Array.isArray(parsed) ? parsed : [];
      } catch {
        history = [];
      }
    }

    const id = Date.now().toString();

    history.unshift({
      id,
      test: testName,
      value: fullResult,
      createdAt: new Date().toLocaleString(),
    });

    history = history.slice(0, 5);

    localStorage.setItem("recent_results", JSON.stringify(history));

    setUnlocked(true);
    setProgress(unlockedCount);
    setCredits(freeCredits);
  };

  if (unlocked) {
    return (
      <div className="mt-6 w-full rounded-2xl border border-yellow-300 bg-gradient-to-b from-white to-yellow-50 p-6 shadow-lg dark:border-yellow-500 dark:from-gray-800 dark:to-gray-900">
        <div className="text-center">
          <h2 className="text-xl font-bold text-yellow-700 dark:text-yellow-400">
            Premium Result
          </h2>

          <p className="mt-4 text-3xl font-semibold text-blue-600 dark:text-blue-300">
            {fullResult}
          </p>

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Progress to next free result: {progress} / 3
          </p>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Free result credits: {credits}
          </p>
        </div>

        {children && <div className="mt-6">{children}</div>}
      </div>
    );
  }

  return (
    <div className="mt-6 w-full rounded-2xl border border-yellow-300 bg-gradient-to-b from-white to-yellow-50 p-6 text-center shadow-lg dark:border-yellow-500 dark:from-gray-800 dark:to-gray-900">
      <h2 className="text-xl font-bold text-yellow-700 dark:text-yellow-400">
        🔒 Premium Result
      </h2>

      <p className="mt-2 text-gray-600 dark:text-gray-300">
        Unlock to see your full result.
      </p>

      <div className="mt-5 rounded-xl bg-gray-100 p-5 dark:bg-gray-900">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Preview
        </p>

        <div className="relative mt-3 overflow-hidden rounded-lg">
          <p className="select-none text-3xl font-semibold text-blue-600 blur-[20px] dark:text-blue-300">
            {previewText}
          </p>
          <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90" />
        </div>
      </div>

      <button
        onClick={unlockResult}
        className="mt-6 rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-white shadow transition hover:bg-yellow-600"
      >
        Unlock Premium Result
      </button>

      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Progress to free result: {progress} / 3
      </div>

      <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Free result credits: {credits}
      </div>

      <p className="mt-4 text-sm font-medium text-yellow-700 dark:text-yellow-400">
        Unlock 3 results → get 1 FREE result
      </p>
    </div>
  );
}
