import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "@/components/navbar";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
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
        className={`${publicSans.variable} antialiased bg-background text-foreground font-sans`}
      >
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
