import { notFound } from "next/navigation";
import LoveShareCard from "@/components/LoveShareCard";

type PageProps = {
  params: Promise<{
    score: string;
  }>;
  searchParams: Promise<{
    mode?: string;
  }>;
};

export default async function LoveOgPreviewPage({
  params,
  searchParams,
}: PageProps) {
  const { score } = await params;
  const { mode } = await searchParams;

  const numericScore = Number(score);

  if (
    !Number.isInteger(numericScore) ||
    numericScore < 0 ||
    numericScore > 100
  ) {
    notFound();
  }

  const shareMode: "solo" | "pair" = mode === "pair" ? "pair" : "solo";

  return (
    <main className="min-h-screen bg-[#151515] p-8">
      <LoveShareCard score={numericScore} mode={shareMode} />
    </main>
  );
}
