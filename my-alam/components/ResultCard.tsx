"use client";
import { useState, useRef } from "react";
import { IResultCardProps, ScanType } from "@/types";
import { ScannerService } from "@/lib/services/ScannerService";

export default function ResultCard({ result }: IResultCardProps) {
  const [imgError, setImgError]     = useState(false);
  const [imgLoaded, setImgLoaded]   = useState(false);
  const [shareState, setShareState] = useState<"idle"|"copying"|"copied"|"sharing">("idle");
  const cardRef = useRef<HTMLDivElement>(null);

  const badgeClass = ScannerService.getBadgeClass(result.status);
  const icon       = ScannerService.getStatusIcon(result.status);
  const scoreColor = ScannerService.getRiskColorClass(result.riskScore);

  const colorMap: Record<string,string> = {
    green: "var(--safe)", red: "var(--danger)", yellow: "var(--warn)",
  };
  const badgeStyle: Record<string,{bg:string;color:string;border:string}> = {
    "badge-safe":   { bg:"rgba(0,229,160,0.12)", color:"var(--safe)",   border:"rgba(0,229,160,0.3)"  },
    "badge-danger": { bg:"rgba(255,77,109,0.12)",color:"var(--danger)", border:"rgba(255,77,109,0.3)" },
    "badge-warn":   { bg:"rgba(255,183,3,0.12)", color:"var(--warn)",   border:"rgba(255,183,3,0.3)"  },
  };
  const badge = badgeStyle[badgeClass] || badgeStyle["badge-warn"];

  const isUrl      = result.type === ScanType.URL;
  const isFile     = result.type === ScanType.FILE;
  const isPassword = result.type === ("PASSWORD" as any);

  const screenshotUrl = isUrl && result.inputRef
    ? `https://api.microlink.io/?url=${encodeURIComponent(result.inputRef)}&screenshot=true&embed=screenshot.url`
    : null;

  const gaugeWidth = `${Math.min(100, Math.max(0, result.riskScore))}%`;
  const gaugeColor = colorMap[scoreColor];
  const res = result as any;

  // ── Share: build plain-text result ─────────────────────────────────────────
  const buildShareText = () => {
    const lines = [
      `🛡️ CyberAlam — Hasil Scan Keamanan`,
      `──────────────────────────────`,
      `Status   : ${icon} ${result.status}`,
      `Risk     : ${result.riskScore}/100`,
      isUrl      ? `URL      : ${result.inputRef}` : "",
      isFile     ? `File     : ${result.inputRef}` : "",
      isPassword ? `Password : ${result.inputRef}` : "",
      `Kategori : ${result.category || "-"}`,
      ``,
      `📋 Analisis:`,
      result.summary,
    ].filter(l => l !== undefined);

    if (result.indicators?.length) {
      lines.push("", "🔍 Indikator:");
      result.indicators.slice(0, 3).forEach((ind: string) => lines.push(`  • ${ind}`));
    }
    if (result.recommendation) {
      lines.push("", "💡 Rekomendasi:", result.recommendation);
    }
    lines.push("", "──────────────────────────────");
    lines.push("🔒 Scan gratis di CyberAlam — cyberalam.vercel.app");
    return lines.join("\n");
  };

  const handleShare = async () => {
    const text = buildShareText();
    // 1️⃣ Web Share API (native di mobile & beberapa desktop)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        setShareState("sharing");
        await navigator.share({ title: `CyberAlam — ${result.status}`, text });
        setShareState("idle");
        return;
      } catch { /* dibatalkan user atau tidak support */ }
    }
    // 2️⃣ Clipboard fallback
    try {
      setShareState("copying");
      await navigator.clipboard.writeText(text);
      setShareState("copied");
      setTimeout(() => setShareState("idle"), 2500);
    } catch {
      setShareState("idle");
    }
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#020c0a",
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `cyberalam-${result.status.toLowerCase()}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      // html2canvas tidak ter-install, fallback ke share teks
      handleShare();
    }
  };

  const shareLabel =
    shareState === "copied"  ? "Tersalin!" :
    shareState === "copying" ? "Menyalin..." :
    shareState === "sharing" ? "Berbagi..."  : "Bagikan";

  return (
    <>
      <style>{`
        .rc-wrap {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
          animation: slideUp 0.35s ease;
        }

        /* HEADER */
        .rc-header {
          padding: 1rem 1.4rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
          background: var(--surface2);
        }
        .rc-header-left { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
        .rc-badge {
          padding: 5px 14px; border-radius: 20px;
          font-family: 'Space Mono', monospace; font-size: 0.75rem; font-weight: 700;
          border: 1px solid; letter-spacing: 0.5px;
        }
        .rc-type-tag {
          font-family: 'Space Mono', monospace; font-size: 0.72rem; color: var(--muted);
          background: var(--surface); border: 1px solid var(--border);
          padding: 4px 10px; border-radius: 8px;
        }

        /* SHARE ACTIONS */
        .rc-actions { display:flex; align-items:center; gap:6px; flex-shrink:0; }
        .rc-time { font-family:'Space Mono',monospace; font-size:0.7rem; color:var(--muted); }

        .rc-share-btn {
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.78rem;
          background: var(--accent-dim); color: var(--accent);
          border: 1px solid rgba(0,229,160,0.35); border-radius: 9px;
          padding: 6px 14px; cursor: pointer;
          display: flex; align-items: center; gap: 6px;
          transition: all 0.2s; white-space: nowrap; line-height: 1.5;
        }
        .rc-share-btn:hover { background:rgba(0,229,160,0.2); border-color:rgba(0,229,160,0.55); transform:translateY(-1px); }
        .rc-share-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
        .rc-share-btn.success { background:rgba(0,229,160,0.25); color:var(--safe); }

        .rc-dl-btn {
          font-family: 'Space Mono', monospace; font-size: 0.7rem;
          background: var(--surface); color: var(--muted);
          border: 1px solid var(--border); border-radius: 9px;
          padding: 6px 12px; cursor: pointer;
          display: flex; align-items: center; gap: 5px;
          transition: all 0.2s; white-space: nowrap; line-height: 1.5;
        }
        .rc-dl-btn:hover { color:var(--text); border-color:rgba(0,229,160,0.3); background:var(--surface2); }

        /* SCREENSHOT */
        .rc-screenshot-wrap {
          position:relative; width:100%; height:220px;
          background:var(--surface2); border-bottom:1px solid var(--border); overflow:hidden;
        }
        .rc-screenshot-img {
          width:100%; height:100%; object-fit:cover; object-position:top; transition:opacity 0.4s;
        }
        .rc-screenshot-overlay {
          position:absolute; inset:0;
          background:linear-gradient(to bottom, transparent 60%, var(--surface) 100%);
          pointer-events:none;
        }
        .rc-screenshot-label {
          position:absolute; top:10px; right:12px;
          background:rgba(2,12,10,0.8); border:1px solid var(--border); border-radius:8px;
          padding:3px 10px; font-family:'Space Mono',monospace; font-size:0.65rem; color:var(--muted);
          backdrop-filter:blur(6px);
        }
        .rc-screenshot-loading {
          position:absolute; inset:0;
          display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px;
          color:var(--muted); font-family:'Space Mono',monospace; font-size:0.75rem;
        }
        .rc-ss-spinner {
          width:28px; height:28px;
          border:2px solid var(--border); border-top-color:var(--accent);
          border-radius:50%; animation:spin 1s linear infinite;
        }

        /* BODY */
        .rc-body { padding:1.5rem; }

        .rc-input-ref {
          display:flex; align-items:center; gap:8px;
          background:var(--surface2); border:1px solid var(--border);
          border-radius:10px; padding:10px 14px; margin-bottom:1.2rem; overflow:hidden;
        }
        .rc-input-ref span {
          font-family:'Space Mono',monospace; font-size:0.78rem; color:var(--accent);
          overflow:hidden; text-overflow:ellipsis; white-space:nowrap; min-width:0;
        }
        .pw-display {
          background:var(--surface2); border:1px solid rgba(0,229,160,0.3);
          border-radius:10px; padding:10px 14px; margin-bottom:1.2rem;
          display:flex; align-items:center; gap:8px;
        }
        .pw-display-text {
          font-family:'Space Mono',monospace; font-size:0.9rem;
          color:var(--accent); letter-spacing:2px; word-break:break-all;
        }

        /* GAUGE */
        .rc-gauge-wrap { margin-bottom:1.4rem; }
        .rc-gauge-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; }
        .rc-gauge-label { font-family:'Space Mono',monospace; font-size:0.68rem; color:var(--muted); letter-spacing:1.5px; text-transform:uppercase; }
        .rc-gauge-value { font-family:'Space Mono',monospace; font-size:0.85rem; font-weight:700; }
        .rc-gauge-track { height:8px; background:var(--surface2); border-radius:8px; overflow:hidden; border:1px solid var(--border); }
        .rc-gauge-bar { height:100%; border-radius:8px; transition:width 0.8s cubic-bezier(0.4,0,0.2,1); }

        /* SUMMARY */
        .rc-summary {
          font-size:0.92rem; line-height:1.7; color:var(--text);
          margin-bottom:1.4rem; padding:1rem 1.2rem;
          background:var(--surface2); border-radius:12px; border-left:3px solid var(--accent);
        }

        /* URL / FILE DETAILS */
        .rc-details-grid {
          display:grid; grid-template-columns:repeat(auto-fit,minmax(155px,1fr));
          gap:10px; margin-bottom:1.4rem;
        }
        .rc-detail-item { background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:0.75rem 1rem; }
        .rc-detail-label { font-family:'Space Mono',monospace; font-size:0.6rem; color:var(--muted); text-transform:uppercase; letter-spacing:1.5px; margin-bottom:4px; }
        .rc-detail-value { font-size:0.82rem; font-weight:600; color:var(--text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

        /* METRICS */
        .rc-metrics { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:10px; margin-bottom:1.4rem; }
        .rc-metric-card { background:var(--surface2); border:1px solid var(--border); border-radius:12px; padding:0.9rem 1rem; transition:border-color 0.2s; }
        .rc-metric-card:hover { border-color:rgba(0,229,160,0.25); }
        .rc-metric-label { font-family:'Space Mono',monospace; font-size:0.62rem; color:var(--muted); text-transform:uppercase; letter-spacing:1.5px; margin-bottom:5px; }
        .rc-metric-value { font-family:'Syne',sans-serif; font-weight:700; font-size:0.9rem; line-height:1.3; }

        /* PASSWORD STRENGTH */
        .pw-strength-wrap { margin-bottom:1.4rem; }
        .pw-bars { display:flex; gap:4px; margin-top:8px; }
        .pw-bar { flex:1; height:5px; border-radius:4px; background:var(--border); transition:background 0.4s; }

        /* PERMISSIONS */
        .rc-perms { margin-bottom:1.4rem; }
        .rc-perms-title { font-family:'Space Mono',monospace; font-size:0.68rem; color:var(--muted); letter-spacing:1.5px; text-transform:uppercase; margin-bottom:8px; }
        .rc-perm-tag {
          display:inline-block; background:rgba(255,77,109,0.1); border:1px solid rgba(255,77,109,0.3);
          color:var(--danger); border-radius:8px; padding:4px 10px;
          font-family:'Space Mono',monospace; font-size:0.72rem; margin:2px;
        }

        /* INDICATORS */
        .rc-indicators { margin-bottom:1.4rem; }
        .rc-indicators-title { font-family:'Space Mono',monospace; font-size:0.68rem; color:var(--muted); letter-spacing:1.5px; text-transform:uppercase; margin-bottom:8px; }
        .rc-ind-item { display:flex; align-items:flex-start; gap:8px; padding:7px 0; border-bottom:1px solid var(--border); font-size:0.83rem; color:var(--text); line-height:1.5; }
        .rc-ind-item:last-child { border-bottom:none; }
        .rc-ind-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; margin-top:6px; }

        /* RECOMMENDATION */
        .rc-rec { background:rgba(0,229,160,0.06); border:1px solid rgba(0,229,160,0.2); border-radius:14px; padding:1.2rem 1.4rem; }
        .rc-rec-title { font-family:'Space Mono',monospace; font-size:0.68rem; color:var(--accent); letter-spacing:1.5px; text-transform:uppercase; margin-bottom:8px; display:flex; align-items:center; gap:6px; }
        .rc-rec-body { font-size:0.87rem; color:var(--text); line-height:1.7; }

        /* TOAST */
        .rc-toast {
          position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
          background:var(--accent); color:#020c0a;
          font-family:'Space Mono',monospace; font-size:0.8rem; font-weight:700;
          padding:10px 24px; border-radius:30px; z-index:9999;
          box-shadow:0 4px 24px rgba(0,229,160,0.4); animation:slideUp 0.2s ease; white-space:nowrap;
        }

        @media (max-width:640px) {
          .rc-body { padding:1.2rem; }
          .rc-screenshot-wrap { height:160px; }
          .rc-actions { width:100%; justify-content:flex-end; }
          .rc-dl-btn { display:none; }
          .rc-details-grid { grid-template-columns:repeat(2,1fr); }
          .rc-metrics { grid-template-columns:repeat(2,1fr); }
        }
      `}</style>

      {shareState === "copied" && (
        <div className="rc-toast">✅ Hasil scan tersalin! Tempel ke WhatsApp / sosmed.</div>
      )}

      <div className="rc-wrap" ref={cardRef}>

        {/* HEADER */}
        <div className="rc-header">
          <div className="rc-header-left">
            <div className="rc-badge" style={{ background:badge.bg, color:badge.color, borderColor:badge.border }}>
              {icon} {result.status}
            </div>
            <span className="rc-type-tag">
              {isUrl ? "🔗 URL Analysis" : isFile ? "📁 File Analysis" : "🔑 Password Analysis"}
            </span>
          </div>
          <div className="rc-actions">
            <span className="rc-time">
              {new Date(result.scannedAt).toLocaleTimeString("id-ID",{ hour:"2-digit", minute:"2-digit" })}
            </span>
            <button className="rc-dl-btn" onClick={handleDownloadImage} title="Simpan sebagai gambar PNG">
              📥 Simpan
            </button>
            <button
              className={`rc-share-btn${shareState==="copied"?" success":""}`}
              onClick={handleShare}
              disabled={shareState==="copying"||shareState==="sharing"}
            >
              {shareState==="copied" ? "✅" : shareState==="copying" ? "⏳" : shareState==="sharing" ? "📤" : "🔗"}
              {shareLabel}
            </button>
          </div>
        </div>

        {/* SCREENSHOT */}
        {isUrl && screenshotUrl && !imgError && (
          <div className="rc-screenshot-wrap">
            {!imgLoaded && (
              <div className="rc-screenshot-loading">
                <div className="rc-ss-spinner" />
                <span>Memuat preview website...</span>
              </div>
            )}
            <img
              src={screenshotUrl} alt="Website preview"
              className="rc-screenshot-img"
              style={{ opacity: imgLoaded ? 1 : 0 }}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              crossOrigin="anonymous"
            />
            <div className="rc-screenshot-overlay" />
            <span className="rc-screenshot-label">📸 Live Preview</span>
          </div>
        )}
        {isUrl && imgError && (
          <div style={{ padding:"0.6rem 1.4rem", borderBottom:"1px solid var(--border)", background:"var(--surface2)" }}>
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:"0.7rem", color:"var(--muted)" }}>
              🚫 Preview tidak tersedia untuk URL ini
            </span>
          </div>
        )}

        {/* BODY */}
        <div className="rc-body">

          {/* Input ref */}
          {isPassword ? (
            <div className="pw-display">
              <span>🔑</span>
              <span className="pw-display-text">{result.inputRef}</span>
            </div>
          ) : (
            <div className="rc-input-ref">
              <span style={{ color:"var(--muted)", flexShrink:0 }}>{isFile ? "📎" : "🔗"}</span>
              <span>{result.inputRef}</span>
            </div>
          )}

          {/* Gauge */}
          <div className="rc-gauge-wrap">
            <div className="rc-gauge-header">
              <span className="rc-gauge-label">Risk Score</span>
              <span className="rc-gauge-value" style={{ color:gaugeColor }}>{result.riskScore}/100</span>
            </div>
            <div className="rc-gauge-track">
              <div className="rc-gauge-bar" style={{ width:gaugeWidth, background:gaugeColor }} />
            </div>
          </div>

          {/* Summary */}
          <div className="rc-summary">{result.summary}</div>

          {/* URL details */}
          {isUrl && (
            <div className="rc-details-grid">
              {[
                { label:"Domain",       value: res.domain },
                { label:"SSL / HTTPS",  value: res.ssl,
                  color: res.ssl && (res.ssl.toLowerCase().includes("valid")||res.ssl.toLowerCase().includes("ada")) ? "var(--safe)" : "var(--danger)" },
                { label:"Usia Domain",  value: res.ageDomain },
                { label:"Redirect",     value: res.redirectCount !== undefined ? `${res.redirectCount}×` : undefined },
                { label:"Reputasi IP",  value: res.ipReputation },
                { label:"Kategori",     value: result.category },
              ].filter(d => d.value).map(d => (
                <div key={d.label} className="rc-detail-item">
                  <div className="rc-detail-label">{d.label}</div>
                  <div className="rc-detail-value" style={{ color: d.color || "var(--text)" }}>{d.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* File details */}
          {isFile && (
            <>
              <div className="rc-details-grid">
                {[
                  { label:"Tipe File",       value: res.fileType },
                  { label:"Kategori",        value: result.category },
                  { label:"Tanda Tangan",    value: res.signatureStatus },
                  { label:"Malware Family",  value: res.malwareFamily,
                    color: res.malwareFamily && res.malwareFamily !== "Tidak Terdeteksi" ? "var(--danger)" : "var(--safe)" },
                ].filter(d => d.value).map(d => (
                  <div key={d.label} className="rc-detail-item">
                    <div className="rc-detail-label">{d.label}</div>
                    <div className="rc-detail-value" style={{ color: d.color || "var(--text)" }}>{d.value}</div>
                  </div>
                ))}
              </div>
              {res.dangerousPermissions?.length > 0 && (
                <div className="rc-perms">
                  <p className="rc-perms-title">⚠️ Permission Berbahaya Terdeteksi</p>
                  <div>
                    {res.dangerousPermissions.map((p: string, i: number) => (
                      <span key={i} className="rc-perm-tag">{p}</span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Password details */}
          {isPassword && (
            <>
              {res.strength && (
                <div className="pw-strength-wrap">
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
                    <span style={{ fontFamily:"'Space Mono',monospace", fontSize:"0.68rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"1.5px" }}>
                      Kekuatan Password
                    </span>
                    <span style={{ fontFamily:"'Space Mono',monospace", fontSize:"0.8rem", fontWeight:700, color: (() => {
                      const s = (res.strength||"").toLowerCase();
                      return s.includes("kuat") ? "var(--safe)" : s.includes("sedang") ? "var(--warn)" : "var(--danger)";
                    })() }}>{res.strength}</span>
                  </div>
                  <div className="pw-bars">
                    {[1,2,3,4,5].map(lvl => {
                      const sMap: Record<string,number> = {"sangat lemah":1,"lemah":2,"sedang":3,"kuat":4,"sangat kuat":5};
                      const cur = sMap[(res.strength||"").toLowerCase()] || 0;
                      const colors = ["var(--danger)","var(--danger)","var(--warn)","var(--safe)","var(--safe)"];
                      return <div key={lvl} className="pw-bar" style={{ background: lvl<=cur ? colors[lvl-1] : "var(--border)" }} />;
                    })}
                  </div>
                </div>
              )}
              <div className="rc-metrics">
                {res.entropy && (
                  <div className="rc-metric-card">
                    <div className="rc-metric-label">Entropi</div>
                    <div className="rc-metric-value" style={{ color:"var(--accent)" }}>{res.entropy}</div>
                  </div>
                )}
                {res.isLeaked && (
                  <div className="rc-metric-card">
                    <div className="rc-metric-label">Bocor di Database</div>
                    <div className="rc-metric-value" style={{ color: res.isLeaked.toLowerCase()==="tidak" ? "var(--safe)" : "var(--danger)" }}>
                      {res.isLeaked}
                    </div>
                  </div>
                )}
                {(res.usageCount||res.leakedCount) && (
                  <div className="rc-metric-card">
                    <div className="rc-metric-label">Estimasi Pengguna</div>
                    <div className="rc-metric-value" style={{ color:"var(--warn)", fontSize:"0.78rem" }}>
                      {res.usageCount || res.leakedCount}
                    </div>
                  </div>
                )}
                {result.category && (
                  <div className="rc-metric-card">
                    <div className="rc-metric-label">Kategori</div>
                    <div className="rc-metric-value">{result.category}</div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Indicators */}
          {result.indicators?.length > 0 && (
            <div className="rc-indicators">
              <p className="rc-indicators-title">Indikator Terdeteksi</p>
              {result.indicators.map((item: string, i: number) => (
                <div key={i} className="rc-ind-item">
                  <div className="rc-ind-dot" style={{ background:badge.color }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}

          {/* Recommendation */}
          {result.recommendation && (
            <div className="rc-rec">
              <div className="rc-rec-title">Rekomendasi untuk Kamu</div>
              <div className="rc-rec-body">{result.recommendation}</div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}