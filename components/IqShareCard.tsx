"use client";
import { Shapes, Calculator, Brain, Languages } from "lucide-react";
import { getIqShareTemplate } from "@/data/iqShareTemplates";
type IqDomains = {
  visual?: number;
  number?: number;
  logic?: number;
  verbal?: number;
};

type IqShareCardProps = {
  isUnlocked: boolean;
  score?: number;
  level?: string;
  levelRange?: string;
  percentile?: number;
  domains?: IqDomains;
};

export default function IqShareCard({
  isUnlocked,
  score = 0,
  level = "",
  levelRange = "",
  percentile = 0,
  domains = {},
}: IqShareCardProps) {
  const template = getIqShareTemplate(score);
  const scalePosition = Math.max(
    0,
    Math.min(100, ((score - 55) / (145 - 55)) * 100),
  );

  const domainItems = [
    {
      short: "ДҮРСЛЭЛ",
      label: "Дүрслэлийн логик",
      value: Number(domains.visual ?? 0),
    },
    {
      short: "ТОО",
      label: "Тоон сэтгэлгээ",
      value: Number(domains.number ?? 0),
    },
    {
      short: "ЛОГИК",
      label: "Логик сэтгэлгээ",
      value: Number(domains.logic ?? 0),
    },
    {
      short: "ҮГ",
      label: "Үгийн холбоо",
      value: Number(domains.verbal ?? 0),
    },
  ];

  return (
    <div className="relative h-[630px] w-[1200px] overflow-hidden bg-[#090d19] text-white">
      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-[center_right]"
        style={{
          backgroundImage: "url('/images/iq/share/iq-bg-teaser.png')",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#070b16]/58 via-[#070b16]/48 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />

      {/* faint lines */}
      <div className="relative flex h-full flex-col px-[72px] py-[50px]">
        {/* HEADER - TEASER ONLY */}
        {!isUnlocked && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[17px] font-black tracking-[0.27em] text-blue-300">
                IQ ТЕСТИЙН ҮР ДҮН
              </p>

              <p className="mt-2 text-[14px] font-medium tracking-[0.08em] text-slate-500">
                29 ДААЛГАВАР · 4 ЧИГЛЭЛ
              </p>
            </div>
          </div>
        )}

        {!isUnlocked ? (
          <>
            {/* =========================
                TEASER
            ========================== */}
            <div className="flex flex-1 items-center pb-4">
              <div className="pointer-events-none absolute right-[290px] top-[268px] z-[2] select-none">
                <span className="text-[42px] font-black tracking-[-0.04em] text-transparent [-webkit-text-stroke:2px_#0802b4] [text-shadow:0_0_10px_rgba(231,184,255,0.45),0_0_20px_rgba(168,85,247,0.28)]">
                  IQ?
                </span>
              </div>
              <div className="relative z-10 ml-[-25px] max-w-[620px] text-center">
                <h1 className="text-center text-[65px] font-black leading-[1.06] tracking-[-0.045em] [text-shadow:none]">
                  Таны сэтгэх чадвар
                  <br />
                  <span className="bg-gradient-to-r from-[#84c8ff] to-[#a6a1ff] bg-clip-text text-transparent">
                    аль түвшинд
                  </span>{" "}
                  гарсан бол?
                </h1>

                <p className="mx-auto mt-6 max-w-[620px] text-[19px] font-medium leading-7 text-slate-400 [text-shadow:none]">
                  Дүрслэл, тоо, логик болон үгийн холбооны 29 даалгаврын үр дүнг
                  нэгтгэн тооцооллоо.
                </p>

                <div className="mt-6 flex items-center justify-center gap-3.5">
                  {[
                    { label: "ДҮРСЛЭЛ", icon: Shapes },
                    { label: "ТОО", icon: Calculator },
                    { label: "ЛОГИК", icon: Brain },
                    { label: "ҮГИЙН ХОЛБОО", icon: Languages },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.055] px-5 py-2.5 text-[14px] font-black tracking-[0.08em] text-slate-300 [text-shadow:none]"
                      >
                        <Icon
                          className="h-[18px] w-[18px] text-blue-300"
                          strokeWidth={2}
                        />
                        <span>{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* =========================
      FULL RESULT
  ========================== */}

            {template && (
              <div className="relative flex flex-1 items-start pt-[18px]">
                <div className="relative z-10 ml-[12px] w-[600px]">
                  {/* LABEL */}
                  <p className="w-[170px] text-center text-[20px] font-black uppercase tracking-[0.24em] text-blue-300">
                    IQ ТЕСТ
                  </p>

                  {/* SCORE */}
                  <div className="mt-1 flex items-end">
                    <span className="text-[188px] font-black leading-[0.84] tracking-[-0.07em] text-white">
                      {score}
                    </span>
                  </div>

                  {/* LEVEL */}
                  <h2 className="mt-6 text-[42px] font-black leading-[1.02] tracking-[-0.025em] text-white">
                    {template.title}
                  </h2>

                  {/* RANGE */}
                  <p className="mt-2 text-[28px] font-bold tracking-[0.06em] text-blue-300">
                    {levelRange}
                  </p>

                  {/* DIVIDER */}
                  <div className="mt-5 flex w-[430px] items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-blue-300/70" />

                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-300/30 bg-blue-400/10">
                      <Brain
                        className="h-[18px] w-[18px] text-blue-300"
                        strokeWidth={1.8}
                      />
                    </div>

                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-blue-300/70" />
                  </div>
                  {/* QUOTE */}
                  <p className="mt-6 max-w-[520px] text-[31px] font-medium leading-[1.18] tracking-[-0.015em] text-white/88">
                    “{template.quote}”
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* FOOTER */}
        <div className="absolute bottom-[28px] left-[72px] right-[72px] flex items-center justify-between">
          <p className="text-[12px] font-semibold slate-400/70">seer.mn</p>
        </div>
      </div>
    </div>
  );
}
