import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    score: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { score } = await params;
  const numericScore = Number(score);

  if (
    !Number.isInteger(numericScore) ||
    numericScore < 0 ||
    numericScore > 100
  ) {
    return {};
  }

  const imageUrl = `/share/love-final/${numericScore}.jpg`;

  return {
    title: `Бидний нийцэл ${numericScore}%`,
    description: "Love Test | seer.mn",

    openGraph: {
      title: `Бидний нийцэл ${numericScore}%`,
      description: "Love Test | seer.mn",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `Бидний нийцэл ${numericScore}%`,
      description: "Love Test | seer.mn",
      images: [imageUrl],
    },
  };
}

export default async function LoveSharePage({ params }: PageProps) {
  const { score } = await params;
  const numericScore = Number(score);

  if (
    !Number.isInteger(numericScore) ||
    numericScore < 0 ||
    numericScore > 100
  ) {
    notFound();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <img
        src={`/share/love-final/${numericScore}.jpg`}
        alt={`${numericScore}% Love result`}
        className="w-full max-w-[1200px]"
      />
    </main>
  );
}
