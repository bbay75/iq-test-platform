"use client";
import LoveDimensionsResult from "@/components/LoveDimensionsResult";
import { useLang } from "@/lib/LanguageProvider";
type LovePairResultProps = {
  result: any;
  person1Name: string;
  person2Name: string;
};

const categoryLabels = {
  emotion: "love_category_emotion",
  communication: "love_category_communication",
  trust: "love_category_trust",
  conflict: "love_category_conflict",
  intimacy: "love_category_intimacy",
  future: "love_category_future",
} as const;

const categoryOrder = [
  "emotion",
  "communication",
  "trust",
  "conflict",
  "intimacy",
  "future",
];

export default function LovePairResult({
  result,
  person1Name,
  person2Name,
}: LovePairResultProps) {
  const { t, lang } = useLang();
  const displayResult = result.localized?.[lang] ?? result;
  return (
    <div className="space-y-6">
      {/* TOP RESULT */}
      <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <p className="text-sm font-semibold uppercase tracking-wider text-pink-500">
          {t("love_pair_title")}
        </p>

        <h1 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
          {person1Name} + {person2Name}
        </h1>

        <p className="mt-5 text-sm text-gray-500 dark:text-gray-400">
          {t("love_pair_total_score")}
        </p>

        <p className="mt-2 text-6xl font-bold text-pink-500">
          {result.finalScore}%
        </p>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-300">
          {displayResult.summary}
        </p>
      </div>

      {/* RELATIONSHIP PATTERN */}
      {result.relationshipPattern && (
        <div className="rounded-3xl border border-pink-200 bg-pink-50 p-6 dark:border-pink-900 dark:bg-pink-950/20">
          <p className="text-xs font-semibold uppercase tracking-wider text-pink-500">
            {t("love_pair_pattern")}
          </p>

          <h2 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
            {displayResult.relationshipPattern.title}
          </h2>

          <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
            {displayResult.relationshipPattern.description}
          </p>
        </div>
      )}

      {/* 6 DIMENSIONS */}
      <LoveDimensionsResult
        sections={result.detailedSections}
        mode="both"
        person1Name={person1Name}
        person2Name={person2Name}
        person1Scores={result.person1CategoryScores}
        person2Scores={result.person2CategoryScores}
        categoryGaps={result.categoryGaps}
      />

      {/* STRENGTHS / CHALLENGES */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950/20">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t("love_pair_strengths")}
          </h2>

          <div className="mt-4 space-y-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
            {(displayResult.strengths ?? []).map(
              (item: string, index: number) => (
                <p key={index}>✓ {item}</p>
              ),
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-orange-200 bg-orange-50 p-6 dark:border-orange-900 dark:bg-orange-950/20">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t("love_pair_attention")}
          </h2>

          <div className="mt-4 space-y-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
            {(displayResult.challenges ?? []).map(
              (item: string, index: number) => (
                <p key={index}>! {item}</p>
              ),
            )}
          </div>
        </div>
      </div>

      {/* ADVICE */}
      <div className="rounded-3xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/20">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {t("love_pair_advice")}
        </h2>

        <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
          {displayResult.advice}
        </p>
      </div>

      {/* NAME BONUS */}
      {displayResult.nameCompatibilityTitle && (
        <div className="rounded-3xl border border-dashed border-pink-400 bg-white p-6 dark:bg-gray-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-pink-500">
            {t("love_pair_fun_bonus")}
          </p>

          <div className="mt-2 flex items-start justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {displayResult.nameCompatibilityTitle}
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                {displayResult.nameCompatibilitySummary}
              </p>

              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                {displayResult.nameCompatibilityAdvice}
              </p>
            </div>

            <div className="shrink-0 text-center">
              <p className="text-4xl font-bold text-pink-500">
                {result.nameScore}%
              </p>

              <p className="mt-1 text-xs text-gray-400">
                {t("love_pair_not_in_score")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreBar({ name, score }: { name: string; score: number }) {
  return (
    <div className="rounded-xl bg-gray-100 p-3 dark:bg-gray-900">
      <div className="flex items-center justify-between gap-3">
        <span className="truncate text-sm text-gray-700 dark:text-gray-300">
          {name}
        </span>

        <span className="text-sm font-bold text-gray-900 dark:text-white">
          {score}%
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-700">
        <div
          className="h-full rounded-full bg-pink-500"
          style={{
            width: `${Math.max(0, Math.min(100, score))}%`,
          }}
        />
      </div>
    </div>
  );
}
