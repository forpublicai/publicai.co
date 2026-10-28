import React from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Hash } from "lucide-react";
import { MaxWidthWrapper } from "@/components/global/max-width-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CopyButton } from "@/components/ui/copy-button";
import { SectionHeader } from "./SectionHeader";
import { CardGrid, CardGridItem } from "./CardGrid";
import { cn } from "@/lib/utils";

export interface ProductCodeTab {
  id: string;
  label: string;
  language?: string;
  description?: string;
  code: string;
}

export interface ProductHashSubsection {
  /** Anchor ID without '#', e.g. 'mobile', 'batch', 'voice' */
  id: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "outline" | "amber" | "teal";
  title: string;
  accentText?: string;
  accentColor?: "red" | "teal";
  description: string;
  features?: CardGridItem[];
  codeTabs?: ProductCodeTab[];
  ctaLabel?: string;
  ctaHref?: string;
  waitlistSlot?: React.ReactNode;
}

export interface ProductPageTemplateProps {
  badge: string;
  badgeVariant?: "default" | "secondary" | "outline" | "amber" | "teal";
  title: string;
  accentText?: string;
  accentColor?: "red" | "teal";
  description: string;
  primaryCta?: {
    label: string;
    href: string;
    external?: boolean;
  };
  secondaryCta?: {
    label: string;
    href: string;
    external?: boolean;
  };
  heroSlot?: React.ReactNode;
  featuresTitle?: string;
  featuresSubtitle?: string;
  features: CardGridItem[];
  featuresColumns?: 2 | 3 | 4;
  codeSectionTitle?: string;
  codeSectionSubtitle?: string;
  codeTabs?: ProductCodeTab[];
  subsections?: ProductHashSubsection[];
  waitlistSlot?: React.ReactNode;
  bottomBanner?: {
    title?: string;
    accentText?: string;
    subtitle?: string;
    ctaLabel?: string;
    ctaHref?: string;
  };
  children?: React.ReactNode;
}

export function ProductPageTemplate({
  badge,
  badgeVariant = "secondary",
  title,
  accentText,
  accentColor = "red",
  description,
  primaryCta,
  secondaryCta,
  heroSlot,
  featuresTitle = "Built for Public Good at Production Scale",
  featuresSubtitle,
  features,
  featuresColumns = 3,
  codeSectionTitle,
  codeSectionSubtitle,
  codeTabs,
  subsections,
  waitlistSlot,
  bottomBanner,
  children,
}: ProductPageTemplateProps) {
  return (
    <div className="flex flex-col gap-16 md:gap-24 py-12 md:py-20">
      {/* 1. Product Hero Section */}
      <MaxWidthWrapper>
        <div className="flex flex-col items-center text-center gap-6">
          <SectionHeader
            badge={badge}
            badgeVariant={badgeVariant}
            title={title}
            accentText={accentText}
            accentColor={accentColor}
            description={description}
            align="center"
          >
            {primaryCta && (
              <Button
                asChild
                size="lg"
                className="rounded-full px-7 font-semibold shadow-sm"
              >
                <Link
                  href={primaryCta.href}
                  target={primaryCta.external ? "_blank" : undefined}
                  rel={primaryCta.external ? "noopener noreferrer" : undefined}
                >
                  {primaryCta.label}
                  {primaryCta.external ? (
                    <ExternalLink className="ml-2 h-4 w-4" />
                  ) : (
                    <ArrowRight className="ml-2 h-4 w-4" />
                  )}
                </Link>
              </Button>
            )}
            {secondaryCta && (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-7 font-semibold"
              >
                <Link
                  href={secondaryCta.href}
                  target={secondaryCta.external ? "_blank" : undefined}
                  rel={secondaryCta.external ? "noopener noreferrer" : undefined}
                >
                  {secondaryCta.label}
                </Link>
              </Button>
            )}
          </SectionHeader>

          {/* Quick Anchor Pills for Sub-Features (#mobile, #batch, #voice) */}
          {subsections && subsections.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1">
                Sub-Features:
              </span>
              {subsections.map((sub) => (
                <Link
                  key={sub.id}
                  href={`#${sub.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/70 px-3.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-accent"
                >
                  <Hash className="h-3 w-3 text-primary" />
                  <span>{sub.title}</span>
                  {sub.badge && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "ml-1 rounded-full px-2 py-0 text-[10px]",
                        sub.badgeVariant === "amber" &&
                          "bg-warning text-warning-foreground border-transparent"
                      )}
                    >
                      {sub.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>
          )}

          {heroSlot && <div className="w-full pt-4">{heroSlot}</div>}
        </div>
      </MaxWidthWrapper>

      {/* 2. Core Feature CardGrid */}
      {features.length > 0 && (
        <MaxWidthWrapper>
          <div className="flex flex-col gap-10">
            <SectionHeader
              title={featuresTitle}
              description={featuresSubtitle}
              align="center"
            />
            <CardGrid items={features} columns={featuresColumns} />
          </div>
        </MaxWidthWrapper>
      )}

      {/* 3. Code / Spec Tabs Showcase */}
      {codeTabs && codeTabs.length > 0 && (
        <MaxWidthWrapper>
          <div className="flex flex-col gap-8">
            {codeSectionTitle && (
              <SectionHeader
                badge="Developer Experience"
                badgeVariant="teal"
                title={codeSectionTitle}
                description={codeSectionSubtitle}
                align="center"
              />
            )}
            <Card className="theme-navy rounded-2xl border border-border/40 bg-background text-foreground shadow-lg overflow-hidden">
              <Tabs defaultValue={codeTabs[0].id} className="w-full">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 bg-black/20 px-6 py-4">
                  <div>
                    <CardTitle className="text-base font-semibold text-white">
                      Quickstart Examples
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-300">
                      Drop-in OpenAI-compatible SDK & REST examples
                    </CardDescription>
                  </div>
                  <TabsList className="bg-white/10 text-white">
                    {codeTabs.map((tab) => (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="data-[state=active]:bg-primary data-[state=active]:text-white text-xs"
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </CardHeader>
                {codeTabs.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id} className="m-0">
                    <CardContent className="relative p-6">
                      {tab.description && (
                        <p className="mb-3 text-xs text-slate-300">
                          {tab.description}
                        </p>
                      )}
                      <div className="relative rounded-xl bg-black/40 p-4 font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto border border-white/10">
                        <CopyButton
                          text={tab.code}
                          className="absolute right-3 top-3 bg-white/10 hover:bg-white/20"
                        />
                        <pre className="pr-10 leading-relaxed">
                          <code>{tab.code}</code>
                        </pre>
                      </div>
                    </CardContent>
                  </TabsContent>
                ))}
              </Tabs>
            </Card>
          </div>
        </MaxWidthWrapper>
      )}

      {/* 4. Deep-Linkable #hash Anchor Subsections (e.g. #mobile, #batch, #voice) */}
      {subsections &&
        subsections.map((sub) => (
          <MaxWidthWrapper key={sub.id}>
            <div
              id={sub.id}
              className="scroll-mt-28 rounded-3xl border border-border bg-secondary/40 p-6 sm:p-10 md:p-12 flex flex-col gap-10"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <SectionHeader
                  badge={sub.badge ?? `#${sub.id}`}
                  badgeVariant={sub.badgeVariant ?? "amber"}
                  title={sub.title}
                  accentText={sub.accentText}
                  accentColor={sub.accentColor ?? "teal"}
                  description={sub.description}
                  align="left"
                />
                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href={`#${sub.id}`}
                    className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground"
                    title={`Direct link to #${sub.id}`}
                  >
                    <Hash className="h-3.5 w-3.5 text-primary" />
                    <span>{sub.id}</span>
                  </Link>
                  {sub.ctaHref && sub.ctaLabel && (
                    <Button asChild className="rounded-full font-semibold">
                      <Link href={sub.ctaHref}>
                        {sub.ctaLabel}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              {sub.features && sub.features.length > 0 && (
                <>
                  <Separator />
                  <CardGrid items={sub.features} columns={3} />
                </>
              )}

              {sub.codeTabs && sub.codeTabs.length > 0 && (
                <Card className="theme-navy rounded-2xl border border-border/40 bg-background text-foreground overflow-hidden">
                  <Tabs defaultValue={sub.codeTabs[0].id} className="w-full">
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/10 bg-black/20 px-6 py-3">
                      <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
                        {sub.title} — Spec Preview
                      </span>
                      <TabsList className="bg-white/10 text-white">
                        {sub.codeTabs.map((tab) => (
                          <TabsTrigger
                            key={tab.id}
                            value={tab.id}
                            className="data-[state=active]:bg-primary data-[state=active]:text-white text-xs"
                          >
                            {tab.label}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </CardHeader>
                    {sub.codeTabs.map((tab) => (
                      <TabsContent key={tab.id} value={tab.id} className="m-0">
                        <CardContent className="p-5">
                          <div className="relative rounded-xl bg-black/40 p-4 font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto border border-white/10">
                            <CopyButton
                              text={tab.code}
                              className="absolute right-3 top-3 bg-white/10 hover:bg-white/20"
                            />
                            <pre className="pr-10 leading-relaxed">
                              <code>{tab.code}</code>
                            </pre>
                          </div>
                        </CardContent>
                      </TabsContent>
                    ))}
                  </Tabs>
                </Card>
              )}

              {sub.waitlistSlot && <div>{sub.waitlistSlot}</div>}
            </div>
          </MaxWidthWrapper>
        ))}

      {/* 5. Custom Page Children / Waitlist Slot */}
      {children && <MaxWidthWrapper>{children}</MaxWidthWrapper>}
      {waitlistSlot && <MaxWidthWrapper>{waitlistSlot}</MaxWidthWrapper>}

      {/* 6. Signature Dual-Tone Navy Banner (design/branding.png) */}
      {bottomBanner && (
        <MaxWidthWrapper>
          <div className="theme-navy relative overflow-hidden rounded-2xl border border-white/10 bg-[#0F2D4A] px-6 py-12 sm:px-12 sm:py-16 text-center shadow-xl">
            {/* Left Primary Red & Right Teal geometric ribbon accents */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-72 rotate-12 rounded-full bg-[#FF3B30]/25 blur-2xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-72 -rotate-12 rounded-full bg-[#00B3A4]/25 blur-2xl"
            />
            <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-4">
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
                {bottomBanner.title ?? "Smarter AI."}{" "}
                <span className="text-[#00B3A4]">
                  {bottomBanner.accentText ?? "Greater Possibilities."}
                </span>
              </h2>
              <p className="text-sm sm:text-base text-slate-200 max-w-xl">
                {bottomBanner.subtitle ??
                  "Build. Deploy. Scale. Sovereign public AI infrastructure for what's next."}
              </p>
              {bottomBanner.ctaHref && (
                <Button
                  asChild
                  size="lg"
                  className="mt-2 rounded-full bg-[#FF3B30] hover:bg-[#E02E24] text-white font-semibold px-7"
                >
                  <Link href={bottomBanner.ctaHref}>
                    {bottomBanner.ctaLabel ?? "Get Started"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </MaxWidthWrapper>
      )}
    </div>
  );
}

export default ProductPageTemplate;
