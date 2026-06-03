import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Supabase server env missing" },
        { status: 500 },
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json();

    const {
      test_type,
      result_json,
      score,
      is_unlocked = false,
      image_url = null,
      device_id = null,
      user_id = null,
    } = body;

    if (!test_type) {
      return NextResponse.json({ error: "test_type missing" }, { status: 400 });
    }

    if (!result_json) {
      return NextResponse.json(
        { error: "result_json missing" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("test_results")
      .insert({
        user_id,
        device_id,
        test_type,
        result_json,
        score,
        is_unlocked,
        image_url,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
          details: error,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
