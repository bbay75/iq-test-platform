"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { iqQuestions, type IQQuestionType } from "@/data/iqQuestions";
import { saveTestResult } from "@/lib/saveResult";
import { useLang } from "@/lib/LanguageProvider";

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
  let strengths: string[] = [];
  let weaknesses: string[] = [];
  let recommendation = "";

  if (iq < 80) {
    label = "Below Average";

    summary =
      "Энэ тестийн хүрээнд логик холбоо, хэв маяг болон тоон reasoning дээр илүү их дасгал хийх боломж харагдаж байна.";

    strengths = [
      "Суурь логик холбоог таних боломжтой",
      "Энгийн хэв маягийг ялгах чадвартай",
      "Дасгалаар хурдан ахих боломжтой",
    ];

    weaknesses = [
      "Олон алхамт логик дээр хүндрэл гарч магадгүй",
      "Хийсвэр pattern дээр илүү хугацаа шаардаж болно",
      "Тоон болон дүрслэлийн reasoning-ийг хөгжүүлэх зай байна",
    ];

    recommendation =
      "Өдөр бүр 10–15 минут pattern, тоон дараалал болон энгийн логик puzzle хийж дадлагажаарай.";
  } else if (iq < 90) {
    label = "Low Average";

    summary =
      "Таны reasoning чадварын суурь тогтвортой боловч төвөгтэй бодлого дээр илүү анхаарал, хугацаа шаардаж байна.";

    strengths = [
      "Энгийн логикийг зөв таних чадвартай",
      "Тодорхой дүрэмтэй бодлогод тогтвортой",
      "Суурь тоон reasoning боломжийн",
    ];

    weaknesses = [
      "Хийсвэр pattern дээр эргэлзэх магадлалтай",
      "Олон нөхцөлтэй логик дээр удааширч болно",
      "Хурдтай үед жижиг алдаа гарах боломжтой",
    ];

    recommendation =
      "Дунд түвшний pattern болон number reasoning дасгалыг тогтмол хийвэл үр дүн хурдан сайжирна.";
  } else if (iq < 110) {
    label = "Average";

    summary =
      "Таны логик, тоон, хэлний болон дүрслэлийн reasoning чадвар ерөнхийдөө дундаж түвшинд байна.";

    strengths = [
      "Суурь логик тогтвортой",
      "Тоон дарааллыг ойлгох чадвар сайн",
      "Өдөр тутмын reasoning бодлогуудыг боломжийн шийддэг",
    ];

    weaknesses = [
      "Хэцүү abstract pattern дээр илүү хугацаа орж магадгүй",
      "Олон алхамт бодлогод анхаарал шаардана",
      "Яарах үед жижиг алдаа гарах боломжтой",
    ];

    recommendation =
      "Timed puzzle, matrix reasoning болон логик бодлого тогтмол хийвэл дараагийн түвшинд гарах боломжтой.";
  } else if (iq < 120) {
    label = "Above Average";

    summary =
      "Таны reasoning чадвар дундажаас дээгүүр бөгөөд логик холбоо, pattern болон тоон бүтэц таних чадвар сайн байна.";

    strengths = [
      "Логик холбоос хурдан олдог",
      "Pattern recognition сайн",
      "Тоон болон хэлний reasoning тогтвортой",
    ];

    weaknesses = [
      "Маш төвөгтэй хийсвэр бодлогод хугацаа шаардаж магадгүй",
      "Хэт хурдан шийдэх үед анхаарал алдах эрсдэлтэй",
      "Зарим бодлогод overthinking хийх боломжтой",
    ];

    recommendation =
      "Advanced matrix, strategy puzzle болон олон алхамт reasoning бодлого танд тохирно.";
  } else if (iq < 130) {
    label = "High";

    summary =
      "Таны reasoning чадвар өндөр түвшинд байна. Та төвөгтэй pattern, логик бүтэц болон тоон холбоог хурдан таних хандлагатай.";

    strengths = [
      "Хийсвэр логик сайн",
      "Pattern recognition өндөр",
      "Олон алхамт асуудлыг хурдан задлах чадвартай",
    ];

    weaknesses = [
      "Хэт итгэлтэй үед энгийн алдаа гаргаж магадгүй",
      "Хэт их анализ хийх хандлага үүсч болно",
      "Хурдтай үед нягт нямбай байдал чухал",
    ];

    recommendation =
      "Advanced reasoning, strategy game, complex matrix болон олимпиадын түвшний логик бодлогууд тохиромжтой.";
  } else {
    label = "Very High";

    summary =
      "Энэ тестийн хүрээнд таны логик, дүрслэлийн болон тоон reasoning чадвар маш өндөр түвшинд гарлаа.";

    strengths = [
      "Маш хурдан логик анализ хийдэг",
      "Хийсвэр pattern-ийг хүчтэй таньдаг",
      "Төвөгтэй бүтцийг хурдан задлах чадвартай",
    ];

    weaknesses = [
      "Энгийн бодлогыг хэт төвөгтэй болгож бодох магадлалтай",
      "Яарах үед жижиг алдаа гаргах эрсдэлтэй",
      "Өндөр түвшний сорил шаардлагатай",
    ];

    recommendation =
      "Complex reasoning, advanced matrix, strategy болон өндөр түвшний problem-solving сорил танд илүү тохирно.";
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
    strengths,
    weaknesses,
    recommendation,

    disclaimer:
      "Энэ нь логик, тоон, хэлний болон дүрслэлийн reasoning чадварт суурилсан онлайн тооцоолол бөгөөд клиникийн IQ үнэлгээг орлохгүй.",
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

    // Сүүлийн асуулт биш бол auto-next
    if (index + 1 < iqQuestions.length) {
      setIndex(index + 1);
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
          {q.options.map((opt, i) => {
            const isSelected = answers[index]?.optionIndex === i;

            return (
              <button
                key={`${q.id}-${i}`}
                type="button"
                disabled={submitting}
                onClick={() => handleAnswer(i, opt.points)}
                className={`rounded-xl border px-4 py-4 text-center font-medium transition ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20 dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-200"
                    : "border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700"
                }`}
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
            );
          })}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIndex((prev) => Math.max(0, prev - 1))}
            disabled={index === 0 || submitting}
            className={`rounded-xl border px-5 py-3 text-sm font-semibold transition ${
              index === 0
                ? "cursor-not-allowed border-gray-200 text-gray-300 dark:border-gray-700 dark:text-gray-600"
                : "border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
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
              className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                answers[index]
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500"
              }`}
            >
              Дараах →
            </button>
          )}
        </div>
        <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          {t("iq_notice")}
        </p>
      </div>
    </div>
  );
}
