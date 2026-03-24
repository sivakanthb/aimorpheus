import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ClientLayout } from "./client-layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AIMorpheus - Master the Future of Intelligence",
  description: "Personalized, self-sourced AI learning recommendations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <ClientLayout>{children}</ClientLayout>
          <footer style={{textAlign:'center',padding:'20px 16px',borderTop:'1px solid #e5e7eb',fontSize:'0.78rem',color:'#9ca3af'}}>
            &copy; 2026 AIMorpheus &middot; Built by <a href="https://sivakanth.vercel.app" target="_blank" rel="noopener noreferrer" style={{color:'#4f46e5',textDecoration:'none'}}>Sivakanth Badigenchala</a>
          </footer>
        </ErrorBoundary>
      </body>
    </html>
  );
}
