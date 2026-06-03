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
  const deviceId = getDeviceId();

  const res = await fetch("/api/save-result", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      test_type,
      result_json,
      score,
      is_unlocked,
      image_url,
      device_id: deviceId,
      user_id: null,
    }),
  });

  let data: any = null;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new Error(data?.error || `Save failed: ${res.status}`);
  }

  return data;
}
