import { mbtiShareTemplates } from "@/data/mbtiShareTemplates";
import { Caveat } from "next/font/google";
import {
  Heart,
  Sparkle,
  Feather,
  Eye,
  Moon,
  Crown,
  Sword,
  Compass,
  Brain,
  Shield,
  Fire,
  Flower,
} from "@phosphor-icons/react";
const quoteFont = Caveat({
  subsets: ["cyrillic"],
  weight: "400",
});
export default function MbtiSharePoster({
  type,
  gender = "female",
}: {
  type: string;
  gender?: "female" | "male";
}) {
  const key = type?.toUpperCase();
  const template = mbtiShareTemplates[key] ?? mbtiShareTemplates.INTJ;
  const isMale = gender === "male";

  const bg = isMale && template.maleBg ? template.maleBg : template.bg;

  const bgSize =
    isMale && template.maleBgSize ? template.maleBgSize : template.bgSize;

  const bgPosition =
    isMale && template.maleBgPosition
      ? template.maleBgPosition
      : template.bgPosition;
  const iconMap: Record<string, any[]> = {
    INFP: [Heart, Sparkle, Feather],
    INFJ: [Eye, Moon, Sparkle],
    INTJ: [Brain, Crown, Eye],
    ENFP: [Fire, Sparkle, Compass],
    ISTP: [Sword, Shield, Compass],
  };

  const TraitIcons = iconMap[key] ?? [Sparkle, Heart, Feather];
  return (
    <div
      className="relative h-[1350px] w-[1080px] overflow-hidden bg-slate-950 text-white"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: bgSize ?? "cover",
        backgroundPosition: bgPosition ?? "center",
      }}
    >
      {/* Background readable cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/68 via-black/22 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-transparent to-black/10" />

      {/* TOP BLOCK */}
      <div className="absolute left-[72px] top-[128px] z-10 w-[720px]">
        <div className="w-[520px] text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-[70px] bg-[#d8b76a]/45" />

            <p className="whitespace-nowrap text-[18px] font-semibold tracking-[0.28em] text-[#c9a95f] drop-shadow">
              ТАНЫ MBTI ТӨРӨЛ
            </p>

            <div className="h-[1px] w-[70px] bg-[#d8b76a]/45" />
          </div>
        </div>

        <h1
          className="mt-4 w-[520px] text-center font-serif text-[224px] font-black leading-[0.74] tracking-[-0.05em]"
          style={{
            color: template.accent,
            textShadow:
              "0 0 18px rgba(255,255,255,0.38), 0 0 58px rgba(190,130,255,0.45)",
          }}
        >
          {key}
        </h1>

        <h2 className="mt-6 text-[40px] font-semibold uppercase leading-tight tracking-[0.12em] text-white/95 drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)]">
          {template.archetype}
        </h2>

        <div className="mt-7 flex w-[520px] items-center justify-center gap-3">
          <div className="h-[1px] w-[210px] bg-white/22" />
          <div
            className="h-[11px] w-[11px] rotate-45 border border-yellow-300/45"
            style={{ backgroundColor: template.accent }}
          />
          <div className="h-[1px] w-[210px] bg-white/30" />
        </div>

        <p className="mt-10 text-[28px] leading-tight text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
          Хүмүүсийн дөнгөж{" "}
          <span style={{ color: template.accent }} className="font-black">
            {template.rarity}
          </span>
          -д байдаг
        </p>
      </div>

      {/* MIDDLE TRAITS */}
      <div className="absolute left-[72px] top-[620px] z-10 space-y-[52px]">
        {template.strengths.map((item, index) => (
          <div key={item} className="flex items-center gap-7">
            <div
              className="relative flex h-[92px] w-[92px] items-center justify-center rounded-full border border-yellow-300/45 bg-black/30 shadow-xl backdrop-blur-sm"
              style={{
                color: template.accent,
                boxShadow: `0 0 14px ${template.accent}35`,
              }}
            >
              <span className="absolute inset-[8px] rounded-full border border-white/15" />
              <span className="relative z-10 leading-none">
                {(() => {
                  const Icon = TraitIcons[index] ?? Sparkle;
                  return <Icon size={36} weight="duotone" />;
                })()}
              </span>
            </div>

            <div className="h-[66px] w-[2px] bg-yellow-200/35" />

            <p className="max-w-[520px] text-[36px] font-semibold leading-tight tracking-[0.01em] text-white/95 drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)]">
              {item}
            </p>
          </div>
        ))}
      </div>
      {/* BOTTOM QUOTE */}
      <div className="absolute bottom-[86px] left-[72px] right-[72px] z-10 rounded-[32px] border border-yellow-300/40 bg-black/34 px-12 py-6 shadow-2xl backdrop-blur-sm">
        <div
          className="absolute left-1/2 top-[-11px] h-[22px] w-[22px] -translate-x-1/2 rotate-45 border border-yellow-300/55 bg-black"
          style={{ boxShadow: `0 0 18px ${template.accent}66` }}
        />

        <p
          className={`${quoteFont.className} text-center text-[52px] font-medium leading-[1.02] tracking-[0.005em] text-[#f4eadf] drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)]`}
        >
          “{template.quote}”
        </p>
      </div>

      {/* BRAND */}
      <p className="absolute bottom-[32px] left-0 right-0 z-10 text-center text-[22px] font-semibold tracking-[0.24em] text-white/42">
        seer.mn
      </p>
    </div>
  );
}
