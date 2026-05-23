import { supabase } from "@/lib/supabase";

type SaveResultInput = {
  test_type: string;
  result_json: any;
  score: number | null;
  is_unlocked?: boolean;
  image_url?: string | null;
};

function getDeviceId() {
  if (typeof window === "undefined") return null;

  const key = "test_device_id";
  let deviceId = localStorage.getItem(key);

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(key, deviceId);
  }

  return deviceId;
}

export async function saveTestResult({
  test_type,
  result_json,
  score,
  is_unlocked = false,
  image_url = null,
}: SaveResultInput) {
  let userId: string | null = null;

  // Login байхгүй үед crash хийхгүй
  const { data, error: userError } = await supabase.auth.getUser();

  if (!userError && data?.user) {
    userId = data.user.id;
  }

  const deviceId = getDeviceId();

  const { data: inserted, error } = await supabase
    .from("test_results")
    .insert({
      user_id: userId,
      device_id: deviceId,
      test_type,
      result_json,
      score,
      is_unlocked,
      image_url,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return inserted;
}
