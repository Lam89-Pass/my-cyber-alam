'use client';

import React, { useState } from 'react';
import { 
  Search, ArrowRight, UploadCloud, Globe, ShieldCheck, 
  AlertTriangle, CheckCircle2, Terminal 
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export default function Home() {
  const [inputMode, setInputMode] = useState<'url' | 'file'>('url');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => alert(`File ${files[0].name} siap (Demo Only)`),
  });

  // Dummy Handler
  const handleAnalyze = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!url) return;
    setLoading(true);
    // Simulasi loading
    setTimeout(() => {
        setLoading(false);
        setResult({ title: "Google.com", riskScore: 10, verdict: "safe", url: url });
    }, 1500);
  };

  return (
    // CONTAINER UTAMA: Pakai flex-col biar header, konten, footer urut ke bawah
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col justify-between relative overflow-hidden">
      
      {/* Background Effect (Position Absolute & Z-0 biar di belakang) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px]" />
      </div>

      {/* 1. NAVBAR (Z-index tinggi biar gak ketutup) */}
      <nav className="w-full p-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-2 text-white font-bold tracking-tight">
           <ShieldCheck className="w-6 h-6 text-cyan-500" />
           <span>Cyber<span className="text-cyan-500">Analyzer</span></span>
        </div>
        <div className="text-xs font-mono text-slate-500 border border-slate-800 px-3 py-1 rounded-full">
           v2.0 Stable
        </div>
      </nav>

      {/* 2. MAIN CONTENT (Tengah) */}
      <main className="flex-1 flex flex-col items-center justify-center w-full px-4 z-10">
        
        {/* Wrapper Konten: Dibatasi max-width-2xl (sekitar 670px) biar gak melebar */}
        <div className="w-full max-w-2xl flex flex-col gap-8 text-center">
            
            {/* Header Text */}
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900/50 border border-slate-800 rounded-full text-xs text-cyan-400 mx-auto">
                    <Terminal className="w-3 h-3" />
                    <span>Threat Intelligence Engine</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                    Analisis Keamanan <br/> Website & File
                </h1>
                <p className="text-slate-400 text-lg">
                    Cek apakah link aman sebelum Anda mengunjunginya.
                </p>
            </div>

            {/* TAB SWITCHER */}
            <div className="flex justify-center gap-2 p-1 bg-slate-900/50 border border-slate-800 rounded-lg w-fit mx-auto">
                <button 
                    onClick={() => setInputMode('url')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${inputMode === 'url' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <div className="flex items-center gap-2"><Globe className="w-4 h-4"/> URL Scan</div>
                </button>
                <button 
                    onClick={() => setInputMode('file')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${inputMode === 'file' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                     <div className="flex items-center gap-2"><UploadCloud className="w-4 h-4"/> File Scan</div>
                </button>
            </div>

            {/* INPUT BOX BESAR */}
            <div className="w-full bg-slate-900 border border-slate-700/50 rounded-2xl p-2 shadow-2xl flex items-center group focus-within:ring-2 focus-within:ring-cyan-500/50 transition-all">
                {inputMode === 'url' ? (
                    <>
                        <input 
                            type="text" 
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Tempel URL (contoh: google.com)..."
                            className="flex-1 bg-transparent border-none outline-none text-white px-4 py-3 text-lg placeholder-slate-600"
                        />
                        <button 
                            onClick={handleAnalyze}
                            disabled={loading || !url}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white p-3 rounded-xl disabled:opacity-50 disabled:bg-slate-800 transition-colors"
                        >
                            {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <ArrowRight className="w-6 h-6" />}
                        </button>
                    </>
                ) : (
                    <div {...getRootProps()} className="w-full h-14 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-800 hover:border-cyan-500/50 transition-all text-slate-500 hover:text-cyan-400 gap-2">
                        <input {...getInputProps()} />
                        <UploadCloud className="w-5 h-5" />
                        <span className="text-sm font-medium">{isDragActive ? 'Lepaskan file...' : 'Klik untuk upload APK'}</span>
                    </div>
                )}
            </div>

            {/* Result Placeholder (Biar gak kosong pas ada hasil) */}
            {result && (
                <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold">Scan Selesai: {result.title} (Aman)</span>
                </div>
            )}

            {/* Fitur Badges */}
            <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-500 mt-4">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-cyan-500"/> Real-time Analysis</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-cyan-500"/> Anti-Phishing</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-cyan-500"/> Malware Detection</span>
            </div>

        </div>
      </main>

      {/* 3. FOOTER (Paling Bawah) */}
      <footer className="w-full p-6 text-center text-slate-600 text-xs font-mono z-10">
        &copy; 2024 SECURITY SYSTEM • KDS STUDIO
      </footer>

    </div>
  );
}