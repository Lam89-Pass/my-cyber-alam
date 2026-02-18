import { IResultCardProps, ScanStatus, ScanType } from "@/types";
import { ScannerService } from "@/lib/services/ScannerService";

export default function ResultCard({ result }: IResultCardProps) {
  const badgeClass  = ScannerService.getBadgeClass(result.status);
  const icon        = ScannerService.getStatusIcon(result.status);
  const scoreColor  = ScannerService.getRiskColorClass(result.riskScore);

  const colorMap: Record<string, string> = {
    green: "var(--safe)", red: "var(--danger)", yellow: "var(--warn)",
  };
  const badgeStyle: Record<string, { bg: string; color: string; border: string }> = {
    "badge-safe":  { bg: "rgba(0,229,160,0.12)",  color: "var(--safe)",   border: "rgba(0,229,160,0.3)" },
    "badge-danger":{ bg: "rgba(255,77,109,0.12)", color: "var(--danger)", border: "rgba(255,77,109,0.3)" },
    "badge-warn":  { bg: "rgba(255,183,3,0.12)",  color: "var(--warn)",   border: "rgba(255,183,3,0.3)" },
  };
  const badge = badgeStyle[badgeClass];

  // ── Build metric rows based on scan type ──────────────────────────────────────
  const metrics: { label: string; value: string; color?: string }[] = [
    { label: "Risk Score", value: `${result.riskScore}/100`, color: colorMap[scoreColor] },
    { label: "Kategori",   value: result.category,           color: "var(--text)" },
  ];

  if (result.type === ScanType.URL) {
    if (result.domain)       metrics.push({ label: "Domain",        value: result.domain });
    if (result.ssl)          metrics.push({ label: "SSL/HTTPS",     value: result.ssl,        color: result.ssl === "Ada" ? "var(--safe)" : "var(--danger)" });
    if (result.ipReputation) metrics.push({ label: "IP Reputation", value: result.ipReputation, color: result.ipReputation === "Bersih" ? "var(--safe)" : "var(--danger)" });
  }

  if (result.type === ScanType.FILE) {
    if (result.fileType) metrics.push({ label: "Tipe File", value: result.fileType });
  }

  if (result.type === ScanType.PHONE) {
    if (result.operator)      metrics.push({ label: "Operator",       value: result.operator });
    if (result.region)        metrics.push({ label: "Region",         value: result.region });
    if (result.reportedCount) metrics.push({ label: "Laporan",        value: result.reportedCount, color: result.reportedCount === "Tidak Ada Laporan" ? "var(--safe)" : "var(--danger)" });
    if (result.scamType)      metrics.push({ label: "Jenis Penipuan", value: result.scamType });
  }

  if (result.type === ScanType.EMAIL) {
    if (result.emailDomain)      metrics.push({ label: "Domain Email",      value: result.emailDomain });
    if (result.senderReputation) metrics.push({ label: "Reputasi Pengirim", value: result.senderReputation, color: result.senderReputation === "Terpercaya" ? "var(--safe)" : "var(--danger)" });
    if (result.breachFound)      metrics.push({ label: "Data Breach",       value: result.breachFound, color: result.breachFound === "Tidak Ada" ? "var(--safe)" : "var(--danger)" });
    if (result.spfStatus)        metrics.push({ label: "SPF",               value: result.spfStatus });
    if (result.dmarcStatus)      metrics.push({ label: "DMARC",             value: result.dmarcStatus });
  }

  // ── Type label ────────────────────────────────────────────────────────────────
  const typeLabel: Record<ScanType, string> = {
    [ScanType.URL]:   "🔗 URL Analysis",
    [ScanType.FILE]:  "📁 File Analysis",
    [ScanType.PHONE]: "📱 Phone Analysis",
    [ScanType.EMAIL]: "📧 Email Analysis",
  };

  const detailText = [
    result.indicators?.length
      ? "🚩 INDIKATOR ANCAMAN:\n" + result.indicators.map(i => `  • ${i}`).join("\n")
      : null,
    result.dangerousPermissions?.length
      ? "\n⚠️ PERMISSION BERBAHAYA:\n" + result.dangerousPermissions.map(p => `  • ${p}`).join("\n")
      : null,
    result.recommendation
      ? `\n💡 REKOMENDASI:\n  ${result.recommendation}`
      : null,
  ].filter(Boolean).join("\n");

  return (
    <>
      <style>{`
        .result-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 1.5rem;
          animation: slideUp 0.4s cubic-bezier(.16,1,.3,1);
        }
        .result-header {
          padding: 1.1rem 1.8rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border);
          flex-wrap: wrap;
          gap: 8px;
        }
        .result-header-left { display: flex; align-items: center; gap: 10px; }
        .result-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 13px; border-radius: 20px;
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem; font-weight: 700; letter-spacing: 1px;
          white-space: nowrap;
        }
        .result-type-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          color: var(--muted);
          line-height: 1.5;
        }
        .result-time {
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          color: var(--muted);
          line-height: 1.5;
        }
        .result-body { padding: 1.5rem 1.8rem; }
        .result-ref {
          font-family: 'Space Mono', monospace;
          font-size: 0.78rem;
          color: var(--muted);
          margin-bottom: 1rem;
          word-break: break-all;
          line-height: 1.6;
        }
        .result-summary {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 400;
          color: var(--text);
          line-height: 1.75;
          margin-bottom: 1.2rem;
        }
        .result-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 10px;
          margin-bottom: 1.2rem;
        }
        .metric-box {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 0.9rem 1rem;
        }
        .metric-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.62rem;
          color: var(--muted);
          letter-spacing: 1.2px;
          text-transform: uppercase;
          margin-bottom: 4px;
          line-height: 1.5;
        }
        .metric-value {
          font-family: 'Syne', sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          line-height: 1.4;
        }
        .result-detail {
          font-family: 'Space Mono', monospace;
          font-size: 0.78rem;
          color: var(--muted);
          line-height: 1.8;
          white-space: pre-wrap;
          background: var(--surface2);
          border-radius: 12px;
          padding: 1rem 1.2rem;
        }
        /* URL screenshot placeholder */
        .screenshot-placeholder {
          border: 1px solid var(--border);
          border-radius: 12px;
          height: 140px;
          display: flex; align-items: center; justify-content: center;
          flex-direction: column; gap: 6px;
          margin-bottom: 1.2rem;
          background: var(--surface2);
          color: var(--muted);
        }
        .screenshot-placeholder span:first-child { font-size: 1.8rem; }
        .screenshot-placeholder span {
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          line-height: 1.5;
        }
      `}</style>

      <div className="result-card">
        {/* Header */}
        <div className="result-header">
          <div className="result-header-left">
            <div className="result-badge" style={{
              background: badge.bg, color: badge.color,
              border: `1px solid ${badge.border}`,
            }}>
              {icon} {result.status}
            </div>
            <span className="result-type-label">{typeLabel[result.type]}</span>
          </div>
          <span className="result-time">
            {result.scannedAt.toLocaleTimeString("id-ID")}
          </span>
        </div>

        {/* Body */}
        <div className="result-body">
          {/* Referensi input */}
          <p className="result-ref">🔎 {result.inputRef}</p>

          {/* Screenshot placeholder untuk URL */}
          {result.type === ScanType.URL && (
            <div className="screenshot-placeholder">
              <span>🖼️</span>
              <span>Preview halaman — hubungkan VirusTotal API untuk screenshot live</span>
            </div>
          )}

          {/* Summary */}
          <p className="result-summary">{result.summary}</p>

          {/* Metrics */}
          <div className="result-metrics">
            {metrics.map(m => (
              <div key={m.label} className="metric-box">
                <div className="metric-label">{m.label}</div>
                <div className="metric-value" style={{ color: m.color ?? "var(--text)" }}>
                  {m.value}
                </div>
              </div>
            ))}
          </div>

          {/* Detail block */}
          {detailText && (
            <pre className="result-detail">{detailText}</pre>
          )}
        </div>
      </div>
    </>
  );
}