import { mbtiShareTemplates } from "@/data/mbtiShareTemplates";

export default function MbtiSharePoster({ type }: { type: string }) {
  const key = type?.toUpperCase();
  const template = mbtiShareTemplates[key] ?? mbtiShareTemplates.INTJ;

  return (
    <div
      className="relative h-[1920px] w-[1080px] overflow-hidden bg-slate-950 text-white"
      style={{
        backgroundImage: `url(${template.bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

      <div className="relative z-10 flex h-full flex-col px-20 py-24">
        <p className="text-4xl font-semibold tracking-[0.28em] text-yellow-300">
          ТАНЫ ТӨРӨЛ
        </p>

        <h1
          className="mt-10 text-[190px] font-black leading-none tracking-tight"
          style={{
            color: template.accent,
            textShadow: "0 0 30px rgba(255,255,255,0.25)",
          }}
        >
          {key}
        </h1>

        <h2 className="mt-2 text-5xl font-bold uppercase tracking-[0.12em] text-white">
          {template.archetype}
        </h2>

        <div className="mt-10 h-[2px] w-[520px] bg-white/30" />

        <p className="mt-10 text-4xl leading-tight text-white">
          Хүмүүсийн дөнгөж{" "}
          <span style={{ color: template.accent }} className="font-black">
            {template.rarity}
          </span>
          -д байдаг
        </p>

        <div className="mt-16 space-y-10">
          {template.strengths.map((item, index) => (
            <div key={item} className="flex items-center gap-7">
              <div
                className="flex h-24 w-24 items-center justify-center rounded-full border border-white/40 bg-black/45 text-4xl font-black"
                style={{ color: template.accent }}
              >
                {index === 0 ? "✦" : index === 1 ? "◆" : "✓"}
              </div>

              <p className="text-5xl font-bold leading-tight text-white drop-shadow">
                {item}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-auto rounded-[36px] border border-yellow-300/40 bg-black/55 px-12 py-12 shadow-2xl backdrop-blur-sm">
          <p className="text-center text-5xl font-semibold leading-tight text-white">
            “{template.quote}”
          </p>
        </div>

        <p className="mt-10 text-center text-3xl font-semibold tracking-[0.2em] text-white/45">
          testplatform
        </p>
      </div>
    </div>
  );
}
