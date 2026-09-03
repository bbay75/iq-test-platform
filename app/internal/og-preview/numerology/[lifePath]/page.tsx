import { notFound } from "next/navigation";
import NumerologyShareCard from "@/components/NumerologyShareCard";

type PageProps = {
  params: Promise<{ lifePath: string }>;
};

const VALID_LIFE_PATHS = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33]);

export default async function NumerologyOgPreviewPage({ params }: PageProps) {
  const { lifePath } = await params;
  const value = Number(lifePath);

  if (!VALID_LIFE_PATHS.has(value)) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#151515] p-8">
      <NumerologyShareCard isUnlocked={true} lifePath={value} />
    </main>
  );
}
