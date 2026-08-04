import Link from "next/link";
import { Metadata } from "next";
import { mbtiShareTemplates } from "@/data/mbtiShareTemplates";

const SITE_URL = "https://iq-test-platform-rouge.vercel.app";

const VALID_GENDERS = ["female", "male"] as const;

type PageProps = {
  params: Promise<{
    gender: string;
    type: string;
  }>;
};

function normalizeGender(gender: string) {
  return VALID_GENDERS.includes(gender as "female" | "male")
    ? gender
    : "female";
}

function normalizeType(type: string) {
  const key = type.toUpperCase();
  return mbtiShareTemplates[key] ? key : "INTJ";
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { gender, type } = await params;

  const safeGender = normalizeGender(gender);
  const safeType = normalizeType(type);
  const template = mbtiShareTemplates[safeType];

  const title = `Миний MBTI: ${safeType}`;
  const description = `${template.archetype} — өөрийн MBTI төрлөө мэдээрэй.`;
  const imageUrl = `${SITE_URL}/share/mbti-og-card/${safeGender}/${safeType.toLowerCase()}-v2.webp`;
  const pageUrl = `${SITE_URL}/share/mbti/${safeGender}/${safeType.toLowerCase()}`;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "Seer",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${safeType} MBTI share image`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function MbtiSharePage({ params }: PageProps) {
  const { gender, type } = await params;

  const safeGender = normalizeGender(gender);
  const safeType = normalizeType(type);
  const template = mbtiShareTemplates[safeType];

  const imageSrc = `/share/mbti-og-card/${safeGender}/${safeType.toLowerCase()}-v2.webp`;

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white">
      <div className="mx-auto max-w-[520px]">
        <img
          src={imageSrc}
          alt={`${safeType} MBTI poster`}
          className="w-full rounded-3xl shadow-2xl"
        />

        <div className="mt-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-purple-300">
            Миний MBTI төрөл
          </p>

          <h1 className="mt-3 text-5xl font-black">{safeType}</h1>

          <p className="mt-3 text-xl font-semibold text-white/90">
            {template.archetype}
          </p>

          <p className="mt-4 text-white/65">
            Та ч бас өөрийн MBTI төрлөө мэдээрэй.
          </p>

          <Link
            href="/mbti-test"
            className="mt-7 inline-flex w-full items-center justify-center rounded-2xl bg-purple-600 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-purple-900/30 hover:bg-purple-500"
          >
            MBTI тест өгөх
          </Link>

          <Link
            href="/"
            className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-4 font-semibold text-white/80 hover:bg-white/10"
          >
            Бусад тест үзэх
          </Link>
        </div>
      </div>
    </main>
  );
}
