import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Atanasiu Ivannoel R.A. | Jasa Pembuatan Aplikasi Mobile & Web Otomatisasi Sidoarjo",
  description:
    "Ubah ide bisnis Anda menjadi aplikasi mobile & web yang bekerja otomatis 24/7. Spesialis integrasi WhatsApp API & sistem tanpa celah di Sidoarjo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full scroll-smooth antialiased`}>
      <body className="min-h-full bg-[#0f172a] font-sans text-slate-100">
        {children}
      </body>
    </html>
  );
}
