"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, CheckCircle2, Rocket, Target } from "lucide-react";

type LoveQuestionnaireProps = {
  title: string;
  questionLabel: string;
  questionText: string;

  index: number;
  total: number;

  selected: number | null;

  stronglyDisagreeLabel: string;
  stronglyAgreeLabel: string;
  previousLabel: string;
  nextLabel: string;

  submitting?: boolean;
  hideNext?: boolean;

  onSelect: (value: number) => void;
  onPrevious: () => void;
  onNext: () => void;
};

type ToastIcon = "start" | "progress" | "almost" | "last";

export default function LoveQuestionnaire({
  title,
  questionLabel,
  questionText,

  index,
  total,

  selected,

  stronglyDisagreeLabel,
  stronglyAgreeLabel,
  previousLabel,
  nextLabel,

  submitting = false,
  hideNext = false,

  onSelect,
  onPrevious,
  onNext,
}: LoveQuestionnaireProps) {
  const progress = ((index + 1) / total) * 100;

  const [toast, setToast] = useState<{
    message: string;
    icon: ToastIcon;
  } | null>(null);

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shownMilestones = useRef<Set<number>>(new Set());

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
    const questionNumber = index + 1;

    // Эхний асуулт
    if (questionNumber === 1 && !shownMilestones.current.has(1)) {
      shownMilestones.current.add(1);

      showToast(
        "Эхэллээ. Зөв, буруу хариулт байхгүй. Өөрт хамгийн ойр хариултаа сонгоорой.",
        "start",
        3500,
      );

      return;
    }

    const milestones: Record<
      number,
      {
        message: string;
        icon: ToastIcon;
      }
    > = {
      8: {
        message: "Сайн явж байна",
        icon: "progress",
      },
      16: {
        message: "Талаас илүү гарлаа",
        icon: "progress",
      },
      23: {
        message: "Бараг дууслаа",
        icon: "almost",
      },
      30: {
        message: "Сүүлийн асуулт",
        icon: "last",
      },
    };

    const milestone = milestones[questionNumber];

    if (!milestone || shownMilestones.current.has(questionNumber)) {
      return;
    }

    shownMilestones.current.add(questionNumber);

    showToast(milestone.message, milestone.icon);
  }, [index]);

  return (
    <div className="w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
      {/* TOAST */}
      {toast && (
        <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-3 sm:top-5 sm:px-4">
          <div className="flex w-max max-w-[calc(100vw-24px)] items-center gap-3 rounded-xl border border-rose-200 bg-white/95 px-4 py-3 text-gray-900 shadow-xl backdrop-blur-md dark:border-rose-400/20 dark:bg-gray-950/95 dark:text-white sm:max-w-[360px]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300">
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

      <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
        {title}
      </h1>

      {/* PROGRESS */}
      <div className="mt-6">
        <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-400 via-emerald-400 to-emerald-500 transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>
            {questionLabel} {index + 1} / {total}
          </span>

          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* QUESTION */}
      <div className="mt-6 flex min-h-[110px] items-center justify-center rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-gray-900 sm:mt-7 sm:min-h-[130px] sm:px-8 sm:py-7">
        <p className="text-base font-bold leading-7 text-gray-900 dark:text-white sm:text-lg sm:leading-8 md:text-xl">
          {questionText}
        </p>
      </div>

      {/* SCALE */}
      <div className="mt-8">
        <div className="relative mx-auto w-full max-w-xl">
          {/* Connector line */}
          <div className="pointer-events-none absolute left-[10%] right-[10%] top-7 h-[2px] bg-rose-300/40 dark:bg-rose-400/20" />

          {/* 5 choices */}
          <div className="relative z-10 grid w-full grid-cols-5 place-items-center">
            {[1, 2, 3, 4, 5].map((value) => {
              const active = selected === value;

              const sizeClass =
                value === 1 || value === 5
                  ? "h-10 w-10 sm:h-12 sm:w-12"
                  : value === 2 || value === 4
                    ? "h-9 w-9 sm:h-10 sm:w-10"
                    : "h-8 w-8";

              return (
                <div
                  key={value}
                  className="flex h-14 w-full items-center justify-center"
                >
                  <button
                    type="button"
                    onClick={() => onSelect(value)}
                    aria-label={`${value}`}
                    disabled={submitting}
                    className="relative z-10 flex h-14 w-14 items-center justify-center transition-transform duration-150 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span
                      className={`flex items-center justify-center rounded-full border-2 transition-all duration-150 ${sizeClass} ${
                        active
                          ? "border-rose-500 bg-rose-500 text-white shadow-md shadow-rose-500/20"
                          : "border-gray-400 bg-white text-transparent hover:border-rose-400 hover:bg-rose-50 dark:border-gray-500 dark:bg-gray-800 dark:hover:border-rose-400 dark:hover:bg-gray-800"
                      }`}
                    >
                      {active ? "✓" : ""}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mx-auto mt-3 flex max-w-xl items-start justify-between gap-3 text-[11px] font-medium leading-4 text-gray-500 dark:text-gray-400 sm:text-sm sm:leading-5">
          <span className="max-w-[44%] text-left">{stronglyDisagreeLabel}</span>

          <span className="max-w-[44%] text-right">{stronglyAgreeLabel}</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrevious}
          disabled={index === 0 || submitting}
          className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          {previousLabel}
        </button>

        {!hideNext && (
          <button
            type="button"
            onClick={onNext}
            disabled={selected === null || submitting}
            className="rounded-xl bg-emerald-500/80 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-emerald-500/75 dark:hover:bg-emerald-500"
          >
            {nextLabel} →
          </button>
        )}
      </div>
    </div>
  );
}
