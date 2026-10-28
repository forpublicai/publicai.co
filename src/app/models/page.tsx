import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Code2,
  ExternalLink,
  Globe2,
  KeyRound,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { MaxWidthWrapper } from "@/components/global/max-width-wrapper";
import { SectionHeader, ModelCatalog } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";

export const metadata: Metadata = {
  title: "Sovereign Open-Weight Models Directory — PublicAI",
  description:
    "Explore sovereign and open-weight AI models hosted on the PublicAI Inference Utility, including Swiss AI Apertus 1.5 (Vision), AI Singapore SEA-LION v4, BSC Salamandra, AI Sweden GPT-SW3, AI2 Olmo 3, and EuroLLM.",
  alternates: {
    canonical: "https://publicai.co/models",
  },
};

const LIST_MODELS_SNIPPET = `curl https://api.publicai.co/v1/models \\
  -H "Authorization: Bearer $PUBLICAI_API_KEY" \\
  -H "User-Agent: MyApp/1.0"`;

export default function ModelsPage() {
  return (
    <div className="flex flex-col gap-16 md:gap-24 py-12 md:py-20">
      {/* 1. Hero Section */}
      <MaxWidthWrapper>
        <SectionHeader
          badge="Sovereign Model Registry"
          badgeVariant="teal"
          title="National & Sovereign Open-Weight Models."
          accentText="One Unified API."
          accentColor="teal"
          description="Access sovereign models trained by national supercomputing centers and public research institutes worldwide—hosted on transparent infrastructure with zero training on your prompts."
          align="center"
        >
          <Button asChild size="lg" className="rounded-full px-7 font-semibold">
            <Link
              href="https://platform.publicai.co/settings/api-keys"
              target="_blank"
              rel="noopener noreferrer"
            >
              <KeyRound className="mr-2 h-4 w-4" />
              Get API Key
              <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-7 font-semibold"
          >
            <Link
              href="https://chat.publicai.co"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Compare in Web Chat
              <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="rounded-full px-6 font-semibold"
          >
            <Link href="/docs/models">
              Model Documentation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </SectionHeader>
      </MaxWidthWrapper>

      {/* 2. Interactive Model Directory & Pricing Table */}
      <MaxWidthWrapper>
        <ModelCatalog showHeader={false} defaultTab="cards" />
      </MaxWidthWrapper>

      {/* 3. Live Registry API & Sovereign Hosting Guarantees */}
      <MaxWidthWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <Card className="lg:col-span-7 theme-navy rounded-2xl border border-border/40 bg-background text-foreground shadow-lg flex flex-col justify-between">
            <CardHeader className="border-b border-white/10 bg-black/20">
              <div className="flex items-center justify-between gap-2">
                <Badge
                  variant="outline"
                  className="rounded-full border-[#00B3A4]/40 bg-[#00B3A4]/15 text-[#38BDF8] font-mono text-xs"
                >
                  GET /v1/models
                </Badge>
                <span className="text-xs font-mono text-slate-300">
                  OpenAI SDK Compatible
                </span>
              </div>
              <CardTitle className="text-xl font-bold text-white pt-2">
                Query the Live Model Registry Programmatically
              </CardTitle>
              <CardDescription className="text-slate-300">
                Fetch real-time availability, active model IDs, and routing metadata directly from the PublicAI API gateway.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="relative rounded-xl bg-black/40 p-4 font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto border border-white/10">
                <CopyButton
                  text={LIST_MODELS_SNIPPET}
                  className="absolute right-3 top-3 bg-white/10 hover:bg-white/20"
                />
                <pre className="pr-10 leading-relaxed">
                  <code>{LIST_MODELS_SNIPPET}</code>
                </pre>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-300">
                <span>
                  Base URL:{" "}
                  <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-white">
                    https://api.publicai.co/v1
                  </code>
                </span>
                <Link
                  href="/docs/api"
                  className="inline-flex items-center gap-1 font-semibold text-[#38BDF8] hover:underline"
                >
                  Explore Full OpenAPI Spec
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-5 rounded-2xl border-border/80 flex flex-col justify-between">
            <CardHeader>
              <Badge variant="outline" className="w-fit rounded-full text-xs">
                Infrastructure Standards
              </Badge>
              <CardTitle className="text-xl font-bold pt-1">
                Why Sovereign Open-Weight Models?
              </CardTitle>
              <CardDescription>
                Every model in the PublicAI catalog is selected for transparency, cultural and linguistic inclusivity, and public accountability.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">
                    Auditable Training Provenance
                  </p>
                  <p className="text-xs leading-relaxed mt-0.5">
                    Models like Swiss AI Apertus 1.5, AI2 Olmo 3, and BSC Salamandra publish full training data recipes and compliance documentation.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe2 className="h-5 w-5 text-[#00B3A4] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">
                    1,800+ Languages & Regional Nuance
                  </p>
                  <p className="text-xs leading-relaxed mt-0.5">
                    Purpose-built tokenizers and corpora for European, Southeast Asian, Nordic, Middle Eastern, and global underrepresented languages.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Code2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">
                    Zero Vendor Lock-In
                  </p>
                  <p className="text-xs leading-relaxed mt-0.5">
                    Use PublicAI&apos;s elastic inference cloud today, or deploy the exact same open weights on your own sovereign cluster tomorrow.
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <Button asChild variant="outline" className="w-full rounded-full font-semibold">
                  <Link href="/pricing">
                    View Rate Limits & Plans
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
