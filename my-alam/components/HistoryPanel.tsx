"use client";
import { useState } from "react";
import { IHistoryEntry } from "@/hooks/useScanHistory";
import { IScanResult, ScanType } from "@/types";
import { ScannerService } from "@/lib/services/ScannerService";

interface IHistoryPanelProps {
  history: IHistoryEntry[];
  onRestore: (result: IScanResult) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

const typeLabel: Record<string, string> = {
  [ScanType.URL]:  "🔗 URL",
  [ScanType.FILE]: "📁 File",
  PASSWORD:        "🔑 Password",
};

export default function HistoryPanel({ history, onRestore, onRemove, onClearAll }: IHistoryPanelProps) {
  const [open, setOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  if (history.length === 0) return null;

  return (
    <>
      <style>{`
        .hp-wrap {
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 2;
        }

        /* Toggle Bar */
        .hp-toggle {
          width: 100%;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: ${open ? "16px 16px 0 0" : "16px"};
          padding: 0.85rem 1.2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          gap: 12px;
        }
        .hp-toggle:hover { border-color: rgba(0,229,160,0.3); background: var(--surface2); }

        .hp-toggle-left {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          min-width: 0;
        }
        .hp-icon {
          width: 28px; height: 28px;
          background: var(--accent-dim);
          border: 1px solid rgba(0,229,160,0.3);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem;
          flex-shrink: 0;
        }
        .hp-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text);
          line-height: 1.3;
        }
        .hp-count {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          color: var(--muted);
          margin-top: 1px;
        }
        .hp-badge {
          background: var(--accent-dim);
          border: 1px solid rgba(0,229,160,0.3);
          color: var(--accent);
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 20px;
          flex-shrink: 0;
        }
        .hp-chevron {
          color: var(--muted);
          font-size: 0.75rem;
          transition: transform 0.25s;
          flex-shrink: 0;
        }
        .hp-chevron.open { transform: rotate(180deg); }

        /* Panel Body */
        .hp-panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-top: none;
          border-radius: 0 0 16px 16px;
          overflow: hidden;
        }

        /* Panel Header (actions) */
        .hp-panel-header {
          padding: 0.75rem 1.2rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--surface2);
        }
        .hp-panel-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          color: var(--muted);
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .hp-clear-btn {
          font-family: 'Space Mono', monospace;
          font-size: 0.68rem;
          color: var(--danger);
          background: none;
          border: 1px solid rgba(255,77,109,0.25);
          border-radius: 6px;
          padding: 3px 10px;
          cursor: pointer;
          transition: all 0.2s;
          line-height: 1.5;
        }
        .hp-clear-btn:hover { background: rgba(255,77,109,0.1); }

        /* Confirm clear */
        .hp-confirm {
          padding: 0.75rem 1.2rem;
          background: rgba(255,77,109,0.06);
          border-bottom: 1px solid rgba(255,77,109,0.2);
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .hp-confirm span {
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          color: var(--danger);
          flex: 1;
          min-width: 120px;
          line-height: 1.5;
        }
        .hp-confirm-yes {
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          background: var(--danger);
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 4px 12px;
          cursor: pointer;
          line-height: 1.5;
        }
        .hp-confirm-no {
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          background: var(--surface2);
          color: var(--muted);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 4px 12px;
          cursor: pointer;
          line-height: 1.5;
        }

        /* List */
        .hp-list {
          max-height: 340px;
          overflow-y: auto;
        }
        .hp-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0.85rem 1.2rem;
          border-bottom: 1px solid var(--border);
          transition: background 0.15s;
          cursor: pointer;
        }
        .hp-item:last-child { border-bottom: none; }
        .hp-item:hover { background: var(--surface2); }

        .hp-item-status {
          width: 32px; height: 32px;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .hp-item-info {
          flex: 1;
          min-width: 0;
        }
        .hp-item-ref {
          font-family: 'Space Mono', monospace;
          font-size: 0.75rem;
          color: var(--text);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-bottom: 3px;
        }
        .hp-item-meta {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }
        .hp-item-type {
          font-family: 'Space Mono', monospace;
          font-size: 0.62rem;
          color: var(--muted);
        }
        .hp-item-time {
          font-family: 'Space Mono', monospace;
          font-size: 0.62rem;
          color: var(--muted);
        }
        .hp-item-score {
          font-family: 'Space Mono', monospace;
          font-size: 0.62rem;
          font-weight: 700;
        }

        .hp-item-actions {
          display: flex;
          gap: 6px;
          flex-shrink: 0;
        }
        .hp-restore-btn {
          font-family: 'Syne', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          background: var(--accent-dim);
          color: var(--accent);
          border: 1px solid rgba(0,229,160,0.3);
          border-radius: 7px;
          padding: 4px 10px;
          cursor: pointer;
          white-space: nowrap;
          line-height: 1.5;
          transition: all 0.2s;
        }
        .hp-restore-btn:hover {
          background: rgba(0,229,160,0.2);
          border-color: rgba(0,229,160,0.5);
        }
        .hp-delete-btn {
          width: 26px; height: 26px;
          background: none;
          border: 1px solid var(--border);
          border-radius: 7px;
          color: var(--muted);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .hp-delete-btn:hover {
          background: rgba(255,77,109,0.1);
          border-color: rgba(255,77,109,0.4);
          color: var(--danger);
        }

        @media (max-width: 500px) {
          .hp-item-actions { flex-direction: column; gap: 4px; }
          .hp-restore-btn { font-size: 0.65rem; padding: 3px 8px; }
        }
      `}</style>

      <div className="hp-wrap">
        {/* Toggle Button */}
        <button className="hp-toggle" onClick={() => { setOpen(o => !o); setConfirmClear(false); }}>
          <div className="hp-toggle-left">
            <div className="hp-icon">🕐</div>
            <div>
              <div className="hp-title">Riwayat Scan</div>
              <div className="hp-count">Tersimpan otomatis di perangkat ini</div>
            </div>
          </div>
          <span className="hp-badge">{history.length}</span>
          <span className={`hp-chevron${open ? " open" : ""}`}>▼</span>
        </button>

        {/* Panel */}
        {open && (
          <div className="hp-panel">
            {/* Header actions */}
            <div className="hp-panel-header">
              <span className="hp-panel-label">📋 {history.length} Scan Terakhir</span>
              <button className="hp-clear-btn" onClick={() => setConfirmClear(true)}>
                🗑 Hapus Semua
              </button>
            </div>

            {/* Confirm clear */}
            {confirmClear && (
              <div className="hp-confirm">
                <span>Hapus semua riwayat? Tidak bisa dibatalkan.</span>
                <button className="hp-confirm-yes" onClick={() => { onClearAll(); setConfirmClear(false); setOpen(false); }}>
                  Hapus
                </button>
                <button className="hp-confirm-no" onClick={() => setConfirmClear(false)}>
                  Batal
                </button>
              </div>
            )}

            {/* List */}
            <div className="hp-list">
              {history.map(entry => {
                const icon        = ScannerService.getStatusIcon(entry.result.status);
                const scoreColor  = ScannerService.getRiskColorClass(entry.result.riskScore);
                const colorMap: Record<string,string> = { green: "var(--safe)", red: "var(--danger)", yellow: "var(--warn)" };
                const bgMap: Record<string,string>    = { green: "rgba(0,229,160,0.1)", red: "rgba(255,77,109,0.1)", yellow: "rgba(255,183,3,0.1)" };
                const time = new Date(entry.savedAt).toLocaleString("id-ID", {
                  day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                });

                return (
                  <div key={entry.id} className="hp-item">
                    <div className="hp-item-status" style={{ background: bgMap[scoreColor] }}>
                      {icon}
                    </div>
                    <div className="hp-item-info" onClick={() => onRestore(entry.result)} style={{ cursor: "pointer" }}>
                      <div className="hp-item-ref">
                        {entry.result.type === ("PASSWORD" as any) ? "🔑 ••••••••" : entry.result.inputRef}
                      </div>
                      <div className="hp-item-meta">
                        <span className="hp-item-type">{typeLabel[entry.result.type] ?? "Scan"}</span>
                        <span style={{ color: "var(--border)" }}>·</span>
                        <span className="hp-item-time">{time}</span>
                        <span style={{ color: "var(--border)" }}>·</span>
                        <span className="hp-item-score" style={{ color: colorMap[scoreColor] }}>
                          Risk: {entry.result.riskScore}/100
                        </span>
                      </div>
                    </div>
                    <div className="hp-item-actions">
                      <button className="hp-restore-btn" onClick={() => onRestore(entry.result)}>
                        Lihat
                      </button>
                      <button className="hp-delete-btn" onClick={e => { e.stopPropagation(); onRemove(entry.id); }}
                        title="Hapus entri ini">
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}