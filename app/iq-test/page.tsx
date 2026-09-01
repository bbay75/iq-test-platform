"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { iqQuestions, type IQQuestionType } from "@/data/iqQuestions";
import { saveTestResult } from "@/lib/saveResult";
import { useLang } from "@/lib/LanguageProvider";
import {
  Check,
  Shapes,
  Calculator,
  Brain,
  Languages,
  Target,
} from "lucide-react";
function erf(x: number) {
  const sign = x >= 0 ? 1 : -1;
  const absX = Math.abs(x);

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1 / (1 + p * absX);

  const y =
    1 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return sign * y;
}

function iqToPercentile(iq: number) {
  const mean = 100;
  const sd = 15;

  const z = (iq - mean) / sd;

  const percentile = 0.5 * (1 + erf(z / Math.sqrt(2))) * 100;

  return Math.max(1, Math.min(99, Math.round(percentile)));
}

function calculateDomainPercentages(
  domainScores: Record<IQQuestionType, number>,
) {
  const maxScores = iqQuestions.reduce(
    (acc, question) => {
      acc[question.type] += 2;
      return acc;
    },
    {
      visual: 0,
      number: 0,
      logic: 0,
      verbal: 0,
    } as Record<IQQuestionType, number>,
  );

  return {
    visual: Math.round((domainScores.visual / maxScores.visual) * 100),
    number: Math.round((domainScores.number / maxScores.number) * 100),
    logic: Math.round((domainScores.logic / maxScores.logic) * 100),
    verbal: Math.round((domainScores.verbal / maxScores.verbal) * 100),
  };
}

function calculateIQDetails(totalScore: number) {
  const MAX_RAW_SCORE = 58;

  const clampedScore = Math.max(0, Math.min(MAX_RAW_SCORE, totalScore));

  const iq = Math.round(65 + (clampedScore / MAX_RAW_SCORE) * 70);
  const percentile = iqToPercentile(iq);

  let label = "";
  let summary = "";

  if (iq < 80) {
    label = "Доогуур";
    summary = "Логик болон тоон бодлогын сууриа илүү хөгжүүлэх боломжтой.";
  } else if (iq < 90) {
    label = "Дундажаас доогуур";
    summary =
      "Логик сэтгэлгээний суурь боломжийн. Төвөгтэй бодлогод арай илүү хугацаа шаардагдаж магадгүй.";
  } else if (iq < 110) {
    label = "Дундаж";
    summary =
      "Таны логик, тоон болон дүрслэлийн сэтгэлгээ ерөнхийдөө дундаж түвшинд байна.";
  } else if (iq < 120) {
    label = "Дундажаас дээгүүр";
    summary =
      "Та логик холбоо, тоон дараалал болон дүрсний хэв маягийг сайн таньж байна.";
  } else if (iq < 130) {
    label = "Өндөр";
    summary =
      "Та төвөгтэй логик холбоо, тоон бүтэц болон дүрсний хэв маягийг хурдан таньж байна.";
  } else {
    label = "Маш өндөр";
    summary =
      "Энэ сорилын хүрээнд таны логик, тоон болон дүрслэлийн сэтгэлгээ маш өндөр үзүүлэлттэй гарлаа.";
  }

  return {
    rawScore: clampedScore,
    maxRawScore: MAX_RAW_SCORE,
    correctAnswers: Math.round(clampedScore / 2),
    totalQuestions: 29,

    iq,
    percentile,

    estimatedRange: {
      min: Math.max(60, iq - 5),
      max: Math.min(140, iq + 5),
    },

    label,
    summary,

    disclaimer:
      "Энэ нь онлайн сорилын тооцоолсон үр дүн бөгөөд мэргэжлийн IQ үнэлгээг орлохгүй.",
  };
}

export default function IQTest() {
  const { t } = useLang();
  const router = useRouter();
  const [index, setIndex] = useState(0);

  const [answers, setAnswers] = useState<
    Array<{ optionIndex: number; points: number } | null>
  >(() => Array(iqQuestions.length).fill(null));

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    text: string;
    icon: "visual" | "number" | "logic" | "verbal" | "last";
  } | null>(null);
  const showSectionToast = (
    text: string,
    icon: "visual" | "number" | "logic" | "verbal" | "last",
  ) => {
    setToast({ text, icon });

    setTimeout(() => {
      setToast(null);
    }, 1800);
  };
  useEffect(() => {
    showSectionToast("Дүрс", "visual");
  }, []);
  const handleAnswer = async (optionIndex: number, points: number) => {
    if (submitting) return;

    const safePoints = Number(points) || 0;

    // Өмнөх хариултыг шинэ хариултаар REPLACE хийнэ
    const updatedAnswers = [...answers];

    updatedAnswers[index] = {
      optionIndex,
      points: safePoints,
    };

    setAnswers(updatedAnswers);

    if (index + 1 < iqQuestions.length) {
      const nextIndex = index + 1;

      setTimeout(() => {
        setIndex(nextIndex);

        if (nextIndex === 8) {
          showSectionToast("Тоо", "number");
        } else if (nextIndex === 15) {
          showSectionToast("Логик", "logic");
        } else if (nextIndex === 22) {
          showSectionToast("Үгийн холбоо", "verbal");
        } else if (nextIndex === 28) {
          showSectionToast("Сүүлийн асуулт", "last");
        }
      }, 120);

      return;
    }

    // =========================
    // FINAL SCORE
    // =========================

    const totalScore = updatedAnswers.reduce(
      (sum, answer) => sum + (answer?.points ?? 0),
      0,
    );

    const domainScores: Record<IQQuestionType, number> = {
      visual: 0,
      number: 0,
      logic: 0,
      verbal: 0,
    };

    updatedAnswers.forEach((answer, questionIndex) => {
      if (!answer) return;

      const questionType = iqQuestions[questionIndex].type;

      domainScores[questionType] += answer.points;
    });

    const domainPercentages = calculateDomainPercentages(domainScores);

    const result = {
      ...calculateIQDetails(totalScore),

      domains: {
        visual: domainPercentages.visual,
        number: domainPercentages.number,
        logic: domainPercentages.logic,
        verbal: domainPercentages.verbal,
      },
    };

    try {
      setSubmitting(true);

      const saved = await saveTestResult({
        test_type: "iq",
        result_json: result,
        score: result.iq,
      });

      router.push(`/my-results/${saved.id}`);
    } catch (error) {
      console.error("Save result error:", error);
      setSubmitting(false);
    }
  };

  const q = iqQuestions[index];
  const progress = ((index + 1) / iqQuestions.length) * 100;

  return (
    <>
      {toast && (
        <div className="pointer-events-none fixed inset-x-0 top-5 z-50 flex justify-center px-4">
          <div className="flex items-center gap-2 rounded-xl border border-indigo-400/20 bg-gray-950/95 px-4 py-3 text-sm font-semibold text-white shadow-xl backdrop-blur-md">
            {toast.icon === "visual" && (
              <Shapes className="h-4 w-4 text-indigo-300" />
            )}
            {toast.icon === "number" && (
              <Calculator className="h-4 w-4 text-indigo-300" />
            )}
            {toast.icon === "logic" && (
              <Brain className="h-4 w-4 text-indigo-300" />
            )}
            {toast.icon === "verbal" && (
              <Languages className="h-4 w-4 text-indigo-300" />
            )}
            {toast.icon === "last" && (
              <Target className="h-4 w-4 text-indigo-300" />
            )}

            <span>{toast.text}</span>
          </div>
        </div>
      )}
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100 p-3 dark:bg-gray-900 sm:gap-6 sm:p-6">
        <Link
          href="/"
          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-300"
        >
          ← {t("iq_back_home")}
        </Link>

        <div className="w-full max-w-3xl rounded-3xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
          {/* TITLE */}
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
              {t("iq_title")}
            </h1>

            <span className="shrink-0 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-400/20 dark:bg-indigo-500/10 dark:text-indigo-300">
              {q.type === "visual"
                ? t("iq_type_visual")
                : q.type === "number"
                  ? t("iq_type_number")
                  : q.type === "logic"
                    ? t("iq_type_logic")
                    : t("iq_type_verbal")}
            </span>
          </div>

          {/* PROGRESS */}
          <div className="mt-5">
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-400 via-emerald-400 to-emerald-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              <span>
                {t("iq_question_count")} {index + 1} / {iqQuestions.length}
              </span>

              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          {/* QUESTION */}
          <div className="mt-6 rounded-2xl bg-gray-50 p-4 text-center dark:bg-gray-900 sm:p-6">
            <h2 className="text-base font-bold leading-7 text-gray-900 dark:text-white sm:text-lg">
              {t(q.question)}
            </h2>

            {q.image && (
              <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800 sm:p-3">
                <img
                  src={q.image}
                  alt={t(q.question)}
                  className="mx-auto max-h-[280px] w-full object-contain sm:max-h-[320px]"
                />
              </div>
            )}
          </div>

          {/* ANSWERS */}
          <div
            className={`mt-5 grid gap-3 sm:mt-6 sm:gap-4 ${
              q.type === "visual" ? "grid-cols-3" : "grid-cols-1"
            }`}
          >
            {q.options.map((opt, i) => {
              const isSelected = answers[index]?.optionIndex === i;

              return (
                <button
                  key={`${q.id}-${i}`}
                  type="button"
                  disabled={submitting}
                  onClick={() => handleAnswer(i, opt.points)}
                  className={`min-h-[54px] rounded-xl border px-3 py-3 text-center text-sm font-semibold transition-all duration-200 sm:px-4 sm:py-4 sm:text-base ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/15 dark:border-indigo-400 dark:bg-indigo-500/10 dark:text-indigo-200"
                      : "border-gray-300 bg-white text-gray-900 hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:hover:border-indigo-500/50 dark:hover:bg-gray-800"
                  }`}
                >
                  {opt.image ? (
                    <img
                      src={opt.image}
                      alt={`Option ${i + 1}`}
                      className="h-[80px] w-full object-contain sm:h-[135px]"
                    />
                  ) : (
                    <div className="flex w-full items-center justify-between gap-3">
                      <span>{opt.text ? t(opt.text) : ""}</span>

                      {isSelected && (
                        <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* NAVIGATION */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIndex((prev) => Math.max(0, prev - 1))}
              disabled={index === 0 || submitting}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold transition sm:px-5 ${
                index === 0
                  ? "cursor-not-allowed border-gray-200 text-gray-300 dark:border-gray-700 dark:text-gray-600"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              ← Өмнөх
            </button>

            {index + 1 < iqQuestions.length && (
              <button
                type="button"
                disabled={!answers[index] || submitting}
                onClick={() =>
                  setIndex((prev) => Math.min(iqQuestions.length - 1, prev + 1))
                }
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition sm:px-5 ${
                  answers[index]
                    ? "bg-emerald-500/80 text-white hover:bg-emerald-500 dark:bg-emerald-500/75 dark:hover:bg-emerald-500"
                    : "cursor-not-allowed bg-emerald-500/20 text-emerald-700/40 dark:bg-emerald-500/20 dark:text-emerald-300/40"
                }`}
              >
                Дараах →
              </button>
            )}
          </div>

          <p className="mt-5 text-center text-xs leading-5 text-gray-500 dark:text-gray-400">
            {t("iq_notice")}
          </p>
        </div>
      </div>
    </>
  );
}
