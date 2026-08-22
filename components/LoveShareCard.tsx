"use client";

import { getLoveShareTemplate } from "@/data/loveShareTemplates";

type LoveShareCardProps = {
  score: number;
  mode?: "solo" | "pair";
};

function getLoveAccentColor(score: number) {
  if (score < 40) return "#8FA8FF";
  if (score < 50) return "#9D8CFF";
  if (score < 60) return "#B083E6";
  if (score < 70) return "#C98AAE";
  if (score < 75) return "#E98A7A";
  if (score < 80) return "#EE7B91";
  if (score < 85) return "#F1738C";
  if (score < 90) return "#F36D82";
  if (score < 95) return "#F46384";

  return "#FF5C7A";
}

export default function LoveShareCard({
  score,
  mode = "solo",
}: LoveShareCardProps) {
  const template = getLoveShareTemplate(score);

  if (!template) return null;

  const accentColor = getLoveAccentColor(score);
  const label = mode === "pair" ? "LOVE MATCH" : "LOVE TEST";

  const description =
    mode === "pair" ? template.descriptionPair : template.descriptionSolo;

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
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,6,14,0.98)_0%,rgba(3,6,14,0.94)_30%,rgba(3,6,14,0.72)_52%,rgba(3,6,14,0.18)_74%,rgba(3,6,14,0)_100%)]" />

      {/* CONTENT */}
      <div className="absolute left-[76px] top-[64px] z-10 w-[520px]">
        {/* LABEL + SCORE */}
        <div className="w-fit">
          <p
            className="text-center text-[20px] font-semibold uppercase tracking-[0.34em]"
            style={{ color: accentColor }}
          >
            {label}
          </p>

          <div className="mt-[16px] flex items-start">
            <span className="text-[150px] font-black leading-[0.88] tracking-[-0.065em] text-white">
              {score}
            </span>

            <span
              className="ml-[5px] mt-[7px] text-[96px] font-black leading-none tracking-[-0.04em]"
              style={{ color: accentColor }}
            >
              %
            </span>
          </div>
        </div>

        {/* TITLE */}
        <h2 className="mt-[20px] max-w-[500px] text-[45px] font-black leading-[1.02] tracking-[-0.025em] text-white">
          {template.title}
        </h2>

        {/* HEART DIVIDER */}
        <div className="mt-[20px] flex w-[340px] items-center justify-center gap-[12px]">
          <div
            className="h-[5px] flex-1 opacity-70"
            style={{
              backgroundColor: accentColor,
              clipPath: "polygon(0 0, 100% 44%, 100% 56%, 0 100%)",
            }}
          />

          <span
            className="text-[17px] leading-none"
            style={{ color: accentColor }}
          >
            ♥
          </span>

          <div
            className="h-[5px] flex-1 opacity-70"
            style={{
              backgroundColor: accentColor,
              clipPath: "polygon(0 44%, 100% 0, 100% 100%, 0 56%)",
            }}
          />
        </div>

        {/* DESCRIPTION */}
        <p className="mt-[26px] max-w-[490px] text-[35px] font-medium leading-[1.2] tracking-[-0.015em] text-white/85">
          {description}
        </p>
      </div>

      {/* WATERMARK */}
      <div className="absolute bottom-[28px] right-[76px] z-10 text-[19px] font-semibold tracking-[0.1em] text-white/65">
        seer.mn
      </div>
    </div>
  );
}
