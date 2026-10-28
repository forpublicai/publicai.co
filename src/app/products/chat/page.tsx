import type { Metadata } from "next";
import {
  FileText,
  Globe2,
  Languages,
  Lock,
  MessageSquare,
  Smartphone,
  Sparkles,
  WifiOff,
  Camera,
} from "lucide-react";
import {
  ProductPageTemplate,
  WaitlistForm,
  type CardGridItem,
  type ProductHashSubsection,
} from "@/components/sections";

export const metadata: Metadata = {
  title: "PublicAI Chat & Mobile App — Sovereign Multi-Model AI Assistant",
  description:
    "Compare sovereign open-weight models side-by-side, ground answers with RAG document uploads, and explore national system prompts in PublicAI Web Chat and the upcoming iOS & Android Mobile App.",
  alternates: {
    canonical: "https://publicai.co/products/chat",
  },
};

const CHAT_FEATURES: CardGridItem[] = [
  {
    title: "Side-by-Side Sovereign Model Arena",
    description:
      "Prompt Swiss AI Apertus 1.5, AI Singapore SEA-LION v4, BSC Salamandra, AI2 Olmo 3, and DeepSeek V3.1 simultaneously to compare cultural nuance and reasoning.",
    badge: "Multi-Model",
    badgeVariant: "teal",
    icon: <MessageSquare className="h-5 w-5" />,
    href: "https://chat.publicai.co",
    ctaLabel: "Launch Web Chat",
    external: true,
  },
  {
    title: "Document RAG & Citation Grounding",
    description:
      "Upload PDFs, policy briefs, and research datasets for citation-backed synthesis without handing private institutional documents to closed monopolies.",
    badge: "RAG Grounding",
    badgeVariant: "secondary",
    icon: <FileText className="h-5 w-5" />,
    href: "/docs/chat",
    ctaLabel: "Read Chat Docs",
  },
  {
    title: "National & Civic System Prompts",
    description:
      "Built-in system personas co-designed with public broadcasters, national libraries, and civic archivists to prioritize verifiable public-interest sources.",
    badge: "Public Good",
    badgeVariant: "outline",
    icon: <Globe2 className="h-5 w-5" />,
  },
  {
    title: "1,800+ Languages & Regional Dialects",
    description:
      "Native fluency across European, Southeast Asian, Nordic, Hebrew, Arabic, and regional languages neglected by US-centric commercial chatbots.",
    badge: "Multilingual",
    badgeVariant: "teal",
    icon: <Languages className="h-5 w-5" />,
  },
  {
    title: "Multimodal Vision with Apertus 1.5",
    description:
      "Analyze charts, scanned historical manuscripts, forms, and photographs using open-weight multimodal vision models hosted on sovereign compute.",
    badge: "Vision LLMs",
    badgeVariant: "secondary",
    icon: <Sparkles className="h-5 w-5" />,
    href: "/models",
    ctaLabel: "Explore Vision Models",
  },
  {
    title: "Privacy-First & Zero Surveillance Ads",
    description:
      "Operated as a public digital utility. Opt-in research sharing helps improve open datasets, while private conversations remain strictly confidential.",
    badge: "Zero Ad Tracking",
    badgeVariant: "outline",
    icon: <Lock className="h-5 w-5" />,
  },
];

const CHAT_SUBSECTIONS: ProductHashSubsection[] = [
  {
    id: "mobile",
    badge: "Coming Soon · iOS & Android",
    badgeVariant: "amber",
    title: "PublicAI Mobile App",
    accentText: "Sovereign AI in Your Pocket.",
    accentColor: "teal",
    description:
      "Bring the full power of PublicAI Web Chat to iOS and Android. Capture documents and signs with your camera for instant multimodal translation via Apertus 1.5, converse hands-free, and sync threads seamlessly with chat.publicai.co.",
    features: [
      {
        title: "Camera Vision & Instant Translation",
        description:
          "Point your phone camera at forms, transit signs, or archival pages for real-time OCR and translation across 1,800+ languages.",
        badge: "Apertus 1.5 Vision",
        badgeVariant: "teal",
        icon: <Camera className="h-5 w-5" />,
      },
      {
        title: "Cross-Device Thread Sync",
        description:
          "Start a research session on chat.publicai.co at your desk and continue on iOS or Android with full RAG citation history.",
        badge: "iOS & Android",
        badgeVariant: "secondary",
        icon: <Smartphone className="h-5 w-5" />,
      },
      {
        title: "Low-Bandwidth & Offline Thread Cache",
        description:
          "Engineered for resilient connectivity across rural communities and emerging markets with local thread caching.",
        badge: "Resilient Access",
        badgeVariant: "outline",
        icon: <WifiOff className="h-5 w-5" />,
      },
    ],
    waitlistSlot: (
      <WaitlistForm
        product="chat-mobile"
        badge="Mobile Beta Waitlist"
        title="Get Early TestFlight & Android Beta Access"
        description="Join the waitlist to test the PublicAI iOS (TestFlight) and Android mobile apps as soon as the public beta opens."
        buttonLabel="Join Mobile Beta"
      />
    ),
  },
];

export default function ChatProductPage() {
  return (
    <ProductPageTemplate
      badge="Public Utility · Live at chat.publicai.co"
      badgeVariant="teal"
      title="PublicAI Web Chat."
      accentText="Sovereign Intelligence for Everyone."
      accentColor="red"
      description="A free, multilingual AI assistant powered by the world's leading national and open-weight models. Compare models side-by-side, ground responses in your own documents, and explore AI built as a public good."
      primaryCta={{
        label: "Open Web Chat (chat.publicai.co)",
        href: "https://chat.publicai.co",
        external: true,
      }}
      secondaryCta={{
        label: "Try Inline Demo (/chat)",
        href: "/chat",
      }}
      featuresTitle="Everything You Need in a Public-Interest AI Workspace"
      featuresSubtitle="Built on Open WebUI and routed through the PublicAI Inference Utility across Switzerland, Singapore, Spain, Sweden, and the United States."
      features={CHAT_FEATURES}
      featuresColumns={3}
      subsections={CHAT_SUBSECTIONS}
      bottomBanner={{
        title: "Ready to explore",
        accentText: "sovereign open-weight AI?",
        subtitle:
          "Launch PublicAI Web Chat in your browser today with zero sign-up barriers, or read our user guide to master multi-model comparisons.",
        ctaLabel: "Launch chat.publicai.co",
        ctaHref: "https://chat.publicai.co",
      }}
    />
  );
}
