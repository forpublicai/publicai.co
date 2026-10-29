import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Cpu, Mail, Radio, ShieldCheck } from "lucide-react";
import { MaxWidthWrapper } from "@/components/global/max-width-wrapper";
import { SectionHeader } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Become an Inference Partner — Public AI",
  description:
    "Support Public AI by contributing GPU inference compute for sovereign models. Join national computing centers and sovereign cloud providers.",
  alternates: {
    canonical: "https://publicai.co/contributing/inference-partners",
  },
};

export default function InferencePartnersPage() {
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
          badge="Infrastructure Partnership"
          badgeVariant="teal"
          title="Become an Inference Partner."
          accentText="Power Sovereign AI Compute."
          accentColor="teal"
          description="Support the global public AI movement by providing inference compute for national and open-weight models. We partner with national supercomputing facilities, academic clusters, and sovereign cloud providers."
          align="center"
        >
          <Button asChild size="lg" className="rounded-full px-7 font-semibold">
            <a href="mailto:support@publicai.co?subject=Inference%20Partner%20Inquiry">
              <Mail className="mr-2 h-4 w-4" />
              Contact Infrastructure Team
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-7 font-semibold">
            <Link href="/docs/inference-partners-faq">
              Read Partner FAQ
            </Link>
          </Button>
        </SectionHeader>
      </MaxWidthWrapper>

      <MaxWidthWrapper>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-2xl border-border/80">
            <CardHeader className="space-y-2">
              <Cpu className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-bold">Why Contribute Compute?</CardTitle>
              <CardDescription className="text-xs">
                Demonstrate what public, open-source AI can accomplish outside big tech monopolies.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Your compute directly enables researchers, students, civic organizations, and citizens to access sovereign models for free without private tracking.
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80">
            <CardHeader className="space-y-2">
              <Radio className="h-5 w-5 text-[#00B3A4]" />
              <CardTitle className="text-lg font-bold">Partner Announcements</CardTitle>
              <CardDescription className="text-xs">
                Co-branded press releases, technical case studies, and social amplification.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              We provide partners with communications toolkits, benchmark reports, and high-visibility recognition across Public AI and Hugging Face.
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80">
            <CardHeader className="space-y-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-bold">Seamless Integration</CardTitle>
              <CardDescription className="text-xs">
                Dedicated Slack/Signal channels, weekly office hours, and vLLM routing.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Our gateway handles load balancing, health monitoring, failover, and prompt safety so you can focus on reliable hardware operations.
            </CardContent>
          </Card>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
