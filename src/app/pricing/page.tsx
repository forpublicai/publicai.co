import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  HeartHandshake,
  KeyRound,
  Layers,
  Shield,
  Sparkles,
  Zap,
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

export const metadata: Metadata = {
  title: "Plans, Rate Limits & Token Pricing — PublicAI",
  description:
    "Transparent, non-profit token pricing and rate-limit tiers for the PublicAI Inference Utility. Start free with $2.00 in credits and 100 req/min, or save 50–80% with the Batch API.",
  alternates: {
    canonical: "https://publicai.co/pricing",
  },
};

interface PricingPlanTier {
  id: string;
  name: string;
  badge: string;
  price: string;
  priceSubtext: string;
  rateLimit: string;
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
    badge: "Starter Utility",
    price: "$0",
    priceSubtext: "Includes $2.00 free starter credit",
    rateLimit: "100 req / min",
    description:
      "Immediate access to every sovereign and open-weight model in our catalog for prototyping, civic research, and evaluation.",
    features: [
      "$2.00 complimentary credit upon creating an API key",
      "100 requests per minute across all /v1/* endpoints",
      "Full access to Apertus 1.5 Vision, SEA-LION v4, Olmo 3 & Salamandra",
      "Zero training on your prompts or completions",
      "Community support via Slack & GitHub",
    ],
    ctaLabel: "Get Free API Key",
    ctaHref: "https://platform.publicai.co/settings/api-keys",
    external: true,
  },
  {
    id: "plus",
    name: "Plus",
    badge: "Community Supporter",
    price: "$20+",
    priceSubtext: "Pay-as-you-go or OpenCollective contribution",
    rateLimit: "200 req / min",
    description:
      "Double your rate limits while directly funding open-source public AI infrastructure and public-interest datasets.",
    features: [
      "200 requests per minute rate limit tier",
      "Priority routing during peak sovereign compute hours",
      "Qualifies via top-up billing or OpenCollective donation",
      "Early access to Batch API (4h Express & 24h Standard)",
      "Supporter recognition in the PublicAI network",
    ],
    ctaLabel: "Upgrade in Billing Portal",
    ctaHref: "https://platform.publicai.co/account/billing",
    external: true,
  },
  {
    id: "pro",
    name: "Pro",
    badge: "Most Popular",
    price: "Usage",
    priceSubtext: "Pay per 1M tokens + volume discounts",
    rateLimit: "300 req / min",
    description:
      "Designed for production applications, research labs, and civic deployments requiring sustained concurrency.",
    highlighted: true,
    features: [
      "300 requests per minute sustained throughput",
      "50–80% discount on asynchronous Batch API workloads",
      "Multi-provider automatic failover across sovereign clusters",
      "Usage analytics & programmatic pricing endpoint (/v1/developer/pricing)",
      "Priority developer support via Chatwoot & email",
    ],
    ctaLabel: "Manage Billing & Credits",
    ctaHref: "https://platform.publicai.co/account/billing",
    external: true,
  },
  {
    id: "enterprise",
    name: "Enterprise & Public Sector",
    badge: "Institutional SLA",
    price: "Custom",
    priceSubtext: "Annual procurement & dedicated capacity",
    rateLimit: "10,000 req / min",
    description:
      "For ministries, public libraries, universities, and enterprises requiring dedicated throughput and jurisdictional guarantees.",
    features: [
      "Up to 10,000 requests per minute custom rate limits",
      "Sovereign region pinning (Switzerland, EU, Singapore, US)",
      "Custom Data Processing Agreements (DPA) & public procurement compliance",
      "Dedicated Batch & Voice API capacity reservations",
      "Direct solutions engineering & architectural onboarding",
    ],
    ctaLabel: "Contact Institutional Team",
    ctaHref: "mailto:contact@publicai.co?subject=PublicAI%20Enterprise%20%26%20Public%20Sector%20Inquiry",
    external: false,
  },
];

export default function PricingPage() {
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
          description="Start building immediately with $2.00 in free credits and 100 requests per minute. Scale transparently with pay-as-you-go token pricing and 50–80% off asynchronous batch workloads."
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
              Open Billing Dashboard
              <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>
        </SectionHeader>
      </MaxWidthWrapper>

      {/* 2. Four Rate-Limit & Plan Tier Cards */}
      <MaxWidthWrapper>
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
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 font-mono text-xs font-semibold text-foreground">
                    <Zap className="h-3 w-3 text-primary" />
                    {tier.rateLimit}
                  </span>
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">{tier.name}</CardTitle>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold tracking-tight">
                      {tier.price}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {tier.priceSubtext}
                  </p>
                </div>
                <CardDescription className="text-xs leading-relaxed">
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

      {/* 3. Batch API 50-80% Off & OpenCollective Support Callout */}
      <MaxWidthWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="rounded-2xl border-border/80 bg-secondary/40">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge className="rounded-full bg-warning text-warning-foreground border-transparent text-xs">
                  50% – 80% Lower Token Cost
                </Badge>
                <Badge variant="outline" className="rounded-full font-mono text-xs">
                  4h & 24h SLA
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold pt-2 flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Asynchronous Batch Processing
              </CardTitle>
              <CardDescription>
                Run large-scale dataset evaluations, multilingual translation pipelines, and synthetic data generation during off-peak sovereign compute windows.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-background p-3.5">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    4-Hour Express Window
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    50% discount off synchronous input & output token rates for same-day turnaround.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-background p-3.5">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
                    <Sparkles className="h-3.5 w-3.5 text-[#00B3A4]" />
                    24-Hour Standard Window
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Up to 80% discount when scheduled into spare supercomputing capacity overnight.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button asChild size="sm" className="rounded-full font-semibold">
                  <Link href="/products/api#batch">
                    Join Batch API Waitlist
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="rounded-full">
                  <Link href="/docs/batch">Read Batch Spec</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80 bg-secondary/40">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-full text-xs">
                  Non-Profit Collective
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold pt-2 flex items-center gap-2">
                <HeartHandshake className="h-5 w-5 text-[#00B3A4]" />
                Community Grants & OpenCollective Tier Upgrades
              </CardTitle>
              <CardDescription>
                PublicAI operates as public digital infrastructure. Your API spend and OpenCollective contributions keep open-weight inference accessible to researchers and citizens globally.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border bg-background p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <Shield className="h-4 w-4 text-primary" />
                  Academic, Library & Civic Research Credits
                </div>
                <p className="leading-relaxed">
                  Universities, public libraries, investigative journalists, and open-source maintainers can apply for sponsored Pro/Enterprise rate limits and compute grants.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full font-semibold"
                >
                  <Link
                    href="https://opencollective.com/publicai"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contribute on OpenCollective
                    <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="rounded-full">
                  <Link href="/docs/plans">Rate Limit Documentation</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MaxWidthWrapper>

      {/* 4. Live Per-1M Token Pricing Table */}
      <MaxWidthWrapper>
        <div id="token-pricing" className="scroll-mt-24">
          <ModelCatalog showHeader={true} defaultTab="table" />
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
