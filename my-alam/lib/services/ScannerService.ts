import { IScanResult, IScanService, ScanStatus, ScanType } from "@/types";

// ─── ScannerService Class (OOP) ────────────────────────────────────────────────
export class ScannerService implements IScanService {
  private readonly apiRoute = "/api/scan";

  private async callAPI(prompt: string): Promise<string> {
    const response = await fetch(this.apiRoute, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error ?? `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.result ?? "";
  }

  private buildUrlPrompt(url: string): string {
    return `Kamu adalah sistem keamanan siber profesional. Analisis URL berikut dan berikan laporan keamanan dalam format JSON yang ketat (tidak ada teks di luar JSON):

URL: ${url}

Kembalikan HANYA JSON ini:
{
  "status": "AMAN | BERBAHAYA | MENCURIGAKAN",
  "riskScore": <angka 0-100>,
  "category": "<kategori: Phishing, Malware Distributor, Safe Website, Suspicious Redirect, dll>",
  "domain": "<nama domain>",
  "ssl": "<Ada | Tidak Ada | Expired>",
  "redirects": "<jumlah redirect>",
  "ipReputation": "<Bersih | Listed di Blacklist | Tidak Diketahui>",
  "summary": "<penjelasan 2-3 kalimat dalam Bahasa Indonesia>",
  "indicators": ["<indicator 1>", "<indicator 2>", "<indicator 3>"],
  "recommendation": "<saran dalam Bahasa Indonesia>"
}`;
  }

  private buildFilePrompt(fileName: string, fileSize: number): string {
    const sizeMB = (fileSize / 1024 / 1024).toFixed(2);
    return `Kamu adalah sistem keamanan siber profesional. Analisis file berikut dan berikan laporan dalam format JSON ketat:

File: ${fileName} (${sizeMB} MB)

Kembalikan HANYA JSON ini:
{
  "status": "AMAN | BERBAHAYA | MENCURIGAKAN",
  "riskScore": <angka 0-100>,
  "category": "<kategori: Malware, Adware, Spyware, Clean, Potentially Unwanted Program, Ransomware, dll>",
  "fileType": "<jenis file berdasarkan ekstensi>",
  "dangerousPermissions": ["<permission berbahaya jika APK>"],
  "summary": "<penjelasan 2-3 kalimat dalam Bahasa Indonesia>",
  "indicators": ["<indicator 1>", "<indicator 2>", "<indicator 3>"],
  "recommendation": "<saran dalam Bahasa Indonesia>"
}`;
  }

  async scanUrl(url: string): Promise<IScanResult> {
    const raw = await this.callAPI(this.buildUrlPrompt(url));
    const parsed = JSON.parse(raw);
    return { ...parsed, status: parsed.status as ScanStatus, type: ScanType.URL, inputRef: url, scannedAt: new Date() };
  }

  async scanFile(fileName: string, fileSize: number): Promise<IScanResult> {
    const raw = await this.callAPI(this.buildFilePrompt(fileName, fileSize));
    const parsed = JSON.parse(raw);
    return { ...parsed, status: parsed.status as ScanStatus, type: ScanType.FILE, inputRef: fileName, scannedAt: new Date() };
  }

  static getRiskColorClass(score: number): string {
    if (score < 30) return "green";
    if (score > 65) return "red";
    return "yellow";
  }

  static getBadgeClass(status: ScanStatus): string {
    const map: Record<ScanStatus, string> = {
      [ScanStatus.AMAN]: "badge-safe",
      [ScanStatus.BERBAHAYA]: "badge-danger",
      [ScanStatus.MENCURIGAKAN]: "badge-warn",
    };
    return map[status] ?? "badge-warn";
  }

  static getStatusIcon(status: ScanStatus): string {
    const map: Record<ScanStatus, string> = {
      [ScanStatus.AMAN]: "✅",
      [ScanStatus.BERBAHAYA]: "🚨",
      [ScanStatus.MENCURIGAKAN]: "⚠️",
    };
    return map[status] ?? "⚠️";
  }
}

export const scannerService = new ScannerService();