import { NextResponse } from 'next/server';
import { WebScanner } from '@/lib/services/WebScanner';

// Inisialisasi Scanner di luar handler (Global instance)
const scanner = new WebScanner();

export async function POST(request: Request) {
  try {
    const { targetUrl } = await request.json();

    if (!targetUrl) {
      return NextResponse.json({ error: 'Mohon masukkan URL yang valid.' }, { status: 400 });
    }

    // Panggil method OOP
    const result = await scanner.scan(targetUrl);

    return NextResponse.json({ success: true, data: result });

  } catch (error: any) {
    console.error("Scanning Error:", error);
    return NextResponse.json(
      { success: false, error: 'Gagal memindai URL. Pastikan URL aktif atau coba lagi nanti.' }, 
      { status: 500 }
    );
  }
}