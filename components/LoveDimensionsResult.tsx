"use client";

import {
  Heart,
  MessageCircle,
  ShieldCheck,
  Zap,
  HeartHandshake,
  Compass,
} from "lucide-react";
import { useLang } from "@/lib/LanguageProvider";

type Section = {
  key: string;
  title: string;
  score: number;
  description: string;
  advice: string;
};

type Props = {
  sections: Section[];
  mode?: "solo" | "both";

  person1Name?: string;
  person2Name?: string;

  person1Scores?: Record<string, number>;
  person2Scores?: Record<string, number>;
  categoryGaps?: Record<string, number>;

  activeSection?: string | null;
};

const sectionStyles: Record<
  string,
  {
    icon: typeof Heart;
    eyebrowMn: string;
    eyebrowEn: string;
    titleMn: string;
    titleEn: string;
    headerClass: string;
    iconClass: string;
    activeClass: string;
  }
> = {
  emotion: {
    icon: Heart,
    eyebrowMn: "СЭТГЭЛ ХӨДЛӨЛИЙН ХОЛБОО",
    eyebrowEn: "EMOTIONAL CONNECTION",
    titleMn: "Та хоёр сэтгэлээрээ хэр ойр вэ?",
    titleEn: "How emotionally close are you?",
    headerClass: "bg-gradient-to-r from-rose-500/[0.10] to-pink-500/[0.04]",
    iconClass: "border-rose-400/20 bg-rose-400/10 text-rose-400",
    activeClass: "border-rose-400 ring-2 ring-rose-400/25",
  },

  communication: {
    icon: MessageCircle,
    eyebrowMn: "ХАРИЛЦАА БА ОЙЛГОЛЦОЛ",
    eyebrowEn: "COMMUNICATION & UNDERSTANDING",
    titleMn: "Та хоёр бие биенээ хэр сайн ойлгодог вэ?",
    titleEn: "How well do you understand each other?",
    headerClass: "bg-gradient-to-r from-blue-500/[0.10] to-sky-500/[0.04]",
    iconClass: "border-blue-400/20 bg-blue-400/10 text-blue-400",
    activeClass: "border-blue-400 ring-2 ring-blue-400/25",
  },

  trust: {
    icon: ShieldCheck,
    eyebrowMn: "ИТГЭЛ БА АЮУЛГҮЙ БАЙДАЛ",
    eyebrowEn: "TRUST & SECURITY",
    titleMn: "Та хоёрын итгэлцлийн суурь",
    titleEn: "The foundation of your trust",
    headerClass: "bg-gradient-to-r from-emerald-500/[0.10] to-teal-500/[0.04]",
    iconClass: "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
    activeClass: "border-emerald-400 ring-2 ring-emerald-400/25",
  },

  conflict: {
    icon: Zap,
    eyebrowMn: "ЗӨРЧИЛ ШИЙДВЭРЛЭЛТ",
    eyebrowEn: "CONFLICT RESOLUTION",
    titleMn: "Асуудлыг та хоёр хэрхэн давдаг вэ?",
    titleEn: "How do you work through problems?",
    headerClass: "bg-gradient-to-r from-amber-500/[0.10] to-yellow-500/[0.04]",
    iconClass: "border-amber-400/20 bg-amber-400/10 text-amber-400",
    activeClass: "border-amber-400 ring-2 ring-amber-400/25",
  },

  intimacy: {
    icon: HeartHandshake,
    eyebrowMn: "ДОТНО БАЙДАЛ БА ХАЙР ХАЛАМЖ",
    eyebrowEn: "INTIMACY & AFFECTION",
    titleMn: "Та хоёрын дотно холбоо",
    titleEn: "Your intimate connection",
    headerClass: "bg-gradient-to-r from-pink-500/[0.10] to-rose-500/[0.04]",
    iconClass: "border-pink-400/20 bg-pink-400/10 text-pink-400",
    activeClass: "border-pink-400 ring-2 ring-pink-400/25",
  },

  future: {
    icon: Compass,
    eyebrowMn: "ҮНЭТ ЗҮЙЛ БА ХАМТЫН ИРЭЭДҮЙ",
    eyebrowEn: "SHARED VALUES & FUTURE",
    titleMn: "Та хоёр нэг зүг рүү харж байна уу?",
    titleEn: "Are you moving in the same direction?",
    headerClass: "bg-gradient-to-r from-violet-500/[0.10] to-purple-500/[0.04]",
    iconClass: "border-violet-400/20 bg-violet-400/10 text-violet-400",
    activeClass: "border-violet-400 ring-2 ring-violet-400/25",
  },
};

export default function LoveDimensionsResult({
  sections,
  mode = "solo",
  person1Name,
  person2Name,
  person1Scores,
  person2Scores,
  categoryGaps,
  activeSection,
}: Props) {
  const { lang } = useLang();

  return (
    <div className="space-y-6">
      {sections.map((section) => {
        const style = sectionStyles[section.key];

        if (!style) return null;

        const Icon = style.icon;

        const p1 = person1Scores?.[section.key];
        const p2 = person2Scores?.[section.key];
        const gap = categoryGaps?.[section.key];

        return (
          <section
            key={section.key}
            id={`love-${section.key}`}
            className={`scroll-mt-24 overflow-hidden rounded-[28px] border bg-white shadow-sm transition-all duration-300 dark:bg-slate-950/70 ${
              activeSection === section.key
                ? section.key === "emotion"
                  ? "border-pink-400 ring-2 ring-pink-400/25"
                  : section.key === "communication"
                    ? "border-blue-400 ring-2 ring-blue-400/25"
                    : section.key === "trust"
                      ? "border-emerald-400 ring-2 ring-emerald-400/25"
                      : section.key === "conflict"
                        ? "border-amber-400 ring-2 ring-amber-400/25"
                        : section.key === "intimacy"
                          ? "border-rose-400 ring-2 ring-rose-400/25"
                          : "border-violet-400 ring-2 ring-violet-400/25"
                : "border-gray-200 dark:border-white/[0.08]"
            }`}
          >
            {/* HEADER */}
            <div
              className={`border-b border-gray-200 p-5 dark:border-white/[0.08] sm:p-6 ${style.headerClass}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${style.iconClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                      {lang === "en" ? style.eyebrowEn : style.eyebrowMn}
                    </p>

                    <h3 className="mt-1 text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                      {lang === "en" ? style.titleEn : style.titleMn}
                    </h3>
                  </div>
                </div>

                <span className="shrink-0 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                  {section.score}%
                </span>
              </div>
            </div>

            {/* BODY */}
            <div className="p-5 sm:p-6">
              {/* BOTH MODE */}
              {mode === "both" &&
                typeof p1 === "number" &&
                typeof p2 === "number" && (
                  <div className="mb-6">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <ScoreBar name={person1Name || "Хүн 1"} score={p1} />

                      <ScoreBar name={person2Name || "Хүн 2"} score={p2} />
                    </div>

                    {typeof gap === "number" && (
                      <p className="mt-3 text-right text-xs text-gray-500 dark:text-gray-400">
                        {lang === "en" ? `Difference: ${gap}` : `Зөрүү: ${gap}`}
                      </p>
                    )}

                    <div className="my-5 h-px bg-gray-200 dark:bg-white/[0.08]" />
                  </div>
                )}

              <p className="text-sm leading-7 text-gray-700 dark:text-gray-300">
                {section.description}
              </p>

              {section.advice && (
                <p className="mt-4 text-sm leading-7 text-gray-700 dark:text-gray-300">
                  {section.advice}
                </p>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ScoreBar({ name, score }: { name: string; score: number }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3 dark:bg-slate-900">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">
          {name}
        </span>

        <span className="text-sm font-bold text-gray-900 dark:text-white">
          {score}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
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
