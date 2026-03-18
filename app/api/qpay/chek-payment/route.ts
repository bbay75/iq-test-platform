import { NextRequest, NextResponse } from "next/server";

async function getAccessToken() {
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
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data.access_token;
}

export async function POST(req: NextRequest) {
  const { invoiceId } = await req.json();

  const token = await getAccessToken();

  const res = await fetch("https://merchant-sandbox.qpay.mn/v2/payment/check", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      object_type: "INVOICE",
      object_id: invoiceId,
      offset: {
        page_number: 1,
        page_limit: 100,
      },
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data }, { status: res.status });
  }

  const paid = Array.isArray(data.rows)
    ? data.rows.some(
        (row: { payment_status?: string }) => row.payment_status === "PAID",
      )
    : false;

  return NextResponse.json({ paid, raw: data });
}
