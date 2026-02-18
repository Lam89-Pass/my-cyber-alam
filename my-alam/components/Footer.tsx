export default function Footer() {
  return (
    <>
      <style>{`
        .footer-wrap {
          position: relative;
          z-index: 1;
          border-top: 1px solid var(--border);
          padding: 1.6rem 2rem;
        }
        .footer-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.8rem;
        }
        .footer-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .footer-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          flex-shrink: 0;
        }
        .footer-brand {
          font-family: 'Space Mono', monospace;
          font-size: 0.76rem;
          color: var(--muted);
          letter-spacing: 0.3px;
          line-height: 1.5;
        }
        .footer-copy {
          font-family: 'Space Mono', monospace;
          font-size: 0.73rem;
          color: var(--muted);
          letter-spacing: 0.3px;
          line-height: 1.5;
        }
        .footer-copy strong {
          color: var(--accent);
        }
        @media (max-width: 640px) {
          .footer-wrap { padding: 1.4rem 1.2rem; }
          .footer-inner { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
        }
      `}</style>

      <footer className="footer-wrap">
        <div className="footer-inner">
          <div className="footer-left">
            <div className="footer-dot" />
            <span className="footer-brand">CyberAlam — Keamanan Siber untuk Semua</span>
          </div>
          <span className="footer-copy">
            © 2025 <strong>Alam</strong> · Stay safe, stay smart 🛡️
          </span>
        </div>
      </footer>
    </>
  );
}