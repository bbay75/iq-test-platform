import { supabase } from "@/lib/supabase";

export async function unlockResult(
  resultId: string,
  mode: "credit" | "paid_demo",
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("SESSION:", session); // 👈 debug

  const res = await fetch("/api/unlock", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token}`, // 👈 ЧУХАЛ
    },
    body: JSON.stringify({
      resultId,
      mode,
    }),
  });

  const data = await res.json();

  console.log("API RESPONSE:", data); // 👈 debug

  if (!res.ok) {
    throw new Error(data.error || "Unlock failed");
  }

  return data;
}
