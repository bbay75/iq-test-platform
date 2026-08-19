"use client";

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

  return (
    <div className="w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
        {title}
      </h1>

      {/* PROGRESS */}
      <div className="mt-6">
        <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-pink-500 transition-all"
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
      <div className="mt-7 rounded-2xl bg-gray-100 p-7 text-center dark:bg-gray-900">
        <p className="text-lg font-bold leading-8 text-gray-900 dark:text-white md:text-xl">
          {questionText}
        </p>
      </div>

      {/* SCALE */}
      <div className="mt-8">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
          {[1, 2, 3, 4, 5].map((value) => {
            const active = selected === value;

            return (
              <button
                key={value}
                type="button"
                onClick={() => onSelect(value)}
                aria-label={`${value}`}
                className={`flex items-center justify-center rounded-full border-2 transition ${
                  active
                    ? "border-pink-500 bg-pink-500 text-white"
                    : "border-gray-500 bg-transparent hover:border-pink-400"
                } ${
                  value === 1 || value === 5
                    ? "h-12 w-12"
                    : value === 2 || value === 4
                      ? "h-10 w-10"
                      : "h-8 w-8"
                }`}
              >
                {active && <span className="text-lg font-bold">✓</span>}
              </button>
            );
          })}
        </div>

        <div className="mx-auto mt-3 flex max-w-xl justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{stronglyDisagreeLabel}</span>
          <span>{stronglyAgreeLabel}</span>
        </div>
      </div>
      {/* NAVIGATION */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevious}
          disabled={index === 0 || submitting}
          className="rounded-xl border border-gray-300 px-7 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          {previousLabel}
        </button>

        {!hideNext && (
          <button
            type="button"
            onClick={onNext}
            disabled={selected === null || submitting}
            className="rounded-xl bg-pink-500 px-7 py-3 font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-pink-600 dark:hover:bg-pink-500"
          >
            {nextLabel} →
          </button>
        )}
      </div>
    </div>
  );
}
