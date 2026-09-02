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

  if (!Number.isInteger(score) || score < 0 || score > 145) {
    return null;
  }

  return score;
}

function getIqLevel(score: number) {
  if (score <= 69) {
    return {
      label: "Маш доогуур",
      range: "69 хүртэл",
    };
  }

  if (score <= 79) {
    return {
      label: "Доогуур",
      range: "70–79",
    };
  }

  if (score <= 89) {
    return {
      label: "Дундажаас доогуур",
      range: "80–89",
    };
  }

  if (score <= 109) {
    return {
      label: "Дундаж",
      range: "90–109",
    };
  }

  if (score <= 119) {
    return {
      label: "Дундажаас дээгүүр",
      range: "110–119",
    };
  }

  if (score <= 129) {
    return {
      label: "Өндөр",
      range: "120–129",
    };
  }

  return {
    label: "Маш өндөр",
    range: "130+",
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { score } = await params;

  const numericScore = normalizeScore(score);

  if (numericScore === null) {
    return {};
  }

  const level = getIqLevel(numericScore);

  const imageUrl = `/share/iq-final/${numericScore}.jpg`;

  const title = `Миний IQ үр дүн: ${numericScore}`;

  const description = `IQ ${numericScore} · ${level.label} · ${level.range}`;

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
          alt: `IQ ${numericScore} result`,
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

export default async function IqSharePage({ params }: PageProps) {
  const { score } = await params;

  const numericScore = normalizeScore(score);

  if (numericScore === null) {
    notFound();
  }

  const level = getIqLevel(numericScore);

  const imageUrl = `/share/iq-final/${numericScore}.jpg`;

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[900px] flex-col px-5 py-8 sm:px-8">
        {/* SHARE IMAGE */}
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black shadow-2xl">
          <img
            src={imageUrl}
            alt={`IQ ${numericScore} result`}
            className="block h-auto w-full"
          />
        </div>

        {/* RESULT */}
        <section className="mx-auto mt-10 w-full max-w-[720px] text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-300">
            IQ TEST
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-6xl">
            IQ {numericScore}
          </h1>

          <p className="mt-3 text-2xl font-bold text-white">{level.label}</p>

          <p className="mt-2 text-lg font-semibold text-blue-300">
            {level.range}
          </p>

          <p className="mx-auto mt-6 max-w-[620px] text-lg leading-8 text-slate-300">
            Дүрслэл, тоо, логик болон үгийн холбооны 29 даалгаврын үр дүн.
          </p>

          <div className="mt-9 grid gap-4">
            <Link
              href="/iq-test"
              className="rounded-2xl bg-gradient-to-r from-blue-500 to-violet-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition hover:scale-[1.01]"
            >
              IQ тест өгөх
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
