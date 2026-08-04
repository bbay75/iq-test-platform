import { notFound } from "next/navigation";
import { mbtiShareTemplates } from "@/data/mbtiShareTemplates";
import { getUniqueTraitIconKeys } from "@/data/mbtiTraitIcons";

type PageProps = {
  params: Promise<{
    gender: string;
    type: string;
  }>;
};

export default async function MbtiOgPreviewPage({ params }: PageProps) {
  const { gender, type } = await params;

  const mbtiType = type.toUpperCase();
  const normalizedGender = gender === "male" ? "male" : "female";

  const template = mbtiShareTemplates[mbtiType];

  if (!template) {
    notFound();
  }

  const bg = `/share/mbti-og-bg/${normalizedGender}/${type.toLowerCase()}.webp`;

  const traitIcons = getUniqueTraitIconKeys(template.strengths);

  return (
    <main className="min-h-screen bg-[#151515] p-8">
      <div
        id="mbti-og-card"
        className="relative h-[630px] w-[1200px] overflow-hidden bg-black text-white"
      >
        {/* BACKGROUND */}
        <img
          src={bg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* LEFT READABILITY GRADIENT */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.90)_0%,rgba(0,0,0,0.78)_30%,rgba(0,0,0,0.48)_50%,rgba(0,0,0,0.08)_72%,rgba(0,0,0,0)_100%)]" />

        {/* SUBTLE BOTTOM GRADIENT */}
        <div className="absolute inset-x-0 bottom-0 h-[190px] bg-gradient-to-t from-black/40 to-transparent" />

        {/* MAIN CONTENT */}
        <div className="absolute left-[74px] top-[44px] z-10 w-[690px]">
          {/* TOP BLOCK: LABEL + TYPE */}
          <div className="w-fit">
            {/* SMALL LABEL */}
            <div className="mb-[6px] flex items-center justify-center gap-[12px]">
              <div
                className="h-px w-[44px]"
                style={{
                  backgroundColor: template.accent,
                  opacity: 0.45,
                }}
              />

              <div
                className="text-[11px] font-semibold uppercase tracking-[0.34em]"
                style={{
                  color: template.accent,
                  opacity: 0.72,
                }}
              >
                Таны MBTI төрөл
              </div>

              <div
                className="h-px w-[44px] opacity-70"
                style={{
                  backgroundColor: template.accent,
                  opacity: 0.45,
                }}
              />
            </div>

            {/* MBTI TYPE */}
            <div className="relative w-fit">
              {/* glow layer 1 */}
              <div
                className="absolute inset-0 font-serif text-[132px] font-bold leading-[0.90] tracking-[-0.045em] blur-[16px] opacity-35"
                style={{
                  color: template.accent,
                }}
              >
                {mbtiType}
              </div>

              {/* glow layer 2 */}
              <div
                className="absolute inset-0 font-serif text-[132px] font-bold leading-[0.90] tracking-[-0.045em] blur-[6px] opacity-45"
                style={{
                  color: template.accent,
                }}
              >
                {mbtiType}
              </div>

              {/* main text */}
              <div
                className="relative font-serif text-[132px] font-bold leading-[0.90] tracking-[-0.045em]"
                style={{
                  color: template.accent,
                  textShadow: `
          0 0 10px ${template.accent}55,
          0 0 22px ${template.accent}66,
          0 0 42px ${template.accent}40
        `,
                }}
              >
                {mbtiType}
              </div>
            </div>
          </div>

          {/* ARCHETYPE */}
          <div className="mt-[15px] text-[27px] font-semibold uppercase leading-none tracking-[0.025em]">
            {template.archetype}
          </div>

          {/* RARITY */}
          <div className="mt-[15px] text-[18px] font-normal text-white/78">
            Хүмүүсийн дөнгөж{" "}
            <span
              className="font-bold"
              style={{
                color: template.accent,
              }}
            >
              {template.rarity}
            </span>{" "}
            -д байдаг
          </div>

          {/* STRENGTHS */}
          <div className="mt-[20px] flex flex-col gap-[8px]">
            {template.strengths.slice(0, 3).map((strength, index) => {
              const iconName = traitIcons[index];

              return (
                <div key={strength} className="flex h-[50px] items-center">
                  {/* 3D ICON CIRCLE */}
                  <div
                    className="relative flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full border-2"
                    style={{
                      borderColor: `${template.accent}99`,
                      background: `
                        radial-gradient(
                          circle at 34% 28%,
                          rgba(255,255,255,0.38) 0%,
                          ${template.accent}55 28%,
                          rgba(20,25,60,0.72) 72%,
                          rgba(0,0,0,0.82) 100%
                        )
                      `,
                      boxShadow: `
                        0 6px 12px rgba(0,0,0,0.65),
                        0 0 16px ${template.accent}55
                      `,
                    }}
                  >
                    {/* GLOSS HIGHLIGHT */}
                    <div className="absolute left-[9px] top-[7px] h-[12px] w-[12px] rounded-full bg-white/20" />

                    {/* OLD PHOSPHOR SVG */}
                    <span
                      className="relative z-10 block h-[36px] w-[36px]"
                      style={{
                        backgroundColor: template.accent,
                        filter: `drop-shadow(0 0 6px ${template.accent})`,
                        WebkitMaskImage: `url("/icons/phosphor/${iconName}.svg")`,
                        maskImage: `url("/icons/phosphor/${iconName}.svg")`,
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskPosition: "center",
                        WebkitMaskSize: "contain",
                        maskSize: "contain",
                      }}
                    />
                  </div>

                  {/* CONNECTOR */}
                  <div
                    className="mx-[13px] h-[34px] w-px opacity-40"
                    style={{
                      backgroundColor: template.accent,
                    }}
                  />

                  {/* TEXT */}
                  <div className="text-[21px] font-medium leading-none text-white/95">
                    {strength}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* QUOTE PANEL */}
        <div
          className="absolute bottom-[50px] left-[74px] z-10 flex min-h-[82px] w-[700px] items-center rounded-[18px] border px-[26px] py-[13px] backdrop-blur-[3px]"
          style={{
            borderColor: `${template.accent}55`,
            backgroundColor: "rgba(0,0,0,0.55)",
            boxShadow: "0 10px 28px rgba(0,0,0,0.42)",
          }}
        >
          {/* DIAMOND MARKER */}
          <div
            className="absolute left-1/2 top-0 h-[12px] w-[12px] -translate-x-1/2 -translate-y-1/2 rotate-45 border"
            style={{
              backgroundColor: "#050505",
              borderColor: `${template.accent}88`,
              boxShadow: `0 0 12px ${template.accent}66`,
            }}
          />

          {/* QUOTE */}
          <div
            className="w-full text-center text-[30px] leading-[1.10]"
            style={{
              fontFamily: '"Caveat", cursive',
              color: "#f4eadf",
              textShadow: "0 2px 8px rgba(0,0,0,0.9)",
            }}
          >
            “{template.quote}”
          </div>
        </div>

        {/* WATERMARK */}
        <div className="absolute bottom-[18px] right-[29px] z-10 text-[15px] font-semibold tracking-[0.08em] text-white/35">
          seer.mn
        </div>
      </div>
    </main>
  );
}
