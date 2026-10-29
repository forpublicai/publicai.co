import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Code2,
  ExternalLink,
  Github,
  Heart,
  Sparkles,
  Users,
} from "lucide-react";
import { MaxWidthWrapper } from "@/components/global/max-width-wrapper";
import { SectionHeader } from "@/components/sections";
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
  title: "Contributing — Help Us Build Public AI for Everyone",
  description:
    "Contribute to the Public AI Inference Utility. Opportunities for software developers, AI researchers, policy scholars, designers, and compute donors.",
  alternates: {
    canonical: "https://publicai.co/contributing",
  },
};

const DEV_OPPORTUNITIES = [
  "Evaluation & monitoring pipelines for multilingual sovereign models",
  "Specialized telemetry and data feedback loops back to national labs",
  "Gateway load balancing and failover routing across global GPU clusters",
  "vLLM & Hugging Face automated CI/CD deployment pipelines",
  "Public AI Web Chat UX & OpenWebUI integration",
  "Developer documentation, OpenAPI specs, and SDK tutorials",
];

const CIVIC_OPPORTUNITIES = [
  "Coordination and leadership of distributed contributor working groups",
  "Policy and public procurement guidance for municipal and regional governments",
  "Civic AI Kiosks curriculum development and librarian training workshops",
  "Storytelling, technical writing, and multilingual translations",
  "Outreach to universities and public research institutes for compute donations",
];

export default function ContributingPage() {
  return (
    <div className="flex flex-col gap-16 md:gap-24 py-12 md:py-20">
      {/* 1. Hero Header */}
      <MaxWidthWrapper>
        <SectionHeader
          badge="Open Movement"
          badgeVariant="teal"
          title="Help us build AI for everyone."
          accentText="Join the Public AI Movement."
          accentColor="teal"
          description="The Public AI Inference Utility is the world's first open-source, public inference infrastructure for sovereign AI models. We welcome contributors worldwide—developers, researchers, designers, policymakers, and civic organizers."
          align="center"
        >
          <Button asChild size="lg" className="rounded-full px-7 font-semibold">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSf8vELDGrfgxCt-jxmRHTPYuVzwt8Xv5Vof4H_Oj5XPX_PIWg/viewform?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              30-Second Contributor Form
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-7 font-semibold"
          >
            <a
              href="https://github.com/forpublicai"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub Organization
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
            </a>
          </Button>
        </SectionHeader>
      </MaxWidthWrapper>

      {/* 2. Photo & Story */}
      <MaxWidthWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 relative aspect-[4/3] rounded-3xl overflow-hidden border border-border shadow-md">
            <Image
              src="/josh_puppy.jpeg"
              alt="Contributing to Public AI"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="lg:col-span-7 space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Every Contribution Shapes Sovereign Intelligence
            </h2>
            <p>
              Whether you are an infrastructure engineer tuning GPU kernels, an academic evaluating model bias, a librarian designing civic prompts, or someone with an H100 GPU in your lab, your effort directly expands public access to non-corporate AI.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild variant="outline" className="rounded-full text-xs">
                <Link href="/contributing/model-partners">
                  Become a Model Partner →
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full text-xs">
                <Link href="/contributing/inference-partners">
                  Become an Inference Partner →
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full text-xs">
                <a
                  href="https://opencollective.com/publicai"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Heart className="mr-1.5 h-3.5 w-3.5 text-primary" />
                  Support on OpenCollective
                </a>
              </Button>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>

      {/* 3. Ways to Contribute (Developers & Civic) */}
      <MaxWidthWrapper>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Track 1: Developers */}
          <Card className="rounded-3xl border-border/80 flex flex-col justify-between">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                  <Code2 className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Developers &amp; Engineers</CardTitle>
                  <CardDescription className="text-xs">
                    Backend, gateway routing, ops, web chat, and telemetry
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Our stack is built on Next.js 15, TypeScript, Tailwind, OpenWebUI, Zuplo, vLLM, and federated HPC clusters.
              </p>
              <ul className="space-y-2 text-xs text-foreground/90">
                {DEV_OPPORTUNITIES.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-[#00B3A4] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-2">
              <Button asChild className="w-full rounded-full font-semibold">
                <a
                  href="https://github.com/forpublicai/chat.publicai.co/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  Browse Open GitHub Issues
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </a>
              </Button>
            </CardFooter>
          </Card>

          {/* Track 2: Civic, Policy & Creative */}
          <Card className="rounded-3xl border-border/80 flex flex-col justify-between">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-[#00B3A4]">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Civic, Policy &amp; Creative</CardTitle>
                  <CardDescription className="text-xs">
                    Governance, research, library programs, and community organizing
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                You do not need to write code to make a profound impact on public AI. We need organizers, writers, and policy experts.
              </p>
              <ul className="space-y-2 text-xs text-foreground/90">
                {CIVIC_OPPORTUNITIES.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-2">
              <Button asChild variant="outline" className="w-full rounded-full font-semibold">
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSf8vELDGrfgxCt-jxmRHTPYuVzwt8Xv5Vof4H_Oj5XPX_PIWg/viewform?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Submit 30-Second Bio Form
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </MaxWidthWrapper>

      {/* 4. Partner Track Cards */}
      <MaxWidthWrapper>
        <div className="rounded-3xl border border-border bg-secondary/40 p-6 sm:p-10 space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Institutional Partnership Tracks
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Are you a national AI lab or computing provider? Explore our dedicated partner guides.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="rounded-2xl border-border/80 bg-background">
              <CardHeader className="space-y-1">
                <CardTitle className="text-base font-bold">
                  Become a Model Partner
                </CardTitle>
                <CardDescription className="text-xs">
                  Launch models built by national labs and public universities on our global inference utility.
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-0">
                <Button asChild variant="link" className="px-0 font-semibold text-primary">
                  <Link href="/contributing/model-partners">
                    Read Model Partner Guide →
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="rounded-2xl border-border/80 bg-background">
              <CardHeader className="space-y-1">
                <CardTitle className="text-base font-bold">
                  Become an Inference Partner
                </CardTitle>
                <CardDescription className="text-xs">
                  Donate or sponsor GPU compute to expand global public access to sovereign models.
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-0">
                <Button asChild variant="link" className="px-0 font-semibold text-primary">
                  <Link href="/contributing/inference-partners">
                    Read Inference Partner Guide →
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
