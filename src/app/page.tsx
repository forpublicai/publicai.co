import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Brain,
  Code2,
  Download,
  ExternalLink,
  Globe2,
  KeyRound,
  Landmark,
  Layers,
  MessageSquare,
  Mic,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
} from "lucide-react";
import { MaxWidthWrapper } from "@/components/global/max-width-wrapper";
import { SectionHeader, ModelCatalog } from "@/components/sections";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LandingChatInterface from "@/components/LandingChatInterface";
import { PartnerLogosCarousel } from "@/components/sections/PartnerLogosCarousel";
import { getAllPosts } from "@/utils/blog";
import { formatDate } from "@/utils/format-date";

export const metadata: Metadata = {
  title: "Public AI — Sovereign Open-Weight Infrastructure for Everyone",
  description:
    "A nonprofit, open-source utility providing global access to sovereign AI models trained by national supercomputing centers and public research institutes. Built to serve people, not advertising monopolies.",
  openGraph: {
    url: "https://publicai.co",
    title: "Public AI — Sovereign Open-Weight Infrastructure for Everyone",
    description:
      "A nonprofit, open-source utility providing global access to sovereign AI models trained by national supercomputing centers and public research institutes.",
    siteName: "Public AI",
    images: [
      {
        url: "https://publicai.co/assets/hero-home.png",
        width: 1200,
        height: 630,
        alt: "Public AI Infrastructure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Public AI — Sovereign Open-Weight Infrastructure for Everyone",
    description:
      "A nonprofit, open-source utility providing global access to sovereign and national AI models.",
  },
};

const PARTNERS = [
  {
    name: "Swiss AI Initiative",
    location: "ETH Zurich & EPFL, Switzerland",
    role: "Apertus 1.5 Foundation Model",
  },
  {
    name: "AI Singapore",
    location: "National AI Programme, Singapore",
    role: "SEA-LION v4 Regional LLM",
  },
  {
    name: "Barcelona Supercomputing Center",
    location: "BSC-CNS, Spain",
    role: "Salamandra & ALIA Models",
  },
  {
    name: "Allen Institute for AI (Ai2)",
    location: "Seattle, United States",
    role: "OLMo 3 Open Science Models",
  },
  {
    name: "AI Sweden",
    location: "Gothenburg & Stockholm, Sweden",
    role: "GPT-SW3 & Nordic AI Consortium",
  },
  {
    name: "SpeakLeash",
    location: "Poland",
    role: "Bielik Polish Foundation Model",
  },
  {
    name: "CSCS Alps Supercomputing Centre",
    location: "Lugano, Switzerland",
    role: "National Supercomputing Host",
  },
  {
    name: "Hugging Face",
    location: "Global",
    role: "Official Inference Provider Partner",
  },
  {
    name: "AWS & Intel",
    location: "Zurich Region",
    role: "Sovereign Cloud & Compute Grant",
  },
  {
    name: "Exoscale & Cudo Compute",
    location: "Europe",
    role: "Distributed Green GPU Compute",
  },
];

export default function HomePage() {
  const allPosts = getAllPosts();
  const featuredPosts = allPosts.slice(0, 4);

  return (
    <div className="flex flex-col gap-20 md:gap-32 py-8 md:py-16">
      {/* 1. Hero Section */}
      <MaxWidthWrapper>
        <div className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto pt-6">
          <SectionHeader
            badge="Not for profit Digital Infrastructure"
            badgeVariant="teal"
            title="AI should be public infrastructure."
            accentText="For everyone, everywhere."
            accentColor="red"
            description="Public AI operates high-performance inference, fine-tuning, and evaluation infrastructure for sovereign and national open-weight models—providing civic institutions, researchers, and developers an independent alternative to closed monopolies."
            align="center"
          >
            <Button
              asChild
              size="lg"
              className="rounded-full px-7 font-semibold shadow-sm"
            >
              <a
                href="https://chat.publicai.co"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Try Public AI Chat
                <ExternalLink className="ml-2 h-3.5 w-3.5" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-7 font-semibold"
            >
              <Link href="/products/api">
                <Code2 className="mr-2 h-4 w-4 text-primary" />
                Build with the API
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="rounded-full px-6 font-semibold"
            >
              <Link href="/about">
                Explore the Mission
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </SectionHeader>
        </div>
      </MaxWidthWrapper>
      {/* 2.5 Horizontal Partner Logos Moving Carousel */}
      <div className="-my-8 sm:-my-14">
        <PartnerLogosCarousel />
      </div>
      <MaxWidthWrapper>
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto -mt-8 sm:-mt-14">
          {/* 2. Interactive Product Prompt Bar */}
          <div className="w-full">
            <LandingChatInterface />
          </div>
        </div>
      </MaxWidthWrapper>



      {/* 3. One API: A Growing World of Open Models */}
      <MaxWidthWrapper>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
            <div>
              <Badge
                variant="outline"
                className="rounded-full border-[#00B3A4]/40 bg-[#00B3A4]/15 text-[#00B3A4] text-xs font-semibold mb-2"
              >
                Global Sovereign Registry
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                One API. A Growing World of Sovereign Models.
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-1 max-w-2xl">
                Call models trained by national supercomputing centers across Switzerland, Singapore, Spain, Sweden, and Poland through a single OpenAI-compatible gateway.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/models">
                  Browse All Models
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild className="rounded-full font-semibold">
                <Link
                  href="https://platform.publicai.co/settings/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <KeyRound className="mr-2 h-4 w-4" />
                  Get API Key ($2 Free)
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Compact Accessible Responsive Table */}
          <ModelCatalog compact={true} showHeader={false} />
        </div>
      </MaxWidthWrapper>

      {/* 4. 4-Pillar Platform Suite Bento Grid */}
      <MaxWidthWrapper>
        <div className="flex flex-col gap-10">
          <SectionHeader
            badge="The Public AI Platform Suite"
            badgeVariant="teal"
            title="Sovereign AI Products."
            accentText="From Chat to Sovereign Infrastructure."
            accentColor="teal"
            description="A comprehensive suite of public digital utilities spanning citizen web chat, multimodal vision LLMs, asynchronous batch processing, voice interfaces, and library workstations."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1: Chat & Mobile */}
            <Card className="rounded-2xl border-border/80 flex flex-col justify-between hover:border-primary/40 transition-colors shadow-sm">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="rounded-full text-xs">
                    Live Web · Mobile Soon
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold">
                  Public AI Chat &amp; Mobile
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm leading-relaxed">
                  Free, multilingual web chat with side-by-side sovereign model arena, document RAG grounding, and upcoming iOS &amp; Android companion apps.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Smartphone className="h-3.5 w-3.5 text-primary" />
                  <span>Sub-Feature: Native iOS &amp; Android Apps</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#00B3A4]" />
                  <span>Side-by-side model comparison arena</span>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button asChild variant="link" className="px-0 font-semibold text-primary">
                  <Link href="/products/chat">
                    Explore Chat &amp; Mobile →
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Pillar 2: Inference, Batch & Voice API */}
            <Card className="rounded-2xl border-border/80 flex flex-col justify-between hover:border-primary/40 transition-colors shadow-sm">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <Badge className="rounded-full bg-[#00B3A4]/15 text-[#00B3A4] border-[#00B3A4]/30 text-xs">
                    OpenAI Compatible
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold">
                  Inference, Batch &amp; Voice API
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm leading-relaxed">
                  Unified API gateway at <code className="font-mono text-foreground">api.publicai.co/v1</code> for text and multimodal vision LLMs, 50–80% off Batch API, and low-latency Voice.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-primary" />
                  <span>Sub-Feature: 4h &amp; 24h Async Batch API</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mic className="h-3.5 w-3.5 text-[#00B3A4]" />
                  <span>Sub-Feature: Whisper + NVIDIA PersonaPlex</span>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button asChild variant="link" className="px-0 font-semibold text-primary">
                  <Link href="/products/api">
                    Explore API Platform →
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Pillar 3: Hermes Agentic Service */}
            <Card className="rounded-2xl border-border/80 flex flex-col justify-between hover:border-primary/40 transition-colors shadow-sm">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                    <Bot className="h-5 w-5" />
                  </div>
                  <Badge className="rounded-full bg-warning text-warning-foreground border-transparent text-xs">
                    Coming Soon
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold">
                  Hermes Agentic Service
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm leading-relaxed">
                  Deploy open-weight autonomous agents with native Model Context Protocol (MCP) tool orchestration, sandboxed execution, and immutable audit logs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Brain className="h-3.5 w-3.5 text-primary" />
                  <span>Multi-step reasoning &amp; planning</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#00B3A4]" />
                  <span>Human-in-the-loop policy approval gates</span>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button asChild variant="link" className="px-0 font-semibold text-primary">
                  <Link href="/products/agents">
                    Hermes Agentic Service →
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Pillar 4: Public AI Kiosks */}
            <Card className="rounded-2xl border-border/80 flex flex-col justify-between hover:border-primary/40 transition-colors shadow-sm">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                    <Landmark className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="rounded-full text-xs">
                    $1,000/yr Pilot
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold">
                  Public AI Kiosks for Libraries
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm leading-relaxed">
                  Turnkey physical AI workstations deployed in public libraries, municipal halls, and civic institutions in partnership with the Library of Congress Labs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                  <span>Local collection &amp; archival RAG</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-[#00B3A4]" />
                  <span>Zero patron account tracking</span>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button asChild variant="link" className="px-0 font-semibold text-primary">
                  <Link href="/products/kiosks">
                    View Kiosk Pilot ($1k/yr) →
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </MaxWidthWrapper>

      {/* 5. Real Projects, Real People (Dynamic from content/projects/) */}
      <MaxWidthWrapper>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
            <div>
              <Badge variant="secondary" className="rounded-full text-xs mb-2">
                Field Reports &amp; Case Studies
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Real Projects, Real People.
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-1 max-w-2xl">
                Read field dispatches, academic papers, and technical case studies from partners deploying sovereign public AI worldwide.
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-full shrink-0">
              <Link href="/projects">
                View All {allPosts.length} Projects &amp; Stories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPosts.map((post) => (
              <Card
                key={post.slug}
                className="group rounded-2xl border-border/80 flex flex-col justify-between hover:border-primary/40 transition-colors shadow-sm overflow-hidden"
              >
                {post.ogImage && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary">
                    <Image
                      src={post.ogImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <Badge variant="outline" className="rounded-full text-[10px]">
                      {post.category}
                    </Badge>
                    <span className="font-mono">{formatDate(post.datePublished)}</span>
                  </div>
                  <CardTitle className="text-base font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    <Link href={`/projects/${post.slug}`}>{post.title}</Link>
                  </CardTitle>
                  <CardDescription className="text-xs line-clamp-3 leading-relaxed">
                    {post.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-0 text-xs text-muted-foreground flex items-center justify-between">
                  <span>{post.author}</span>
                  <Link
                    href={`/projects/${post.slug}`}
                    className="font-semibold text-primary inline-flex items-center gap-1 hover:underline"
                  >
                    Read
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </MaxWidthWrapper>

      {/* 6. A Global Movement for Public AI (Research Network) */}
      <MaxWidthWrapper>
        <div className="rounded-3xl border border-border bg-secondary/40 p-6 sm:p-12 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/60 pb-6">
            <div className="space-y-2 max-w-2xl">
              <Badge
                variant="outline"
                className="rounded-full border-[#00B3A4]/40 bg-[#00B3A4]/15 text-[#00B3A4] text-xs font-semibold"
              >
                Public AI Network
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                A Global Movement for Sovereign Public Intelligence
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We bring together universities, civil society, national supercomputing centres, and grassroots communities to advance AI as a public good.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild className="rounded-full font-semibold">
                <Link href="/research">
                  Explore Research Hub
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Download className="h-5 w-5 text-primary" />
                Public AI Whitepaper
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Download our foundational synthesis exploring the economic and constitutional arguments for public computing utilities.
              </p>
              <Button asChild variant="outline" size="sm" className="rounded-full text-xs">
                <a href="/PublicAIwhitepaper.pdf" target="_blank" rel="noopener noreferrer">
                  Download PDF (Whitepaper)
                </a>
              </Button>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Users className="h-5 w-5 text-[#00B3A4]" />
                Research Seminar Series
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Bi-weekly virtual gatherings convening open-source researchers, policy scholars, and infrastructure builders worldwide.
              </p>
              <Button asChild variant="outline" size="sm" className="rounded-full text-xs">
                <Link href="/research/seminar">View Seminar Schedule</Link>
              </Button>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Globe2 className="h-5 w-5 text-primary" />
                SAIL Rating System
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Assessing sovereign and public AI across 7 layers: compute, data governance, model weights, evaluation, and community stewardship.
              </p>
              <Button asChild variant="outline" size="sm" className="rounded-full text-xs">
                <Link href="/projects/sail">Explore SAIL Ratings</Link>
              </Button>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>

      {/* 7. Model & Infrastructure Partners Grid */}
      <MaxWidthWrapper>
        <div className="flex flex-col gap-8">
          <SectionHeader
            badge="Collaborative Ecosystem"
            badgeVariant="teal"
            title="Our Model & Infrastructure Partners."
            description="Collaborating with national supercomputing facilities, research institutes, and sovereign cloud providers across the globe."
            align="center"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {PARTNERS.map((partner) => (
              <div
                key={partner.name}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-4 text-center transition-all hover:border-primary/40 hover:shadow-sm"
              >
                <div className="space-y-1">
                  <p className="font-bold text-sm text-foreground">{partner.name}</p>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                    {partner.location}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="mt-3 mx-auto text-[10px] rounded-full border-border/80 text-muted-foreground"
                >
                  {partner.role}
                </Badge>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center pt-2">
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link href="/contributing/model-partners">
                Become a Model or Compute Partner →
              </Link>
            </Button>
          </div>
        </div>
      </MaxWidthWrapper>

      {/* 8. Signature Dual-Tone Navy Bottom Banner (design/branding.png) */}
      <MaxWidthWrapper>
        <div className="theme-navy relative overflow-hidden rounded-3xl border border-white/10 bg-[#0F2D4A] px-6 py-12 sm:px-12 sm:py-16 text-center shadow-xl">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-72 rotate-12 rounded-full bg-[#FF3B30]/25 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-72 -rotate-12 rounded-full bg-[#00B3A4]/25 blur-2xl"
          />
          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Smarter AI. <span className="text-[#00B3A4]">Greater Possibilities.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-200 max-w-xl">
              Build. Deploy. Scale. Sovereign public AI infrastructure for what&apos;s next.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-[#FF3B30] hover:bg-[#E02E24] text-white font-semibold px-7 shadow-sm"
              >
                <a
                  href="https://platform.publicai.co/settings/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <KeyRound className="mr-2 h-4 w-4" />
                  Get Free API Key ($2 Credit)
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-white/20 bg-white/10 hover:bg-white/20 text-white font-semibold px-7"
              >
                <Link href="/models">Browse Sovereign Models</Link>
              </Button>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
