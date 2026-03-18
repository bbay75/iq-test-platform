"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ResultPaywall from "@/components/ResultPaywall";
import { mbtiQuestions, MbtiDimension } from "@/data/mbtiQuestions";
import { mbtiDescriptions } from "@/data/mbtiDescriptions";

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
    setSelected(value); // 🔥 highlight хийх

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
        setSelected(null); // reset
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
    }, 150); // бага delay → UX гоё болно
  };
  const q = mbtiQuestions[index];
  const progress = ((index + 1) / mbtiQuestions.length) * 100;

  const description = useMemo(() => {
    if (!savedResult) return null;
    return mbtiDescriptions[savedResult] || null;
  }, [savedResult]);

  if (finished && savedResult) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-100 p-6 dark:bg-gray-900">
        <Link
          href="/"
          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-300"
        >
          ← Back to Home
        </Link>

        <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
            MBTI Personality Result
          </h1>

          <ResultPaywall
            result={`${savedResult} - ${description?.title || "Personality Type"}`}
            testName="MBTI Test"
          >
            {description && (
              <div className="space-y-5">
                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Summary
                  </h2>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    {description.summary}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      Strengths
                    </h3>
                    <ul className="mt-2 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      {description.strengths.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      Weaknesses
                    </h3>
                    <ul className="mt-2 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      {description.weaknesses.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      Career Fit
                    </h3>
                    <ul className="mt-2 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      {description.careers.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      Relationship Style
                    </h3>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                      {description.relationships}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </ResultPaywall>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => {
                setIndex(0);
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
                setFinished(false);
              }}
              className="rounded-lg bg-gray-600 px-6 py-2 text-white transition hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Дахин эхлэх
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
        className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-300"
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

        <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-900 text-center">
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
                className={`rounded-2xl border px-5 py-4 text-center text-base font-medium transition-all duration-200
          
          ${
            isSelected
              ? "border-purple-500 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
              : "border-gray-300 bg-white text-gray-900 hover:scale-[1.02] hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700"
          }
        `}
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
