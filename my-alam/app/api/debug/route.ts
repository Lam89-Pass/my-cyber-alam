import { NextRequest, NextResponse } from "next/server";

// ── Fallback chain: daftar model yang VALID dan tersedia di v1beta ──────────
const GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-1.5-pro",
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
          generationConfig: { 
            temperature: 0.1, 
            maxOutputTokens: 2048,
            response_mime_type: "application/json" // Memaksa AI kirim format JSON
          },
        }),
      });

      const data = await res.json();

      // Jika 429 (quota habis) atau 404 (model tidak ditemukan) -> coba model berikutnya
      if (res.status === 429 || res.status === 404) {
        lastError = `[${model}] ${res.status === 429 ? "quota habis" : "tidak ditemukan"}`;
        console.warn(`⚠️ ${lastError}, mencoba model berikutnya...`);
        continue;
      }

      if (!res.ok) {
        const errMsg = data?.error?.message ?? `HTTP ${res.status}`;
        throw new Error(`[${model}] ${errMsg}`);
      }

      const raw: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      if (!raw) throw new Error(`[${model}] Respons kosong`);

      console.log(`✅ Berhasil menggunakan model: ${model}`);
      return raw;

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      // Jika error bukan masalah kuota/model tidak ada, jangan lanjut looping
      if (!msg.includes("quota habis") && !msg.includes("404")) throw err;
      lastError = msg;
    }
  }

  throw new Error(`Semua model Gemini gagal. Detail terakhir: ${lastError}`);
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

    // Membersihkan karakter markdown jika AI tetap mengirimnya
    const cleaned = raw.replace(/```json|```/g, "").trim();

    // Validasi JSON
    try {
      JSON.parse(cleaned);
      return NextResponse.json({ result: cleaned });
    } catch {
      return NextResponse.json(
        { error: "Hasil dari AI bukan JSON valid", rawOutput: raw },
        { status: 500 }
      );
    }

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}