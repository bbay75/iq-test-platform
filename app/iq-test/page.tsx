"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ResultCard from "@/components/ResultCard";
import { iqQuestions } from "@/data/iqQuestions";
import { recordCompletedTest } from "@/lib/rewardSystem";
import ResultPaywall from "@/components/ResultPaywall";

export default function IQTest() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [savedResult, setSavedResult] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("iqResult");
    if (saved !== null) {
      const parsed = Number(saved);
      if (!isNaN(parsed)) {
        setSavedResult(parsed);
      }
    }
  }, []);

  const handleAnswer = (correct: boolean) => {
    let newScore = score;

    if (correct) {
      newScore = score + 1;
      setScore(newScore);
    }

    if (index + 1 < iqQuestions.length) {
      setIndex(index + 1);
    } else {
      const iqScore = 80 + newScore * 5;
      localStorage.setItem("iqResult", String(iqScore));
      setSavedResult(iqScore);
      recordCompletedTest();
      setFinished(true);
      const existing = localStorage.getItem("iqLeaderboard");

      let leaderboard: number[] = existing ? JSON.parse(existing) : [];

      leaderboard.push(iqScore);

      leaderboard = leaderboard.sort((a, b) => b - a).slice(0, 5);

      localStorage.setItem("iqLeaderboard", JSON.stringify(leaderboard));
      setSavedResult(iqScore);
    }
  };

  if (finished) {
    const finalIQ = 80 + score * 5;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-100 p-6 dark:bg-gray-900">
        <Link
          href="/"
          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-300"
        >
          ← Back to Home
        </Link>

        <ResultPaywall result={finalIQ} />

        <button
          onClick={() => {
            setIndex(0);
            setScore(0);
            setFinished(false);
          }}
          className="rounded-lg bg-gray-600 px-6 py-2 text-white transition hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          Дахин эхлэх
        </button>
      </div>
    );
  }

  const q = iqQuestions[index];

  const progress = ((index + 1) / iqQuestions.length) * 100;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-100 p-6 dark:bg-gray-900">
      <Link
        href="/"
        className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-300"
      >
        ← Back to Home
      </Link>

      <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
          IQ Test
        </h1>

        {/* progress bar */}
        <div className="mb-6">
          <div className="h-2 w-full rounded bg-gray-200 dark:bg-gray-700">
            <div
              className="h-2 rounded bg-blue-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Question {index + 1} / {iqQuestions.length}
          </p>
        </div>

        <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
          {q.question}
        </h2>

        <div className="flex flex-col gap-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer((opt.points ?? 0) > 0)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-left text-gray-900 transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700"
            >
              {opt.text}
            </button>
          ))}
        </div>

        {savedResult !== null && (
          <div className="mt-8">
            <h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
              Previous Result
            </h2>

            <ResultCard
              title="IQ Result"
              result={savedResult}
              description="Таны өмнөх хадгалсан IQ"
            />
          </div>
        )}
      </div>
    </div>
  );
}
