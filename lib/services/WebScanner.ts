import puppeteer, { Browser, Page } from 'puppeteer';

// Interface untuk Tipe Data yang Jelas
export interface ScanResult {
  url: string;
  finalUrl: string;
  title: string;
  redirects: string[];
  screenshot: string; // Base64 image
  riskScore: number;
  verdict: 'safe' | 'suspicious' | 'malicious';
  scanDuration: number;
}

export class WebScanner {
  // Singleton Pattern (Opsional, tapi bagus untuk resource management)
  private browser: Browser | null = null;

  private async initBrowser() {
    this.browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--incognito'],
    });
  }

  public async scan(targetUrl: string): Promise<ScanResult> {
    const startTime = Date.now();
    if (!this.browser) await this.initBrowser();

    const context = await this.browser!.createIncognitoBrowserContext();
    const page = await context.newPage();
    const redirects: string[] = [];

    try {
      // Set User Agent biar gak dikira bot
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

      page.on('response', response => {
        if (response.status() >= 300 && response.status() <= 399) {
          redirects.push(response.url());
        }
      });

      // Buka URL (Timeout 20 detik)
      await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 20000 });
      
      const finalUrl = page.url();
      const title = await page.title();
      
      // Ambil Screenshot (Quality dikurangi biar ringan di network)
      const screenshotBuffer = await page.screenshot({ encoding: 'base64', type: 'jpeg', quality: 70 });
      
      // Hitung Durasi
      const duration = (Date.now() - startTime) / 1000;

      // Analisis Risiko
      const risk = this.analyzeRisk(title, redirects, finalUrl);

      return {
        url: targetUrl,
        finalUrl,
        title: title || 'No Title Detected',
        redirects,
        screenshot: `data:image/jpeg;base64,${screenshotBuffer}`,
        scanDuration: duration,
        ...risk
      };

    } catch (error) {
      throw error;
    } finally {
      await context.close();
      // Browser dibiarkan hidup untuk request selanjutnya (Cold start prevention)
    }
  }

  private analyzeRisk(title: string, redirects: string[], finalUrl: string) {
    let score = 0;
    const lowerTitle = title.toLowerCase();

    // Heuristic Rules
    if (redirects.length > 2) score += 30; // Terlalu banyak operan
    if (finalUrl.length > 100) score += 20; // URL kepanjangan
    if (['login', 'verify', 'update', 'bank', 'secure', 'bonus'].some(k => lowerTitle.includes(k))) score += 40;

    return {
      riskScore: score,
      verdict: score > 50 ? 'malicious' : (score > 20 ? 'suspicious' : 'safe') as any
    };
  }
}