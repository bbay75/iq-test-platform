"use client";
import LoveDimensionsResult from "@/components/LoveDimensionsResult";
import { useLang } from "@/lib/LanguageProvider";
import LoveDimensionsNav from "@/components/LoveDimensionsNav";
import {
  HeartHandshake,
  ShieldCheck,
  TriangleAlert,
  Compass,
  HeartPulse,
} from "lucide-react";
type LovePairResultProps = {
  result: any;
  person1Name: string;
  person2Name: string;
  navRef?: React.RefObject<HTMLDivElement | null>;
  activeSection?: string | null;
  onSectionSelect?: (key: string) => void;
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
  navRef,
  activeSection,
  onSectionSelect,
}: LovePairResultProps) {
  const { t, lang } = useLang();
  const displayResult = result.localized?.[lang] ?? result;

  const relationshipPattern =
    result.localized?.[lang]?.relationshipPattern ?? result.relationshipPattern;

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
      {relationshipPattern && (
        <div className="rounded-[28px] border border-violet-400/15 bg-violet-400/[0.04] p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-400">
              <HeartHandshake className="h-5 w-5" />
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-400">
                {lang === "en" ? "RELATIONSHIP PATTERN" : "ХАРИЛЦААНЫ ХЭВ МАЯГ"}
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                {relationshipPattern.title}
              </h2>
            </div>
          </div>

          <p className="mt-4 text-sm leading-7 text-gray-700 dark:text-gray-300">
            {relationshipPattern.description}
          </p>
        </div>
      )}
      <LoveDimensionsNav
        navRef={navRef}
        activeSection={activeSection}
        onSelect={onSectionSelect}
      />

      {/* STRENGTHS / CHALLENGES */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* STRENGTHS */}
        <div className="rounded-[28px] border border-emerald-400/15 bg-emerald-400/[0.04] p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-400">
                {lang === "en" ? "STRENGTHS" : "ДАВУУ ТАЛ"}
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                {lang === "en"
                  ? "What is working well"
                  : "Таны харилцааны хүчтэй талууд"}
              </h2>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-sm leading-7 text-gray-700 dark:text-gray-300">
            {(displayResult.strengths ?? []).map(
              (item: string, index: number) => (
                <p key={index}>• {item}</p>
              ),
            )}
          </div>
        </div>

        {/* ATTENTION */}
        <div className="rounded-[28px] border border-amber-400/15 bg-amber-400/[0.04] p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-400">
              <TriangleAlert className="h-5 w-5" />
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-400">
                {lang === "en" ? "WATCH-OUTS" : "АНХААРАХ ТАЛ"}
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                {lang === "en"
                  ? "Areas worth paying attention to"
                  : "Анхаарах хэрэгтэй зүйлс"}
              </h2>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-sm leading-7 text-gray-700 dark:text-gray-300">
            {(displayResult.challenges ?? []).map(
              (item: string, index: number) => (
                <p key={index}>• {item}</p>
              ),
            )}
          </div>
        </div>
      </div>

      {/* ADVICE */}
      <div className="rounded-[28px] border border-violet-400/15 bg-violet-400/[0.04] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-400">
            <Compass className="h-5 w-5" />
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-400">
              {lang === "en" ? "GUIDANCE" : "ЗӨВЛӨМЖ"}
            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
              {lang === "en" ? "What to focus on next" : "Дараагийн алхам"}
            </h2>
          </div>
        </div>

        <p className="mt-4 text-sm leading-7 text-gray-700 dark:text-gray-300">
          {displayResult.advice}
        </p>
      </div>

      {/* NAME BONUS */}
      {displayResult.nameCompatibilityTitle && (
        <div className="rounded-3xl border border-dashed border-pink-400 bg-white p-6 dark:bg-gray-800">
          <div className="flex items-start justify-between gap-6">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-pink-400/20 bg-pink-400/10 text-pink-400">
                <HeartPulse className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-pink-500">
                  {t("love_pair_fun_bonus")}
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                  {displayResult.nameCompatibilityTitle}
                </h2>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-4xl font-bold text-pink-500">
                {result.nameScore}%
              </p>

              <p className="mt-1 text-xs text-gray-400">
                {t("love_pair_not_in_score")}
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-gray-600 dark:text-gray-300">
            {displayResult.nameCompatibilitySummary}
          </p>

          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
            {displayResult.nameCompatibilityAdvice}
          </p>
        </div>
      )}
      {/* 6 DIMENSIONS */}
      <div id="love-pair-dimensions">
        <LoveDimensionsResult
          sections={displayResult.detailedSections ?? result.detailedSections}
          mode="both"
          person1Name={person1Name}
          person2Name={person2Name}
          person1Scores={result.person1CategoryScores}
          person2Scores={result.person2CategoryScores}
          categoryGaps={result.categoryGaps}
          activeSection={activeSection}
        />
      </div>
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
