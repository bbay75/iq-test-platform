"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type ResultItem = {
  id: string;
  test: string;
  value: string;
  createdAt: string;
};

export default function ResultDetailPage() {
  const params = useParams();
  const [result, setResult] = useState<ResultItem | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("recent_results");
    if (!saved) return;

    try {
      const parsed: ResultItem[] = JSON.parse(saved);
      const found = parsed.find((item) => item.id === params.id);
      setResult(found || null);
    } catch {
      setResult(null);
    }
  }, [params.id]);

  if (!result) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100 p-6 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300">Result not found</p>
        <Link
          href="/"
          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-300"
        >
          ← Back to Home
        </Link>
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

      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {result.test}
        </h1>

        <p className="mt-4 break-words text-4xl font-bold text-blue-600 dark:text-blue-300">
          {result.value}
        </p>

        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          {result.createdAt}
        </p>
      </div>
    </div>
  );
}
