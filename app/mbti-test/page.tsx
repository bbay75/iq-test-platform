"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mbtiQuestions } from "@/data/mbtiQuestions";
import { getLocalizedMbtiProfile } from "@/data/mbtiLocalizedProfiles";
import { saveTestResult } from "@/lib/saveResult";
import { useLang } from "@/lib/LanguageProvider";
import { scoreMbti, validateMbtiBlueprint } from "@/lib/mbtiScoring";
import type { MbtiAnswerValue, MbtiAnswers } from "@/lib/mbtiScoring";
import { runMbtiScoringTests } from "@/lib/testMbtiScoring";
import { Venus, Mars } from "lucide-react";
const scaleOptions: {
  value: MbtiAnswerValue;
  visualSize: number;
  label: {
    mn: string;
    en: string;
  };
}[] = [
  {
    value: -3,
    visualSize: 52,
    label: {
      mn: "Огт санал нийлэхгүй",
      en: "Strongly disagree",
    },
  },
  {
    value: -2,
    visualSize: 46,
    label: {
      mn: "Санал нийлэхгүй",
      en: "Disagree",
    },
  },
  {
    value: -1,
    visualSize: 40,
    label: {
      mn: "Бага зэрэг санал нийлэхгүй",
      en: "Slightly disagree",
    },
  },
  {
    value: 0,
    visualSize: 34,
    label: {
      mn: "Саармаг",
      en: "Neutral",
    },
  },
  {
    value: 1,
    visualSize: 40,
    label: {
      mn: "Бага зэрэг санал нийлнэ",
      en: "Slightly agree",
    },
  },
  {
    value: 2,
    visualSize: 46,
    label: {
      mn: "Санал нийлнэ",
      en: "Agree",
    },
  },
  {
    value: 3,
    visualSize: 52,
    label: {
      mn: "Бүрэн санал нийлнэ",
      en: "Strongly agree",
    },
  },
];

export default function MBTITest() {
  const [index, setIndex] = useState(0);

  const [answers, setAnswers] = useState<MbtiAnswers>({});

  const [finished, setFinished] = useState(false);

  const [savedResult, setSavedResult] = useState<string | null>(null);

  const [gender, setGender] = useState<"female" | "male" | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [resultError, setResultError] = useState<string | null>(null);

  const router = useRouter();
  const autoNextTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { lang } = useLang();

  useEffect(() => {
    const saved = localStorage.getItem("mbtiResult");

    if (saved) {
      setSavedResult(saved);
    }
  }, []);

  /**
   * Development үед 60-question blueprint
   * алдаагүй байгаа эсэхийг шалгана.
   */
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      const validation = validateMbtiBlueprint(mbtiQuestions);

      if (!validation.valid) {
        console.error(
          "MBTI blueprint error:",
          validation.errors,
          validation.stats,
        );

        return;
      }

      console.log("✅ MBTI blueprint valid", validation.stats);

      runMbtiScoringTests();
    }
  }, []);

  const q = mbtiQuestions[index];

  const selected = answers[q.id] ?? null;

  const progress = ((index + 1) / mbtiQuestions.length) * 100;

  async function finishTest(finalAnswers: MbtiAnswers) {
    if (isSubmitting) {
      return;
    }

    setResultError(null);

    const result = scoreMbti(mbtiQuestions, finalAnswers);

    /**
     * Бүх 60 асуулт хариулагдаагүй бол
     * result гаргахгүй.
     */
    if (!result.complete) {
      setResultError(
        lang === "en"
          ? "Please answer every question before finishing the test."
          : "Тестийг дуусгахын өмнө бүх асуултад хариулна уу.",
      );

      return;
    }

    /**
     * Маш ховор тохиолдолд core score = 0
     * мөн borderline answer = 0 байвал
     * хүчээр E/I/S/N... сонгохгүй.
     */
    if (!result.type) {
      setResultError(
        lang === "en"
          ? "One of your personality dimensions is exactly balanced. Please review your answers and adjust any answer that does not fully reflect you."
          : "Таны зан төлөвийн нэг чиглэл яг тэнцүү гарлаа. Өөрийг тань бүрэн илэрхийлээгүй хариулт байгаа эсэхийг эргэж шалгаарай.",
      );

      return;
    }

    const personality = result.type;

    const localized = getLocalizedMbtiProfile(personality);

    localStorage.setItem("mbtiResult", personality);

    setSavedResult(personality);
    setIsSubmitting(true);

    try {
      /**
       * 60 хариултыг facet-тай нь хадгална.
       *
       * Premium personalized тайлалд
       * дараа ашиглана.
       */
      const answerData = mbtiQuestions.map((question) => ({
        id: question.id,
        axis: question.axis,
        direction: question.direction,
        role: question.role,
        facet: question.facet,
        value: finalAnswers[question.id],
      }));

      const saved = await saveTestResult({
        test_type: "mbti",

        result_json: {
          type: personality,
          label: personality,
          gender,

          /**
           * ШИНЭ:
           * 4 чиглэлийн бүх scoring data.
           */
          axes: result.axes,

          /**
           * ШИНЭ:
           * 60 бодит answer.
           */
          answers: answerData,

          /**
           * Дараа scoring system өөрчлөгдвөл
           * хуучин result-оос ялгахад хэрэгтэй.
           */
          scoringVersion: "mbti_60_v1",

          /**
           * Хуучин profile data-г
           * хэвээр үлдээнэ.
           */
          name: localized.mn.name,

          summary: localized.mn.summary,

          strengths: localized.mn.strengths,

          weaknesses: localized.mn.weaknesses,

          careers: localized.mn.careers,

          relationships: localized.mn.relationships,

          localized: {
            mn: {
              ...localized.mn,
              label: personality,
            },

            en: {
              ...localized.en,
              label: personality,
            },
          },
        },

        score: null,
      });

      router.push(`/my-results/${saved.id}`);

      return;
    } catch (error) {
      console.error("MBTI save error:", error);

      /**
       * Save алдаа гарсан ч
       * хэрэглэгчийн type-г алдахгүй.
       */
      setFinished(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleAnswer(value: MbtiAnswerValue) {
    if (isSubmitting) {
      return;
    }

    setResultError(null);

    const nextAnswers: MbtiAnswers = {
      ...answers,
      [q.id]: value,
    };

    setAnswers(nextAnswers);

    if (autoNextTimer.current) {
      clearTimeout(autoNextTimer.current);
    }

    autoNextTimer.current = setTimeout(() => {
      autoNextTimer.current = null;

      if (index + 1 < mbtiQuestions.length) {
        setIndex(index + 1);
      } else {
        void finishTest(nextAnswers);
      }
    }, 250);
  }

  function handlePrevious() {
    if (autoNextTimer.current) {
      clearTimeout(autoNextTimer.current);
      autoNextTimer.current = null;
    }

    if (index === 0 || isSubmitting) {
      return;
    }

    setResultError(null);

    setIndex((current) => current - 1);
  }
  function handleNext() {
    if (autoNextTimer.current) {
      clearTimeout(autoNextTimer.current);
      autoNextTimer.current = null;
    }

    if (selected === null || isSubmitting) {
      return;
    }

    setResultError(null);

    if (index + 1 < mbtiQuestions.length) {
      setIndex(index + 1);
      return;
    }

    void finishTest(answers);
  }

  /**
   * Save error гарсан үед local fallback.
   * Ерөнхийдөө save амжилттай бол
   * /my-results/[id] руу шууд орно.
   */
  if (finished && savedResult) {
    const fallbackProfile = getLocalizedMbtiProfile(savedResult);
    const profile = lang === "en" ? fallbackProfile.en : fallbackProfile.mn;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-100 p-6 dark:bg-gray-900">
        <Link
          href="/"
          className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-300"
        >
          {lang === "en" ? "← Back to Home" : "← Нүүр хуудас руу буцах"}
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

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setFinished(false);
                setIndex(0);
                setAnswers({});
                setResultError(null);
              }}
              className="rounded-lg bg-gray-600 px-6 py-2 text-white transition hover:bg-gray-700"
            >
              {lang === "en" ? "Retake test" : "Дахин хийх"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-8 dark:bg-gray-900 sm:px-6">
      <div className="mb-5 flex w-full max-w-2xl">
        <Link
          href="/"
          className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-300"
        >
          {lang === "en" ? "← Back to Home" : "← Нүүр хуудас руу буцах"}
        </Link>
      </div>

      <div className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-7">
        <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
          {lang === "en" ? "MBTI Personality Test" : "MBTI зан төлөвийн тест"}
        </h1>

        {!gender && (
          <div className="mt-7 space-y-4">
            <p className="text-center text-sm text-gray-600 dark:text-gray-300">
              {lang === "en"
                ? "Choose the character shown in your result image"
                : "Үр дүнгийн зурагт харагдах дүрээ сонгоно уу"}
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setGender("female")}
                className="group flex items-center justify-center gap-3 rounded-2xl border border-pink-300 bg-pink-50 px-5 py-4 font-semibold text-pink-700 transition hover:border-pink-400 hover:bg-pink-100 dark:border-pink-500/30 dark:bg-pink-500/[0.08] dark:text-pink-300 dark:hover:bg-pink-500/[0.12]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-300">
                  <Venus className="h-5 w-5" strokeWidth={2} />
                </span>

                <span>
                  {lang === "en" ? "Female character" : "Эмэгтэй дүр"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setGender("male")}
                className="group flex items-center justify-center gap-3 rounded-2xl border border-blue-300 bg-blue-50 px-5 py-4 font-semibold text-blue-700 transition hover:border-blue-400 hover:bg-blue-100 dark:border-blue-500/30 dark:bg-blue-500/[0.08] dark:text-blue-300 dark:hover:bg-blue-500/[0.12]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                  <Mars className="h-5 w-5" strokeWidth={2} />
                </span>

                <span>{lang === "en" ? "Male character" : "Эрэгтэй дүр"}</span>
              </button>
            </div>
          </div>
        )}

        {gender && (
          <>
            {/* Progress */}
            <div className="mt-7">
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-purple-500 transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>
                  {lang === "en"
                    ? `Question ${index + 1} / ${mbtiQuestions.length}`
                    : `Асуулт ${index + 1} / ${mbtiQuestions.length}`}
                </span>

                <span>{Math.round(progress)}%</span>
              </div>
            </div>

            {/* Question */}
            <div className="mt-8 min-h-[130px] rounded-2xl bg-gray-50 px-5 py-7 dark:bg-gray-900 sm:px-8">
              <h2 className="text-center text-xl font-semibold leading-8 text-gray-900 dark:text-white sm:text-2xl sm:leading-9">
                {q.question[lang]}
              </h2>
            </div>

            {/* Scale */}
            <div className="mt-9">
              <div className="flex items-center justify-between gap-0.5 sm:gap-2">
                {scaleOptions.map((option) => {
                  const isSelected = selected === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-label={option.label[lang]}
                      title={option.label[lang]}
                      onClick={() => handleAnswer(option.value)}
                      disabled={isSubmitting}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-transform duration-150 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 sm:h-14 sm:w-14"
                    >
                      <span
                        className={`flex items-center justify-center rounded-full border-2 transition-all duration-150 ${
                          isSelected
                            ? "border-purple-600 bg-purple-600 text-white shadow-md"
                            : "border-gray-400 bg-white text-transparent hover:border-purple-400 dark:border-gray-500 dark:bg-gray-800"
                        }`}
                        style={{
                          width: `min(${option.visualSize}px, 10vw)`,
                          height: `min(${option.visualSize}px, 10vw)`,
                        }}
                      >
                        {isSelected ? "✓" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 flex items-start justify-between gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 sm:text-sm">
                <span className="max-w-[42%] text-left">
                  {lang === "en" ? "Disagree" : "Санал нийлэхгүй"}
                </span>

                <span className="max-w-[42%] text-right">
                  {lang === "en" ? "Agree" : "Санал нийлнэ"}
                </span>
              </div>
            </div>

            {/* Error */}
            {resultError && (
              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                {resultError}
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={index === 0 || isSubmitting}
                className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                {lang === "en" ? "← Previous" : "← Өмнөх"}
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={selected === null || isSubmitting}
                className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSubmitting
                  ? lang === "en"
                    ? "Saving..."
                    : "Хадгалж байна..."
                  : index === mbtiQuestions.length - 1
                    ? lang === "en"
                      ? "See result"
                      : "Үр дүн харах"
                    : lang === "en"
                      ? "Next →"
                      : "Дараах →"}
              </button>
            </div>

            <p className="mt-7 text-center text-xs leading-5 text-gray-500 dark:text-gray-400">
              {lang === "en"
                ? "Answer based on how you usually behave, not how you think you should behave."
                : "Өөрийгөө ямар байх ёстой гэж боддогоор биш, ихэвчлэн бодитоор яаж ханддагаараа хариулаарай."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
