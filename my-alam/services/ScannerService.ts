import { IScanResult, IScanService, ScanStatus, ScanType } from "../../my-alam/types";

// ─── ScannerService Class (OOP) ────────────────────────────────────────────────
export class ScannerService implements IScanService {
  private readonly apiUrl = "https://api.anthropic.com/v1/messages";
  private readonly model = "claude-sonnet-4-20250514";
  private readonly maxTokens = 1000;

  // ── Private: call Claude AI ──────────────────────────────────────────────────
  private async callAI(prompt: string): Promise<string> {
    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this.model,
        max_tokens: this.maxTokens,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const data = await response.json();
    const raw = data.content?.map((b: { text?: string }) => b.text ?? "").join("") ?? "";
    return raw.replace(/```json|```/g, "").trim();
  }

  // ── Private: build URL prompt ────────────────────────────────────────────────
  private buildUrlPrompt(url: string): string {
    return `Kamu adalah sistem keamanan siber profesional. Analisis URL berikut dan berikan laporan keamanan dalam format JSON yang ketat (tidak ada teks di luar JSON):

URL: ${url}

Kembalikan HANYA JSON ini (tidak ada komentar, tidak ada markdown):
{
  "status": "AMAN | BERBAHAYA | MENCURIGAKAN",
  "riskScore": <angka 0-100>,
  "category": "<kategori: Phishing, Malware Distributor, Safe Website, Suspicious Redirect, dll>",
  "domain": "<nama domain>",
  "ssl": "<Ada | Tidak Ada | Expired>",
  "redirects": "<jumlah redirect, misal: 0, 1, 3>",
  "ipReputation": "<Bersih | Listed di Blacklist | Tidak Diketahui>",
  "summary": "<penjelasan singkat 2-3 kalimat dalam Bahasa Indonesia>",
  "indicators": ["<indicator 1>", "<indicator 2>", "<indicator 3>"],
  "recommendation": "<saran tindakan dalam Bahasa Indonesia>"
}`;
  }

  // ── Private: build File prompt ───────────────────────────────────────────────
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
  "dangerousPermissions": ["<permission berbahaya jika APK, kosong [] jika bukan APK>"],
  "summary": "<penjelasan 2-3 kalimat dalam Bahasa Indonesia>",
  "indicators": ["<indicator 1>", "<indicator 2>", "<indicator 3>"],
  "recommendation": "<saran dalam Bahasa Indonesia>"
}`;
  }

  // ── Public: Scan URL ─────────────────────────────────────────────────────────
  async scanUrl(url: string): Promise<IScanResult> {
    const prompt = this.buildUrlPrompt(url);
    const raw = await this.callAI(prompt);
    const parsed = JSON.parse(raw);

    return {
      ...parsed,
      status: parsed.status as ScanStatus,
      type: ScanType.URL,
      inputRef: url,
      scannedAt: new Date(),
    };
  }

  // ── Public: Scan File ────────────────────────────────────────────────────────
  async scanFile(fileName: string, fileSize: number): Promise<IScanResult> {
    const prompt = this.buildFilePrompt(fileName, fileSize);
    const raw = await this.callAI(prompt);
    const parsed = JSON.parse(raw);

    return {
      ...parsed,
      status: parsed.status as ScanStatus,
      type: ScanType.FILE,
      inputRef: fileName,
      scannedAt: new Date(),
    };
  }

  // ── Utility: get risk color class ────────────────────────────────────────────
  static getRiskColorClass(score: number): string {
    if (score < 30) return "green";
    if (score > 65) return "red";
    return "yellow";
  }

  // ── Utility: get badge class ─────────────────────────────────────────────────
  static getBadgeClass(status: ScanStatus): string {
    const map: Record<ScanStatus, string> = {
      [ScanStatus.AMAN]: "badge-safe",
      [ScanStatus.BERBAHAYA]: "badge-danger",
      [ScanStatus.MENCURIGAKAN]: "badge-warn",
    };
    return map[status] ?? "badge-warn";
  }

  // ── Utility: get status icon ─────────────────────────────────────────────────
  static getStatusIcon(status: ScanStatus): string {
    const map: Record<ScanStatus, string> = {
      [ScanStatus.AMAN]: "✅",
      [ScanStatus.BERBAHAYA]: "🚨",
      [ScanStatus.MENCURIGAKAN]: "⚠️",
    };
    return map[status] ?? "⚠️";
  }
}

// ── Singleton instance (pakai di seluruh app) ──────────────────────────────────
export const scannerService = new ScannerService();