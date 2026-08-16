import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { buildPairLoveResult } from "@/data/loveCalculator";
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase server configuration missing");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function GET(
  _req: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Session id is required" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("love_couple_sessions")
      .select(
        `
        id,
        person1_name,
        person2_name,
        person1_completed,
        person2_completed,
         result_unlocked,
          result_id,
        result_json,
        created_at
       
        `,
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Love couple session fetch error:", error);

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({
      session: data,
    });
  } catch (error) {
    console.error("Love couple session fetch error:", error);

    return NextResponse.json(
      { error: "Failed to load couple session" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const person2Name = String(body.person2Name ?? "").trim();

    const person2Answers = body.person2Answers;

    if (!id) {
      return NextResponse.json(
        { error: "Session id is required" },
        { status: 400 },
      );
    }

    if (!person2Name) {
      return NextResponse.json(
        { error: "person2Name is required" },
        { status: 400 },
      );
    }

    if (
      !Array.isArray(person2Answers) ||
      person2Answers.length !== 30 ||
      person2Answers.some(
        (answer) => !Number.isInteger(answer) || answer < 1 || answer > 5,
      )
    ) {
      return NextResponse.json(
        { error: "30 valid answers are required" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: session, error: fetchError } = await supabase
      .from("love_couple_sessions")
      .select(
        `
    id,
    person1_user_id,
    person1_name,
    person1_answers,
    person1_completed,
    person2_completed,
    result_json
  `,
      )
      .eq("id", id)
      .maybeSingle();

    if (fetchError) {
      console.error("Love couple fetch before submit error:", fetchError);

      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (!session.person1_completed) {
      return NextResponse.json(
        { error: "Person 1 has not completed the test" },
        { status: 409 },
      );
    }

    if (session.person2_completed) {
      return NextResponse.json(
        {
          error: "This couple session is already completed",
          result: session.result_json,
        },
        { status: 409 },
      );
    }

    const person1Answers = Array.isArray(session.person1_answers)
      ? session.person1_answers
      : [];

    if (person1Answers.length !== 30) {
      return NextResponse.json(
        { error: "Person 1 answers are incomplete" },
        { status: 409 },
      );
    }

    const result = buildPairLoveResult(
      session.person1_name,
      person2Name,
      person1Answers,
      person2Answers,
    );

    const { data: updatedSession, error: updateError } = await supabase
      .from("love_couple_sessions")
      .update({
        person2_name: person2Name,
        person2_answers: person2Answers,
        person2_completed: true,
        result_json: result,
      })
      .eq("id", id)
      .select(
        `
          id,
          person1_name,
          person2_name,
          person1_completed,
          person2_completed,
          result_json
          `,
      )
      .single();

    if (updateError) {
      console.error("Love couple submit error:", updateError);

      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    if (!session.person1_user_id) {
      return NextResponse.json(
        { error: "Person 1 user id is missing" },
        { status: 409 },
      );
    }

    const pairResultForStorage = {
      ...result,
      mode: "both",
      coupleSessionId: id,
      person1Name: session.person1_name,
      person2Name: person2Name,
    };
    console.log("PAIR RESULT OWNER:", session.person1_user_id);
    const { data: savedResult, error: saveResultError } = await supabase

      .from("test_results")
      .insert({
        user_id: session.person1_user_id,
        test_type: "love",
        score: result.finalScore,
        result_json: pairResultForStorage,
        is_unlocked: false,
      })
      .select("id")
      .single();

    if (saveResultError) {
      console.error("Love pair result save error:", saveResultError);

      return NextResponse.json(
        { error: saveResultError.message },
        { status: 500 },
      );
    }

    const { error: resultLinkError } = await supabase
      .from("love_couple_sessions")
      .update({
        result_id: savedResult.id,
      })
      .eq("id", id);

    if (resultLinkError) {
      console.error(
        "Love couple result id save error:",
        resultLinkError.message,
      );

      return NextResponse.json(
        { error: resultLinkError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      completed: true,
      session: updatedSession,
      result,
      resultId: savedResult.id,
    });
  } catch (error) {
    console.error("Love couple submit error:", error);

    return NextResponse.json(
      { error: "Failed to submit couple answers" },
      { status: 500 },
    );
  }
}
