"use client";

import {
  Heart,
  MessageCircle,
  ShieldCheck,
  Zap,
  HeartHandshake,
  Compass,
  ArrowRight,
} from "lucide-react";
import { useLang } from "@/lib/LanguageProvider";

type Props = {
  onSelect?: (key: string) => void;
  navRef?: React.RefObject<HTMLDivElement | null>;
  activeSection?: string | null;
};

const items = [
  {
    key: "emotion",
    icon: Heart,
    mn: "Сэтгэл хөдлөлийн холбоо",
    en: "Emotional connection",
    iconClass:
      "bg-pink-100 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400",
  },
  {
    key: "communication",
    icon: MessageCircle,
    mn: "Харилцаа ба ойлголцол",
    en: "Communication & understanding",
    iconClass: "bg-blue-400/10 text-blue-400",
  },
  {
    key: "trust",
    icon: ShieldCheck,
    mn: "Итгэлцэл ба аюулгүй байдал",
    en: "Trust & security",
    iconClass: "bg-emerald-400/10 text-emerald-400",
  },
  {
    key: "conflict",
    icon: Zap,
    mn: "Зөрчил шийдвэрлэлт",
    en: "Conflict resolution",
    iconClass: "bg-amber-400/10 text-amber-400",
  },
  {
    key: "intimacy",
    icon: HeartHandshake,
    mn: "Дотно байдал ба хайр халамж",
    en: "Intimacy & affection",
    iconClass: "bg-pink-400/10 text-pink-400",
  },
  {
    key: "future",
    icon: Compass,
    mn: "Үнэт зүйл ба хамтын ирээдүй",
    en: "Shared values & future",
    iconClass: "bg-violet-400/10 text-violet-400",
  },
];

export default function LoveDimensionsNav({
  onSelect,
  navRef,
  activeSection,
}: Props) {
  const { lang } = useLang();

  return (
    <div
      ref={navRef}
      id="love-dimensions-nav"
      className="rounded-[28px] border border-gray-200 bg-white/5 p-5 dark:border-white/[0.08] sm:p-6"
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-pink-500">
        {lang === "en" ? "YOUR RELATIONSHIP REPORT" : "ТАНЫ ХАРИЛЦААНЫ ТАЙЛАН"}
      </p>

      <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
        {lang === "en"
          ? "6-area relationship breakdown"
          : "6 чиглэлийн дэлгэрэнгүй үнэлгээ"}
      </h2>

      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        {lang === "en"
          ? "Choose an area to view its detailed interpretation and guidance."
          : "Тухайн хэсгийг сонгож дэлгэрэнгүй тайлбар, зөвлөгөөг хараарай."}
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                onSelect?.(item.key);

                document.getElementById(`love-${item.key}`)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className="flex items-center justify-between rounded-xl border border-gray-200 p-4 text-left transition hover:bg-white/5 dark:border-white/[0.08]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.iconClass}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {lang === "en" ? item.en : item.mn}
                  </p>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {lang === "en" ? "View details" : "Дэлгэрэнгүй харах"}
                  </p>
                </div>
              </div>

              <ArrowRight className="ml-3 h-5 w-5 shrink-0 text-gray-400" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
