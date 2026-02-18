"use client";
import { useRef, useState } from "react";
import { IScannerProps, ScanType } from "@/types";
import { scannerService } from "@/lib/services/ScannerService";
import ResultCard from "./ResultCard";

export default function Scanner() {
  const [tab, setTab] = useState<ScanType>(ScanType.URL);
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof scannerService.scanUrl>> | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = (newTab: ScanType) => {
    setTab(newTab);
    setResult(null);
    setError("");
    setUrl("");
    setFile(null);
  };

  const handleScanUrl = async () => {
    if (!url.trim()) return;
    setScanning(true); setResult(null); setError("");
    try {
      const r = await scannerService.scanUrl(url.trim());
      setResult(r);
    } catch {
      setError("Gagal menganalisis URL. Periksa koneksi atau coba lagi.");
    } finally { setScanning(false); }
  };

  const handleScanFile = async () => {
    if (!file) return;
    setScanning(true); setResult(null); setError("");
    try {
      const r = await scannerService.scanFile(file.name, file.size);
      setResult(r);
    } catch {
      setError("Gagal menganalisis file. Coba lagi.");
    } finally { setScanning(false); }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  return (
    <div style={{ position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto", padding: "0 clamp(1.5rem,5vw,4rem) clamp(3rem,6vh,5rem)" }}>
      <div style={{
        display: "flex", gap: 4, background: "var(--surface2)",
        border: "1px solid var(--border)", borderRadius: 14, padding: 5,
        marginBottom: "1.5rem", width: "fit-content",
      }}>
        {([ScanType.URL, ScanType.FILE] as ScanType[]).map(t => (
          <button
            key={t}
            onClick={() => reset(t)}
            style={{
              background: tab === t ? "var(--accent)" : "none",
              border: "none", cursor: "pointer",
              fontFamily: "var(--font-display)", fontSize: "0.88rem", fontWeight: 600,
              color: tab === t ? "#020c0a" : "var(--muted)",
              padding: "8px 20px", borderRadius: 10,
              display: "flex", alignItems: "center", gap: 7, transition: "all 0.2s",
            }}
          >
            {t === ScanType.URL ? "🔗" : "📁"} Scan {t === ScanType.URL ? "URL" : "File / APK"}
          </button>
        ))}
      </div>

      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 20, padding: "2rem", marginBottom: "1.5rem",
      }}>
        {tab === ScanType.URL ? (
          <>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "0.8rem" }}>
              Masukkan URL / Link yang Dicurigai
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <input
                type="url"
                placeholder="https://..."
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleScanUrl()}
                style={{
                  flex: 1, background: "var(--surface2)", border: "1px solid var(--border)",
                  borderRadius: 12, padding: "14px 18px",
                  fontFamily: "var(--font-mono)", fontSize: "0.88rem", color: "var(--text)",
                  outline: "none",
                }}
              />
              <button
                onClick={handleScanUrl}
                disabled={scanning || !url.trim()}
                style={{
                  background: scanning ? "var(--accent2)" : "var(--accent)",
                  color: "#020c0a", border: "none", cursor: scanning ? "not-allowed" : "pointer",
                  borderRadius: 12, padding: "14px 24px",
                  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem",
                  display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
                  opacity: scanning || !url.trim() ? 0.5 : 1,
                }}
              >
                🔍 {scanning ? "Scanning..." : "Scan Sekarang"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${dragging ? "var(--accent)" : "var(--border)"}`,
                background: dragging ? "var(--accent-dim)" : "transparent",
                borderRadius: 14, padding: "3rem 2rem",
                textAlign: "center", cursor: "pointer", transition: "all 0.25s",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>📁</div>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                <strong style={{ color: "var(--text)" }}>Klik untuk upload</strong> atau drag &amp; drop file di sini
              </p>
              <p style={{ color: "var(--muted)", fontSize: "0.78rem", marginTop: 4 }}>APK, EXE, ZIP, PDF, DOCX — maks. 50MB</p>
              <input ref={fileRef} type="file" style={{ display: "none" }} onChange={e => setFile(e.target.files?.[0] ?? null)} />
              {file && (
                <div style={{ marginTop: "1rem", fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--accent)" }}>
                  📎 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>
            {file && (
              <button
                onClick={handleScanFile}
                disabled={scanning}
                style={{
                  marginTop: "1rem", width: "100%",
                  background: scanning ? "var(--accent2)" : "var(--accent)",
                  color: "#020c0a", border: "none", cursor: scanning ? "not-allowed" : "pointer",
                  borderRadius: 12, padding: "14px",
                  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                🔍 {scanning ? "Menganalisis File..." : "Analisis File"}
              </button>
            )}
          </>
        )}
      </div>

      {error && (
        <div style={{
          background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.3)",
          borderRadius: 12, padding: "1rem", marginBottom: "1rem",
          color: "var(--danger)", fontFamily: "var(--font-mono)", fontSize: "0.85rem",
        }}>
          ⚠️ {error}
        </div>
      )}

      {scanning && (
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 20, padding: "3rem 2rem", textAlign: "center", marginBottom: "1.5rem",
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%",
            border: "2px solid var(--border)", borderTopColor: "var(--accent)",
            animation: "spin 1s linear infinite", margin: "0 auto 1rem",
          }} />
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--muted)" }}>
            🔍 AI sedang menganalisis...
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--border)", marginTop: 4 }}>
            Memeriksa database ancaman &amp; pola berbahaya
          </div>
        </div>
      )}

      {/* Result */}
      {result && !scanning && <ResultCard result={result} />}
    </div>
  );
}