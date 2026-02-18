import { IScanResult, IScanService, ScanStatus, ScanType } from "@/types";

export class ScannerService implements IScanService {

  private async callAI(prompt: string): Promise<string> {
    const response = await fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Server Error");
    return data.result ?? "";
  }

  private safeParse(raw: string): any {
    try {
      return JSON.parse(raw);
    } catch (e) {
      throw new Error("Gagal menganalisis data");
    }
  }

  // --- Prompt Builder ---
  private buildUrlPrompt(url: string): string {
    return `Analisis URL: ${url}. Kembalikan JSON: {"status":"AMAN|BERBAHAYA|MENCURIGAKAN","riskScore":0-100,"category":"...","domain":"...","ssl":"...","summary":"...","indicators":[],"recommendation":"..."}`;
  }

  private buildFilePrompt(fileName: string, fileSize: number): string {
    const sizeMB = (fileSize / 1024 / 1024).toFixed(2);
    return `Analisis file: ${fileName} (${sizeMB} MB). Kembalikan JSON: {"status":"AMAN|BERBAHAYA","riskScore":0-100,"category":"...","fileType":"...","summary":"...","indicators":[],"recommendation":"..."}`;
  }

  private buildPasswordPrompt(password: string): string {
    return `Kamu adalah ahli kriptografi. Analisis password ini: "${password}". 
    Berikan laporan dalam JSON ketat:
    {
      "status": "AMAN | BERBAHAYA | LEMAH",
      "riskScore": <0-100, makin tinggi makin bahaya/lemah>,
      "strength": "Sangat Lemah | Lemah | Sedang | Kuat | Sangat Kuat",
      "isLeaked": "Ya | Tidak | Mungkin",
      "leakedCount": "<perkiraan berapa banyak orang menggunakan, misal: 'Sangat Banyak' atau 'Unik'>",
      "entropy": "<bit entropy, misal: 45 bits>",
      "summary": "<penjelasan kekuatan password dan riwayat kebocoran dalam Bahasa Indonesia>",
      "indicators": ["<alasan 1>", "<alasan 2>"],
      "recommendation": "<saran perbaikan password>"
    }`;
  }

  // --- Public Methods ---
  async scanUrl(url: string): Promise<IScanResult> {
    const raw = await this.callAI(this.buildUrlPrompt(url));
    const parsed = this.safeParse(raw);
    return { ...parsed, type: ScanType.URL, inputRef: url, scannedAt: new Date() };
  }

  async scanFile(fileName: string, fileSize: number): Promise<IScanResult> {
    const raw = await this.callAI(this.buildFilePrompt(fileName, fileSize));
    const parsed = this.safeParse(raw);
    return { ...parsed, type: ScanType.FILE, inputRef: fileName, scannedAt: new Date() };
  }

  // Fitur Baru: Scan Password
  async scanPassword(password: string): Promise<IScanResult> {
    const raw = await this.callAI(this.buildPasswordPrompt(password));
    const parsed = this.safeParse(raw);
    return { 
      ...parsed, 
      type: "PASSWORD" as ScanType, // Pastikan di types/index.ts ada enum PASSWORD
      inputRef: "********", 
      scannedAt: new Date() 
    };
  }

  // Method lama yang dihapus untuk menjaga kebersihan kode
  async scanPhone(): Promise<any> { throw new Error("Fitur dihapus"); }
  async scanEmail(): Promise<any> { throw new Error("Fitur dihapus"); }

  static getRiskColorClass(score: number): string {
    if (score < 30) return "green";
    if (score > 65) return "red";
    return "yellow";
  }
}

export const scannerService = new ScannerService();