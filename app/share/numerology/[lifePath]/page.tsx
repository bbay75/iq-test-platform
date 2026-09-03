import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNumerologyPremiumProfile } from "@/data/numerologyPremiumProfiles";

type PageProps = {
  params: Promise<{ lifePath: string }>;
};

const VALID_LIFE_PATHS = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33]);

function normalizeLifePath(value: string): number | null {
  const lifePath = Number(value);

  if (!Number.isInteger(lifePath) || !VALID_LIFE_PATHS.has(lifePath)) {
    return null;
  }

  return lifePath;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lifePath } = await params;
  const value = normalizeLifePath(lifePath);

  if (value === null) {
    return {};
  }

  const profile = getNumerologyPremiumProfile(value);
  const imageUrl = `/share/numerology-final/${value}.jpg`;

  return {
    title: `Миний үндсэн тоо: ${value} · ${profile.shortTitle}`,
    description: `Тоон зурхайн миний үндсэн тоо ${value} — ${profile.shortTitle}.`,
    openGraph: {
      title: `Миний үндсэн тоо: ${value} · ${profile.shortTitle}`,
      description: `Тоон зурхайн миний үндсэн тоо ${value} — ${profile.shortTitle}.`,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `Numerology ${value}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Миний үндсэн тоо: ${value} · ${profile.shortTitle}`,
      description: `Тоон зурхайн миний үндсэн тоо ${value} — ${profile.shortTitle}.`,
      images: [imageUrl],
    },
  };
}

export default async function NumerologySharePage({ params }: PageProps) {
  const { lifePath } = await params;
  const value = normalizeLifePath(lifePath);

  if (value === null) {
    notFound();
  }

  const profile = getNumerologyPremiumProfile(value);
  const imageUrl = `/share/numerology-final/${value}.jpg`;

  return (
    <main className="min-h-screen bg-[#0b1020] px-4 py-10 text-white">
      <section className="mx-auto w-full max-w-[900px] text-center">
        <img
          src={imageUrl}
          alt={`Numerology ${value}`}
          width={1200}
          height={630}
          className="w-full rounded-2xl shadow-2xl"
        />

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">
          NUMEROLOGY
        </p>

        <h1 className="mt-3 text-4xl font-black sm:text-5xl">
          Миний үндсэн тоо {value}
        </h1>

        <p className="mt-3 text-2xl font-bold text-violet-200">
          {profile.shortTitle}
        </p>

        <p className="mx-auto mt-5 max-w-[620px] text-lg leading-8 text-slate-300">
          Төрсөн огноо, нэр, утасны дугаар дээр үндэслэн өөрийн тоон зурхайн үр
          дүнг үзээрэй.
        </p>

        <div className="mt-9 grid gap-4 sm:grid-cols-2">
          <Link
            href="/numerology"
            className="rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-4 font-bold"
          >
            Тоон зурхай үзэх
          </Link>

          <Link
            href="/"
            className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 font-bold"
          >
            Бусад тест үзэх
          </Link>
        </div>

        <p className="mt-10 text-sm text-white/40">seer.mn</p>
      </section>
    </main>
  );
}
