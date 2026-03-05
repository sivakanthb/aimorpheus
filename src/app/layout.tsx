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
      <head>
        {/* Sentry Script for Error Tracking */}
        {process.env.NEXT_PUBLIC_SENTRY_DSN && (
          <script
            src="https://browser.sentry-cdn.com/7.80.0/bundle.tracekit.min.js"
            integrity="sha384-nKiMDyccsPiDmB1CVUavg7aYPpJPF9eXgGdqH3s3wGDGw7YQmMzNrEQs1HgzUvJql"
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <ClientLayout>{children}</ClientLayout>
        </ErrorBoundary>
      </body>
    </html>
  );
}
