import { NextRequest, NextResponse } from "next/server";

// ── Fallback chain: coba satu per satu kalau quota habis ──────────────────────
// Urutan: paling umum → paling ringan (semua masih aktif 2025)
const GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite-preview-06-17",
];

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

async function callGeminiWithFallback(prompt: string, apiKey: string): Promise<string> {
  let lastError = "";

  for (const model of GEMINI_MODELS) {
    const url = `${GEMINI_BASE}/${model}:generateContent?key=${apiKey}`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
        }),
      });

      const data = await res.json();

      // Kalau 429 (quota habis) → coba model berikutnya
      if (res.status === 429) {
        lastError = `[${model}] quota habis`;
        console.warn(`⚠️ ${lastError}, mencoba model berikutnya...`);
        continue;
      }

      // Error lain (401, 400, dll) → langsung gagal, jangan coba model lain
      if (!res.ok) {
        const errMsg = data?.error?.message ?? `HTTP ${res.status}`;
        throw new Error(`[${model}] ${errMsg}`);
      }

      const raw: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      if (!raw) throw new Error(`[${model}] Respons kosong`);

      // Log model yang berhasil (opsional, untuk debugging)
      console.log(`✅ Berhasil menggunakan model: ${model}`);
      return raw;

    } catch (err: unknown) {
      // Kalau error bukan quota, langsung lempar
      const msg = err instanceof Error ? err.message : String(err);
      if (!msg.includes("quota habis")) throw err;
      lastError = msg;
    }
  }

  // Semua model habis quota
  throw new Error(`Semua model Gemini quota habis. Detail: ${lastError}`);
}

// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt wajib diisi" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY belum diset di .env.local" },
        { status: 500 }
      );
    }

    const raw = await callGeminiWithFallback(prompt, apiKey);

    // Ekstrak JSON dari dalam ```json ... ``` atau langsung
    const jsonMatch =
      raw.match(/```json\s*([\s\S]*?)```/) ||
      raw.match(/```\s*([\s\S]*?)```/) ||
      raw.match(/(\{[\s\S]*\})/);

    const cleaned = jsonMatch ? jsonMatch[1].trim() : raw.trim();

    // Validasi JSON sebelum kirim
    try {
      JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: `Model tidak mengembalikan JSON valid. Output: ${raw.substring(0, 300)}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ result: cleaned });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}