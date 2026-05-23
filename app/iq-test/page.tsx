"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ResultPaywall from "@/components/ResultPaywall";
import { iqQuestions } from "@/data/iqQuestions";
import { saveTestResult } from "@/lib/saveResult";
import { useLang } from "@/lib/LanguageProvider";

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
  const { t } = useLang();
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [savedResult, setSavedResult] = useState<string | null>(null);
  const [resultId, setResultId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("iqResult");
    if (saved) setSavedResult(saved);
  }, []);

  const handleAnswer = async (points: number) => {
    const newScore = score + (Number(points) || 0);
    setScore(newScore);

    if (index + 1 < iqQuestions.length) {
      setIndex(index + 1);
      return;
    }

    const result = calculateIQDetails(newScore);

    try {
      const saved = await saveTestResult({
        test_type: "iq",
        result_json: result,
        score: result.iq,
      });

      router.push(`/my-results/${saved.id}`);
      return;
    } catch (error) {
      console.error("Save result error:", error);
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
          ← {t("iq_back_home")}
        </Link>

        <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
            {t("iq_result_title")}
          </h1>

          <div className="mt-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
            <p className="text-center text-lg font-semibold text-gray-900 dark:text-white">
              {savedResult}
            </p>
          </div>

          <ResultPaywall
            isUnlocked={false}
            title={t("iq_unlock_title")}
            description={t("iq_unlock_desc")}
            priceLabel={t("iq_unlock_price")}
            onUnlock={async () => {
              if (!resultId) {
                alert("Result ID олдсонгүй");
                return;
              }

              router.push(`/my-results/${resultId}`);
            }}
          />

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => {
                setIndex(0);
                setScore(0);
                setFinished(false);
                setSavedResult(null);
                setResultId(null);
                localStorage.removeItem("iqResult");
              }}
              className="rounded-lg bg-gray-600 px-6 py-2 text-white transition hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              {t("iq_restart")}
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
        ← {t("iq_back_home")}
      </Link>

      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("iq_title")}
          </h1>

          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            {q.type === "visual"
              ? t("iq_type_visual")
              : q.type === "number"
                ? t("iq_type_number")
                : q.type === "logic"
                  ? t("iq_type_logic")
                  : t("iq_type_verbal")}
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
            {t("iq_question_count")} {index + 1} / {iqQuestions.length}
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-900">
          <h2 className="text-lg font-semibold leading-7 text-gray-900 dark:text-white">
            {t(q.question)}
          </h2>

          {q.image && (
            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
              <img
                src={q.image}
                alt={t(q.question)}
                className="mx-auto max-h-[360px] w-full object-contain"
              />
            </div>
          )}
        </div>

        <div
          className={`mt-6 grid gap-4 ${
            q.type === "visual" ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1"
          }`}
        >
          {q.options.map((opt, i) => (
            <button
              key={`${q.id}-${i}`}
              onClick={() => handleAnswer(opt.points)}
              className="rounded-xl border border-gray-300 bg-white px-4 py-4 text-center font-medium text-gray-900 transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700"
            >
              {opt.image ? (
                <img
                  src={opt.image}
                  alt={`Option ${i + 1}`}
                  className="w-full h-[120px] object-contain"
                />
              ) : (
                <span>{opt.text ? t(opt.text) : ""}</span>
              )}
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          {t("iq_notice")}
        </p>
      </div>
    </div>
  );
}
