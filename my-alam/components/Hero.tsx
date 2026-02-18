export default function Hero() {
  return (
    <section style={{
      position: "relative", zIndex: 1,
      padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,5vw,4rem) clamp(3rem,6vh,5rem)",
      textAlign: "center", maxWidth: "900px", margin: "0 auto",
    }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: 600, height: 300, pointerEvents: "none",
        background: "radial-gradient(ellipse, rgba(0,229,160,0.08) 0%, transparent 70%)",
      }} />

      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: "rgba(0,229,160,0.1)", border: "1px solid rgba(0,229,160,0.3)",
        borderRadius: 20, padding: "5px 14px",
        fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--accent)",
        letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "1.5rem",
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", animation: "pulse 2s infinite", display: "inline-block" }} />
        AI-Powered · Real-time Analysis
      </div>

      <h1 style={{
        fontSize: "clamp(2.5rem, 7vw, 5rem)", fontWeight: 800,
        lineHeight: 1.05, letterSpacing: "-2px", marginBottom: "1.2rem",
      }}>
        Deteksi Ancaman{" "}
        <em style={{ fontStyle: "normal", color: "var(--accent)", position: "relative" }}>
          Siber
        </em>
        <br />Sebelum Terlambat
      </h1>

      <p style={{
        fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "var(--muted)",
        maxWidth: 600, margin: "0 auto", lineHeight: 1.7,
      }}>
        Scan URL, file, dan APK mencurigakan dengan teknologi AI canggih.
        Lindungi dirimu dari phishing, malware, dan penipuan digital — gratis, cepat, dan akurat.
      </p>
    </section>
  );
}