import { NextResponse } from "next/server";

export async function POST() {
  const auth = Buffer.from(
    `${process.env.QPAY_CLIENT_ID}:${process.env.QPAY_CLIENT_SECRET}`,
  ).toString("base64");

  const res = await fetch("https://merchant-sandbox.qpay.mn/v2/auth/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data }, { status: res.status });
  }

  return NextResponse.json(data);
}
