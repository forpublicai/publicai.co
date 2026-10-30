import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  HeartHandshake,
  HelpCircle,
  KeyRound,
  Layers,
  Mail,
  Shield,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";
import { MaxWidthWrapper } from "@/components/global/max-width-wrapper";
import { SectionHeader } from "@/components/sections";
import { LiveModelPricingTable } from "@/components/pricing/LiveModelPricingTable";
import { getLiveModelPricing } from "@/lib/live-model-pricing";
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

export const metadata: Metadata = {
  title: "Plans, Rate Limits & Token Pricing — PublicAI",
  description:
    "Transparent usage tiers, per-minute rate limits, and pay-as-you-go token pricing for the PublicAI Inference Utility. Start free with $2.00 in starter credits and 100 req/min.",
  alternates: {
    canonical: "https://publicai.co/pricing",
  },
};

interface PricingPlanTier {
  id: string;
  name: string;
  badge: string;
  rateLimit: string;
  rateLimitNum: string;
  howToGet: string;
  priceSubtext?: string;
  description: string;
  highlighted?: boolean;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  external?: boolean;
}

const PLAN_TIERS: PricingPlanTier[] = [
  {
    id: "free",
    name: "Free",
    badge: "Default Tier",
    rateLimit: "100 req / min",
    rateLimitNum: "100",
    howToGet: "Default when you create an API key",
    // priceSubtext: "Includes $2.00 free starter credit",
    description:
      "Every new API key starts on the Free tier. Access every sovereign model immediately with complimentary starter credit—no credit card required.",
    features: [
      "100 requests per minute rate limit per API key",
      "$2.00 complimentary starter credit on API key creation",
      "Pay-as-you-go per-token wallet billing thereafter",
      "Full access to Apertus, SEA-LION, OLMo & Salamandra",
      "Enforced per API key with a 1-minute sliding window",
    ],
    ctaLabel: "Create API Key",
    ctaHref: "https://platform.publicai.co/settings/api-keys",
    external: true,
  },
  {
    id: "plus",
    name: "Plus",
    badge: "Community Supporter",
    rateLimit: "200 req / min",
    rateLimitNum: "200",
    howToGet: "Contribute via OpenCollective",
    // priceSubtext: "Automated webhook tier upgrade",
    highlighted: true,
    description:
      "Double your rate limit to 200 requests/minute by supporting Public AI on OpenCollective. Upgraded automatically when using your portal account email.",
    features: [
      "200 requests per minute rate limit (2× Free tier)",
      "Automated upgrade when you contribute on OpenCollective",
      "Requires contributing with your portal account email",
      "Tokens billed separately from wallet balance",
      "Directly funds open-source public compute & datasets",
    ],
    ctaLabel: "Contribute",
    ctaHref: "https://opencollective.com/publicai",
    external: true,
  },
  {
    id: "pro",
    name: "Pro",
    badge: "High Concurrency",
    rateLimit: "300 req / min",
    rateLimitNum: "300",
    howToGet: "Contact support@publicai.co",
    // priceSubtext: "For production & research teams",
    description:
      "For production applications, university labs, and civic deployments requiring higher sustained request throughput.",
    features: [
      "300 requests per minute rate limit (3× Free tier)",
      "Upgraded upon request with account email & use case",
      "Tokens billed separately against wallet credits",
      "Priority developer support via email & Chatwoot",
      "Multi-provider failover across sovereign compute nodes",
    ],
    ctaLabel: "Contact Us",
    ctaHref: "mailto:support@publicai.co?subject=Pro%20Tier%20Rate%20Limit%20Request",
    external: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    badge: "Dedicated & SLA",
    rateLimit: "10,000 req / min",
    rateLimitNum: "10,000",
    howToGet: "Contact support@publicai.co",
    // priceSubtext: "Dedicated capacity & procurement",
    description:
      "For ministries, national libraries, supercomputing centers, and enterprises needing custom throughput and jurisdictional guarantees.",
    features: [
      "Up to 10,000 requests per minute rate limit",
      "Dedicated GPU capacity & sovereign region pinning",
      "Custom Data Processing Agreements (DPA) & procurement",
      "Invoicing & customized institutional payment terms",
      "Direct solutions engineering & onboarding",
    ],
    ctaLabel: "Contact Us",
    ctaHref: "mailto:support@publicai.co?subject=Enterprise%20Rate%20Limit%20Inquiry",
    external: false,
  },
];

export default async function PricingPage() {
  const { models: liveModels, fetchedAt, source } = await getLiveModelPricing();

  return (
    <div className="flex flex-col gap-16 md:gap-24 py-12 md:py-20">
      {/* 1. Hero Header */}
      <MaxWidthWrapper>
        <SectionHeader
          badge="Transparent Public Utility Pricing"
          badgeVariant="teal"
          title="Plans, Rate Limits &"
          accentText="Live Token Pricing."
          accentColor="red"
          description="Rate limits and token usage are separate. Start free with 100 requests per minute and $2.00 in starter credit. Scale transparently with pay-as-you-go wallet billing."
          align="center"
        >
          <Button asChild size="lg" className="rounded-full px-7 font-semibold">
            <Link
              href="https://platform.publicai.co/settings/api-keys"
              target="_blank"
              rel="noopener noreferrer"
            >
              <KeyRound className="mr-2 h-4 w-4" />
              Create API Key ($2 Free Credit)
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
              href="https://platform.publicai.co/account/billing"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Wallet className="mr-2 h-4 w-4 text-[#00B3A4]" />
              Manage Wallet &amp; Billing
              <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>
        </SectionHeader>
      </MaxWidthWrapper>

      {/*/!* 2. How Pricing & Rate Limits Work (The Crucial Architecture Distinction) *!/*/}
      {/*<MaxWidthWrapper>*/}
      {/*  <div className="rounded-3xl border border-border/80 bg-secondary/30 p-6 md:p-8 space-y-6">*/}
      {/*    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">*/}
      {/*      <div>*/}
      {/*        <div className="flex items-center gap-2">*/}
      {/*          <Badge variant="outline" className="rounded-full font-mono text-[11px] text-primary border-primary/40 bg-primary/10">*/}
      {/*            Architecture Overview*/}
      {/*          </Badge>*/}
      {/*          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">*/}
      {/*            How Public AI Gateway Works*/}
      {/*          </span>*/}
      {/*        </div>*/}
      {/*        <h3 className="text-xl md:text-2xl font-bold text-foreground mt-1.5">*/}
      {/*          Rate limits and token usage billing are completely separate.*/}
      {/*        </h3>*/}
      {/*      </div>*/}
      {/*      <Button asChild variant="outline" size="sm" className="rounded-full shrink-0">*/}
      {/*        <Link href="/docs/plans">*/}
      {/*          Read Full Plans Spec*/}
      {/*          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />*/}
      {/*        </Link>*/}
      {/*      </Button>*/}
      {/*    </div>*/}

      {/*    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">*/}
      {/*      /!* Column 1 *!/*/}
      {/*      <div className="space-y-2.5 rounded-2xl border border-border/60 bg-background/80 p-5 shadow-xs">*/}
      {/*        <div className="flex items-center gap-2 text-primary font-semibold text-sm">*/}
      {/*          <Layers className="h-4 w-4 text-primary" />*/}
      {/*          <span>1. Request Rate Limits</span>*/}
      {/*        </div>*/}
      {/*        <p className="text-xs text-muted-foreground leading-relaxed">*/}
      {/*          Rate limits control <strong>how many requests you can make per minute</strong> based on your tier (100, 200, 300, or 10,000 req/min). Limits apply per API key and are enforced on every request.*/}
      {/*        </p>*/}
      {/*      </div>*/}

      {/*      /!* Column 2 *!/*/}
      {/*      <div className="space-y-2.5 rounded-2xl border border-border/60 bg-background/80 p-5 shadow-xs">*/}
      {/*        <div className="flex items-center gap-2 text-[#00B3A4] font-semibold text-sm">*/}
      {/*          <Wallet className="h-4 w-4 text-[#00B3A4]" />*/}
      {/*          <span>2. Token Wallet Billing</span>*/}
      {/*        </div>*/}
      {/*        <p className="text-xs text-muted-foreground leading-relaxed">*/}
      {/*          Token usage is billed against <strong>pre-paid wallet credits</strong> at the per-1M token rates shown below. Every new user account receives <strong>$2.00 in free starter credit</strong> upon signing up.*/}
      {/*        </p>*/}
      {/*      </div>*/}

      {/*      /!* Column 3 *!/*/}
      {/*      <div className="space-y-2.5 rounded-2xl border border-border/60 bg-background/80 p-5 shadow-xs">*/}
      {/*        <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm">*/}
      {/*          <Clock className="h-4 w-4 text-amber-500" />*/}
      {/*          <span>3. Rate Limit Exceeded (HTTP 429)</span>*/}
      {/*        </div>*/}
      {/*        <p className="text-xs text-muted-foreground leading-relaxed">*/}
      {/*          Exceeding your tier&apos;s requests/min returns a <code className="rounded bg-secondary px-1 py-0.5 font-mono text-[11px] text-foreground">429 Too Many Requests</code> response. The window resets every 60 seconds.*/}
      {/*        </p>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</MaxWidthWrapper>*/}

      {/* 3. Four Rate-Limit & Plan Tier Cards */}
      <MaxWidthWrapper>
        <div className="flex flex-col gap-4 mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Rate-Limit Tiers
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Choose the request throughput your application requires. All tiers have equal access to every sovereign and national model in our registry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
          {PLAN_TIERS.map((tier) => (
            <Card
              key={tier.id}
              className={
                tier.highlighted
                  ? "relative flex flex-col justify-between rounded-2xl border-2 border-primary shadow-lg bg-card"
                  : "flex flex-col justify-between rounded-2xl border-border/80 bg-card/90"
              }
            >
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant={tier.highlighted ? "default" : "secondary"}
                    className="rounded-full text-xs"
                  >
                    {tier.badge}
                  </Badge>
                  {/*<span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 font-mono text-xs font-semibold text-foreground">*/}
                  {/*  <Zap className="h-3 w-3 text-primary" />*/}
                  {/*  {tier.rateLimit}*/}
                  {/*</span>*/}
                </div>

                <div>
                  <CardTitle className="text-xl font-bold">{tier.name}</CardTitle>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold tracking-tight font-mono text-foreground">
                      {tier.rateLimitNum}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">
                      req / min
                    </span>
                  </div>
                  {/*<div className="mt-2 text-xs">*/}
                  {/*  <span className="font-semibold text-foreground">How to get it:</span>{" "}*/}
                  {/*  <span className="text-muted-foreground">{tier.howToGet}</span>*/}
                  {/*</div>*/}
                  {/*<p className="text-[11px] text-muted-foreground/90 mt-1 font-mono">*/}
                  {/*  {tier.priceSubtext}*/}
                  {/*</p>*/}
                </div>

                <CardDescription className="text-xs leading-relaxed pt-1">
                  {tier.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-2.5 text-xs text-foreground/90">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#00B3A4] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-4">
                <Button
                  asChild
                  variant={tier.highlighted ? "default" : "outline"}
                  className="w-full rounded-full font-semibold"
                >
                  <Link
                    href={tier.ctaHref}
                    target={tier.external ? "_blank" : undefined}
                    rel={tier.external ? "noopener noreferrer" : undefined}
                  >
                    {tier.ctaLabel}
                    {tier.external ? (
                      <ExternalLink className="ml-2 h-3.5 w-3.5" />
                    ) : (
                      <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    )}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </MaxWidthWrapper>

      {/* 4. Batch API 50-80% Off & OpenCollective Support Callout */}
      {/*<MaxWidthWrapper>*/}
      {/*  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">*/}
      {/*    <Card className="rounded-2xl border-border/80 bg-secondary/40">*/}
      {/*      <CardHeader>*/}
      {/*        <div className="flex items-center gap-2">*/}
      {/*          <Badge className="rounded-full bg-warning text-warning-foreground border-transparent text-xs">*/}
      {/*            50% – 80% Lower Token Cost*/}
      {/*          </Badge>*/}
      {/*          <Badge variant="outline" className="rounded-full font-mono text-xs">*/}
      {/*            4h &amp; 24h SLA*/}
      {/*          </Badge>*/}
      {/*        </div>*/}
      {/*        <CardTitle className="text-xl font-bold pt-2 flex items-center gap-2">*/}
      {/*          <Layers className="h-5 w-5 text-primary" />*/}
      {/*          Asynchronous Batch Processing*/}
      {/*        </CardTitle>*/}
      {/*        <CardDescription>*/}
      {/*          Run large-scale dataset evaluations, multilingual translation pipelines, and synthetic data generation during off-peak sovereign compute windows.*/}
      {/*        </CardDescription>*/}
      {/*      </CardHeader>*/}
      {/*      <CardContent className="space-y-4 text-sm text-muted-foreground">*/}
      {/*        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">*/}
      {/*          <div className="rounded-xl border border-border bg-background p-3.5">*/}
      {/*            <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">*/}
      {/*              <Clock className="h-3.5 w-3.5 text-primary" />*/}
      {/*              4-Hour Express Window*/}
      {/*            </div>*/}
      {/*            <p className="text-xs text-muted-foreground mt-1">*/}
      {/*              50% discount off synchronous input &amp; output token rates for same-day turnaround.*/}
      {/*            </p>*/}
      {/*          </div>*/}
      {/*          <div className="rounded-xl border border-border bg-background p-3.5">*/}
      {/*            <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">*/}
      {/*              <Sparkles className="h-3.5 w-3.5 text-[#00B3A4]" />*/}
      {/*              24-Hour Standard Window*/}
      {/*            </div>*/}
      {/*            <p className="text-xs text-muted-foreground mt-1">*/}
      {/*              Up to 80% discount when scheduled into spare supercomputing capacity overnight.*/}
      {/*            </p>*/}
      {/*          </div>*/}
      {/*        </div>*/}
      {/*        <div className="flex flex-wrap items-center gap-3 pt-1">*/}
      {/*          <Button asChild size="sm" className="rounded-full font-semibold">*/}
      {/*            <Link href="/products/api#batch">*/}
      {/*              Join Batch API Waitlist*/}
      {/*              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />*/}
      {/*            </Link>*/}
      {/*          </Button>*/}
      {/*          <Button asChild variant="ghost" size="sm" className="rounded-full">*/}
      {/*            <Link href="/docs/batch">Read Batch Spec</Link>*/}
      {/*          </Button>*/}
      {/*        </div>*/}
      {/*      </CardContent>*/}
      {/*    </Card>*/}

      {/*    <Card className="rounded-2xl border-border/80 bg-secondary/40">*/}
      {/*      <CardHeader>*/}
      {/*        <div className="flex items-center gap-2">*/}
      {/*          <Badge variant="outline" className="rounded-full text-xs">*/}
      {/*            Non-Profit Collective*/}
      {/*          </Badge>*/}
      {/*        </div>*/}
      {/*        <CardTitle className="text-xl font-bold pt-2 flex items-center gap-2">*/}
      {/*          <HeartHandshake className="h-5 w-5 text-[#00B3A4]" />*/}
      {/*          OpenCollective Upgrade &amp; Community Grants*/}
      {/*        </CardTitle>*/}
      {/*        <CardDescription>*/}
      {/*          PublicAI operates as public digital infrastructure. Contributing on OpenCollective automatically upgrades your rate limits while funding open compute and civic datasets.*/}
      {/*        </CardDescription>*/}
      {/*      </CardHeader>*/}
      {/*      <CardContent className="space-y-4 text-sm text-muted-foreground">*/}
      {/*        <div className="rounded-xl border border-border bg-background p-4 space-y-2 text-xs">*/}
      {/*          <div className="flex items-center gap-2 font-semibold text-foreground">*/}
      {/*            <Shield className="h-4 w-4 text-primary" />*/}
      {/*            Academic, Library &amp; Civic Research Credits*/}
      {/*          </div>*/}
      {/*          <p className="leading-relaxed">*/}
      {/*            Universities, public libraries, investigative journalists, and open-source maintainers can apply for sponsored Pro/Enterprise rate limits and compute grants by emailing <a href="mailto:support@publicai.co" className="text-primary underline">support@publicai.co</a>.*/}
      {/*          </p>*/}
      {/*        </div>*/}
      {/*        <div className="flex flex-wrap items-center gap-3 pt-1">*/}
      {/*          <Button*/}
      {/*            asChild*/}
      {/*            variant="outline"*/}
      {/*            size="sm"*/}
      {/*            className="rounded-full font-semibold"*/}
      {/*          >*/}
      {/*            <Link*/}
      {/*              href="https://opencollective.com/publicai"*/}
      {/*              target="_blank"*/}
      {/*              rel="noopener noreferrer"*/}
      {/*            >*/}
      {/*              Contribute*/}
      {/*              <ExternalLink className="ml-1.5 h-3.5 w-3.5" />*/}
      {/*            </Link>*/}
      {/*          </Button>*/}
      {/*          <Button asChild variant="ghost" size="sm" className="rounded-full">*/}
      {/*            <Link href="/docs/plans">Rate Limit Documentation</Link>*/}
      {/*          </Button>*/}
      {/*        </div>*/}
      {/*      </CardContent>*/}
      {/*    </Card>*/}
      {/*  </div>*/}
      {/*</MaxWidthWrapper>*/}

      {/* 5. Live Per-1M Token Pricing Table */}
      <MaxWidthWrapper>
        <div id="token-pricing" className="scroll-mt-24 space-y-4">
          <div>
            {/*<div className="flex items-center gap-2">*/}
            {/*  <Badge variant="outline" className="rounded-full text-xs font-mono text-primary">*/}
            {/*    Pay-As-You-Go*/}
            {/*  </Badge>*/}
            {/*  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">*/}
            {/*    Live Token Rates*/}
            {/*  </span>*/}
            {/*</div>*/}
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
              Model Pricing
            </h2>
            {/*<p className="text-sm text-muted-foreground max-w-2xl mt-1">*/}
            {/*  Incurred against your prepaid wallet balance based on actual input and output tokens consumed. Prices are listed per 1,000,000 tokens.*/}
            {/*</p>*/}
          </div>
          <LiveModelPricingTable
            initialModels={liveModels}
            fetchedAt={fetchedAt}
            source={source}
          />
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
