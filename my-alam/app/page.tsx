"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import TentangModal from "@/components/TentangModal";
import Hero from "@/components/Hero";
import Scanner from "@/components/Scanner";
import SocialSection from "@/components/SocialSection";
import Footer from "@/components/Footer";

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:         #020c0a;
    --surface:    #061410;
    --surface2:   #0b1f1a;
    --border:     #0f3028;
    --accent:     #00e5a0;
    --accent2:    #00b37a;
    --accent-dim: rgba(0,229,160,0.12);
    --accent-glow: 0 0 24px rgba(0,229,160,0.35);
    --danger:     #ff4d6d;
    --warn:       #ffb703;
    --safe:       #00e5a0;
    --text:       #d4ede7;
    --muted:      #5a8a78;
    --font-display: 'Syne', sans-serif;
    --font-mono:    'Space Mono', monospace;
  }

  html {
    font-size: 16px;
    text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-display);
    line-height: 1.6;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-synthesis: none;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:.5;transform:scale(.8);} }
  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes slideUp { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }
`;

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

      {/* Grid background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(rgba(0,229,160,0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,229,160,0.035) 1px, transparent 1px)`,
        backgroundSize: "44px 44px",
      }} />

      <Navbar onTentangClick={() => setShowModal(true)} />
      {showModal && <TentangModal onClose={() => setShowModal(false)} />}
      <Hero />
      <Scanner />
      <SocialSection />
      <Footer />
    </>
  );
}