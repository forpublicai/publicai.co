import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Globe2, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { MaxWidthWrapper } from "@/components/global/max-width-wrapper";
import { SectionHeader } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Become a Model Partner — Public AI",
  description:
    "Launch sovereign models with the Public AI Inference Utility. We provide stable APIs, Hugging Face integration, and global public deployment for national labs.",
  alternates: {
    canonical: "https://publicai.co/contributing/model-partners",
  },
};

export default function ModelPartnersPage() {
  return (
    <div className="flex flex-col gap-16 md:gap-24 py-12 md:py-20">
      <MaxWidthWrapper>
        <div className="mb-4">
          <Button asChild variant="ghost" size="sm" className="rounded-full text-xs">
            <Link href="/contributing">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Back to Contributing
            </Link>
          </Button>
        </div>

        <SectionHeader
          badge="National Model Launch Platform"
          badgeVariant="teal"
          title="Become a Model Partner."
          accentText="Deploy Sovereign Models Globally."
          accentColor="red"
          description="The Public AI Inference Utility provides stable, public access to AI models built by national supercomputing centers, government-funded research institutes, and universities."
          align="center"
        >
          <Button asChild size="lg" className="rounded-full px-7 font-semibold">
            <a href="mailto:josh@publicai.co?subject=Model%20Partner%20Inquiry">
              <Mail className="mr-2 h-4 w-4" />
              Contact Model Partnerships (josh@publicai.co)
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-7 font-semibold">
            <Link href="/models">Browse Active Catalog</Link>
          </Button>
        </SectionHeader>
      </MaxWidthWrapper>

      {/* Testimonial Quote */}
      <MaxWidthWrapper>
        <Card className="rounded-3xl border-border bg-secondary/40 p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative h-20 w-20 shrink-0 rounded-full overflow-hidden border-2 border-primary">
              <Image
                src="/people/imanol.png"
                alt="Imanol Schlag"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-3 text-center sm:text-left">
              <blockquote className="text-sm sm:text-base text-foreground leading-relaxed italic">
                &ldquo;So many people have been using Public AI to get an idea of the model. It&apos;s been extremely valuable to just get the word out and get people to play around with it. People are already building on the API—including a system for answering tax questions in Zurich that shows links, hallucinates very little, and highlights what you can build with Apertus.&rdquo;
              </blockquote>
              <div className="text-xs text-muted-foreground font-medium">
                <span className="font-bold text-foreground">Imanol Schlag</span> — Co-lead of Apertus, Swiss National AI Initiative (ETH Zurich &amp; EPFL)
              </div>
            </div>
          </div>
        </Card>
      </MaxWidthWrapper>

      {/* Partner Capabilities Grid */}
      <MaxWidthWrapper>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-2xl border-border/80">
            <CardHeader className="space-y-2">
              <Globe2 className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-bold">Global Inference Gateway</CardTitle>
              <CardDescription className="text-xs">
                OpenAI-compatible APIs, streaming SSE, and high-availability failover.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              We manage user routing, authentication, rate limits, and compliance with data privacy regulations like GDPR.
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80">
            <CardHeader className="space-y-2">
              <Sparkles className="h-5 w-5 text-[#00B3A4]" />
              <CardTitle className="text-lg font-bold">Official Hugging Face Provider</CardTitle>
              <CardDescription className="text-xs">
                Direct integration into Hugging Face model cards for 1-click test runs.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Your model is instantly accessible via Hugging Face&apos;s inference widget and client SDKs through our official provider tier.
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80">
            <CardHeader className="space-y-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-bold">Comms &amp; Compute Coordination</CardTitle>
              <CardDescription className="text-xs">
                Rallying inference compute partners to ensure free pilot availability.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              We coordinate press releases, media kits, and academic distribution to give your model the global visibility it deserves.
            </CardContent>
          </Card>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
