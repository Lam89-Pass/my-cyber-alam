import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google'; // Font modern pengganti Inter
import './globals.css';

const font = Plus_Jakarta_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Cyber Threat Analyzer',
    default: 'Cyber Threat Analyzer - Cek Keamanan Website Gratis',
  },
  description: 'Tools analisis keamanan cyber berbasis AI. Deteksi phishing, malware, dan scam link dalam hitungan detik. Lindungi data Anda sekarang.',
  keywords: ['cyber security', 'cek link', 'anti phishing', 'malware scanner', 'website safety check'],
  authors: [{ name: 'KDS Studio', url: 'https://github.com/Lam89-Pass' }],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    title: 'Cyber Threat Analyzer',
    description: 'Aman atau Bahaya? Cek link mencurigakan sebelum Anda klik.',
    siteName: 'Cyber Threat Analyzer',
  },
  themeColor: '#06b6d4', // Cyan color
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${font.className} bg-slate-950 text-slate-200 antialiased overflow-x-hidden`}>
        {/* Background Grid Global */}
        <div className="fixed inset-0 z-[-1] bg-[url('/grid-pattern.svg')] opacity-[0.03]"></div>
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        {children}
      </body>
    </html>
  );
}