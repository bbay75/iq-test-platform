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
        {
          error: "Supabase env missing",
        },
        {
          status: 500,
        },
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const body = await req.json();

    const { resultId, mode, deviceId } = body as {
      resultId?: string;
      mode?: "credit" | "paid_demo";
      deviceId?: string;
    };

    if (!resultId || !mode || !deviceId) {
      return NextResponse.json(
        {
          error: "Missing resultId, mode or deviceId",
        },
        {
          status: 400,
        },
      );
    }

    /**
     * Result нь яг энэ device-ийнх мөн эсэхийг шалгана.
     */
    const { data: result, error: resultError } = await supabaseAdmin
      .from("test_results")
      .select("*")
      .eq("id", resultId)
      .maybeSingle();
    if (resultError) {
      return NextResponse.json(
        {
          error: resultError.message,
        },
        {
          status: 500,
        },
      );
    }

    if (!result) {
      return NextResponse.json(
        {
          error: "Result not found",
        },
        {
          status: 404,
        },
      );
    }

    /**
     * Аль хэдийн unlock болсон бол
     * дахин update хийх шаардлагагүй.
     */
    if (result.is_unlocked) {
      return NextResponse.json({
        result,
        profile: null,
      });
    }

    /**
     * Одоохондоо paid_demo:
     * шууд unlock.
     *
     * Credit/reward системийг дараа нь
     * device profile-тэй зөв холбоно.
     */
    if (mode === "paid_demo") {
      const { data: updatedResult, error: unlockError } = await supabaseAdmin
        .from("test_results")
        .update({
          is_unlocked: true,
        })
        .eq("id", resultId)
        .select("*")
        .maybeSingle();

      if (unlockError) {
        return NextResponse.json(
          {
            error: unlockError.message,
          },
          {
            status: 500,
          },
        );
      }

      if (!updatedResult) {
        return NextResponse.json(
          {
            error: "Result could not be unlocked",
          },
          {
            status: 404,
          },
        );
      }

      return NextResponse.json({
        result: updatedResult,
        profile: null,
      });
    }

    /**
     * Credit системийг user/profile login logic-тэй
     * хольж эвдэхгүй.
     */
    if (mode === "credit") {
      return NextResponse.json(
        {
          error: "Credit unlock is not configured for device mode yet.",
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        error: "Invalid unlock mode",
      },
      {
        status: 400,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Server error",
        detail: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      },
    );
  }
}
