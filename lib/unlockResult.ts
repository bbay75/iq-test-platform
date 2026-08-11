export type UnlockMode = "credit" | "paid_demo";

function getDeviceId() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("test_device_id");
}

export async function unlockResult(
  resultId: string,
  mode: UnlockMode = "paid_demo",
) {
  const deviceId = getDeviceId();

  if (!deviceId) {
    throw new Error("Device ID олдсонгүй.");
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
