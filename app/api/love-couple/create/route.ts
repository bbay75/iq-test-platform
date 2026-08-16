import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const person1Name = String(body.person1Name ?? "").trim();
    const person2Name = String(body.person2Name ?? "").trim();
    const person1Answers = body.person1Answers;

    if (!person1Name) {
      return NextResponse.json(
        { error: "person1Name is required" },
        { status: 400 },
      );
    }

    if (
      !Array.isArray(person1Answers) ||
      person1Answers.length !== 30 ||
      person1Answers.some(
        (answer) => !Number.isInteger(answer) || answer < 1 || answer > 5,
      )
    ) {
      return NextResponse.json(
        { error: "30 valid answers are required" },
        { status: 400 },
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Supabase server configuration missing" },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // Person 1-ийн login / anonymous session token
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Invalid authentication" },
        { status: 401 },
      );
    }

    const { data, error } = await supabase
      .from("love_couple_sessions")
      .insert({
        person1_user_id: user.id,
        person1_name: person1Name,
        person2_name: person2Name || null,
        person1_answers: person1Answers,
        person1_completed: true,
        person2_completed: false,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Love couple create error:", error);

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      sessionId: data.id,
      invitePath: `/love-test/couple/${data.id}`,
    });
  } catch (error) {
    console.error("Love couple create error:", error);

    return NextResponse.json(
      { error: "Failed to create couple session" },
      { status: 500 },
    );
  }
}
