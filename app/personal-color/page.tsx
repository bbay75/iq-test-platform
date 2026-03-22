"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Season = "Warm Spring" | "Cool Summer" | "Deep Autumn" | "Clear Winter";
type Undertone = "Warm" | "Cool" | "Neutral";
type ResultMode = "ai" | "demo";
type Contrast = "low" | "medium" | "high";
type Chroma = "soft" | "balanced" | "bright";
type Depth = "light" | "medium" | "deep";

type ColorItem = {
  name: string;
  hex: string;
};

type Analysis = {
  season: Season;
  undertone: Undertone;
  confidence: number;
  summary: string;
  contrast: Contrast;
  chroma: Chroma;
  depth: Depth;
  bestColors: ColorItem[];
  avoidColors: ColorItem[];
  outfits: string[];
  jewelry: string;
  makeup: string;
  hair: string;
  advice: string;
  why: string[];
  quality: string;
  confidenceBreakdown: string[];
};

type QuizAnswers = {
  tanning: string;
  jewelry: string;
  skinTone: string;
  contrast: string;
};

const demoProfiles: Record<
  Season,
  Omit<
    Analysis,
    | "confidence"
    | "summary"
    | "contrast"
    | "chroma"
    | "depth"
    | "why"
    | "quality"
    | "confidenceBreakdown"
  >
> = {
  "Warm Spring": {
    season: "Warm Spring",
    undertone: "Warm",
    bestColors: [
      { name: "Coral", hex: "#FF7F50" },
      { name: "Warm Apricot", hex: "#F4A261" },
      { name: "Sun Yellow", hex: "#E9C46A" },
      { name: "Fresh Olive", hex: "#8AB17D" },
      { name: "Camel", hex: "#DDA15E" },
      { name: "Warm Terracotta", hex: "#E76F51" },
    ],
    avoidColors: [
      { name: "Cool Gray", hex: "#A8A8B3" },
      { name: "Icy Blue", hex: "#BCC6E6" },
      { name: "Muted Slate", hex: "#7A8799" },
      { name: "Frozen Lilac", hex: "#D6D6E7" },
    ],
    outfits: [
      "Coral дээд + cream доод",
      "Warm beige цамц + camel гадуур",
      "Olive accent + light tan base",
      "Peach knit + soft brown pants",
    ],
    jewelry: "Алтлаг, champagne gold, warm rose gold илүү зохино.",
    makeup: "Peach, coral, warm nude, apricot blush.",
    hair: "Honey brown, caramel, warm chestnut.",
    advice: "Хүйтэн саарал, мөстэй pastel өнгөнөөс зайлсхий.",
  },
  "Cool Summer": {
    season: "Cool Summer",
    undertone: "Cool",
    bestColors: [
      { name: "Dusty Rose", hex: "#C08497" },
      { name: "Soft Blue", hex: "#9FB7D9" },
      { name: "Lavender", hex: "#B8A1D9" },
      { name: "Cool Gray", hex: "#8D99AE" },
      { name: "Soft Mauve", hex: "#D8B4C6" },
      { name: "Powder Blue", hex: "#A3B8D9" },
    ],
    avoidColors: [
      { name: "Warm Apricot", hex: "#F4A261" },
      { name: "Golden Yellow", hex: "#E9C46A" },
      { name: "Orange Brown", hex: "#D97706" },
      { name: "Warm Mustard", hex: "#A16207" },
    ],
    outfits: [
      "Dusty rose дээд + cool gray доод",
      "Soft blue цамц + charcoal trouser",
      "Lavender accent + muted navy base",
      "Mauve knit + soft gray outerwear",
    ],
    jewelry: "Silver, platinum, white gold илүү зохино.",
    makeup: "Rose pink, mauve, berry nude.",
    hair: "Ash brown, cool mocha, soft espresso.",
    advice: "Хэт алтлаг, улбар шарлаг өнгөнөөс зайлсхий.",
  },
  "Deep Autumn": {
    season: "Deep Autumn",
    undertone: "Warm",
    bestColors: [
      { name: "Olive", hex: "#6B8E23" },
      { name: "Rust", hex: "#B85C38" },
      { name: "Chocolate", hex: "#5C4033" },
      { name: "Deep Teal", hex: "#2A6F6B" },
      { name: "Warm Brown", hex: "#8C5E3C" },
      { name: "Espresso", hex: "#7A4E2D" },
    ],
    avoidColors: [
      { name: "Ice Blue", hex: "#E0E7FF" },
      { name: "Cool Lavender", hex: "#D8B4FE" },
      { name: "Pure White", hex: "#F5F5F5" },
      { name: "Pale Mist", hex: "#DDE7F0" },
    ],
    outfits: [
      "Olive дээд + dark brown доод",
      "Rust knit + chocolate гадуур",
      "Deep teal accent + camel base",
      "Mustard detail + espresso trouser",
    ],
    jewelry: "Gold, bronze, antique gold илүү зохино.",
    makeup: "Terracotta, brick, cinnamon, warm brown.",
    hair: "Chocolate brown, warm espresso, chestnut.",
    advice: "Хэт цайвар, мөстэй өнгө сулруулж магадгүй.",
  },
  "Clear Winter": {
    season: "Clear Winter",
    undertone: "Cool",
    bestColors: [
      { name: "Black", hex: "#111111" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Cobalt Blue", hex: "#0077B6" },
      { name: "Magenta", hex: "#D81B60" },
      { name: "Royal Blue", hex: "#1D4ED8" },
      { name: "Bright Violet", hex: "#7C3AED" },
    ],
    avoidColors: [
      { name: "Warm Beige", hex: "#C2B280" },
      { name: "Camel", hex: "#C19A6B" },
      { name: "Muted Olive", hex: "#A3B18A" },
      { name: "Soft Sand", hex: "#D8C3A5" },
    ],
    outfits: [
      "Black + white high contrast",
      "Cobalt top + black bottom",
      "Magenta accent + charcoal base",
      "Emerald tone + crisp white layering",
    ],
    jewelry: "Silver, platinum, white gold төрлийн тод гоёл илүү зохино.",
    makeup: "Berry, plum, cool red, cool pink.",
    hair: "Cool black, blue-black, dark ash brown.",
    advice: "Хэт бүдэг, дулаан, шаварлаг өнгөнөөс зайлсхий.",
  },
};

function pickDemoProfile(answers: QuizAnswers): Analysis {
  const warmBright =
    answers.jewelry === "gold" &&
    answers.skinTone === "warm" &&
    answers.contrast === "bright";

  const coolSoft =
    answers.jewelry === "silver" &&
    answers.skinTone === "cool" &&
    answers.contrast === "soft";

  const warmDeep =
    answers.jewelry === "gold" &&
    answers.skinTone === "warm" &&
    answers.contrast === "deep";

  if (warmBright) {
    return {
      ...demoProfiles["Warm Spring"],
      confidence: 78,
      contrast: "medium",
      chroma: "bright",
      depth: "light",
      summary:
        "Энэ нь demo preview үр дүн юм. Таны хариултаас харахад дулаан, тод өнгөнүүд илүү зохих магадлалтай байна.",
      quality: "Demo preview тул зураг анализ хийгдээгүй.",
      confidenceBreakdown: [
        "Demo mode нь AI анализ биш",
        "Зөвхөн quiz дээр үндэслэсэн",
        "Confidence нь ойролцоо утга",
      ],
      why: [
        "Таны сонгосон гоёл (алт) warm undertone-г илтгэж байна",
        "Таны skin tone warm тал руу илүү байна",
        "Таны сонгосон тод өнгө chroma өндөр байгааг илтгэж байна",
      ],
    };
  }

  if (coolSoft) {
    return {
      ...demoProfiles["Cool Summer"],
      confidence: 78,
      contrast: "low",
      chroma: "soft",
      depth: "medium",
      summary:
        "Энэ нь demo preview үр дүн юм. Таны хариултаас харахад зөөлөн, сэрүүн, намдуу palette илүү зохих магадлалтай байна.",
      quality: "Demo preview тул зураг анализ хийгдээгүй.",
      confidenceBreakdown: [
        "Demo mode нь AI анализ биш",
        "Зөвхөн quiz хариултад тулгуурласан",
        "Confidence нь ойролцоо утга",
      ],
      why: [
        "Мөнгөлөг гоёл cool undertone-г илтгэж байна",
        "Таны арьсны өнгө сэрүүн талдаа байна",
        "Зөөлөн өнгө сонгосон нь chroma бага байгааг илтгэж байна",
      ],
    };
  }

  if (warmDeep) {
    return {
      ...demoProfiles["Deep Autumn"],
      confidence: 79,
      contrast: "medium",
      chroma: "balanced",
      depth: "deep",
      summary:
        "Энэ нь demo preview үр дүн юм. Таны хариултаас харахад гүн, баялаг, дулаан өнгөнүүд илүү зохих магадлалтай байна.",
      quality: "Demo preview тул зураг анализ хийгдээгүй.",
      confidenceBreakdown: [
        "Demo mode нь AI анализ биш",
        "Зөвхөн quiz хариултад тулгуурласан",
        "Confidence нь ойролцоо утга",
      ],
      why: [
        "Алтлаг гоёл warm undertone-г илтгэж байна",
        "Таны өнгөний сонголт гүн өнгө рүү хэлбийж байна",
        "Гүн өнгө сонгосон нь depth өндөр байгааг илтгэж байна",
      ],
    };
  }

  return {
    ...demoProfiles["Clear Winter"],
    confidence: 80,
    contrast: "high",
    chroma: "bright",
    depth: "deep",
    summary:
      "Энэ нь demo preview үр дүн юм. Таны хариултаас харахад тод, контрасттай, сэрүүн өнгөнүүд илүү зохих магадлалтай байна.",
    quality: "Demo preview тул зураг анализ хийгдээгүй.",
    confidenceBreakdown: [
      "Demo mode нь AI анализ биш",
      "Зөвхөн quiz хариултад тулгуурласан",
      "Confidence нь ойролцоо утга",
    ],
    why: [
      "Мөнгөлөг гоёл cool undertone-г илтгэж байна",
      "Тод өнгө сонгосон нь өндөр contrast байгааг илтгэж байна",
      "Таны palette тод, цэвэр өнгөнд илүү зохиж байна",
    ],
  };
}

function ResultPaywall({
  unlocked,
  onUnlock,
}: {
  unlocked: boolean;
  onUnlock: () => void;
}) {
  if (unlocked) return null;

  return (
    <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-xl dark:border-gray-700 dark:bg-gray-900">
        <div className="text-4xl">🔒</div>
        <h2 className="mt-3 text-xl font-bold text-gray-900 dark:text-white">
          Unlock Result
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          AI анализын дэлгэрэнгүй үр дүнг харахын тулд unlock хийнэ үү
        </p>
        <button
          onClick={onUnlock}
          className="mt-5 rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white transition hover:bg-rose-600 active:scale-95"
        >
          Unlock
        </button>
      </div>
    </div>
  );
}

function downloadPalette(colors: ColorItem[]) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 260;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const blockWidth = canvas.width / colors.length;

  colors.forEach((color, index) => {
    ctx.fillStyle = color.hex;
    ctx.fillRect(index * blockWidth, 0, blockWidth, 180);

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(index * blockWidth, 180, blockWidth, 80);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(color.name, index * blockWidth + blockWidth / 2, 215);

    ctx.font = "16px monospace";
    ctx.fillText(color.hex, index * blockWidth + blockWidth / 2, 240);
  });

  const link = document.createElement("a");
  link.download = "personal-color-palette.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function QuizCard({
  title,
  name,
  value,
  options,
  onChange,
}: {
  title: string;
  name: keyof QuizAnswers;
  value: string;
  options: { label: string; value: string }[];
  onChange: (name: keyof QuizAnswers, value: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
      <p className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
        {title}
      </p>

      <div className="space-y-2">
        {options.map((option) => {
          const checked = value === option.value;

          return (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 transition ${
                checked
                  ? "border-rose-400 bg-rose-50 dark:border-rose-500 dark:bg-rose-950/20"
                  : "border-gray-200 bg-white hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={(e) => onChange(name, e.target.value)}
                className="h-4 w-4"
              />
              <span className="text-sm text-gray-700 dark:text-gray-200">
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function ColorCard({
  color,
  crossed = false,
}: {
  color: ColorItem;
  crossed?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
      <div
        className="mb-4 h-16 w-full rounded-xl border border-gray-200 transition-transform hover:scale-[1.02] dark:border-gray-700"
        style={{
          background: color.hex,
          minHeight: "64px",
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)",
        }}
      />

      <div className="text-center">
        <p className="text-base font-semibold text-gray-800 dark:text-gray-200">
          {color.name}
        </p>

        <p className="mt-2 text-xs font-mono tracking-wide text-gray-500 dark:text-gray-400">
          {color.hex}
        </p>

        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => navigator.clipboard.writeText(color.hex)}
            className="inline-flex min-w-[82px] items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100 active:scale-95 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Хуулах
          </button>

          {crossed && (
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-sm font-bold text-red-500 dark:bg-red-900/30 dark:text-red-400">
              ✕
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PersonalColorPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysisMode, setAnalysisMode] = useState<ResultMode>("ai");
  const [resultMode, setResultMode] = useState<ResultMode>("demo");

  const [answers, setAnswers] = useState<QuizAnswers>({
    tanning: "",
    jewelry: "",
    skinTone: "",
    contrast: "",
  });

  const isQuizComplete = useMemo(() => {
    return (
      answers.tanning !== "" &&
      answers.jewelry !== "" &&
      answers.skinTone !== "" &&
      answers.contrast !== ""
    );
  }, [answers]);

  const handleUpload = (file: File | null) => {
    if (!file) return;

    setSelectedFile(file);
    setError("");

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result?.toString() || "";
      setImagePreview(result);
      setAnalysis(null);
      setUnlocked(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !isQuizComplete) return;

    if (analysisMode === "demo") {
      setLoading(true);
      setError("");
      setUnlocked(true);
      setAnalysis(null);

      const demo = pickDemoProfile(answers);
      setAnalysis(demo);
      setResultMode("demo");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setUnlocked(false);
      setAnalysis(null);

      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("answers", JSON.stringify(answers));

      const res = await fetch("/api/personal-color/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        const raw =
          typeof data?.detail === "string"
            ? data.detail
            : data?.error || "Analyze failed";

        if (raw.includes("insufficient_quota")) {
          const demo = pickDemoProfile(answers);

          setAnalysis(demo);
          setResultMode("demo");
          setUnlocked(true);
          setError("AI анализ түр ажиллахгүй байна. Demo preview харууллаа.");
          return;
        }

        throw new Error(raw);
      }

      setAnalysis(data);
      setResultMode("ai");
    } catch {
      const demo = pickDemoProfile(answers);
      setAnalysis(demo);
      setResultMode("demo");
      setUnlocked(true);
      setError("AI анализ түр ажиллахгүй байна. Demo preview харууллаа.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setAnalysis(null);
    setUnlocked(false);
    setLoading(false);
    setError("");
    setResultMode("demo");
    setAnswers({
      tanning: "",
      jewelry: "",
      skinTone: "",
      contrast: "",
    });
  };

  const handleAnswerChange = (name: keyof QuizAnswers, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const shouldShowPaywall = resultMode === "ai" && analysis && !unlocked;

  return (
    <div className="min-h-screen bg-gray-100 p-6 dark:bg-gray-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Link
          href="/"
          className="text-sm font-medium text-rose-600 hover:underline dark:text-rose-300"
        >
          ← Back to Home
        </Link>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="rounded-3xl bg-gradient-to-br from-rose-500 via-pink-500 to-orange-400 p-8 text-center text-white shadow-lg">
            <p className="text-sm uppercase tracking-[0.2em] text-rose-100">
              Personal Color AI
            </p>
            <h1 className="mt-4 text-3xl font-bold md:text-4xl">
              Хувийн өнгө тодорхойлох
            </h1>
            <p className="mt-3 text-rose-100">
              AI эсвэл Demo mode сонгоод богино тест бөглөж, зургаа оруулан өөрт
              тохирох өнгөө хараарай
            </p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[420px_1fr]">
            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                <p className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Analysis Mode
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAnalysisMode("ai")}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      analysisMode === "ai"
                        ? "border-rose-500 bg-rose-500 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    AI Analysis
                  </button>

                  <button
                    type="button"
                    onClick={() => setAnalysisMode("demo")}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      analysisMode === "demo"
                        ? "border-amber-500 bg-amber-500 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    Demo Preview
                  </button>
                </div>

                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  {analysisMode === "ai"
                    ? "AI mode нь зураг + тестийн хариултаар анализ хийнэ. API ажиллахгүй бол demo preview рүү шилжинэ."
                    : "Demo mode нь API ашиглахгүй, тестийн хариултад тулгуурласан ойролцоо preview харуулна."}
                </p>
              </div>

              <QuizCard
                title="1. Нарны гэрэлд арьс чинь ихэвчлэн яадаг вэ?"
                name="tanning"
                value={answers.tanning}
                onChange={handleAnswerChange}
                options={[
                  { label: "Амархан борлодог", value: "tan" },
                  { label: "Илүү амархан түлэгддэг", value: "burn" },
                ]}
              />

              <QuizCard
                title="2. Аль төрлийн гоёл илүү зохидог гэж санагддаг вэ?"
                name="jewelry"
                value={answers.jewelry}
                onChange={handleAnswerChange}
                options={[
                  { label: "Алтлаг", value: "gold" },
                  { label: "Мөнгөлөг", value: "silver" },
                ]}
              />

              <QuizCard
                title="3. Арьсны өнгө ер нь аль тал руугаа санагддаг вэ?"
                name="skinTone"
                value={answers.skinTone}
                onChange={handleAnswerChange}
                options={[
                  { label: "Шаргал / дулаан талдаа", value: "warm" },
                  { label: "Ягаандуу / сэрүүн талдаа", value: "cool" },
                ]}
              />

              <QuizCard
                title="4. Чамд ямар өнгө илүү зохидог мэт санагддаг вэ?"
                name="contrast"
                value={answers.contrast}
                onChange={handleAnswerChange}
                options={[
                  { label: "Тод, цэвэр өнгө", value: "bright" },
                  { label: "Зөөлөн, намдуу өнгө", value: "soft" },
                  { label: "Гүн, баялаг өнгө", value: "deep" },
                ]}
              />

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-rose-300 bg-rose-50 p-8 text-center transition hover:bg-rose-100 dark:border-rose-700 dark:bg-rose-950/20 dark:hover:bg-rose-950/30">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Photo Upload
                </span>
                <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Нүүр, хүзүү, цээж харагдсан зураг байвал илүү сайн
                </span>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files?.[0] || null)}
                />
              </label>

              {imagePreview ? (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                  <p className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Original Photo
                  </p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-[360px] w-full rounded-xl object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-[240px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-900">
                  Зураг оруулаагүй байна
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleAnalyze}
                  disabled={!imagePreview || !isQuizComplete || loading}
                  className="flex-1 rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Analyzing..."
                    : analysisMode === "ai"
                      ? "Analyze with AI"
                      : "Show Demo"}
                </button>

                <button
                  onClick={handleReset}
                  className="rounded-xl bg-gray-600 px-6 py-3 font-semibold text-white transition hover:bg-gray-700 active:scale-95"
                >
                  Reset
                </button>
              </div>

              {!isQuizComplete && (
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  Analyze хийхийн өмнө бүх асуултад хариулна уу.
                </p>
              )}

              {error && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
                  {error}
                </div>
              )}
            </div>

            <div>
              {!analysis ? (
                <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                  <div className="px-6">
                    <p className="text-lg font-semibold">
                      Result will appear here
                    </p>
                    <p className="mt-2 text-sm">
                      Mode сонгоод, асуултад хариулаад, зургаа оруулсны дараа
                      Analyze дарна уу
                    </p>
                  </div>
                </div>
              ) : shouldShowPaywall ? (
                <ResultPaywall
                  unlocked={unlocked}
                  onUnlock={() => {
                    alert("Payment successful");
                    setUnlocked(true);
                  }}
                />
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-center dark:border-rose-900 dark:bg-rose-950/20">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Season
                      </p>
                      <p className="mt-3 text-2xl font-bold text-rose-600 dark:text-rose-300">
                        {analysis.season}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-center dark:border-orange-900 dark:bg-orange-950/20">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Undertone
                      </p>
                      <p className="mt-3 text-2xl font-bold text-orange-600 dark:text-orange-300">
                        {analysis.undertone}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-fuchsia-200 bg-fuchsia-50 p-5 text-center dark:border-fuchsia-900 dark:bg-fuchsia-950/20">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Confidence
                      </p>
                      <p className="mt-3 text-2xl font-bold text-fuchsia-600 dark:text-fuchsia-300">
                        {analysis.confidence}%
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-900">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Contrast
                      </p>
                      <p className="mt-2 text-lg font-bold capitalize text-slate-700 dark:text-slate-200">
                        {analysis.contrast}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-900">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Chroma
                      </p>
                      <p className="mt-2 text-lg font-bold capitalize text-slate-700 dark:text-slate-200">
                        {analysis.chroma}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-900">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Depth
                      </p>
                      <p className="mt-2 text-lg font-bold capitalize text-slate-700 dark:text-slate-200">
                        {analysis.depth}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      Summary
                    </h2>

                    <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 dark:border-yellow-900 dark:bg-yellow-950/20">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Image Quality
                      </h3>

                      <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                        {analysis.quality}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/20">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Why this result?
                      </h3>

                      <ul className="mt-4 space-y-2">
                        {analysis.why?.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                          >
                            <span className="mt-1 text-blue-500">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-2">
                      {resultMode === "ai" ? (
                        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                          Real AI Analysis
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                          Demo Preview
                        </span>
                      )}
                    </div>

                    <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
                      {analysis.summary}
                    </p>
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/20">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Confidence Breakdown
                      </h3>

                      <ul className="mt-4 space-y-2">
                        {analysis.confidenceBreakdown?.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                          >
                            <span className="mt-1 text-emerald-500">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                      {resultMode === "ai"
                        ? "Энэ дүгнэлт нь зураг болон тестийн хариултад тулгуурласан AI-based estimate юм. Гэрэлтүүлэг, камерын өнгө, будалт зэрэг нь үр дүнд нөлөөлж болно."
                        : "Энэ нь demo preview үр дүн бөгөөд жинхэнэ зураг анализ биш. Quiz хариултад тулгуурласан ойролцоо санал юм."}
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-900 dark:bg-green-950/20">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          Best Colors
                        </h3>

                        <button
                          onClick={() => downloadPalette(analysis.bestColors)}
                          className="inline-flex items-center justify-center rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600 active:scale-95"
                        >
                          Download Palette
                        </button>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-5">
                        {analysis.bestColors.map((color) => (
                          <ColorCard key={color.hex} color={color} />
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/20">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Avoid Colors
                      </h3>

                      <div className="mt-6 grid grid-cols-2 gap-5">
                        {analysis.avoidColors.map((color) => (
                          <ColorCard key={color.hex} color={color} crossed />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5 dark:border-purple-900 dark:bg-purple-950/20">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Outfit Suggestions
                    </h3>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {analysis.outfits.map((item, i) => (
                        <div
                          key={item}
                          className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
                        >
                          <div className="flex justify-center gap-2">
                            <div
                              className="h-10 w-16 rounded-md border border-black/10"
                              style={{
                                backgroundColor:
                                  analysis.bestColors[
                                    i % analysis.bestColors.length
                                  ].hex,
                              }}
                            />
                            <div
                              className="h-10 w-16 rounded-md border border-black/10"
                              style={{
                                backgroundColor:
                                  analysis.bestColors[
                                    (i + 1) % analysis.bestColors.length
                                  ].hex,
                              }}
                            />
                          </div>

                          <p className="mt-3 text-center text-sm text-gray-700 dark:text-gray-300">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 dark:border-yellow-900 dark:bg-yellow-950/20">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Jewelry
                      </h3>
                      <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
                        {analysis.jewelry}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-pink-200 bg-pink-50 p-5 dark:border-pink-900 dark:bg-pink-950/20">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Makeup Tone
                      </h3>
                      <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
                        {analysis.makeup}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-900 dark:bg-orange-950/20">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Hair Color Suggestion
                      </h3>
                      <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
                        {analysis.hair}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5 dark:border-cyan-900 dark:bg-cyan-950/20">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Advice
                      </h3>
                      <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
                        {analysis.advice}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
