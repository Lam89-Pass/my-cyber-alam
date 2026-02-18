"use client";
import { useRef, useState } from "react";
import { IScanResult, ScanType } from "@/types";
import { scannerService } from "@/lib/services/ScannerService";
import ResultCard from "@/components/ResultCard";

// ─── Tab config ────────────────────────────────────────────────────────────────
const TABS = [
  { type: ScanType.URL,   label: "Scan URL",      icon: "🔗" },
  { type: ScanType.FILE,  label: "Scan File/APK",  icon: "📁" },
  { type: ScanType.PHONE, label: "Scan No. HP",    icon: "📱" },
  { type: ScanType.EMAIL, label: "Scan Email",     icon: "📧" },
];

export default function Scanner() {
  const [tab, setTab]           = useState<ScanType>(ScanType.URL);
  const [url, setUrl]           = useState("");
  const [phone, setPhone]       = useState("");
  const [email, setEmail]       = useState("");
  const [file, setFile]         = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult]     = useState<IScanResult | null>(null);
  const [error, setError]       = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = (newTab: ScanType) => {
    setTab(newTab); setResult(null); setError("");
    setUrl(""); setPhone(""); setEmail(""); setFile(null);
  };

  const run = async (fn: () => Promise<IScanResult>) => {
    setScanning(true); setResult(null); setError("");
    try { setResult(await fn()); }
    catch { setError("Gagal menganalisis. Periksa koneksi atau coba lagi."); }
    finally { setScanning(false); }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  // ── Validasi sederhana ────────────────────────────────────────────────────────
  const isPhoneValid = phone.replace(/\D/g, "").length >= 8;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <>
      <style>{`
        .scanner-wrap {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 2rem 5rem;
        }

        /* TAB BAR */
        .tab-bar {
          display: flex;
          gap: 4px;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 5px;
          margin-bottom: 1.5rem;
          width: fit-content;
          flex-wrap: wrap;
        }
        .tab-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--muted);
          padding: 8px 18px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 7px;
          transition: all 0.2s;
          white-space: nowrap;
          line-height: 1.5;
          letter-spacing: 0.1px;
        }
        .tab-btn.active {
          background: var(--accent);
          color: #020c0a;
        }
        .tab-btn:not(.active):hover {
          color: var(--text);
          background: var(--accent-dim);
        }

        /* INPUT CARD */
        .input-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 1.5rem;
          transition: border-color 0.25s;
        }
        .input-card:focus-within {
          border-color: rgba(0,229,160,0.35);
        }

        .input-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.68rem;
          color: var(--muted);
          letter-spacing: 1.8px;
          text-transform: uppercase;
          margin-bottom: 0.8rem;
          display: block;
          line-height: 1.5;
        }

        /* TEXT INPUT ROW */
        .input-row {
          display: flex;
          gap: 12px;
          align-items: stretch;
        }
        .text-input {
          flex: 1;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 13px 18px;
          font-family: 'Space Mono', monospace;
          font-size: 0.88rem;
          color: var(--text);
          outline: none;
          transition: border-color 0.2s;
          line-height: 1.5;
          min-width: 0;
        }
        .text-input::placeholder { color: var(--muted); }
        .text-input:focus { border-color: rgba(0,229,160,0.5); }

        /* SCAN BUTTON */
        .scan-btn {
          background: var(--accent);
          color: #020c0a;
          border: none;
          cursor: pointer;
          border-radius: 12px;
          padding: 13px 22px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.88rem;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
          line-height: 1.5;
          letter-spacing: 0.1px;
        }
        .scan-btn:hover:not(:disabled) {
          background: #00ffb3;
          box-shadow: 0 0 24px rgba(0,229,160,0.4);
          transform: translateY(-1px);
        }
        .scan-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        /* HINT TEXT */
        .input-hint {
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          color: var(--muted);
          margin-top: 0.6rem;
          line-height: 1.6;
        }

        /* DROP ZONE */
        .drop-zone {
          border: 2px dashed var(--border);
          border-radius: 14px;
          padding: 2.5rem 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.25s;
        }
        .drop-zone:hover, .drop-zone.drag { border-color: var(--accent); background: var(--accent-dim); }
        .drop-icon { font-size: 2.2rem; margin-bottom: 0.7rem; }
        .drop-title {
          font-family: 'Syne', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 0.3rem;
          line-height: 1.5;
        }
        .drop-sub {
          font-family: 'Space Mono', monospace;
          font-size: 0.75rem;
          color: var(--muted);
          line-height: 1.6;
        }
        .drop-file-name {
          margin-top: 0.8rem;
          font-family: 'Space Mono', monospace;
          font-size: 0.78rem;
          color: var(--accent);
          line-height: 1.5;
        }

        /* SCANNING ANIM */
        .scan-anim {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 3rem 2rem;
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .scan-ring {
          width: 52px; height: 52px;
          border-radius: 50%;
          border: 2px solid var(--border);
          border-top-color: var(--accent);
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }
        .scan-anim-text {
          font-family: 'Space Mono', monospace;
          font-size: 0.82rem;
          color: var(--muted);
          line-height: 1.6;
        }

        /* ERROR */
        .error-box {
          background: rgba(255,77,109,0.08);
          border: 1px solid rgba(255,77,109,0.28);
          border-radius: 12px;
          padding: 1rem 1.2rem;
          margin-bottom: 1.2rem;
          font-family: 'Space Mono', monospace;
          font-size: 0.82rem;
          color: var(--danger);
          line-height: 1.6;
        }

        /* RESPONSIVE */
        @media (max-width: 640px) {
          .scanner-wrap { padding: 0 1.2rem 4rem; }
          .tab-bar { width: 100%; }
          .tab-btn { flex: 1; justify-content: center; padding: 8px 10px; font-size: 0.78rem; }
          .input-row { flex-direction: column; }
          .scan-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="scanner-wrap">
        {/* ── TAB BAR ── */}
        <div className="tab-bar">
          {TABS.map(t => (
            <button
              key={t.type}
              className={`tab-btn${tab === t.type ? " active" : ""}`}
              onClick={() => reset(t.type)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── INPUT CARD ── */}
        <div className="input-card">

          {/* URL */}
          {tab === ScanType.URL && (
            <>
              <span className="input-label">Masukkan URL / Link yang Dicurigai</span>
              <div className="input-row">
                <input
                  className="text-input"
                  type="url"
                  placeholder="https://link-mencurigakan.com/promo-palsu..."
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && url.trim() && run(() => scannerService.scanUrl(url.trim()))}
                />
                <button
                  className="scan-btn"
                  onClick={() => run(() => scannerService.scanUrl(url.trim()))}
                  disabled={scanning || !url.trim()}
                >
                  🔍 {scanning ? "Scanning..." : "Scan"}
                </button>
              </div>
              <p className="input-hint">Contoh: link promo WhatsApp, bit.ly, link transfer, dll</p>
            </>
          )}

          {/* FILE */}
          {tab === ScanType.FILE && (
            <>
              <span className="input-label">Upload File atau APK yang Dicurigai</span>
              <div
                className={`drop-zone${dragging ? " drag" : ""}`}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
              >
                <div className="drop-icon">📁</div>
                <p className="drop-title">Klik untuk upload atau drag & drop</p>
                <p className="drop-sub">APK · EXE · ZIP · PDF · DOCX — maks. 50MB</p>
                <input ref={fileRef} type="file" style={{ display: "none" }}
                  onChange={e => setFile(e.target.files?.[0] ?? null)} />
                {file && <div className="drop-file-name">📎 {file.name} ({(file.size/1024/1024).toFixed(2)} MB)</div>}
              </div>
              {file && (
                <button
                  className="scan-btn"
                  style={{ marginTop: "1rem", width: "100%", justifyContent: "center" }}
                  onClick={() => run(() => scannerService.scanFile(file.name, file.size))}
                  disabled={scanning}
                >
                  🔍 {scanning ? "Menganalisis..." : "Analisis File"}
                </button>
              )}
            </>
          )}

          {/* PHONE */}
          {tab === ScanType.PHONE && (
            <>
              <span className="input-label">Masukkan Nomor HP yang Mencurigakan</span>
              <div className="input-row">
                <input
                  className="text-input"
                  type="tel"
                  placeholder="08xx-xxxx-xxxx atau +628xx..."
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && isPhoneValid && run(() => scannerService.scanPhone(phone.trim()))}
                />
                <button
                  className="scan-btn"
                  onClick={() => run(() => scannerService.scanPhone(phone.trim()))}
                  disabled={scanning || !isPhoneValid}
                >
                  🔍 {scanning ? "Scanning..." : "Scan"}
                </button>
              </div>
              <p className="input-hint">Cek nomor penipu, OTP scam, pinjol ilegal, investasi bodong</p>
            </>
          )}

          {/* EMAIL */}
          {tab === ScanType.EMAIL && (
            <>
              <span className="input-label">Masukkan Alamat Email yang Mencurigakan</span>
              <div className="input-row">
                <input
                  className="text-input"
                  type="email"
                  placeholder="contoh@domain.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && isEmailValid && run(() => scannerService.scanEmail(email.trim()))}
                />
                <button
                  className="scan-btn"
                  onClick={() => run(() => scannerService.scanEmail(email.trim()))}
                  disabled={scanning || !isEmailValid}
                >
                  🔍 {scanning ? "Scanning..." : "Scan"}
                </button>
              </div>
              <p className="input-hint">Cek email phishing, domain palsu, email bocor di database breach</p>
            </>
          )}
        </div>

        {/* ── ERROR ── */}
        {error && <div className="error-box">⚠️ {error}</div>}

        {/* ── SCANNING ANIM ── */}
        {scanning && (
          <div className="scan-anim">
            <div className="scan-ring" />
            <p className="scan-anim-text">🔍 AI sedang menganalisis...</p>
            <p className="scan-anim-text" style={{ fontSize: "0.72rem", marginTop: "4px", opacity: 0.6 }}>
              Memeriksa database ancaman & pola berbahaya
            </p>
          </div>
        )}

        {/* ── RESULT ── */}
        {result && !scanning && <ResultCard result={result} />}
      </div>
    </>
  );
}