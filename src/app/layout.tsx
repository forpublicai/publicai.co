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
  title: "Public AI Inference Utility",
  description: "Free, open-source AI inference for everyone. Access public and sovereign AI models like Apertus, built by and for the people.",
  keywords: ["public AI", "sovereign AI", "AI inference", "open source AI", "Apertus", "nonprofit AI"],
  icons: {
    icon: '/favicon.ico',
  },
  metadataBase: new URL('https://publicai.co'),
  openGraph: {
    title: "Public AI Inference Utility",
    description: "Free, open-source AI inference for everyone. Access public and sovereign AI models like Apertus, built by and for the people.",
    siteName: "PublicAI",
    type: "website",
    locale: "en_US",
    url: "https://publicai.co",
    images: [
      {
        url: "/logo-large.png",
        width: 1200,
        height: 630,
        alt: "Public AI Inference Utility",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Public AI Inference Utility",
    description: "Free, open-source AI inference for everyone. Access public and sovereign AI models like Apertus, built by and for the people.",
    images: ["/logo-large.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD structured data for organization
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Public AI Inference Utility",
  "url": "https://publicai.co",
  "logo": "https://publicai.co/logo-large.png",
  "description": "A nonprofit, open-source service to make public and sovereign AI models more accessible.",
  "sameAs": [
    "https://www.linkedin.com/company/pubai/",
    "https://github.com/forpublicai",
    "https://publicai.substack.com"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "hello@publicai.co",
    "contactType": "customer support"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${publicSans.variable} antialiased bg-background text-foreground font-sans`}
      >
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded">
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
