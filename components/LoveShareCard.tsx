"use client";

import { getLoveShareTemplate } from "@/data/loveShareTemplates";

type LoveShareCardProps = {
  score: number;
};

export default function LoveShareCard({ score }: LoveShareCardProps) {
  const template = getLoveShareTemplate(score);

  if (!template) return null;

  return (
    <div
      id="love-share-card"
      className="relative h-[630px] w-[1200px] overflow-hidden bg-black text-white"
    >
      {/* BACKGROUND */}
      <img
        src={template.bg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* LEFT READABILITY GRADIENT */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.72)_28%,rgba(0,0,0,0.42)_48%,rgba(0,0,0,0.08)_68%,rgba(0,0,0,0)_100%)]" />

      {/* BOTTOM GRADIENT */}
      <div className="absolute inset-x-0 bottom-0 h-[170px] bg-gradient-to-t from-black/35 to-transparent" />

      {/* CONTENT */}
      <div className="absolute left-[72px] top-[70px] z-10 w-[470px]">
        <p className="text-[15px] font-semibold uppercase tracking-[0.32em] text-white/60">
          LOVE TEST
        </p>

        <div className="mt-[18px] text-[118px] font-black leading-none tracking-[-0.05em]">
          {score}%
        </div>

        <h2 className="mt-[18px] text-[34px] font-semibold leading-[1.08]">
          Та хоёрын нийцэл
        </h2>

        <p className="mt-[18px] max-w-[420px] text-[21px] leading-[1.45] text-white/72">
          Харилцааны ойр байдал, ойлголцол, итгэлцэл болон хамтын мэдрэмж.
        </p>
      </div>

      {/* WATERMARK */}
      <div className="absolute bottom-[24px] left-[72px] z-10 text-[17px] font-semibold tracking-[0.1em] text-white/42">
        seer.mn
      </div>
    </div>
  );
}
