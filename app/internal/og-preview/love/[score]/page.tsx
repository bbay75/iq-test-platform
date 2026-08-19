import { notFound } from "next/navigation";
import LoveShareCard from "@/components/LoveShareCard";

type PageProps = {
  params: Promise<{
    score: string;
  }>;
};

export default async function LoveOgPreviewPage({ params }: PageProps) {
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
    <main className="min-h-screen bg-[#151515] p-8">
      <LoveShareCard score={numericScore} />
    </main>
  );
}
