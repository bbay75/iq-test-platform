"use client";

import { useState } from "react";
import Link from "next/link";
import ResultPaywall from "@/components/ResultPaywall";
import {
  calculateLifePath,
  calculateDestiny,
  calculateSoulUrge,
  calculatePersonalityNumber,
} from "@/data/numerologyCalculator";
import { numerologyProfiles } from "@/data/numerologyProfiles";

type NumerologyResult = {
  lifePath: number;
  destiny: number;
  soulUrge: number;
  personality: number;
};

export default function NumerologyPage() {
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [result, setResult] = useState<NumerologyResult | null>(null);

  const handleCalculate = () => {
    if (!name.trim() || !birth) return;

    const nextResult: NumerologyResult = {
      lifePath: calculateLifePath(birth),
      destiny: calculateDestiny(name),
      soulUrge: calculateSoulUrge(name),
      personality: calculatePersonalityNumber(name),
    };

    setResult(nextResult);
  };

  const handleReset = () => {
    setName("");
    setBirth("");
    setResult(null);
  };

  if (result) {
    const profile = numerologyProfiles[result.lifePath];

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-100 p-6 dark:bg-gray-900">
        <Link
          href="/"
          className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-300"
        >
          ← Back to Home
        </Link>

        <div className="w-full max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500 p-8 text-center text-white shadow-lg">
            <p className="text-sm uppercase tracking-[0.2em] text-indigo-100">
              Numerology Result
            </p>

            <h1 className="mt-4 text-4xl font-bold md:text-5xl">
              {result.lifePath}
            </h1>

            <p className="mt-3 text-lg text-indigo-100">
              Life Path Number • {profile?.title || "Profile"}
            </p>
          </div>

          <ResultPaywall
            result={`${result.lifePath} - ${profile?.title || "Numerology"}`}
            testName="Numerology"
          >
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 text-center dark:border-indigo-900 dark:bg-indigo-950/20">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Life Path
                  </p>
                  <p className="mt-3 text-3xl font-bold text-indigo-600 dark:text-indigo-300">
                    {result.lifePath}
                  </p>
                </div>

                <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5 text-center dark:border-violet-900 dark:bg-violet-950/20">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Destiny
                  </p>
                  <p className="mt-3 text-3xl font-bold text-violet-600 dark:text-violet-300">
                    {result.destiny}
                  </p>
                </div>

                <div className="rounded-2xl border border-fuchsia-200 bg-fuchsia-50 p-5 text-center dark:border-fuchsia-900 dark:bg-fuchsia-950/20">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Soul Urge
                  </p>
                  <p className="mt-3 text-3xl font-bold text-fuchsia-600 dark:text-fuchsia-300">
                    {result.soulUrge}
                  </p>
                </div>

                <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5 text-center dark:border-purple-900 dark:bg-purple-950/20">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Personality
                  </p>
                  <p className="mt-3 text-3xl font-bold text-purple-600 dark:text-purple-300">
                    {result.personality}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-5 dark:border-indigo-900 dark:from-gray-900 dark:to-gray-900">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Summary
                </h2>
                <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
                  {profile?.summary}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-900 dark:bg-green-950/20">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Strengths
                  </h3>
                  <ul className="mt-3 space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    {profile?.strengths.map((item) => (
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
                    {profile?.challenges.map((item) => (
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

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/20">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Career Tendency
                  </h3>
                  <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
                    {profile?.careers.join(", ")}
                  </p>
                </div>

                <div className="rounded-2xl border border-pink-200 bg-pink-50 p-5 dark:border-pink-900 dark:bg-pink-950/20">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Relationship Style
                  </h3>
                  <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
                    {profile?.relationship}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5 dark:border-cyan-900 dark:bg-cyan-950/20">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Advice
                </h3>
                <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
                  {profile?.advice}
                </p>
              </div>
            </div>
          </ResultPaywall>

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
        className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-300"
      >
        ← Back to Home
      </Link>

      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Numerology Test
        </h1>

        <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Нэр болон төрсөн огноогоор numerology profile гаргана.
        </p>

        <div className="grid gap-4">
          <input
            placeholder="Нэр"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />

          <input
            type="date"
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />

          <button
            onClick={handleCalculate}
            className="rounded-xl bg-indigo-500 px-6 py-3 font-semibold text-white transition hover:bg-indigo-600"
          >
            Calculate
          </button>
        </div>
      </div>
    </div>
  );
}
