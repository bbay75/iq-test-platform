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
import {
  Venus,
  Mars,
  Sparkles,
  CheckCircle2,
  Rocket,
  Target,
} from "lucide-react";

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
      mn: "Зүүн талтай маш ойр",
      en: "Strongly closer to the left option",
    },
  },
  {
    value: -2,
    visualSize: 46,
    label: {
      mn: "Зүүн талтай ойр",
      en: "Closer to the left option",
    },
  },
  {
    value: -1,
    visualSize: 40,
    label: {
      mn: "Зүүн талтай бага зэрэг ойр",
      en: "Slightly closer to the left option",
    },
  },
  {
    value: 0,
    visualSize: 34,
    label: {
      mn: "Аль аль нь адил",
      en: "Both equally",
    },
  },
  {
    value: 1,
    visualSize: 40,
    label: {
      mn: "Баруун талтай бага зэрэг ойр",
      en: "Slightly closer to the right option",
    },
  },
  {
    value: 2,
    visualSize: 46,
    label: {
      mn: "Баруун талтай ойр",
      en: "Closer to the right option",
    },
  },
  {
    value: 3,
    visualSize: 52,
    label: {
      mn: "Баруун талтай маш ойр",
      en: "Strongly closer to the right option",
    },
  },
];
type ToastIcon = "start" | "progress" | "almost" | "last";
export default function MBTITest() {
  const [index, setIndex] = useState(0);

  const [answers, setAnswers] = useState<MbtiAnswers>({});

  const [finished, setFinished] = useState(false);

  const [savedResult, setSavedResult] = useState<string | null>(null);

  const [gender, setGender] = useState<"female" | "male" | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [resultError, setResultError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    icon: ToastIcon;
  } | null>(null);

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const shownMilestones = useRef<Set<number>>(new Set());

  const router = useRouter();
  const autoNextTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { lang } = useLang();

  function showToast(message: string, icon: ToastIcon, duration = 2200) {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    setToast({ message, icon });

    toastTimer.current = setTimeout(() => {
      setToast(null);
      toastTimer.current = null;
    }, duration);
  }

  useEffect(() => {
    if (!gender) return;

    const questionNumber = index + 1;

    const milestoneMessages: Record<
      number,
      {
        mn: string;
        en: string;
        icon: ToastIcon;
      }
    > = {
      13: {
        mn: "Сайн явж байна",
        en: "You're doing great",
        icon: "progress",
      },
      25: {
        mn: "Талаас илүү гарлаа",
        en: "You're past halfway",
        icon: "progress",
      },
      37: {
        mn: "Бараг дууслаа",
        en: "Almost there",
        icon: "almost",
      },
      48: {
        mn: "Сүүлийн асуулт",
        en: "Last question",
        icon: "last",
      },
    };

    const milestone = milestoneMessages[questionNumber];

    if (!milestone || shownMilestones.current.has(questionNumber)) {
      return;
    }

    shownMilestones.current.add(questionNumber);

    showToast(milestone[lang], milestone.icon);
  }, [index, gender, lang]);

  useEffect(() => {
    const saved = localStorage.getItem("mbtiResult");

    if (saved) {
      setSavedResult(saved);
    }
  }, []);

  /**
   * Development үед 48-question blueprint
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

  const leftLabel =
    q.direction === 1 ? q.secondLabel[lang] : q.firstLabel[lang];

  const rightLabel =
    q.direction === 1 ? q.firstLabel[lang] : q.secondLabel[lang];
  const progress = ((index + 1) / mbtiQuestions.length) * 100;

  async function finishTest(finalAnswers: MbtiAnswers) {
    if (isSubmitting) {
      return;
    }

    setResultError(null);

    const result = scoreMbti(mbtiQuestions, finalAnswers);

    /**
     * Бүх 48 асуулт хариулагдаагүй бол
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
       * 48 хариултыг facet-тай нь хадгална.
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
           * 48 бодит answer.
           */
          answers: answerData,

          /**
           * Дараа scoring system өөрчлөгдвөл
           * хуучин result-оос ялгахад хэрэгтэй.
           */
          scoringVersion: "mbti_48_v1",

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
      {toast && (
        <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-3 sm:top-5 sm:px-4">
          <div className="flex w-max max-w-[calc(100vw-24px)] items-center gap-3 rounded-xl border border-purple-200 bg-white/95 px-4 py-3 text-gray-900 shadow-xl backdrop-blur-md dark:border-purple-400/20 dark:bg-gray-950/95 dark:text-white sm:max-w-[360px]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-300">
              {toast.icon === "start" && (
                <Sparkles className="h-4 w-4" strokeWidth={2} />
              )}

              {toast.icon === "progress" && (
                <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
              )}

              {toast.icon === "almost" && (
                <Rocket className="h-4 w-4" strokeWidth={2} />
              )}

              {toast.icon === "last" && (
                <Target className="h-4 w-4" strokeWidth={2} />
              )}
            </div>

            <p className="max-w-[285px] text-sm font-medium leading-5">
              {toast.message}
            </p>
          </div>
        </div>
      )}
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
          {lang === "en" ? "MBTI Personality Test" : "MBTI Зан төлөвийн тест"}
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
                onClick={() => {
                  setGender("female");

                  showToast(
                    lang === "en"
                      ? "Let's begin. No right or wrong answers. Choose the side that feels more like you."
                      : "Эхэллээ. Зөв, буруу хариулт байхгүй. Өөрт хамгийн ойр талыг сонгоорой.",
                    "start",
                    3500,
                  );
                }}
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
                onClick={() => {
                  setGender("male");

                  showToast(
                    lang === "en"
                      ? "Let's begin. No right or wrong answers. Choose the side that feels more like you."
                      : "Эхэллээ. Зөв, буруу хариулт байхгүй. Өөрт хамгийн ойр талыг сонгоорой.",
                    "start",
                    3500,
                  );
                }}
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
                  className="h-full rounded-full bg-gradient-to-r from-teal-400 via-emerald-400 to-emerald-500 transition-all duration-300"
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
              <div className="relative">
                {/* 7 choices */}
                <div className="grid grid-cols-7 items-center">
                  {scaleOptions.map((option) => {
                    const isSelected = selected === option.value;

                    const isLeft = option.value < 0;
                    const isRight = option.value > 0;
                    const isCenter = option.value === 0;

                    const selectedClass = isLeft
                      ? "border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-500/20"
                      : isRight
                        ? "border-purple-500 bg-purple-500 text-white shadow-md shadow-purple-500/20"
                        : "border-gray-500 bg-gray-500 text-white shadow-md";

                    const idleClass = isLeft
                      ? "border-blue-400 bg-white text-transparent hover:border-blue-500 hover:bg-blue-50 dark:bg-gray-800 dark:hover:border-blue-400 dark:hover:bg-gray-800"
                      : isRight
                        ? "border-purple-400 bg-white text-transparent hover:border-purple-500 hover:bg-purple-50 dark:bg-gray-800 dark:hover:border-purple-400 dark:hover:bg-gray-800"
                        : "border-gray-400 bg-white text-transparent hover:border-gray-500 hover:bg-gray-50 dark:border-gray-500 dark:bg-gray-800 dark:hover:border-gray-400 dark:hover:bg-gray-800";

                    return (
                      <div
                        key={option.value}
                        className="relative flex h-14 items-center justify-center"
                      >
                        {/* LEFT GROUP CONNECTORS */}
                        {option.value === -3 && (
                          <div className="absolute left-1/2 right-0 h-[2px] bg-blue-400/50" />
                        )}

                        {option.value === -2 && (
                          <div className="absolute inset-x-0 h-[2px] bg-blue-400/50" />
                        )}

                        {option.value === -1 && (
                          <div className="absolute left-0 right-1/2 h-[2px] bg-blue-400/50" />
                        )}

                        {/* RIGHT GROUP CONNECTORS */}
                        {option.value === 1 && (
                          <div className="absolute left-1/2 right-0 h-[2px] bg-purple-400/50" />
                        )}

                        {option.value === 2 && (
                          <div className="absolute inset-x-0 h-[2px] bg-purple-400/50" />
                        )}

                        {option.value === 3 && (
                          <div className="absolute left-0 right-1/2 h-[2px] bg-purple-400/50" />
                        )}

                        <button
                          type="button"
                          aria-label={option.label[lang]}
                          title={option.label[lang]}
                          onClick={() => handleAnswer(option.value)}
                          disabled={isSubmitting}
                          className="relative z-10 flex h-14 w-14 items-center justify-center transition-transform duration-150 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <span
                            className={`flex items-center justify-center rounded-full border-2 transition-all duration-150 ${
                              isSelected ? selectedClass : idleClass
                            }`}
                            style={{
                              width: `${option.visualSize * 0.78}px`,
                              height: `${option.visualSize * 0.78}px`,
                            }}
                          >
                            {isSelected ? "✓" : ""}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 flex items-start justify-between gap-4 text-xs font-semibold text-gray-600 dark:text-gray-300 sm:text-sm">
                <span className="max-w-[43%] text-left">{leftLabel}</span>

                <span className="max-w-[43%] text-right">{rightLabel}</span>
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
                className="rounded-xl bg-emerald-500/85 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
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
