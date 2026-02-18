import { NextResponse } from "next/server";

const GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite-preview-06-17",
];

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      status: "❌ GAGAL",
      error: "GEMINI_API_KEY tidak ditemukan di .env.local",
    });
  }

  const results: Record<string, string> = {};

  for (const model of GEMINI_MODELS) {
    const url = `${GEMINI_BASE}/${model}:generateContent?key=${apiKey}`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Balas dengan kata: BERHASIL" }] }],
          generationConfig: { maxOutputTokens: 10 },
        }),
      });

      const data = await res.json();

      if (res.status === 429) {
        results[model] = "❌ Quota habis (429)";
        continue;
      }

      if (!res.ok) {
        results[model] = `❌ Error ${res.status}: ${data?.error?.message ?? "unknown"}`;
        continue;
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "(kosong)";
      results[model] = `✅ OK — "${text.trim()}"`;

    } catch (err: unknown) {
      results[model] = `❌ Network error: ${String(err)}`;
    }
  }

  // Tentukan model aktif pertama yang berhasil
  const activeModel = Object.entries(results).find(([, v]) => v.startsWith("✅"))?.[0] ?? null;

  return NextResponse.json({
    status: activeModel ? "✅ SIAP" : "❌ SEMUA MODEL GAGAL",
    activeModel: activeModel ?? "tidak ada",
    modelStatus: results,
  });
}