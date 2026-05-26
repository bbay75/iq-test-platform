import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "OPENAI_API_KEY missing",
        },
        { status: 500 },
      );
    }

    const body = await req.json();
    const { imageUrl, resultId } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl missing" }, { status: 400 });
    }

    if (!resultId) {
      return NextResponse.json({ error: "resultId missing" }, { status: 400 });
    }

    const openaiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text: `
You are a professional personal color analyst.

Analyze the person's facial coloring from the uploaded image.

Return ONLY pure JSON.
No explanation.
No markdown.
No text before or after JSON.

Use exactly this schema:
{
  "season": "string",
  "undertone": "string",
  "confidence": 0,
  "summary": "string",
  "bestColors": ["string"],
  "avoidColors": ["string"],
  "outfits": ["string"],
  "jewelry": "string",
  "makeup": "string",
  "hair": "string",
  "advice": "string"
}
                `.trim(),
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: "Analyze this image for personal color",
              },
              {
                type: "input_image",
                image_url: imageUrl,
                detail: "low",
              },
            ],
          },
        ],
      }),
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      return NextResponse.json(
        {
          error: "OpenAI request failed",
          detail: data?.error?.message || JSON.stringify(data),
        },
        { status: openaiRes.status },
      );
    }

    const outputText =
      data.output_text ||
      data.output
        ?.flatMap((item: any) => item.content || [])
        ?.map((c: any) => c.text || "")
        ?.join("") ||
      "";

    if (!outputText) {
      return NextResponse.json(
        { error: "Model returned empty output" },
        { status: 500 },
      );
    }

    const cleanText = outputText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleanText);
    } catch {
      return NextResponse.json(
        {
          error: "Invalid JSON from AI",
          raw: cleanText,
        },
        { status: 500 },
      );
    }

    const normalizedConfidence =
      typeof parsed.confidence === "number"
        ? parsed.confidence > 1
          ? parsed.confidence / 100
          : parsed.confidence
        : 0;

    const finalResult = {
      ...parsed,
      confidence: normalizedConfidence,
    };

    const score =
      typeof normalizedConfidence === "number"
        ? Math.round(normalizedConfidence * 100)
        : null;

    const { supabaseAdmin } = await import("@/lib/supabaseAdmin");

    const { error: updateError } = await supabaseAdmin
      .from("test_results")
      .update({
        result_json: finalResult,
        score,
      })
      .eq("id", resultId);

    if (updateError) {
      return NextResponse.json(
        {
          error: "Failed to save result",
          detail: updateError.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(finalResult);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unexpected server error",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
