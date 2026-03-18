"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ResultPaywall from "@/components/ResultPaywall";
import { iqQuestions } from "@/data/iqQuestions";

function calculateIQDetails(totalScore: number) {
  if (totalScore <= 16) {
    return {
      iq: 85,
      label: "Below Average",
      summary:
        "Таны reasoning болон pattern таних чадварын суурь байгаа ч илүү их дасгал хийх боломж харагдаж байна.",
      strengths: [
        "Энгийн дараалал таних чадвар байна",
        "Суурь логик ойлголттой",
        "Анхан түвшний reasoning боломжтой",
      ],
      weaknesses: [
        "Холимог логик дээр алдаа гарах магадлалтай",
        "Visual pattern дээр тогтворгүй байж болно",
        "Хурд ба анхааралд сайжруулах зай байна",
      ],
      recommendation:
        "Өдөр бүр 10–15 минут логик puzzle, тоон дараалал, pattern дасгал хийвэл хурдан ахина.",
    };
  }

  if (totalScore <= 32) {
    return {
      iq: 100,
      label: "Average",
      summary:
        "Та дундаж түвшний reasoning чадвартай бөгөөд basic логик, verbal болон number асуултуудыг сайн шийдэж байна.",
      strengths: [
        "Суурь логик сайн",
        "Verbal reasoning боломжийн",
        "Тоон дараалал ойлгох чадвар тогтвортой",
      ],
      weaknesses: [
        "Илүү хэцүү visual abstraction дээр эргэлзэж магадгүй",
        "Зарим төвөгтэй нөхцөлт логик дээр удааширч болно",
        "Хурдан шийдвэр дээр жижиг алдаа гарч магадгүй",
      ],
      recommendation:
        "Дунд түвшний IQ-style puzzle болон timed logic challenge хийвэл дараагийн шатанд гарна.",
    };
  }

  if (totalScore <= 44) {
    return {
      iq: 115,
      label: "Above Average",
      summary:
        "Таны reasoning чадвар дундажаас дээш байна. Та number, logic, verbal төрлүүд дээр сайн ажиллаж байна.",
      strengths: [
        "Логик холбоос хурдан олдог",
        "Тоон болон verbal reasoning сайн",
        "Pattern таних чадвар дээгүүр",
      ],
      weaknesses: [
        "Илүү abstract visual асуултад бага зэрэг цаг орж магадгүй",
        "Маш хурдтай үед анхаарал сарних магадлалтай",
        "Хэт итгэлтэй үед жижиг алдаа гарч болно",
      ],
      recommendation:
        "Advanced pattern, matrix reasoning, strategy puzzle хийвэл өндөр түвшний гүйцэтгэлд хүрэх боломжтой.",
    };
  }

  return {
    iq: 130,
    label: "High Intelligence",
    summary:
      "Таны reasoning, pattern recognition, verbal болон logical analysis чадвар маш сайн байна.",
    strengths: [
      "Хурдан логик анализ",
      "Pattern recognition өндөр",
      "Number болон verbal reasoning тэнцвэртэй сайн",
    ],
    weaknesses: [
      "Яарсан үед хэт энгийн асуултад алдаа гаргах эрсдэлтэй",
      "Overthinking хийх магадлал бий",
      "Тогтвортой анхаарал чухал хэвээр",
    ],
    recommendation:
      "Advanced IQ-style challenge, abstract reasoning, Olympiad-level logic puzzle, strategy game танд илүү тохирно.",
  };
}

export default function IQTest() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [savedResult, setSavedResult] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("iqResult");
    if (saved) setSavedResult(saved);
  }, []);

  const handleAnswer = (points: number) => {
    const newScore = score + (Number(points) || 0);
    setScore(newScore);

    if (index + 1 < iqQuestions.length) {
      setIndex(index + 1);
    } else {
      const result = calculateIQDetails(newScore);
      const finalText = `${result.iq} (${result.label})`;
      localStorage.setItem("iqResult", finalText);
      setSavedResult(finalText);
      setFinished(true);
    }
  };

  const q = iqQuestions[index];
  const progress = ((index + 1) / iqQuestions.length) * 100;

  const resultDetails = useMemo(() => {
    if (!savedResult) return null;
    const matched = savedResult.match(/^(\d+)/);
    const numericIq = matched ? Number(matched[1]) : 100;

    if (numericIq <= 85) return calculateIQDetails(16);
    if (numericIq <= 100) return calculateIQDetails(32);
    if (numericIq <= 115) return calculateIQDetails(44);
    return calculateIQDetails(56);
  }, [savedResult]);

  if (finished && savedResult && resultDetails) {
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
            IQ Test Result
          </h1>

          <ResultPaywall result={savedResult} testName="IQ Test">
            <div className="space-y-5">
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Summary
                </h2>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  {resultDetails.summary}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    Strengths
                  </h3>
                  <ul className="mt-2 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    {resultDetails.strengths.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    Weaknesses
                  </h3>
                  <ul className="mt-2 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    {resultDetails.weaknesses.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Recommendation
                </h3>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  {resultDetails.recommendation}
                </p>
              </div>
            </div>
          </ResultPaywall>

          <div className="mt-6 flex justify-center">
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
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            IQ Test
          </h1>

          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            {q.type}
          </span>
        </div>

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

        <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-900">
          <h2 className="text-lg font-semibold leading-7 text-gray-900 dark:text-white">
            {q.question}
          </h2>
        </div>

        <div className="mt-6 grid gap-4">
          {q.options.map((opt, i) => (
            <button
              key={`${q.question}-${i}`}
              onClick={() => handleAnswer(opt.points)}
              className={`rounded-xl border border-gray-300 bg-white px-5 py-4 text-center font-medium text-gray-900 transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700 ${
                q.type === "visual"
                  ? "text-3xl leading-[1.8]"
                  : "text-base leading-6"
              }`}
            >
              {opt.text}
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          Энэ тест нь reasoning болон логик чадварыг ерөнхий байдлаар үнэлэхэд
          зориулагдсан.
        </p>
      </div>
    </div>
  );
}
