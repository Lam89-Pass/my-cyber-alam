import { IResultCardProps, ScanStatus, ScanType } from "@/types";
// Pastikan impor menggunakan { ScannerService } untuk mengambil Kelas, bukan instans
import { ScannerService } from "@/lib/services/ScannerService"; 

export default function ResultCard({ result }: IResultCardProps) {
  // Sekarang pemanggilan static method ini tidak akan error
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
  
  // Tambahkan fallback agar tidak undefined
  const badge = badgeStyle[badgeClass] || badgeStyle["badge-warn"];

  const metrics: { label: string; value: string; color?: string }[] = [
    { label: "Risk Score", value: `${result.riskScore}/100`, color: colorMap[scoreColor] },
    { label: "Kategori",   value: result.category || "Analisis", color: "var(--text)" },
  ];

  // Logika tampilan untuk Password (Fitur baru kamu)
  if (result.type === ("PASSWORD" as any)) {
    const res = result as any;
    if (res.strength)   metrics.push({ label: "Kekuatan", value: res.strength, color: res.strength.includes("Kuat") ? "var(--safe)" : "var(--danger)" });
    if (res.isLeaked)   metrics.push({ label: "Kebocoran", value: res.isLeaked, color: res.isLeaked === "Tidak" ? "var(--safe)" : "var(--danger)" });
    if (res.entropy)    metrics.push({ label: "Entropi",  value: res.entropy });
  }

  // Tipe label yang diperbarui
  const typeLabel: Record<string, string> = {
    [ScanType.URL]:   "🔗 URL Analysis",
    [ScanType.FILE]:  "📁 File Analysis",
    "PASSWORD":       "🔑 Password Analysis",
  };

  return (
    <div className="result-card">
      <div className="result-header" style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="result-badge" style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem' }}>
            {icon} {result.status}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{typeLabel[result.type] || "Analysis"}</span>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
          {new Date(result.scannedAt).toLocaleTimeString("id-ID")}
        </span>
      </div>

      <div className="result-body" style={{ padding: '1.5rem' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '1rem' }}>
          {result.type === ("PASSWORD" as any) ? "🔑 [PASSWORD HIDDEN]" : `🔎 ${result.inputRef}`}
        </p>
        <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>{result.summary}</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '1.5rem' }}>
          {metrics.map(m => (
            <div key={m.label} style={{ background: 'var(--surface2)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>{m.label}</div>
              <div style={{ fontWeight: 'bold', color: m.color || 'var(--text)' }}>{m.value}</div>
            </div>
          ))}
        </div>

        {result.recommendation && (
          <div style={{ background: 'var(--surface2)', padding: '1rem', borderRadius: '12px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>💡 REKOMENDASI:</span>
            <p style={{ marginTop: '5px', color: 'var(--muted)' }}>{result.recommendation}</p>
          </div>
        )}
      </div>
    </div>
  );
}