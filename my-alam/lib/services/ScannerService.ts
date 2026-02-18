import { IScanResult, IScanService, ScanStatus, ScanType } from "@/types";

export class ScannerService implements IScanService {
  private readonly apiRoute = "/api/scan";

  // ── Private: call internal API route ────────────────────────────────────────
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

  // ── Prompts ──────────────────────────────────────────────────────────────────
  private buildUrlPrompt(url: string): string {
    return `Kamu adalah sistem keamanan siber profesional. Analisis URL berikut dan berikan laporan keamanan dalam format JSON ketat (tidak ada teks di luar JSON):

URL: ${url}

Kembalikan HANYA JSON ini:
{
  "status": "AMAN | BERBAHAYA | MENCURIGAKAN",
  "riskScore": <angka 0-100>,
  "category": "<Phishing | Malware Distributor | Safe Website | Suspicious Redirect | Scam | dll>",
  "domain": "<nama domain>",
  "ssl": "<Ada | Tidak Ada | Expired>",
  "redirects": "<jumlah redirect>",
  "ipReputation": "<Bersih | Listed di Blacklist | Tidak Diketahui>",
  "summary": "<penjelasan 2-3 kalimat Bahasa Indonesia>",
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
  "category": "<Malware | Adware | Spyware | Clean | PUP | Ransomware | Trojan | dll>",
  "fileType": "<jenis file berdasarkan ekstensi>",
  "dangerousPermissions": ["<permission berbahaya jika APK, kosong [] jika bukan>"],
  "summary": "<penjelasan 2-3 kalimat Bahasa Indonesia>",
  "indicators": ["<indicator 1>", "<indicator 2>", "<indicator 3>"],
  "recommendation": "<saran dalam Bahasa Indonesia>"
}`;
  }

  private buildPhonePrompt(phone: string): string {
    return `Kamu adalah sistem keamanan siber dan fraud detection profesional untuk konteks Indonesia. Analisis nomor telepon berikut:

Nomor: ${phone}

Berdasarkan pengetahuanmu tentang pola penipuan di Indonesia (OTP fraud, pinjol ilegal, investasi bodong, social engineering, WhatsApp scam), analisis nomor ini dan kembalikan HANYA JSON ini:
{
  "status": "AMAN | BERBAHAYA | MENCURIGAKAN",
  "riskScore": <angka 0-100>,
  "category": "<Nomor Normal | Potensi Scam | OTP Fraud | Pinjol Ilegal | Investasi Bodong | Penipuan WhatsApp | dll>",
  "operator": "<Telkomsel | Indosat | XL | Tri | Smartfren | BTEL | Tidak Diketahui>",
  "region": "<perkiraan asal region/provinsi berdasarkan prefix, atau Tidak Diketahui>",
  "reportedCount": "<Tidak Ada Laporan | Sedikit Laporan | Banyak Laporan | Sangat Banyak Laporan>",
  "scamType": "<jenis penipuan yang umum dari nomor ini, atau Tidak Terdeteksi>",
  "summary": "<penjelasan 2-3 kalimat Bahasa Indonesia tentang analisis nomor ini>",
  "indicators": ["<indicator 1>", "<indicator 2>", "<indicator 3>"],
  "recommendation": "<saran tindakan dalam Bahasa Indonesia>"
}`;
  }

  private buildEmailPrompt(email: string): string {
    return `Kamu adalah sistem keamanan siber dan email security profesional. Analisis alamat email berikut untuk mendeteksi potensi phishing, spam, atau ancaman keamanan:

Email: ${email}

Analisis domain email, pola nama, reputasi, dan potensi ancaman. Kembalikan HANYA JSON ini:
{
  "status": "AMAN | BERBAHAYA | MENCURIGAKAN",
  "riskScore": <angka 0-100>,
  "category": "<Email Legitimate | Phishing | Spam | Disposable Email | Spoofed Domain | Business Email Compromise | dll>",
  "emailDomain": "<nama domain email>",
  "spfStatus": "<Valid | Tidak Valid | Tidak Diketahui>",
  "dmarcStatus": "<Ada | Tidak Ada | Tidak Diketahui>",
  "breachFound": "<Tidak Ada | Kemungkinan Bocor | Terdeteksi di Database Breach>",
  "senderReputation": "<Terpercaya | Netral | Mencurigakan | Berbahaya>",
  "summary": "<penjelasan 2-3 kalimat Bahasa Indonesia>",
  "indicators": ["<indicator 1>", "<indicator 2>", "<indicator 3>"],
  "recommendation": "<saran dalam Bahasa Indonesia>"
}`;
  }

  // ── Public Methods ────────────────────────────────────────────────────────────
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

  async scanPhone(phone: string): Promise<IScanResult> {
    const raw = await this.callAPI(this.buildPhonePrompt(phone));
    const parsed = JSON.parse(raw);
    return { ...parsed, status: parsed.status as ScanStatus, type: ScanType.PHONE, inputRef: phone, scannedAt: new Date() };
  }

  async scanEmail(email: string): Promise<IScanResult> {
    const raw = await this.callAPI(this.buildEmailPrompt(email));
    const parsed = JSON.parse(raw);
    return { ...parsed, status: parsed.status as ScanStatus, type: ScanType.EMAIL, inputRef: email, scannedAt: new Date() };
  }

  // ── Static Utilities ──────────────────────────────────────────────────────────
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