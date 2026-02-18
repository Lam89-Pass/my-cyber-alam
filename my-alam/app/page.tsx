'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ArrowRight, UploadCloud, Globe, ShieldCheck, 
  AlertTriangle, CheckCircle2, Terminal, X, Lock, FileCode, Zap, MessageCircle 
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility Class ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Ikon Sosial Media (SVG Manual agar akurat) ---
const SocialIcon = ({ path, href, label }: { path: string, href: string, label: string }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noreferrer"
    className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-cyan-500/50 hover:text-cyan-400 hover:scale-110 transition-all group"
    aria-label={label}
  >
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-400 group-hover:text-cyan-400">
      <path d={path} />
    </svg>
  </a>
);

export default function Home() {
  const [inputMode, setInputMode] = useState<'url' | 'file'>('url');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showAbout, setShowAbout] = useState(false);

  // --- Konfigurasi Dropzone (File Upload) ---
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      setLoading(true);
      // Simulasi Analisis File
      setTimeout(() => {
        setLoading(false);
        setResult({ 
          title: files[0].name, 
          riskScore: 95, 
          verdict: "malicious", 
          type: "APK / Executable",
          details: "Terdeteksi Trojan.Gen.X dalam manifest aplikasi.",
          screenshot: null // File tidak ada screenshot web
        });
      }, 2500);
    },
  });

  // --- Handler Analisis URL ---
  const handleAnalyze = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!url) return;
    setLoading(true);
    setResult(null);
    
    // Simulasi API Call
    setTimeout(() => {
        setLoading(false);
        setResult({ 
          title: "Login Page (Suspicious)", 
          riskScore: 88, 
          verdict: "malicious", 
          type: "Phishing URL",
          details: "Website ini meniru tampilan halaman login resmi (Google/Facebook).",
          screenshot: "https://via.placeholder.com/600x400/0f172a/ef4444?text=Preview+Website+Phishing", // Placeholder
          url: url 
        });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans flex flex-col relative overflow-hidden selection:bg-cyan-500/30">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-cyan-900/20 rounded-full blur-[120px] opacity-40" />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* --- 1. NAVBAR (Header) --- */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-50 relative">
        {/* Kiri: Logo Nama */}
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white cursor-pointer" onClick={() => window.location.reload()}>
           <ShieldCheck className="w-6 h-6 text-cyan-500" />
           <span>Alam<span className="text-cyan-500">Security</span></span>
        </div>

        {/* Tengah: Tombol Tentang (Trigger Modal) */}
        <button 
          onClick={() => setShowAbout(true)}
          className="hidden md:block text-sm font-medium text-slate-400 hover:text-white transition-colors hover:underline decoration-cyan-500 underline-offset-4"
        >
          Tentang & Panduan
        </button>

        {/* Kanan: Hubungi Saya (WhatsApp) */}
        <a 
          href="https://wa.me/6281234567890" // Ganti dengan nomor WA Anda
          target="_blank"
          className="flex items-center gap-2 bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200 px-4 py-2 rounded-full text-xs font-semibold transition-all hover:bg-slate-800"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Hubungi Saya</span>
        </a>
      </nav>

      {/* --- 2. KONTEN UTAMA --- */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 z-10 w-full max-w-4xl mx-auto mb-12">
        
        <AnimatePresence mode="wait">
          {!result ? (
            /* --- STATE INPUT --- */
            <motion.div 
              key="input-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex flex-col items-center text-center space-y-8"
            >
               {/* Judul & Deskripsi */}
               <div className="space-y-4 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-[10px] font-mono text-cyan-400">
                      <Terminal className="w-3 h-3" />
                      <span>SYSTEM V2.0 ONLINE</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
                    Cek Keamanan Link <br /> & File Mencurigakan
                  </h1>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    Jangan asal klik! Tempel URL atau upload file di sini untuk mendeteksi ancaman 
                    <span className="text-cyan-400 font-medium"> Phishing</span>, 
                    <span className="text-rose-400 font-medium"> Malware</span>, atau 
                    <span className="text-amber-400 font-medium"> Scam</span> secara instan.
                  </p>
               </div>

               {/* Tab Pilihan (URL / File) */}
               <div className="flex p-1 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <button 
                    onClick={() => setInputMode('url')}
                    className={cn(
                      "px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                      inputMode === 'url' ? "bg-slate-800 text-white shadow-lg shadow-cyan-900/10" : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    <Globe className="w-4 h-4" /> URL / Link
                  </button>
                  <button 
                    onClick={() => setInputMode('file')}
                    className={cn(
                      "px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                      inputMode === 'file' ? "bg-slate-800 text-white shadow-lg shadow-cyan-900/10" : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    <UploadCloud className="w-4 h-4" /> File / APK
                  </button>
               </div>

               {/* Input Area */}
               <div className="w-full max-w-2xl relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-50 transition duration-1000"></div>
                  
                  <div className="relative bg-[#0B1121] rounded-2xl border border-slate-800 flex items-center p-2 shadow-2xl">
                    {inputMode === 'url' ? (
                      <>
                        <div className="pl-4 pr-3 text-slate-500"><Search className="w-5 h-5" /></div>
                        <input 
                          type="url"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="Tempel link yang ingin diperiksa..."
                          className="flex-1 bg-transparent text-white placeholder-slate-600 text-base md:text-lg py-3 outline-none w-full"
                          disabled={loading}
                        />
                        <button 
                          onClick={handleAnalyze}
                          disabled={!url || loading}
                          className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                        </button>
                      </>
                    ) : (
                      <div {...getRootProps()} className="w-full h-24 border-2 border-dashed border-slate-700/50 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500/50 hover:bg-slate-900/50 transition-all gap-2">
                         <input {...getInputProps()} />
                         <UploadCloud className="w-6 h-6 text-slate-400" />
                         <p className="text-sm text-slate-400">Klik atau Drag file (APK/EXE/JPG) ke sini</p>
                      </div>
                    )}
                  </div>
               </div>

               {/* 4. Ikuti Kami (Social Media) */}
               <div className="pt-8 flex flex-col items-center gap-4">
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Ikuti Kami</p>
                  <div className="flex gap-4">
                    {/* Instagram */}
                    <SocialIcon href="#" label="Instagram" path="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22H7.75A5.75 5.75 0 0 1 2 16.25V7.75A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25V7.75a4.25 4.25 0 0 0-4.25-4.25H7.75zm0 8.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm8.5-4.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                    {/* LinkedIn */}
                    <SocialIcon href="#" label="LinkedIn" path="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68zm1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    {/* TikTok (Simple Path) */}
                    <SocialIcon href="#" label="TikTok" path="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    {/* Discord (Simple Path) */}
                    <SocialIcon href="#" label="Discord" path="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.2 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08 0-.1c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09 0 .11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" />
                  </div>
               </div>
            </motion.div>
          ) : (
            /* --- STATE HASIL ANALISIS (Result) --- */
            <motion.div 
               key="result-card"
               initial={{ opacity: 0, y: 40 }}
               animate={{ opacity: 1, y: 0 }}
               className="w-full max-w-3xl"
            >
               <button onClick={() => setResult(null)} className="mb-4 text-slate-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
                  <ArrowRight className="w-4 h-4 rotate-180" /> Kembali ke Scanner
               </button>

               <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
                  {/* Header Hasil */}
                  <div className={cn(
                     "p-6 border-b border-slate-800 flex justify-between items-center",
                     result.verdict === 'malicious' ? "bg-rose-500/10" : "bg-emerald-500/10"
                  )}>
                     <div className="flex gap-4 items-center">
                        <div className={cn("p-3 rounded-full", result.verdict === 'malicious' ? "bg-rose-500 text-white" : "bg-emerald-500 text-white")}>
                           {result.verdict === 'malicious' ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                        </div>
                        <div>
                           <h2 className="text-xl font-bold text-white">{result.title}</h2>
                           <p className="text-sm text-slate-300 flex items-center gap-2">
                             {result.type} <span className="w-1 h-1 bg-slate-500 rounded-full"/> {result.verdict === 'malicious' ? 'BERBAHAYA' : 'AMAN'}
                           </p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase font-bold">Risk Score</p>
                        <p className={cn("text-3xl font-black", result.verdict === 'malicious' ? "text-rose-500" : "text-emerald-500")}>
                           {result.riskScore}/100
                        </p>
                     </div>
                  </div>

                  {/* Konten Detail */}
                  <div className="p-6 grid md:grid-cols-2 gap-6">
                     {/* Kolom Kiri: Preview / Screenshot */}
                     <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                           <Zap className="w-4 h-4" /> Preview
                        </h3>
                        {result.screenshot ? (
                          <div className="rounded-xl overflow-hidden border border-slate-700 relative group">
                            <img src={result.screenshot} alt="Preview" className="w-full h-40 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <span className="text-xs text-white bg-black/80 px-2 py-1 rounded">Klik Link Berbahaya!</span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-40 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-slate-600">
                             <FileCode className="w-8 h-8 mb-2" />
                             <span className="text-xs">File Analysis Preview Not Available</span>
                          </div>
                        )}
                     </div>

                     {/* Kolom Kanan: Detail Analisis */}
                     <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                           <Lock className="w-4 h-4" /> Detail Keamanan
                        </h3>
                        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-sm leading-relaxed text-slate-300">
                           <p className="mb-2 font-medium text-white">Analisis AI:</p>
                           {result.details}
                           <div className="mt-4 pt-4 border-t border-slate-800 flex gap-2">
                              <span className="px-2 py-1 bg-rose-500/20 text-rose-400 text-xs rounded">Phishing</span>
                              <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded">Social Engineering</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* --- 5. FOOTER REVISI --- */}
      <footer className="w-full py-8 text-center border-t border-slate-900 bg-slate-950 z-10">
        <p className="text-sm text-slate-500">
          Dibuat oleh <span className="text-cyan-400 font-semibold">Alam</span> untuk Keamanan Digital Indonesia.
        </p>
        <p className="text-[10px] text-slate-700 mt-1">© 2024 AlamSecurity. All Rights Reserved.</p>
      </footer>

      {/* --- MODAL TENTANG (SEO Friendly) --- */}
      <AnimatePresence>
        {showAbout && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowAbout(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setShowAbout(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
              
              <div className="p-8 space-y-6 text-slate-300">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-2xl font-bold text-white mb-2">Tentang AlamSecurity</h2>
                  <p className="text-sm text-cyan-400">Panduan & Informasi Platform</p>
                </div>

                <section>
                  <h3 className="text-white font-semibold mb-2">Apa itu website ini?</h3>
                  <p className="text-sm leading-relaxed">
                    AlamSecurity adalah alat analisis keamanan siber berbasis web (Cyber Threat Analyzer). Website ini dirancang untuk membantu masyarakat mendeteksi tautan (URL) phishing, file berbahaya (Malware), dan potensi penipuan online sebelum Anda menjadi korban.
                  </p>
                </section>

                <section>
                  <h3 className="text-white font-semibold mb-2">Mengapa dibuat?</h3>
                  <p className="text-sm leading-relaxed">
                    Maraknya kasus penipuan digital melalui link undangan pernikahan palsu, file APK kurir paket, dan modus lainnya mendasari pembuatan alat ini. Tujuannya adalah menyediakan verifikasi keamanan instan yang mudah digunakan oleh siapa saja.
                  </p>
                </section>

                <section>
                  <h3 className="text-white font-semibold mb-2">Bagaimana cara kerjanya?</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 text-slate-400">
                    <li><strong>URL Scanner:</strong> Memeriksa reputasi domain, sertifikat SSL, dan struktur halaman web secara real-time.</li>
                    <li><strong>File Analyzer:</strong> Membedah file (seperti APK) untuk mencari script berbahaya atau permission yang mencurigakan.</li>
                    <li><strong>Sandboxing:</strong> Membuka link di lingkungan terisolasi agar perangkat Anda tetap aman.</li>
                  </ul>
                </section>

                <section className="pt-4 border-t border-slate-800">
                  <h3 className="text-white font-semibold mb-2">Siapa Pembuatnya?</h3>
                  <p className="text-sm leading-relaxed">
                    Platform ini dikembangkan dan dikelola oleh <strong className="text-white">Alam</strong>, seorang penggiat keamanan siber yang berdedikasi untuk menciptakan internet yang lebih aman bagi masyarakat Indonesia.
                  </p>
                </section>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}