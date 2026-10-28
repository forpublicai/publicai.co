import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Navbar, Footer } from "@/components/navigation";
import { ThemeProvider } from "@/components/global/theme-provider";
import { ChatwootWidget } from "@/components/global/chatwoot-widget";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://publicai.co"),
  title: "Public AI Inference Utility",
  description:
    "A nonprofit, open-source service to make public and sovereign AI models more accessible.",
  icons: {
    icon: "/logo-mark.png",
    apple: "/logo-mark.png",
  },
  openGraph: {
    title: "Public AI Inference Utility",
    description:
      "A nonprofit, open-source service to make public and sovereign AI models more accessible.",
    siteName: "PublicAI",
    type: "website",
    images: [
      {
        url: "https://publicai.co/og-image.png",
        width: 1200,
        height: 630,
        alt: "Public AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Public AI Inference Utility",
    description:
      "A nonprofit, open-source service to make public and sovereign AI models more accessible.",
    images: ["https://publicai.co/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${publicSans.variable} antialiased bg-background text-foreground font-sans flex min-h-svh flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
          <Toaster />
          <ChatwootWidget />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
