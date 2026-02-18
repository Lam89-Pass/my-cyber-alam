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
    } catch {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      try {
        return JSON.parse(cleaned);
      } catch {
        throw new Error("Gagal menganalisis data dari AI. Coba scan ulang.");
      }
    }
  }

  // ─── Prompt Builders ────────────────────────────────────────────────────────

  private buildUrlPrompt(url: string): string {
    return `Kamu adalah pakar keamanan siber. Analisis URL ini secara mendalam: "${url}"

Berikan hasil analisis dalam format JSON murni (tanpa markdown, tanpa teks lain):
{
  "status": "AMAN | BERBAHAYA | MENCURIGAKAN",
  "riskScore": <angka 0-100, makin tinggi makin berbahaya>,
  "category": "<kategori ancaman atau jenis website, contoh: Phishing, E-Commerce Palsu, Website Resmi, Scam, dll>",
  "domain": "<nama domain utama>",
  "ssl": "<status SSL: Ada & Valid | Tidak Ada | Kedaluwarsa | Mencurigakan>",
  "ageDomain": "<estimasi usia domain: Baru (<1 tahun) | Sedang (1-3 tahun) | Lama (>3 tahun) | Tidak Diketahui>",
  "redirectCount": <estimasi jumlah redirect: 0, 1, 2, dst>,
  "ipReputation": "<reputasi IP: Bersih | Masuk Daftar Hitam | Mencurigakan | Tidak Diketahui>",
  "summary": "<penjelasan lengkap 2-3 kalimat mengapa URL ini aman/berbahaya/mencurigakan, dalam Bahasa Indonesia yang mudah dipahami>",
  "indicators": [
    "<indikator 1 yang ditemukan>",
    "<indikator 2 yang ditemukan>",
    "<tambahkan lebih jika relevan>"
  ],
  "recommendation": "<langkah konkret yang harus dilakukan pengguna: jangan klik, laporkan ke mana, alternatif apa, dll. Minimal 2 kalimat dalam Bahasa Indonesia.>"
}`;
  }

  private buildFilePrompt(fileName: string, fileSize: number): string {
    const sizeMB    = (fileSize / 1024 / 1024).toFixed(2);
    const ext       = fileName.split(".").pop()?.toLowerCase() ?? "";
    const isApk     = ext === "apk";
    const isExe     = ext === "exe" || ext === "msi";
    const isDoc     = ["pdf","doc","docx","xls","xlsx"].includes(ext);
    const isArchive = ["zip","rar","7z"].includes(ext);

    const fileContext = isApk
      ? "File APK Android — periksa permission berbahaya, potensi spyware, adware, dan malware."
      : isExe
      ? "File executable Windows — periksa tanda-tanda trojan, ransomware, atau virus."
      : isDoc
      ? "File dokumen — periksa potensi macro berbahaya atau embedded malware."
      : isArchive
      ? "File arsip — periksa potensi payload berbahaya di dalamnya."
      : "File tidak dikenal — analisis berdasarkan nama dan ukuran.";

    return `Kamu adalah pakar keamanan siber. Analisis file berikut: "${fileName}" (${sizeMB} MB).
Konteks: ${fileContext}

Berikan hasil analisis dalam format JSON murni (tanpa markdown, tanpa teks lain):
{
  "status": "AMAN | BERBAHAYA | MENCURIGAKAN",
  "riskScore": <angka 0-100>,
  "category": "<kategori: Malware | Trojan | Ransomware | Spyware | Adware | File Bersih | Mencurigakan | dll>",
  "fileType": "<deskripsi tipe file, contoh: APK Android, Executable Windows, PDF Dokumen>",
  "signatureStatus": "<status tanda tangan digital: Terverifikasi | Tidak Ada | Tidak Valid | Mencurigakan>",
  "malwareFamily": "<nama malware jika terdeteksi, atau 'Tidak Terdeteksi'>",
  "summary": "<penjelasan lengkap 2-3 kalimat tentang kondisi file ini, dalam Bahasa Indonesia>",
  "dangerousPermissions": ${isApk ? `["<permission berbahaya 1>", "<permission berbahaya 2>"]` : "[]"},
  "indicators": [
    "<indikator 1>",
    "<indikator 2>",
    "<tambahkan lebih jika relevan>"
  ],
  "recommendation": "<langkah konkret untuk pengguna: hapus file, scan ulang dengan antivirus apa, cara melindungi device, dll. Minimal 2 kalimat dalam Bahasa Indonesia.>"
}`;
  }

  private buildPasswordPrompt(password: string): string {
    return `Kamu adalah ahli kriptografi dan keamanan siber. Analisis kekuatan dan keamanan password ini: "${password}"

Berikan hasil analisis dalam format JSON murni (tanpa markdown, tanpa teks lain):
{
  "status": "AMAN | BERBAHAYA | LEMAH",
  "riskScore": <angka 0-100, makin tinggi makin lemah/berbahaya>,
  "category": "<kategori: Password Lemah | Password Umum | Password Bocor | Password Kuat | Password Sedang>",
  "strength": "Sangat Lemah | Lemah | Sedang | Kuat | Sangat Kuat",
  "isLeaked": "Ya | Tidak | Mungkin",
  "usageCount": "<estimasi berapa banyak orang menggunakan password ini, contoh: 'Lebih dari 10 juta orang', 'Sekitar 50.000 orang', 'Sangat sedikit atau unik', 'Tidak ada data kebocoran'>",
  "leakedCount": "<keterangan kebocoran, misal: 'Muncul di 5 database kebocoran terkenal' atau 'Tidak ditemukan di database breach'>",
  "entropy": "<perhitungan entropi, contoh: '28 bits - sangat rendah' atau '72 bits - tinggi'>",
  "summary": "<penjelasan lengkap 2-3 kalimat tentang kekuatan dan riwayat kebocoran password ini, dalam Bahasa Indonesia>",
  "indicators": [
    "<alasan 1 mengapa password ini kuat/lemah>",
    "<alasan 2>",
    "<tambahkan lebih jika relevan>"
  ],
  "recommendation": "<saran konkret untuk memperbaiki atau mengganti password ini, termasuk contoh pola yang lebih kuat. Minimal 2 kalimat dalam Bahasa Indonesia.>"
}`;
  }

  // ─── Public Scan Methods ─────────────────────────────────────────────────────

  async scanUrl(url: string): Promise<IScanResult> {
    const raw    = await this.callAI(this.buildUrlPrompt(url));
    const parsed = this.safeParse(raw);
    return { ...parsed, type: ScanType.URL, inputRef: url, scannedAt: new Date() };
  }

  async scanFile(fileName: string, fileSize: number): Promise<IScanResult> {
    const raw    = await this.callAI(this.buildFilePrompt(fileName, fileSize));
    const parsed = this.safeParse(raw);
    return { ...parsed, type: ScanType.FILE, inputRef: fileName, scannedAt: new Date() };
  }

  async scanPassword(password: string): Promise<IScanResult> {
    const raw    = await this.callAI(this.buildPasswordPrompt(password));
    const parsed = this.safeParse(raw);
    return {
      ...parsed,
      type:      ScanType.PASSWORD,
      inputRef:  password,  
      scannedAt: new Date(),
    };
  }

  async scanPhone(): Promise<any>  { throw new Error("Fitur dihapus"); }
  async scanEmail(): Promise<any>  { throw new Error("Fitur dihapus"); }

  // ─── Static Utility Methods ──────────────────────────────────────────────────

  static getBadgeClass(status: string): string {
    const s = (status ?? "").toUpperCase();
    if (s === "AMAN")      return "badge-safe";
    if (s === "BERBAHAYA") return "badge-danger";
    return "badge-warn";
  }

  static getStatusIcon(status: string): string {
    const s = (status ?? "").toUpperCase();
    if (s === "AMAN")         return "✅";
    if (s === "BERBAHAYA")    return "🚨";
    if (s === "MENCURIGAKAN") return "⚠️";
    if (s === "LEMAH")        return "⚠️";
    return "🔍";
  }

  static getRiskColorClass(score: number): string {
    if (score < 30) return "green";
    if (score > 65) return "red";
    return "yellow";
  }
}

export const scannerService = new ScannerService();