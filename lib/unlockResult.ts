export type UnlockMode = "credit" | "paid_demo";

function getOrCreateDeviceId() {
  if (typeof window === "undefined") {
    return null;
  }

  let deviceId = localStorage.getItem("test_device_id");

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("test_device_id", deviceId);
  }

  return deviceId;
}

export async function unlockResult(
  resultId: string,
  mode: UnlockMode = "paid_demo",
) {
  const deviceId = getOrCreateDeviceId();

  if (!deviceId) {
    throw new Error("Device ID үүсгэж чадсангүй.");
  }

  const response = await fetch("/api/unlock", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resultId,
      mode,
      deviceId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail || data?.error || "Үр дүн нээхэд алдаа гарлаа.",
    );
  }

  return data;
}
