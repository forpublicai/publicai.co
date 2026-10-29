import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  Globe2,
  Heart,
  Landmark,
  Mail,
  Sparkles,
} from "lucide-react";
import { MaxWidthWrapper } from "@/components/global/max-width-wrapper";
import { SectionHeader } from "@/components/sections";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us — Public AI Inference Utility",
  description:
    "We build public AI: sovereign, nonprofit, open-source AI infrastructure operated as a public good like highways, clean water, or electricity.",
  alternates: {
    canonical: "https://publicai.co/about",
  },
};

const QUOTES = [
  {
    quote: "We're three toddlers in a trench coat, and that is awesome!",
    author: "Katherine",
    link: "https://www.katherinelgorman.com/",
  },
  {
    quote: "Okay, why don't we just build this feature in the next hour?",
    author: "Josh",
    link: "https://joshuatan.com/research",
  },
  {
    quote: "... who built this? 😒",
    author: "Jenny",
    link: "https://jennyfan.com/",
  },
  {
    quote: "[While demoing the app] Oh, I'm actually on a run right now.",
    author: "Joseph",
    link: "https://www.linkedin.com/in/joseph-low-bc/",
  },
  {
    quote: "Is this like ChatGPT but vegan/fairtrade/organic?",
    author: "Nick",
    link: "https://www.nickmvincent.com/",
  },
  {
    quote: "Eat some shit, I love you.",
    author: "Alex",
    link: "http://linkedin.com/in/alex-kj?originalSubdomain=uk",
  },
  {
    quote: "Computers were a mistake.",
    author: "Robin",
    link: "https://berjon.com/",
  },
  {
    quote: "We're the best supporting actress for Swiss AI's launch, and that can be a luxury.",
    author: "Katherine",
    link: "https://www.katherinelgorman.com/",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-16 md:gap-24 py-12 md:py-20">
      {/* 1. Hero Section */}
      <MaxWidthWrapper>
        <SectionHeader
          badge="Nonprofit Public Digital Infrastructure"
          badgeVariant="teal"
          title="We build public AI."
          accentText="AI as a Civic Good."
          accentColor="red"
          description="The Public AI Inference Utility is a nonprofit, open-source organization supporting sovereign AI model builders worldwide. We believe AI should be governed like public utilities: transparent, auditable, and accessible to everyone."
          align="center"
        >
          <Button asChild size="lg" className="rounded-full px-7 font-semibold">
            <Link href="/contributing">
              Join the Movement
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-7 font-semibold"
          >
            <a
              href="https://opencollective.com/publicai"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Heart className="mr-2 h-4 w-4 text-primary" />
              Support on OpenCollective
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
            </a>
          </Button>
        </SectionHeader>
      </MaxWidthWrapper>

      {/* 2. Team Photo & Mission Story */}
      <MaxWidthWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden border border-border shadow-md">
            <Image
              src="/team.jpg"
              alt="Public AI Team"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="lg:col-span-6 space-y-5 text-sm sm:text-base text-muted-foreground leading-relaxed">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Think of a BBC, a Water Utility, or a Public Library for AI
            </h2>
            <p>
              We operate user-facing infrastructure, APIs, and community tools to support public AI model builders like the{" "}
              <strong className="text-foreground">Swiss National AI Initiative</strong>,{" "}
              <strong className="text-foreground">AI Singapore</strong>,{" "}
              <strong className="text-foreground">AI Sweden</strong>, and the{" "}
              <strong className="text-foreground">Barcelona Supercomputing Center</strong>.
            </p>
            <p>
              Rather than forcing societies to depend exclusively on venture-backed monopolies driven by advertising surveillance, we help national labs and public institutions bring their models directly to citizens, researchers, and developers.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
                Fiscally sponsored by Metagov (501c3)
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
                Supported by Mozilla &amp; Future of Life Institute
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
                Center for Cultural Innovation
              </Badge>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>

      {/* 3. Sister Projects & Movement */}
      <MaxWidthWrapper>
        <div className="rounded-3xl border border-border bg-secondary/40 p-6 sm:p-12 space-y-8">
          <div className="space-y-2 max-w-2xl">
            <Badge variant="secondary" className="rounded-full text-xs">
              Part of a Global Movement
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Sister Initiatives &amp; Coalitions
            </h2>
            <p className="text-sm text-muted-foreground">
              Public AI is not just one organization—it is a worldwide ecosystem of researchers, civil servants, and technologists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="rounded-2xl border-border/80">
              <CardHeader className="space-y-2">
                <Globe2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-bold">
                  Public AI Network
                </CardTitle>
                <CardDescription className="text-xs">
                  Global research coalition convening bi-weekly seminars, working groups, and publishing open scientific research.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild variant="link" className="px-0 font-semibold text-primary">
                  <Link href="/research">Visit Research Hub →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/80">
              <CardHeader className="space-y-2">
                <Landmark className="h-5 w-5 text-[#00B3A4]" />
                <CardTitle className="text-lg font-bold">
                  Public AI Switzerland
                </CardTitle>
                <CardDescription className="text-xs">
                  Swiss chapter advancing public digital infrastructure in collaboration with ETH Zurich, EPFL, and CSCS Alps.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild variant="link" className="px-0 font-semibold text-primary">
                  <a href="https://publicai.ch" target="_blank" rel="noopener noreferrer">
                    publicai.ch <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/80">
              <CardHeader className="space-y-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-bold">
                  Public AI Substack
                </CardTitle>
                <CardDescription className="text-xs">
                  Bi-monthly newsletter covering model launches, state compute investments, and interviews with sovereign builders.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild variant="link" className="px-0 font-semibold text-primary">
                  <a href="https://publicai.substack.com" target="_blank" rel="noopener noreferrer">
                    Read Substack <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </MaxWidthWrapper>

      {/* 4. Quote Wall */}
      <MaxWidthWrapper>
        <div className="space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <Badge variant="outline" className="rounded-full text-xs">
              Culture &amp; Voices
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              The Quote Wall
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Unfiltered thoughts from the team, collaborators, and friends who build Public AI.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {QUOTES.map((item, idx) => (
              <Card
                key={idx}
                className="rounded-2xl border-border/70 flex flex-col justify-between hover:border-primary/40 transition-colors"
              >
                <CardHeader className="space-y-3">
                  <p className="text-sm font-medium leading-relaxed italic text-foreground">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </CardHeader>
                <CardContent className="pt-0 text-xs text-muted-foreground">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    — {item.author}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </MaxWidthWrapper>

      {/* 5. Contact CTA */}
      <MaxWidthWrapper>
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold">Have Questions or Want to Collaborate?</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Reach out to our founding team or connect on social media.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild className="rounded-full font-semibold">
              <a href="mailto:hello@publicai.co">
                <Mail className="mr-2 h-4 w-4" />
                hello@publicai.co
              </a>
            </Button>
            <Button asChild variant="outline" className="rounded-full font-semibold">
              <a
                href="https://www.linkedin.com/company/pubai/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn Page
                <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
