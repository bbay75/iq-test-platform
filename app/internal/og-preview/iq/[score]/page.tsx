import { notFound } from "next/navigation";
import IqShareCard from "@/components/IqShareCard";

type PageProps = {
  params: Promise<{
    score: string;
  }>;
};

export default async function IqOgPreviewPage({ params }: PageProps) {
  const { score } = await params;

  const numericScore = Number(score);

  if (
    !Number.isInteger(numericScore) ||
    numericScore < 0 ||
    numericScore > 145
  ) {
    notFound();
  }

  const level =
    numericScore <= 69
      ? { label: "Маш доогуур", range: "69 хүртэл" }
      : numericScore <= 79
        ? { label: "Доогуур", range: "70–79" }
        : numericScore <= 89
          ? { label: "Дундажаас доогуур", range: "80–89" }
          : numericScore <= 109
            ? { label: "Дундаж", range: "90–109" }
            : numericScore <= 119
              ? { label: "Дундажаас дээгүүр", range: "110–119" }
              : numericScore <= 129
                ? { label: "Өндөр", range: "120–129" }
                : { label: "Маш өндөр", range: "130+" };

  return (
    <main className="min-h-screen bg-[#151515] p-8">
      <IqShareCard
        isUnlocked={true}
        score={numericScore}
        level={level.label}
        levelRange={level.range}
      />
    </main>
  );
}
