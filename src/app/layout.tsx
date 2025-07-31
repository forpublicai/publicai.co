import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PublicAI | By the Public, For the Public",
  description: "PublicAI - By the Public, For the Public. Community-driven AI initiative for everyone.",
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: "PublicAI | By the Public, For the Public",
    description: "PublicAI - By the Public, For the Public. Community-driven AI initiative for everyone.",
    siteName: "PublicAI",
  },
  twitter: {
    title: "PublicAI | By the Public, For the Public",
    description: "PublicAI - By the Public, For the Public. Community-driven AI initiative for everyone.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
