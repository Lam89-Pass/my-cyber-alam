import { NextResponse } from "next/server";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      status: "❌ GAGAL",
      error: "GEMINI_API_KEY tidak ditemukan di .env.local",
    });
  }

  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Balas dengan kata: BERHASIL" }] }],
        generationConfig: { maxOutputTokens: 10 },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ status: "❌ GAGAL", httpStatus: res.status, error: data });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return NextResponse.json({ status: "✅ BERHASIL", geminiResponse: text });
  } catch (err: unknown) {
    return NextResponse.json({ status: "❌ NETWORK ERROR", error: String(err) });
  }
}