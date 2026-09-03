"use client";

import { Sparkles } from "lucide-react";
import { getNumerologyPremiumProfile } from "@/data/numerologyPremiumProfiles";
import { getNumerologyShareTemplate } from "@/data/numerologyShareTemplates";

type NumerologyShareCardProps = {
  isUnlocked: boolean;
  lifePath?: number;
  nameNumber?: number;
  phoneNumber?: number;
  finalScore?: number;
};

export default function NumerologyShareCard({
  lifePath = 1,
  nameNumber,
  phoneNumber,
}: NumerologyShareCardProps) {
  const profile = getNumerologyPremiumProfile(lifePath);
  const template = getNumerologyShareTemplate(lifePath);

  return (
    <div className="relative h-[630px] w-[1200px] overflow-hidden bg-[#05040a] text-white">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${template.bg}')`,
        }}
      />

      {/* Left readability only */}
      <div className="absolute left-0 top-0 h-full w-[560px] bg-gradient-to-r from-[#05040a] via-[#05040a]/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[90px] bg-gradient-to-t from-black/20 to-transparent" />
      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="ml-[76px] w-[520px]">
          <p
            className="text-[19px] font-black uppercase tracking-[0.26em]"
            style={{
              color: template.accentSoft,
            }}
          >
            ТАНЫ ҮНДСЭН ТОО
          </p>

          <div
            className="mt-1 text-[172px] font-black leading-[0.88] tracking-[-0.07em]"
            style={{
              color: template.accent,
              textShadow: `0 0 30px ${template.accent}30`,
            }}
          >
            {lifePath}
          </div>

          <h1 className="mt-5 text-[43px] font-black leading-[1.05] tracking-[-0.035em] text-white">
            {profile.shortTitle}
          </h1>

          <div className="mt-5 flex w-[410px] items-center gap-4">
            <div
              className="h-px flex-1"
              style={{
                background: `linear-gradient(to right, transparent, ${template.accent}aa)`,
              }}
            />

            <div
              className="flex h-9 w-9 items-center justify-center rounded-full border"
              style={{
                borderColor: `${template.accent}55`,
                backgroundColor: `${template.accent}18`,
              }}
            >
              <Sparkles
                className="h-[18px] w-[18px]"
                strokeWidth={1.8}
                style={{
                  color: template.accentSoft,
                }}
              />
            </div>

            <div
              className="h-px flex-1"
              style={{
                background: `linear-gradient(to left, transparent, ${template.accent}aa)`,
              }}
            />
          </div>

          <p className="mt-5 max-w-[515px] text-[24px] font-medium leading-[1.3] text-white/85">
            {profile.grandmaNote}
          </p>
        </div>
      </div>

      <div
        className="absolute bottom-[26px] left-[76px] z-10 text-[17px] font-semibold tracking-[0.12em]"
        style={{
          color: `${template.accentSoft}aa`,
        }}
      >
        seer.mn
      </div>
    </div>
  );
}
