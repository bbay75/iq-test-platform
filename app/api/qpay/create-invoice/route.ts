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
  const { amount, description, resultId } = await req.json();

  const token = await getAccessToken();

  const senderInvoiceNo = `result_${resultId}_${Date.now()}`;

  const res = await fetch("https://merchant-sandbox.qpay.mn/v2/invoice", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      invoice_code: process.env.QPAY_INVOICE_CODE,
      sender_invoice_no: senderInvoiceNo,
      invoice_receiver_code: "web-user",
      invoice_description: description,
      amount,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/qpay/callback?resultId=${resultId}`,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data }, { status: res.status });
  }

  return NextResponse.json(data);
}
