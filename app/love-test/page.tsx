"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ResultPaywall from "@/components/ResultPaywall";
import { loveQuestions } from "@/data/loveQuestions";
import {
  buildPairLoveResult,
  buildSoloLoveResult,
} from "@/data/loveCalculator";

const scaleOptions = [
  { label: "Огт санал нийлэхгүй", value: 1 },
  { label: "Санал нийлэхгүй", value: 2 },
  { label: "Дундаж", value: 3 },
  { label: "Санал нийлнэ", value: 4 },
  { label: "Бүрэн санал нийлнэ", value: 5 },
];

type LoveMode = "solo" | "both" | null;

export default function LoveTestPage() {
  const [mode, setMode] = useState<LoveMode>(null);

  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");

  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);

  const [answers1, setAnswers1] = useState<number[]>([]);
  const [answers2, setAnswers2] = useState<number[]>([]);

  const [selected1, setSelected1] = useState<number | null>(null);
  const [selected2, setSelected2] = useState<number | null>(null);

  const [finished, setFinished] = useState(false);
  const [savedResult, setSavedResult] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("loveResult");
    if (saved) setSavedResult(saved);
  }, []);

  const currentQuestion = loveQuestions[index];

  const resultData = useMemo(() => {
    if (!finished || !name1 || !name2 || !mode) return null;

    if (mode === "solo") {
      return buildSoloLoveResult(name1, name2, answers1);
    }

    return buildPairLoveResult(name1, name2, answers1, answers2);
  }, [finished, mode, name1, name2, answers1, answers2]);

  const handleNext = () => {
    if (mode === "solo") {
      if (selected1 === null) return;

      const updatedAnswers1 = [...answers1, selected1];
      setAnswers1(updatedAnswers1);

      if (index + 1 < loveQuestions.length) {
        setIndex(index + 1);
        setSelected1(null);
      } else {
        const result = buildSoloLoveResult(name1, name2, updatedAnswers1);
        const finalText = `${result.finalScore}%`;
        localStorage.setItem("loveResult", finalText);
        setSavedResult(finalText);
        setFinished(true);
      }

      return;
    }

    if (selected1 === null || selected2 === null) return;

    const updatedAnswers1 = [...answers1, selected1];
    const updatedAnswers2 = [...answers2, selected2];

    setAnswers1(updatedAnswers1);
    setAnswers2(updatedAnswers2);

    if (index + 1 < loveQuestions.length) {
      setIndex(index + 1);
      setSelected1(null);
      setSelected2(null);
    } else {
      const result = buildPairLoveResult(
        name1,
        name2,
        updatedAnswers1,
        updatedAnswers2,
      );
      const finalText = `${result.finalScore}%`;
      localStorage.setItem("loveResult", finalText);
      setSavedResult(finalText);
      setFinished(true);
    }
  };

  const progress = started ? ((index + 1) / loveQuestions.length) * 100 : 0;

  const resetTest = () => {
    setMode(null);
    setStarted(false);
    setIndex(0);
    setAnswers1([]);
    setAnswers2([]);
    setSelected1(null);
    setSelected2(null);
    setFinished(false);
  };

  if (finished && resultData && savedResult) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-100 p-6 dark:bg-gray-900">
        <Link
          href="/"
          className="text-sm font-medium text-pink-600 hover:underline dark:text-pink-300"
        >
          ← Back to Home
        </Link>

        <div className="w-full max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="rounded-3xl bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-500 p-8 text-center text-white shadow-lg">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-pink-100">
              Love Compatibility Result
            </p>

            <h1 className="mt-4 text-3xl font-bold md:text-4xl">
              {name1} ❤️ {name2}
            </h1>

            <p className="mt-3 text-pink-100">
              {mode === "solo"
                ? "Solo mode • Estimated compatibility"
                : "Both mode • More accurate compatibility"}
            </p>

            <div className="mt-6 inline-flex rounded-full bg-white/15 px-6 py-3 backdrop-blur">
              <span className="text-4xl font-bold">{savedResult}</span>
            </div>
          </div>

          <ResultPaywall result={savedResult} testName="Love Test">
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-pink-200 bg-pink-50 p-5 text-center dark:border-pink-800 dark:bg-pink-950/30">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Name Match
                  </p>
                  <p className="mt-3 text-3xl font-bold text-pink-600 dark:text-pink-300">
                    {resultData.nameScore}%
                  </p>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Нэрний энерги дээр суурилсан
                  </p>
                </div>

                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-center dark:border-rose-800 dark:bg-rose-950/30">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {mode === "solo" ? "Estimated Match" : "Psychology Match"}
                  </p>
                  <p className="mt-3 text-3xl font-bold text-rose-600 dark:text-rose-300">
                    {resultData.psychologyScore}%
                  </p>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {mode === "solo"
                      ? "Таны хариултаас тооцсон"
                      : "Хоёр хүний хариултаас тооцсон"}
                  </p>
                </div>

                <div className="rounded-2xl border border-fuchsia-200 bg-fuchsia-50 p-5 text-center dark:border-fuchsia-800 dark:bg-fuchsia-950/30">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Name Energy
                  </p>
                  <p className="mt-3 text-3xl font-bold text-fuchsia-600 dark:text-fuchsia-300">
                    {resultData.reduced1} + {resultData.reduced2}
                  </p>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Нэрний бууруулсан тоо
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50 p-5 dark:border-pink-900 dark:from-gray-900 dark:to-gray-900">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Summary
                </h2>
                <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
                  {resultData.summary}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-900 dark:bg-green-950/20">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Strengths
                  </h3>
                  <ul className="mt-3 space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    {resultData.strengths.map((item) => (
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
                    {resultData.challenges.map((item) => (
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
                  Advice
                </h3>
                <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
                  {resultData.advice}
                </p>
              </div>

              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                {mode === "solo"
                  ? "Ганцаараа бөглөсөн тул psychology score нь estimated result юм."
                  : "Хоёулаа бөглөсөн тул psychology score нь илүү accurate result юм."}
              </div>
            </div>
          </ResultPaywall>

          <div className="mt-6 flex justify-center">
            <button
              onClick={resetTest}
              className="rounded-lg bg-gray-600 px-6 py-2 text-white transition hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Дахин эхлэх
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-100 p-6 dark:bg-gray-900">
        <Link
          href="/"
          className="text-sm font-medium text-pink-600 hover:underline dark:text-pink-300"
        >
          ← Back to Home
        </Link>

        <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
            Love Compatibility Test
          </h1>

          <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-300">
            Нэрний зохицол + relationship psychology дээр суурилсан үр дүн
            гаргана.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <button
              onClick={() => setMode("solo")}
              className={`rounded-2xl border p-5 text-center transition ${
                mode === "solo"
                  ? "border-pink-500 bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300"
                  : "border-gray-300 bg-white text-gray-900 hover:bg-pink-50 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700"
              }`}
            >
              <p className="text-lg font-bold">Ганцаараа бөглөх</p>
              <p className="mt-2 text-sm">
                1 хүн хариулна • Estimated compatibility
              </p>
            </button>

            <button
              onClick={() => setMode("both")}
              className={`rounded-2xl border p-5 text-center transition ${
                mode === "both"
                  ? "border-pink-500 bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300"
                  : "border-gray-300 bg-white text-gray-900 hover:bg-pink-50 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700"
              }`}
            >
              <p className="text-lg font-bold">Хоёулаа бөглөх</p>
              <p className="mt-2 text-sm">
                2 хүн хариулна • More accurate compatibility
              </p>
            </button>
          </div>

          <div className="mt-6 grid gap-4">
            <input
              type="text"
              placeholder="Эхний хүний нэр"
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-pink-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />

            <input
              type="text"
              placeholder="Хоёр дахь хүний нэр"
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-pink-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />

            <button
              onClick={() => {
                if (!mode || !name1.trim() || !name2.trim()) return;
                setStarted(true);
              }}
              className="rounded-xl bg-pink-500 px-6 py-3 font-semibold text-white transition hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-500"
            >
              Test Start
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
        className="text-sm font-medium text-pink-600 hover:underline dark:text-pink-300"
      >
        ← Back to Home
      </Link>

      <div className="w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
          {mode === "solo" ? "Solo Love Test" : "Love Psychology Test"}
        </h1>

        <div className="mb-6">
          <div className="h-2 w-full rounded bg-gray-200 dark:bg-gray-700">
            <div
              className="h-2 rounded bg-pink-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Question {index + 1} / {loveQuestions.length}
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-900">
          <h2 className="text-lg font-semibold leading-7 text-gray-900 dark:text-white">
            {currentQuestion.question}
          </h2>
        </div>

        {mode === "solo" ? (
          <div className="mt-6 rounded-2xl border border-pink-200 bg-pink-50 p-4 dark:border-pink-800 dark:bg-pink-950/30">
            <h3 className="mb-4 text-center text-lg font-bold text-gray-900 dark:text-white">
              {name1}
            </h3>

            <div className="flex flex-col gap-3">
              {scaleOptions.map((option) => (
                <button
                  key={`${option.label}-solo`}
                  onClick={() => setSelected1(option.value)}
                  className={`rounded-xl border px-4 py-3 text-center font-medium transition ${
                    selected1 === option.value
                      ? "border-pink-500 bg-pink-200 text-pink-700 dark:bg-pink-900 dark:text-pink-300"
                      : "border-gray-300 bg-white text-gray-900 hover:bg-pink-100 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-pink-200 bg-pink-50 p-4 dark:border-pink-800 dark:bg-pink-950/30">
              <h3 className="mb-4 text-center text-lg font-bold text-gray-900 dark:text-white">
                {name1}
              </h3>

              <div className="flex flex-col gap-3">
                {scaleOptions.map((option) => (
                  <button
                    key={`${option.label}-1`}
                    onClick={() => setSelected1(option.value)}
                    className={`rounded-xl border px-4 py-3 text-center font-medium transition ${
                      selected1 === option.value
                        ? "border-pink-500 bg-pink-200 text-pink-700 dark:bg-pink-900 dark:text-pink-300"
                        : "border-gray-300 bg-white text-gray-900 hover:bg-pink-100 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
              <h3 className="mb-4 text-center text-lg font-bold text-gray-900 dark:text-white">
                {name2}
              </h3>

              <div className="flex flex-col gap-3">
                {scaleOptions.map((option) => (
                  <button
                    key={`${option.label}-2`}
                    onClick={() => setSelected2(option.value)}
                    className={`rounded-xl border px-4 py-3 text-center font-medium transition ${
                      selected2 === option.value
                        ? "border-blue-500 bg-blue-200 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "border-gray-300 bg-white text-gray-900 hover:bg-blue-100 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleNext}
            disabled={
              mode === "solo"
                ? selected1 === null
                : selected1 === null || selected2 === null
            }
            className="rounded-xl bg-pink-500 px-8 py-3 font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-pink-600 dark:hover:bg-pink-500"
          >
            Next
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          {mode === "solo"
            ? "Solo mode нь estimated result гаргана."
            : "Both mode нь илүү accurate result гаргана."}
        </p>
      </div>
    </div>
  );
}
