"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ResultPaywall from "@/components/ResultPaywall";
import { generatePalmReading } from "@/data/palmReadingGenerator";

export default function PalmReadingPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageSeed, setImageSeed] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [finished, setFinished] = useState(false);

  const reading = useMemo(() => {
    if (!imageSeed) return null;
    return generatePalmReading(imageSeed);
  }, [imageSeed]);

  const handleImageUpload = (file: File | null) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result?.toString() || "";
      setImagePreview(result);
      setImageSeed(`${file.name}-${file.size}-${file.type}-${result.length}`);
      setFinished(false);
    };

    reader.readAsDataURL(file);
  };

  const handleAnalyze = () => {
    if (!imagePreview || !imageSeed) return;

    setAnalyzing(true);

    setTimeout(() => {
      const generated = generatePalmReading(imageSeed);

      localStorage.setItem(
        "palmResult",
        JSON.stringify({
          seed: imageSeed,
          result: generated,
        }),
      );

      setAnalyzing(false);
      setFinished(true);
    }, 1800);
  };

  const handleReset = () => {
    setImagePreview(null);
    setImageSeed("");
    setAnalyzing(false);
    setFinished(false);
  };

  if (finished && reading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-100 p-6 dark:bg-gray-900">
        <Link
          href="/"
          className="text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-300"
        >
          ← Back to Home
        </Link>

        <div className="w-full max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-8 text-center text-white shadow-lg">
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-100">
              Palm Reading
            </p>

            <h1 className="mt-4 text-3xl font-bold md:text-4xl">
              {reading.title}
            </h1>

            <p className="mt-3 text-emerald-100">
              AI-style entertainment reading based on your uploaded palm image
            </p>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-[280px_1fr]">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
              <p className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                Uploaded Palm
              </p>

              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Palm Preview"
                  className="h-[320px] w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-[320px] items-center justify-center rounded-xl bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  No image
                </div>
              )}
            </div>

            <ResultPaywall
              result="Detailed Palm Reading"
              testName="Palm Reading"
            >
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-900 dark:bg-indigo-950/20">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Energy Type
                    </h3>
                    <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
                      {reading.energy}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50 p-5 dark:border-emerald-900 dark:from-gray-900 dark:to-gray-900">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      Overall Reading
                    </h2>
                    <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
                      {reading.overall}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-pink-200 bg-pink-50 p-5 dark:border-pink-900 dark:bg-pink-950/20">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Heart Line
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-gray-700 dark:text-gray-300">
                      {reading.heartLine}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/20">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Head Line
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-gray-700 dark:text-gray-300">
                      {reading.headLine}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/20">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Life Line
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-gray-700 dark:text-gray-300">
                      {reading.lifeLine}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5 dark:border-purple-900 dark:bg-purple-950/20">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Personality Insight
                  </h3>
                  <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
                    {reading.personality}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-pink-200 bg-pink-50 p-5 dark:border-pink-900 dark:bg-pink-950/20">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Love & Relationship
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-gray-700 dark:text-gray-300">
                      {reading.love}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5 dark:border-sky-900 dark:bg-sky-950/20">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Career & Money
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-gray-700 dark:text-gray-300">
                      {reading.career}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 dark:border-yellow-900 dark:bg-yellow-950/20">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Future Direction
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-gray-700 dark:text-gray-300">
                      {reading.future}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-900 dark:bg-green-950/20">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Strengths
                    </h3>
                    <ul className="mt-3 space-y-3 text-sm text-gray-700 dark:text-gray-300">
                      {reading.strengths.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="font-bold text-green-600 dark:text-green-400">
                            ✓
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/20">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Challenges
                    </h3>
                    <ul className="mt-3 space-y-3 text-sm text-gray-700 dark:text-gray-300">
                      {reading.challenges.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="font-bold text-amber-600 dark:text-amber-400">
                            !
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5 dark:border-cyan-900 dark:bg-cyan-950/20">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Advice
                  </h3>
                  <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
                    {reading.advice}
                  </p>
                </div>

                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                  Энэ нь entertainment зориулалттай AI-style palm reading юм.
                </div>
              </div>
            </ResultPaywall>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleReset}
              className="rounded-lg bg-gray-600 px-6 py-2 text-white transition hover:bg-gray-700"
            >
              Дахин хийх
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-100 p-6 dark:bg-gray-900">
      <Link
        href="/"
        className="text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-300"
      >
        ← Back to Home
      </Link>

      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Palm Reading AI
        </h1>

        <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Алганы зургаа upload хийгээд entertainment зориулалттай detailed palm
          reading аваарай.
        </p>

        <div className="grid gap-5">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50 p-8 text-center transition hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Palm image upload
            </span>
            <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              JPG, PNG зураг сонгоно уу
            </span>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files?.[0] || null)}
            />
          </label>

          {imagePreview && (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
              <p className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                Preview
              </p>

              <img
                src={imagePreview}
                alt="Palm Preview"
                className="h-[360px] w-full rounded-xl object-cover"
              />
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!imagePreview || analyzing}
            className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {analyzing ? "Analyzing..." : "Analyze Palm"}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          Энэ нь entertainment зориулалттай AI-style palm reading юм.
        </p>
      </div>
    </div>
  );
}
