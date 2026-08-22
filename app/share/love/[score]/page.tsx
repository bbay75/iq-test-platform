import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    score: string;
  }>;

  searchParams: Promise<{
    mode?: string;
  }>;
};

function normalizeScore(value: string) {
  const score = Number(value);

  if (!Number.isInteger(score) || score < 0 || score > 100) {
    return null;
  }

  return score;
}

function normalizeMode(value?: string): "solo" | "pair" {
  return value === "pair" ? "pair" : "solo";
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { score } = await params;
  const { mode } = await searchParams;

  const numericScore = normalizeScore(score);

  if (numericScore === null) {
    return {};
  }

  const shareMode = normalizeMode(mode);

  const imageUrl = `/share/love-final/${shareMode}/${numericScore}.jpg`;

  const title =
    shareMode === "pair"
      ? `Бидний нийцэл ${numericScore}%`
      : `Миний нийцэл ${numericScore}%`;

  const description =
    shareMode === "pair"
      ? "Та хоёрын харилцааны нийцлийг шалгаарай."
      : "Харилцаан дахь өөрийн нийцлийн үр дүнгээ үзээрэй.";

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt:
            shareMode === "pair"
              ? `${numericScore}% Love Match result`
              : `${numericScore}% Love Test result`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function LoveSharePage({
  params,
  searchParams,
}: PageProps) {
  const { score } = await params;
  const { mode } = await searchParams;

  const numericScore = normalizeScore(score);

  if (numericScore === null) {
    notFound();
  }

  const shareMode = normalizeMode(mode);

  const imageUrl = `/share/love-final/${shareMode}/${numericScore}.jpg`;

  const isPair = shareMode === "pair";

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[900px] flex-col px-5 py-8 sm:px-8">
        {/* SHARE IMAGE */}
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black shadow-2xl">
          <img
            src={imageUrl}
            alt={
              isPair
                ? `${numericScore}% Love Match result`
                : `${numericScore}% Love Test result`
            }
            className="block h-auto w-full"
          />
        </div>

        {/* RESULT */}
        <section className="mx-auto mt-10 w-full max-w-[720px] text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-pink-300">
            {isPair ? "LOVE MATCH" : "LOVE TEST"}
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            {isPair ? "Бидний нийцэл" : "Миний нийцэл"} {numericScore}%
          </h1>

          <p className="mx-auto mt-5 max-w-[620px] text-lg leading-8 text-slate-300">
            {isPair
              ? "Хосын ойлголцол, итгэлцэл, ойр дотно байдал болон хамтын мэдрэмжийн нийцлийг шалгах Love Match."
              : "Харилцааны ойр байдал, ойлголцол, итгэлцэл болон өөрийн мэдрэмжийг таних Love Test."}
          </p>

          {/* CTA */}
          <div className="mt-9 grid gap-4">
            <Link
              href="/love-test"
              className="rounded-2xl bg-gradient-to-r from-pink-500 to-violet-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition hover:scale-[1.01]"
            >
              Love Test өгөх
            </Link>

            <Link
              href="/"
              className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-lg font-semibold text-white transition hover:bg-white/10"
            >
              Бусад тест үзэх
            </Link>
          </div>

          <p className="mt-10 text-sm font-semibold tracking-[0.12em] text-white/35">
            seer.mn
          </p>
        </section>
      </div>
    </main>
  );
}
