"use client";

import { useEffect, useState } from "react";
import { generateMbtiShareImage } from "@/lib/generateMbtiShareImage";

export default function MbtiSharePoster({
  type,
  gender = "female",
}: {
  type: string;
  gender?: "female" | "male";
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    let url: string | null = null;

    async function run() {
      const blob = await generateMbtiShareImage({
        type,
        gender,
      });

      url = URL.createObjectURL(blob);

      if (alive) {
        setImageUrl(url);
      }
    }

    run();

    return () => {
      alive = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [type, gender]);

  return (
    <div
      id="mbti-share-poster-export"
      className="relative h-[1350px] w-[1080px] overflow-hidden bg-slate-950 text-white"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${type} MBTI share poster`}
          className="h-full w-full object-cover"
          draggable={false}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-slate-950 text-[36px] font-semibold text-white/80">
          Зураг бэлдэж байна...
        </div>
      )}
    </div>
  );
}
