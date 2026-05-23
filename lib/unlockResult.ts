import { supabase } from "@/lib/supabase";

function getDeviceId() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("test_device_id");
}

export async function unlockResult(resultId: string) {
  const deviceId = getDeviceId();

  if (!deviceId) {
    throw new Error("Device ID олдсонгүй.");
  }

  const { data, error } = await supabase
    .from("test_results")
    .update({ is_unlocked: true })
    .eq("id", resultId)
    .eq("device_id", deviceId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    result: data,
    profile: null,
  };
}
