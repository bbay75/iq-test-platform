import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    score: string;
  }>;
};

function normalizeScore(value: string) {
  const score = Number(value);

  if (!Number.isInteger(score) || score < 0 || score > 100) {
    return null;
  }

  return score;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { score } = await params;
  const numericScore = normalizeScore(score);

  if (numericScore === null) {
    return {};
  }

  const imageUrl = `/share/love-final/${numericScore}.jpg`;

  return {
    title: `Бидний нийцэл ${numericScore}%`,
    description: "Та хоёрын харилцааны нийцлийг шалгаарай.",

    openGraph: {
      title: `Бидний нийцэл ${numericScore}%`,
      description: "Та хоёрын харилцааны нийцлийг шалгаарай.",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${numericScore}% Love Test result`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `Бидний нийцэл ${numericScore}%`,
      description: "Та хоёрын харилцааны нийцлийг шалгаарай.",
      images: [imageUrl],
    },
  };
}

export default async function LoveSharePage({ params }: PageProps) {
  const { score } = await params;
  const numericScore = normalizeScore(score);

  if (numericScore === null) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[900px] flex-col px-5 py-8 sm:px-8">
        {/* SHARE IMAGE */}
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black shadow-2xl">
          <img
            src={`/share/love-final/${numericScore}.jpg`}
            alt={`${numericScore}% Love Test result`}
            className="block h-auto w-full"
          />
        </div>

        {/* RESULT */}
        <section className="mx-auto mt-10 w-full max-w-[720px] text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-pink-300">
            LOVE TEST
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Бидний нийцэл {numericScore}%
          </h1>

          <p className="mx-auto mt-5 max-w-[620px] text-lg leading-8 text-slate-300">
            Харилцааны ойр байдал, ойлголцол, итгэлцэл болон хамтын мэдрэмжийг
            шалгах Love Test.
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
