import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "GROQ_API_KEY tidak ditemukan di .env.local" },
      { status: 500 }
    );
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt kosong" }, { status: 400 });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "Kamu adalah pakar keamanan siber profesional. Kamu hanya boleh merespons dalam format JSON murni. Jangan berikan penjelasan teks di luar JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || "Groq API Error" },
        { status: response.status }
      );
    }

    // Ambil string JSON dari hasil Groq
    const result = data.choices[0]?.message?.content;

    return NextResponse.json({ result });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Gagal terhubung ke server analisis" },
      { status: 500 }
    );
  }
}