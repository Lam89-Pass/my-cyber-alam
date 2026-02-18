"use client";
import { useState } from "react";
import { INavbarProps } from "@/types";

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
          gap: 1rem;
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
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: var(--accent-dim);
          border: 1px solid var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          box-shadow: var(--accent-glow);
          flex-shrink: 0;
        }
        .nav-logo-text {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
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

        /* TENTANG BUTTON */
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

        /* CTA */
        .nav-cta {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.85rem;
          color: #020c0a;
          background: var(--accent);
          border: none;
          text-decoration: none;
          padding: 9px 18px;
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
        }
        .nav-cta:hover {
          background: #00ffb3;
          box-shadow: 0 0 28px rgba(0,229,160,0.4);
          transform: translateY(-1px);
        }

        /* HAMBURGER — mobile only */
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
          width: 22px;
          height: 2px;
          background: var(--text);
          border-radius: 2px;
          transition: all 0.25s;
        }

        /* MOBILE MENU */
        .nav-mobile-menu {
          display: none;
          flex-direction: column;
          gap: 8px;
          padding: 1rem 2rem 1.2rem;
          border-top: 1px solid var(--border);
          background: rgba(2,12,10,0.97);
        }
        .nav-mobile-menu.open {
          display: flex;
        }

        /* RESPONSIVE */
        @media (max-width: 640px) {
          .nav-inner {
            padding: 0 1.2rem;
            height: 60px;
          }
          .nav-tentang,
          .nav-cta {
            display: none;
          }
          .nav-hamburger {
            display: flex;
          }
          .nav-logo-sub {
            display: none;
          }
          .nav-mobile-menu {
            display: none;
            padding: 1rem 1.2rem 1.2rem;
          }
          .nav-mobile-menu.open {
            display: flex;
          }
        }

        @media (min-width: 641px) and (max-width: 860px) {
          .nav-inner {
            padding: 0 1.5rem;
          }
          .nav-logo-sub {
            display: none;
          }
          .nav-cta {
            padding: 8px 14px;
            font-size: 0.82rem;
          }
        }
      `}</style>

      <nav className="nav-wrap">
        <div className="nav-inner">
          <a href="#" className="nav-logo">
            <div className="nav-logo-icon">🛡️</div>
            <div>
              <div className="nav-logo-text">CyberAl</div>
            </div>
          </a>

          <button className="nav-tentang" onClick={onTentangClick}>
            Tentang
          </button>

          <a
            href="https://wa.me/6285603103375"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-cta"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
            Hubungi Saya
          </a>

          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
          </button>
        </div>

        <div className={`nav-mobile-menu${menuOpen ? " open" : ""}`}>
          <button
            className="nav-tentang"
            onClick={() => { onTentangClick(); setMenuOpen(false); }}
            style={{ textAlign: "left", width: "fit-content" }}
          >
            Tentang
          </button>
          <a
            href="https://wa.me/6285183009989"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-cta"
            style={{ width: "fit-content" }}
            onClick={() => setMenuOpen(false)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
            Hubungi Saya
          </a>
        </div>
      </nav>
    </>
  );
}