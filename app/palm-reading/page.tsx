"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ResultCard from "@/components/ResultCard";
import { recordCompletedTest } from "@/lib/rewardSystem";
import ResultPaywall from "@/components/ResultPaywall";

const palmResults = [
  "Та бүтээлч сэтгэлгээтэй, дотоод мэдрэмж сайтай хүн байна.",
  "Таны алганы хээ шийдэмгий, зорилгодоо үнэнч зан чанарыг илэрхийлж байна.",
  "Та хүмүүстэй амархан ойлголцдог, харилцааны өндөр мэдрэмжтэй хүн байна.",
  "Таны амьдралын шугам хүчтэй, эрч хүчтэй, тууштай байдлыг илтгэж байна.",
  "Та аливаад нухацтай ханддаг, шийдвэр гаргахдаа болгоомжтой хүн байна.",
];

export default function PalmReadingPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [savedResult, setSavedResult] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("palmResult");
    if (saved) setSavedResult(saved);
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleAnalyze = () => {
    if (!selectedFile) return;

    setAnalyzing(true);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * palmResults.length);
      const generatedResult = palmResults[randomIndex];

      setResult(generatedResult);
      setSavedResult(generatedResult);
      localStorage.setItem("palmResult", generatedResult);
      recordCompletedTest();
      setAnalyzing(false);
    }, 1800);
  };

  if (result) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-100 p-6 dark:bg-gray-900">
        <Link
          href="/"
          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-300"
        >
          ← Back to Home
        </Link>

        <ResultPaywall result={result} />

        <button
          onClick={() => {
            setResult(null);
            setSelectedFile(null);
            setPreviewUrl(null);
          }}
          className="rounded-lg bg-gray-600 px-6 py-2 text-white transition hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          Дахин үзэх
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

      <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Palm Reading AI
        </h1>

        <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Алганыхаа тод зураг оруулаад AI-style тайлбар аваарай.
        </p>

        <div className="flex flex-col gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setSelectedFile(file);
            }}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />

          {previewUrl && (
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              <img
                src={previewUrl}
                alt="Palm Preview"
                className="h-72 w-full object-cover"
              />
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!selectedFile || analyzing}
            className="rounded-lg bg-emerald-500 px-6 py-3 text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            {analyzing ? "AI шинжилж байна..." : "AI-р шинжлэх"}
          </button>
        </div>

        {savedResult && (
          <div className="mt-8">
            <h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
              Previous Result
            </h2>

            <ResultCard
              title="Palm Reading"
              result={savedResult}
              description="Таны өмнөх хадгалсан palm reading"
            />
          </div>
        )}
      </div>
    </div>
  );
}
