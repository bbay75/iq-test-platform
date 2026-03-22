import { NextResponse } from "next/server";

type Season = "Warm Spring" | "Cool Summer" | "Deep Autumn" | "Clear Winter";
type Undertone = "Warm" | "Cool" | "Neutral";
type Contrast = "low" | "medium" | "high";
type Chroma = "soft" | "balanced" | "bright";
type Depth = "light" | "medium" | "deep";

type ColorItem = {
  name: string;
  hex: string;
};

type AIAnalysis = {
  season: Season;
  undertone: Undertone;
  contrast: Contrast;
  chroma: Chroma;
  depth: Depth;
  confidence: number;
  summary: string;
  why: string[];
  quality: string;
  confidenceBreakdown: string[];
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

const seasonColorPools: Record<
  Season,
  {
    best: ColorItem[];
    avoid: ColorItem[];
    jewelryWarm: string;
    jewelryCool: string;
    makeupSoft: string;
    makeupBright: string;
    makeupBalanced: string;
    hairLight: string;
    hairMedium: string;
    hairDeep: string;
    advice: string;
  }
> = {
  "Warm Spring": {
    best: [
      { name: "Coral", hex: "#FF7F50" },
      { name: "Warm Apricot", hex: "#F4A261" },
      { name: "Sun Yellow", hex: "#E9C46A" },
      { name: "Fresh Olive", hex: "#8AB17D" },
      { name: "Camel", hex: "#DDA15E" },
      { name: "Warm Terracotta", hex: "#E76F51" },
      { name: "Peach", hex: "#F6BD60" },
      { name: "Golden Beige", hex: "#DDB892" },
      { name: "Warm Mint", hex: "#A8D5BA" },
      { name: "Light Tomato", hex: "#F28482" },
    ],
    avoid: [
      { name: "Cool Gray", hex: "#A8A8B3" },
      { name: "Icy Blue", hex: "#BCC6E6" },
      { name: "Muted Slate", hex: "#7A8799" },
      { name: "Frozen Lilac", hex: "#D6D6E7" },
      { name: "Blue Gray", hex: "#8D99AE" },
    ],
    jewelryWarm: "Алтлаг, champagne gold, warm rose gold илүү зохино.",
    jewelryCool: "Warm undertone давамгай ч цайвар rose gold бас боломжтой.",
    makeupSoft: "Peach nude, soft coral, apricot blush тохиромжтой.",
    makeupBalanced: "Coral, peach, warm nude, apricot blush тохиромжтой.",
    makeupBright:
      "Clear coral, warm peach, bright apricot lip өнгө тохиромжтой.",
    hairLight: "Honey brown, light caramel, warm golden brown.",
    hairMedium: "Caramel brown, warm chestnut, honey chestnut.",
    hairDeep: "Warm chestnut, rich caramel brown, cinnamon brown.",
    advice: "Хэт хүйтэн, мөстэй, сааралдуу өнгө төрхийг сулруулж магадгүй.",
  },
  "Cool Summer": {
    best: [
      { name: "Dusty Rose", hex: "#C08497" },
      { name: "Soft Blue", hex: "#9FB7D9" },
      { name: "Lavender", hex: "#B8A1D9" },
      { name: "Cool Gray", hex: "#8D99AE" },
      { name: "Soft Mauve", hex: "#D8B4C6" },
      { name: "Powder Blue", hex: "#A3B8D9" },
      { name: "Rose Beige", hex: "#D4A5A5" },
      { name: "Muted Berry", hex: "#B56576" },
      { name: "Silver Blue", hex: "#B0C4DE" },
      { name: "Soft Plum", hex: "#9D8189" },
    ],
    avoid: [
      { name: "Warm Apricot", hex: "#F4A261" },
      { name: "Golden Yellow", hex: "#E9C46A" },
      { name: "Orange Brown", hex: "#D97706" },
      { name: "Warm Mustard", hex: "#A16207" },
      { name: "Camel Gold", hex: "#C19A6B" },
    ],
    jewelryWarm: "Илүү зохимжтой нь silver, white gold, platinum.",
    jewelryCool: "Silver, platinum, white gold төрлийн гоёл илүү зохино.",
    makeupSoft: "Rose pink, mauve, muted berry nude өнгө тохиромжтой.",
    makeupBalanced: "Rose mauve, soft berry, cool nude өнгө тохиромжтой.",
    makeupBright: "Cool rose, refined berry pink, cool mauve lip тохиромжтой.",
    hairLight: "Soft ash brown, light ash mocha, cool beige brown.",
    hairMedium: "Ash brown, cool mocha, soft espresso.",
    hairDeep: "Cool espresso, ash dark brown, muted charcoal brown.",
    advice:
      "Хэт шаргал, алтлаг, улбар шарлаг өнгөнөөс зайлсхийвэл илүү тэнцвэртэй харагдана.",
  },
  "Deep Autumn": {
    best: [
      { name: "Olive", hex: "#6B8E23" },
      { name: "Rust", hex: "#B85C38" },
      { name: "Chocolate", hex: "#5C4033" },
      { name: "Deep Teal", hex: "#2A6F6B" },
      { name: "Warm Brown", hex: "#8C5E3C" },
      { name: "Espresso", hex: "#7A4E2D" },
      { name: "Burnt Orange", hex: "#CC5500" },
      { name: "Moss Green", hex: "#556B2F" },
      { name: "Bronze", hex: "#CD7F32" },
      { name: "Cinnamon", hex: "#8B5A2B" },
    ],
    avoid: [
      { name: "Ice Blue", hex: "#E0E7FF" },
      { name: "Cool Lavender", hex: "#D8B4FE" },
      { name: "Pure White", hex: "#F5F5F5" },
      { name: "Pale Mist", hex: "#DDE7F0" },
      { name: "Icy Pink", hex: "#F8E1E7" },
    ],
    jewelryWarm: "Gold, bronze, antique gold төрлийн гоёл илүү зохино.",
    jewelryCool: "Bronze, antique gold, dark gold илүү тэнцвэртэй харагдана.",
    makeupSoft: "Soft terracotta, muted cinnamon, warm nude brown.",
    makeupBalanced: "Terracotta, brick, cinnamon, warm brown.",
    makeupBright:
      "Rich terracotta, spiced brick, burnt cinnamon lip тохиромжтой.",
    hairLight: "Light chestnut, warm hazel brown, cinnamon brown.",
    hairMedium: "Chocolate brown, warm espresso, chestnut.",
    hairDeep: "Deep espresso, dark chocolate, rich chestnut brown.",
    advice: "Хэт цайвар, мөстэй, хүйтэн өнгө таны төрхийг сулруулж магадгүй.",
  },
  "Clear Winter": {
    best: [
      { name: "Black", hex: "#111111" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Cobalt Blue", hex: "#0077B6" },
      { name: "Magenta", hex: "#D81B60" },
      { name: "Royal Blue", hex: "#1D4ED8" },
      { name: "Bright Violet", hex: "#7C3AED" },
      { name: "Emerald", hex: "#0F9D58" },
      { name: "Fuchsia", hex: "#C2185B" },
      { name: "True Red", hex: "#D62828" },
      { name: "Icy Pink", hex: "#F7D6E0" },
    ],
    avoid: [
      { name: "Warm Beige", hex: "#C2B280" },
      { name: "Camel", hex: "#C19A6B" },
      { name: "Muted Olive", hex: "#A3B18A" },
      { name: "Soft Sand", hex: "#D8C3A5" },
      { name: "Warm Taupe", hex: "#B08968" },
    ],
    jewelryWarm: "White gold, silver давамгай байвал илүү цэвэр харагдана.",
    jewelryCool: "Silver, platinum, white gold төрлийн тод гоёл илүү зохино.",
    makeupSoft: "Cool rose, soft berry, cool pink nude.",
    makeupBalanced: "Berry, plum, cool red, cool pink.",
    makeupBright: "Clear berry, fuchsia pink, blue-based red lip тохиромжтой.",
    hairLight: "Cool dark blonde-brown, ash brown, smoky mocha.",
    hairMedium: "Dark ash brown, cool espresso, blue-black brown.",
    hairDeep: "Cool black, blue-black, deep ash espresso.",
    advice:
      "Хэт бүдэг, дулаан, шаварлаг өнгөнөөс зайлсхийвэл илүү тод харагдана.",
  },
};

function scoreColorForTraits(
  color: ColorItem,
  traits: { depth: Depth; chroma: Chroma; contrast: Contrast },
) {
  const name = color.name.toLowerCase();
  let score = 0;

  if (traits.depth === "light") {
    if (
      name.includes("light") ||
      name.includes("peach") ||
      name.includes("apricot") ||
      name.includes("powder") ||
      name.includes("icy") ||
      name.includes("white")
    ) {
      score += 2;
    }
    if (
      name.includes("deep") ||
      name.includes("espresso") ||
      name.includes("black") ||
      name.includes("chocolate")
    ) {
      score -= 2;
    }
  }

  if (traits.depth === "deep") {
    if (
      name.includes("deep") ||
      name.includes("espresso") ||
      name.includes("black") ||
      name.includes("chocolate") ||
      name.includes("royal") ||
      name.includes("cobalt")
    ) {
      score += 2;
    }
    if (
      name.includes("light") ||
      name.includes("powder") ||
      name.includes("icy")
    ) {
      score -= 1;
    }
  }

  if (traits.chroma === "bright") {
    if (
      name.includes("bright") ||
      name.includes("clear") ||
      name.includes("cobalt") ||
      name.includes("coral") ||
      name.includes("magenta") ||
      name.includes("true red") ||
      name.includes("sun")
    ) {
      score += 2;
    }
    if (
      name.includes("soft") ||
      name.includes("dusty") ||
      name.includes("muted")
    ) {
      score -= 2;
    }
  }

  if (traits.chroma === "soft") {
    if (
      name.includes("soft") ||
      name.includes("dusty") ||
      name.includes("muted") ||
      name.includes("rose beige") ||
      name.includes("mauve")
    ) {
      score += 2;
    }
    if (
      name.includes("bright") ||
      name.includes("clear") ||
      name.includes("true red")
    ) {
      score -= 2;
    }
  }

  if (traits.contrast === "high") {
    if (
      name.includes("black") ||
      name.includes("white") ||
      name.includes("cobalt") ||
      name.includes("royal") ||
      name.includes("magenta")
    ) {
      score += 2;
    }
  }

  if (traits.contrast === "low") {
    if (
      name.includes("soft") ||
      name.includes("dusty") ||
      name.includes("powder") ||
      name.includes("rose beige")
    ) {
      score += 2;
    }
  }

  return score;
}

function buildHybridPalette(ai: AIAnalysis): Analysis {
  const pool = seasonColorPools[ai.season];

  const sortedBest = [...pool.best].sort((a, b) => {
    return (
      scoreColorForTraits(b, {
        depth: ai.depth,
        chroma: ai.chroma,
        contrast: ai.contrast,
      }) -
      scoreColorForTraits(a, {
        depth: ai.depth,
        chroma: ai.chroma,
        contrast: ai.contrast,
      })
    );
  });

  const bestColors = sortedBest.slice(0, 6);
  const avoidColors = pool.avoid.slice(0, 4);

  const jewelry = ai.undertone === "Warm" ? pool.jewelryWarm : pool.jewelryCool;

  const makeup =
    ai.chroma === "bright"
      ? pool.makeupBright
      : ai.chroma === "soft"
        ? pool.makeupSoft
        : pool.makeupBalanced;

  const hair =
    ai.depth === "light"
      ? pool.hairLight
      : ai.depth === "deep"
        ? pool.hairDeep
        : pool.hairMedium;

  const outfits = [
    `${bestColors[0].name} дээд + ${bestColors[1].name} акцент`,
    `${bestColors[2].name} цамц + ${bestColors[3].name} доод`,
    `${bestColors[4].name} гадуур + ${bestColors[0].name} detail`,
    `${bestColors[1].name} knit + ${bestColors[5].name} trouser`,
  ];

  return {
    season: ai.season,
    undertone: ai.undertone,
    confidence: ai.confidence,
    summary: ai.summary,
    contrast: ai.contrast,
    chroma: ai.chroma,
    depth: ai.depth,
    bestColors,
    avoidColors,
    outfits,
    jewelry,
    makeup,
    hair,
    advice: pool.advice,
    why: ai.why,
    quality: ai.quality,
    confidenceBreakdown: ai.confidenceBreakdown,
  };
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const answersRaw = formData.get("answers") as string | null;

    if (!file) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const answers = answersRaw ? JSON.parse(answersRaw) : {};

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = file.type || "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${base64}`;

    const prompt = `
You are analyzing a user's personal color palette from a face/chest portrait.
Be careful and conservative. Lighting may be imperfect.
Use both the image and the quiz answers.

Return ONLY valid JSON with this exact shape:
{
  "season": "...",
  "undertone": "...",
  "contrast": "...",
  "chroma": "...",
  "depth": "...",
  "confidence": number,
  "summary": string,
  "why": string[],
  "quality": string,
  "confidenceBreakdown": string[]
}

Quiz answers:
${JSON.stringify(answers, null, 2)}

Rules:
- Choose only one season from the allowed list.
- Confidence must be between 70 and 95.
- Summary should be 2-4 Mongolian sentences.
- Consider visible skin undertone, facial contrast, depth, chroma, hair/eye contrast if visible, and the quiz.
- If image quality is poor, lower confidence.
- "why" should contain 3-5 short bullet explanations in Mongolian.
- Each item should explain WHY this result was chosen (skin tone, contrast, undertone, quiz answers, etc.)
- "quality" should describe image quality (lighting, clarity, visibility)
- "confidenceBreakdown" should contain 3-5 short reasons explaining the confidence score
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: dataUrl,
                  detail: "high",
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: "OpenAI request failed", detail: text },
        { status: 500 },
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "No model output" }, { status: 500 });
    }

    const parsed = JSON.parse(content) as AIAnalysis;
    const finalResult = buildHybridPalette(parsed);

    return NextResponse.json(finalResult);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unexpected server error",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
