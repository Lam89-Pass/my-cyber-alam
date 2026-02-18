import { IResultCardProps, ScanStatus, ScanType } from "@/types";
import { ScannerService } from "@/lib/services/ScannerService";

export default function ResultCard({ result }: IResultCardProps) {
  const badgeClass = ScannerService.getBadgeClass(result.status);
  const icon = ScannerService.getStatusIcon(result.status);
  const scoreColor = ScannerService.getRiskColorClass(result.riskScore);

  const colorMap: Record<string, string> = {
    green: "var(--safe)",
    red: "var(--danger)",
    yellow: "var(--warn)",
  };

  const badgeColors: Record<string, { bg: string; color: string; border: string }> = {
    "badge-safe":    { bg: "rgba(0,229,160,0.15)",  color: "var(--safe)",   border: "rgba(0,229,160,0.3)" },
    "badge-danger":  { bg: "rgba(255,77,109,0.15)", color: "var(--danger)", border: "rgba(255,77,109,0.3)" },
    "badge-warn":    { bg: "rgba(255,183,3,0.15)",  color: "var(--warn)",   border: "rgba(255,183,3,0.3)" },
  };
  const badge = badgeColors[badgeClass];

  const metrics = [
    { label: "Risk Score", value: `${result.riskScore}/100`, color: colorMap[scoreColor] },
    { label: "Kategori",   value: result.category,           color: "var(--text)" },
    ...(result.domain      ? [{ label: "Domain",        value: result.domain,                                                         color: "var(--text)" }] : []),
    ...(result.ssl         ? [{ label: "SSL / HTTPS",   value: result.ssl,        color: result.ssl === "Ada" ? "var(--safe)" : "var(--danger)" }] : []),
    ...(result.ipReputation? [{ label: "IP Reputation", value: result.ipReputation, color: result.ipReputation === "Bersih" ? "var(--safe)" : "var(--danger)" }] : []),
    ...(result.fileType    ? [{ label: "Tipe File",     value: result.fileType,                                                       color: "var(--text)" }] : []),
  ];

  const detailText = [
    result.indicators?.length  ? "🚩 INDIKATOR ANCAMAN:\n" + result.indicators.map(i => `  • ${i}`).join("\n") : null,
    result.dangerousPermissions?.length ? "\n⚠️ PERMISSION BERBAHAYA:\n" + result.dangerousPermissions.map(p => `  • ${p}`).join("\n") : null,
    result.recommendation ? `\n💡 REKOMENDASI:\n  ${result.recommendation}` : null,
  ].filter(Boolean).join("\n");

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 20, overflow: "hidden", marginBottom: "1.5rem",
      animation: "slideUp 0.4s cubic-bezier(.16,1,.3,1)",
    }}>
      <div style={{
        padding: "1.2rem 2rem", display: "flex", alignItems: "center",
        justifyContent: "space-between", borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "5px 14px", borderRadius: 20,
            fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "1px",
            background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`,
          }}>
            {icon} {result.status}
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)" }}>
            {result.type === ScanType.URL ? "🔗 URL Analysis" : "📁 File Analysis"}
          </span>
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)" }}>
          {result.scannedAt.toLocaleTimeString("id-ID")}
        </span>
      </div>

      <div style={{ padding: "1.5rem 2rem" }}>
        {result.type === ScanType.URL && (
          <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", marginBottom: "1rem" }}>
            <div style={{
              background: "var(--surface2)", height: 160,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column", gap: 8, color: "var(--muted)", fontSize: "0.85rem",
            }}>
              <span style={{ fontSize: "2rem" }}>🖼️</span>
              <span>Preview screenshot halaman</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}>{result.inputRef}</span>
            </div>
          </div>
        )}

        <p style={{ fontSize: "1.05rem", color: "var(--text)", lineHeight: 1.7, marginBottom: "1.2rem" }}>
          {result.summary}
        </p>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))",
          gap: 12, marginBottom: "1.2rem",
        }}>
          {metrics.map(m => (
            <div key={m.label} style={{
              background: "var(--surface2)", border: "1px solid var(--border)",
              borderRadius: 12, padding: "1rem",
            }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--muted)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 }}>
                {m.label}
              </div>
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>

        {detailText && (
          <pre style={{
            fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--muted)",
            lineHeight: 1.8, whiteSpace: "pre-wrap", background: "var(--surface2)",
            borderRadius: 10, padding: "1rem", margin: 0,
          }}>
            {detailText}
          </pre>
        )}
      </div>
    </div>
  );
}