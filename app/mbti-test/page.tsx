"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ResultPaywall from "@/components/ResultPaywall";
import { mbtiQuestions, MbtiDimension } from "@/data/mbtiQuestions";
import { mbtiProfiles } from "@/data/mbtiProfiles";

const scaleOptions = [
  { label: "Огт санал нийлэхгүй", value: -2 },
  { label: "Санал нийлэхгүй", value: -1 },
  { label: "Дундаж", value: 0 },
  { label: "Санал нийлнэ", value: 1 },
  { label: "Бүрэн санал нийлнэ", value: 2 },
];

function getOppositeDimension(dimension: MbtiDimension): MbtiDimension {
  const map: Record<MbtiDimension, MbtiDimension> = {
    E: "I",
    I: "E",
    S: "N",
    N: "S",
    T: "F",
    F: "T",
    J: "P",
    P: "J",
  };
  return map[dimension];
}

export default function MBTITest() {
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState<Record<MbtiDimension, number>>({
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  });
  const [finished, setFinished] = useState(false);
  const [savedResult, setSavedResult] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("mbtiResult");
    if (saved) setSavedResult(saved);
  }, []);

  const handleAnswer = (dimension: MbtiDimension, value: number) => {
    setSelected(value);

    setTimeout(() => {
      const updatedScores = { ...scores };

      if (value > 0) {
        updatedScores[dimension] += value;
      } else if (value < 0) {
        const opposite = getOppositeDimension(dimension);
        updatedScores[opposite] += Math.abs(value);
      }

      setScores(updatedScores);

      if (index + 1 < mbtiQuestions.length) {
        setIndex(index + 1);
        setSelected(null);
      } else {
        const personality = [
          updatedScores.E >= updatedScores.I ? "E" : "I",
          updatedScores.S >= updatedScores.N ? "S" : "N",
          updatedScores.T >= updatedScores.F ? "T" : "F",
          updatedScores.J >= updatedScores.P ? "J" : "P",
        ].join("");

        localStorage.setItem("mbtiResult", personality);
        setSavedResult(personality);
        setFinished(true);
      }
    }, 150);
  };

  const q = mbtiQuestions[index];
  const progress = ((index + 1) / mbtiQuestions.length) * 100;

  if (finished && savedResult) {
    const profile = mbtiProfiles[savedResult];

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-100 p-6 dark:bg-gray-900">
        <Link
          href="/"
          className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-300"
        >
          ← Back to Home
        </Link>

        <div className="w-full max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 p-8 text-center text-white shadow-lg">
            <p className="text-sm uppercase tracking-[0.2em] text-indigo-200">
              MBTI Result
            </p>

            <h1 className="mt-4 text-4xl font-bold md:text-5xl">
              {savedResult}
            </h1>

            <p className="mt-3 text-lg text-indigo-100">{profile?.name}</p>
          </div>

          <ResultPaywall result={savedResult} testName="MBTI Test">
            <div className="mt-6 space-y-6">
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
                    Weaknesses
                  </h3>
                  <ul className="mt-3 space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    {profile?.weaknesses.map((item) => (
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

              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/20">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Career Fit
                </h3>
                <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
                  {profile?.careers.join(", ")}
                </p>
              </div>

              <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5 dark:border-purple-900 dark:bg-purple-950/20">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Relationship Style
                </h3>
                <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
                  {profile?.relationships}
                </p>
              </div>
            </div>
          </ResultPaywall>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => {
                setFinished(false);
                setIndex(0);
                setSelected(null);
                setScores({
                  E: 0,
                  I: 0,
                  S: 0,
                  N: 0,
                  T: 0,
                  F: 0,
                  J: 0,
                  P: 0,
                });
              }}
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
          MBTI Personality Test
        </h1>

        <div className="mb-6">
          <div className="h-2 w-full rounded bg-gray-200 dark:bg-gray-700">
            <div
              className="h-2 rounded bg-purple-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Question {index + 1} / {mbtiQuestions.length}
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-900">
          <h2 className="text-lg font-semibold leading-7 text-gray-900 dark:text-white">
            {q.question}
          </h2>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {scaleOptions.map((option) => {
            const isSelected = selected === option.value;

            return (
              <button
                key={option.label}
                onClick={() => handleAnswer(q.dimension, option.value)}
                className={`rounded-2xl border px-5 py-4 text-center text-base font-medium transition-all duration-200 ${
                  isSelected
                    ? "border-purple-500 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                    : "border-gray-300 bg-white text-gray-900 hover:scale-[1.02] hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          Энэ тест нь зан төлөвийн чиг хандлагыг ойлгоход зориулсан.
        </p>
      </div>
    </div>
  );
}
