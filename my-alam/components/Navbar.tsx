"use client";
import { useState } from "react";
import { INavbarProps } from "@/types";

const socials = [
  {
    label: "Instagram", href: "https://instagram.com",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
  },
  {
    label: "TikTok", href: "https://tiktok.com",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.79a4.85 4.85 0 0 1-1.01-.1z"/></svg>,
  },
  {
    label: "LinkedIn", href: "https://linkedin.com",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  },
  {
    label: "Discord", href: "https://discord.com",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>,
  },
];

const WaIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);

export default function Navbar({ onTentangClick }: INavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <style>{`
        .nav-wrap {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(2,12,10,0.92);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
        }
        .nav-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 2rem;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.2rem;
        }

        /* LOGO */
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .nav-logo-icon {
          width: 36px; height: 36px; border-radius: 9px;
          background: var(--accent-dim);
          border: 1px solid var(--accent);
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
          box-shadow: var(--accent-glow);
          flex-shrink: 0;
        }
        .nav-logo-text {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.15rem;
          color: var(--accent);
          line-height: 1.2;
          letter-spacing: -0.3px;
          white-space: nowrap;
        }
        .nav-logo-sub {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          color: var(--muted);
          font-weight: 400;
          letter-spacing: 0.5px;
          line-height: 1;
          white-space: nowrap;
        }

        /* TENGAH — Tentang */
        .nav-tentang {
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text);
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 16px;
          border-radius: 8px;
          transition: color 0.2s, background 0.2s;
          white-space: nowrap;
          letter-spacing: 0.1px;
          line-height: 1.5;
        }
        .nav-tentang:hover {
          color: var(--accent);
          background: var(--accent-dim);
        }

        /* KANAN — social + cta wrapper */
        .nav-right {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        /* DIVIDER */
        .nav-divider {
          width: 1px;
          height: 20px;
          background: var(--border);
          margin: 0 4px;
          flex-shrink: 0;
        }

        /* SOCIAL ICON */
        .nav-social-icon {
          width: 34px; height: 34px;
          border-radius: 9px;
          background: none;
          border: 1px solid transparent;
          display: flex; align-items: center; justify-content: center;
          color: var(--muted);
          text-decoration: none;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .nav-social-icon:hover {
          border-color: var(--accent);
          background: var(--accent-dim);
          color: var(--accent);
          transform: translateY(-2px);
        }

        /* CTA */
        .nav-cta {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.85rem;
          color: #020c0a;
          background: var(--accent);
          border: none;
          text-decoration: none;
          padding: 9px 16px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          white-space: nowrap;
          letter-spacing: 0.1px;
          line-height: 1.5;
          box-shadow: 0 0 18px rgba(0,229,160,0.2);
          transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
          flex-shrink: 0;
          margin-left: 4px;
        }
        .nav-cta:hover {
          background: #00ffb3;
          box-shadow: 0 0 28px rgba(0,229,160,0.4);
          transform: translateY(-1px);
        }

        /* HAMBURGER */
        .nav-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
          flex-shrink: 0;
        }
        .nav-hamburger span {
          display: block;
          width: 22px; height: 2px;
          background: var(--text);
          border-radius: 2px;
          transition: all 0.25s;
        }

        /* MOBILE MENU */
        .nav-mobile-menu {
          display: none;
          flex-direction: column;
          gap: 10px;
          padding: 1rem 2rem 1.4rem;
          border-top: 1px solid var(--border);
          background: rgba(2,12,10,0.97);
        }
        .nav-mobile-menu.open { display: flex; }

        .nav-mobile-socials {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        /* ── RESPONSIVE ───────────────────────────── */
        @media (max-width: 768px) {
          .nav-inner { padding: 0 1.2rem; height: 62px; }
          .nav-right { display: none; }
          .nav-tentang { display: none; }
          .nav-hamburger { display: flex; }
          .nav-logo-sub { display: none; }
          .nav-mobile-menu { padding: 1rem 1.2rem 1.4rem; }
        }

        @media (min-width: 769px) and (max-width: 1000px) {
          .nav-inner { padding: 0 1.5rem; }
          .nav-logo-sub { display: none; }
          .nav-social-icon { width: 30px; height: 30px; }
        }
      `}</style>

      <nav className="nav-wrap">
        <div className="nav-inner">

          {/* KIRI — Logo */}
          <a href="#" className="nav-logo">
            <div className="nav-logo-icon">🛡️</div>
            <div>
              <div className="nav-logo-text">CyberAlam</div>
              <div className="nav-logo-sub">by Alam · Cyber Scanner</div>
            </div>
          </a>

          {/* TENGAH — Tentang */}
          <button className="nav-tentang" onClick={onTentangClick}>
            Tentang
          </button>

          {/* KANAN — Sosmed + CTA */}
          <div className="nav-right">
            {socials.map(s => (
              <a key={s.label} href={s.href} target="_blank"
                rel="noopener noreferrer" title={s.label}
                className="nav-social-icon">
                {s.icon}
              </a>
            ))}

            <div className="nav-divider" />

            <a href="https://wa.me/6285183009989" target="_blank"
              rel="noopener noreferrer" className="nav-cta">
              <WaIcon />
              Hubungi Saya
            </a>
          </div>

          {/* MOBILE — Hamburger */}
          <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
          </button>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        <div className={`nav-mobile-menu${menuOpen ? " open" : ""}`}>
          <button className="nav-tentang" style={{ textAlign: "left", width: "fit-content" }}
            onClick={() => { onTentangClick(); setMenuOpen(false); }}>
            Tentang
          </button>

          {/* Sosmed di mobile */}
          <div className="nav-mobile-socials">
            {socials.map(s => (
              <a key={s.label} href={s.href} target="_blank"
                rel="noopener noreferrer" title={s.label}
                className="nav-social-icon"
                style={{ border: "1px solid var(--border)", background: "var(--surface)" }}>
                {s.icon}
              </a>
            ))}
          </div>

          <a href="https://wa.me/6285183009989" target="_blank"
            rel="noopener noreferrer" className="nav-cta"
            style={{ width: "fit-content" }}
            onClick={() => setMenuOpen(false)}>
            <WaIcon />
            Hubungi Saya
          </a>
        </div>
      </nav>
    </>
  );
}