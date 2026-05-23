import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const supabaseAuth = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

export async function POST(req: Request) {
  console.log("🔥 UNLOCK API CALLED");
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "No auth token" }, { status: 401 });
    }

    const {
      data: { user },
      error: authError,
    } = await supabaseAuth.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Invalid user" }, { status: 401 });
    }

    const body = await req.json();
    const { resultId, mode } = body as {
      resultId?: string;
      mode?: "credit" | "paid_demo";
    };

    if (!resultId || !mode) {
      return NextResponse.json(
        { error: "Missing resultId or mode" },
        { status: 400 },
      );
    }

    const { data: result, error: resultError } = await supabaseAdmin
      .from("test_results")
      .select("*")
      .eq("id", resultId)
      .eq("user_id", user.id)
      .single();

    if (resultError || !result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    if (result.is_unlocked) {
      return NextResponse.json({
        result,
        profile: null,
      });
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const isProTest = result.test_type === "personal-color";

    let nextCredits = profile.free_credits ?? 0;
    let nextProgress = profile.reward_progress ?? 0;

    if (mode === "credit") {
      if (isProTest) {
        return NextResponse.json(
          { error: "This is a Pro test. Free credit not allowed." },
          { status: 400 },
        );
      }

      if (nextCredits <= 0) {
        return NextResponse.json({ error: "No free credits" }, { status: 400 });
      }

      nextCredits -= 1;
    }

    if (mode === "paid_demo") {
      nextProgress += 1;

      if (nextProgress >= 3) {
        nextCredits += 1;
        nextProgress = 0;
      }
    }

    const { error: profileUpdateError } = await supabaseAdmin
      .from("profiles")
      .update({
        free_credits: nextCredits,
        reward_progress: nextProgress,
      })
      .eq("id", user.id);

    if (profileUpdateError) {
      return NextResponse.json(
        { error: profileUpdateError.message },
        { status: 500 },
      );
    }

    const { data: updatedResult, error: unlockError } = await supabaseAdmin
      .from("test_results")
      .update({ is_unlocked: true })
      .eq("id", resultId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (unlockError) {
      return NextResponse.json({ error: unlockError.message }, { status: 500 });
    }

    return NextResponse.json({
      result: updatedResult,
      profile: {
        free_credits: nextCredits,
        reward_progress: nextProgress,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
