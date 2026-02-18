"use client";
import { IModalProps } from "@/types";

export default function TentangModal({ onClose }: IModalProps) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(2,12,10,0.85)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "20px", padding: "2.5rem", maxWidth: "680px", width: "92%",
          maxHeight: "90vh", overflowY: "auto", position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "1.2rem", right: "1.2rem",
            background: "var(--surface2)", border: "1px solid var(--border)",
            color: "var(--muted)", width: 32, height: 32, borderRadius: 8,
            cursor: "pointer", fontSize: "1rem",
          }}
        >✕</button>

        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--accent)", marginBottom: "0.3rem" }}>
          CyberAl Scanner
        </h2>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "1.5rem" }}>
          Panduan &amp; Informasi Platform
        </p>

        {[
          {
            num: "01", title: "Apa itu CyberAlam?",
            body: "CyberAlam adalah platform keamanan siber berbasis AI yang membantu kamu mendeteksi ancaman digital seperti link phishing, malware dalam file — secara gratis, cepat, dan akurat. Didukung teknologi AI canggih, CyberAlam menganalisis URL dan file APK/EXE untuk memberikan laporan keamanan yang komprehensif sebelum kamu klik atau instal.",
          },
          {
            num: "02", title: "Mengapa CyberAlam Dibuat?",
            body: "Di era digital yang makin kompleks, kasus penipuan online, phishing, dan penyebaran malware terus meningkat — terutama di Indonesia. Banyak orang sudah terlambat menyadari bahwa link yang mereka klik atau file yang mereka unduh adalah berbahaya. CyberAlam hadir sebagai garda terdepan untuk melindungi pengguna sebelum ancaman itu terjadi.",
          },
          {
            num: "03", title: "Cara Kerja",
            body: "Scan URL — Masukkan link yang mencurigakan. AI akan menganalisis reputasi domain, struktur URL, redirect chain, dan menentukan apakah link aman, mencurigakan, atau phishing.\n\nScan File/APK — Upload file yang ingin diperiksa. AI menganalisis metadata, permission berbahaya (untuk APK), dan pola malware untuk menentukan tingkat ancaman.",
          },
          {
            num: "04", title: "SEO & Visibilitas",
            body: `CyberAlam dioptimalkan untuk pencarian seperti: "cek link phishing Indonesia", "scan malware APK gratis", "deteksi penipuan online", "cek keamanan URL". Platform ini dibangun untuk memudahkan siapapun menemukan alat keamanan siber yang andal dan mudah digunakan.`,
          },
        ].map(s => (
          <div key={s.num} style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.5rem" }}>
              <span style={{ color: "var(--accent)", marginRight: 8 }}>{s.num}</span>{s.title}
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.7, whiteSpace: "pre-line" }}>{s.body}</p>
          </div>
        ))}

        <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--accent-dim)", border: "1px solid var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}>
            👨‍💻
          </div>
          <div>
            <small style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)" }}>DIBUAT OLEH</small>
            <strong style={{ fontSize: "0.95rem", color: "var(--text)" }}>Muhamad Nur Salam · IT Student</strong>
            <small style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", marginTop: 2 }}>Indonesia 🇮🇩</small>
          </div>
        </div>
      </div>
    </div>
  );
}