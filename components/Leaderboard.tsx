"use client";

import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [scores, setScores] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("iqLeaderboard");

    if (saved) {
      setScores(JSON.parse(saved));
    }
  }, []);

  if (scores.length === 0) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        🏆 Top IQ Scores
      </h2>

      <ol className="space-y-2">
        {scores.map((score, i) => (
          <li
            key={i}
            className="flex justify-between rounded-lg bg-gray-100 px-4 py-2 text-gray-900 dark:bg-gray-700 dark:text-white"
          >
            <span>#{i + 1}</span>
            <span className="font-bold">{score}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
