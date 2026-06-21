"use client";

import { useState } from "react";
import { generateMbtiShareImage } from "@/lib/generateMbtiShareImage";

const MBTI_TYPES = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
];

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();

  a.remove();
  URL.revokeObjectURL(url);
}

export default function MbtiOgExportPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function downloadOne(type: string) {
    setLoading(type);

    const blob = await generateMbtiShareImage({
      type,
      gender: "male",
    });

    const ext = blob.type.includes("jpeg") ? "jpg" : "png";

    downloadBlob(blob, `${type.toLowerCase()}.${ext}`);

    setLoading(null);
  }

  async function downloadAll() {
    for (const type of MBTI_TYPES) {
      setLoading(type);

      const blob = await generateMbtiShareImage({
        type,
        gender: "male",
      });

      const ext = blob.type.includes("jpeg") ? "jpg" : "png";

      downloadBlob(blob, `${type.toLowerCase()}.${ext}`);

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setLoading(null);
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <h1 className="text-3xl font-bold">MBTI OG Image Export</h1>

      <p className="mt-3 text-white/70">16 MBTI share image татах түр page.</p>

      <button
        onClick={downloadAll}
        disabled={!!loading}
        className="mt-8 rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white disabled:opacity-50"
      >
        {loading ? `${loading} татаж байна...` : "Бүгдийг татах"}
      </button>

      <div className="mt-8 grid grid-cols-4 gap-4">
        {MBTI_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => downloadOne(type)}
            disabled={!!loading}
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 font-semibold hover:bg-white/15 disabled:opacity-50"
          >
            {type}
          </button>
        ))}
      </div>
    </main>
  );
}
