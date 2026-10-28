import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  Globe2,
  Landmark,
  MonitorSmartphone,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  ProductPageTemplate,
  WaitlistForm,
  type CardGridItem,
} from "@/components/sections";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Public AI Kiosks for Libraries & Civic Spaces — PublicAI",
  description:
    "Turnkey physical AI kiosks co-designed with the Library of Congress, Metagov, Public Knowledge, and state libraries across Texas, Utah, and New Jersey. Join the $1,000/yr library pilot.",
  alternates: {
    canonical: "https://publicai.co/products/kiosks",
  },
};

const KIOSK_FEATURES: CardGridItem[] = [
  {
    title: "$1,000 / Year All-Inclusive Library Pilot",
    description:
      "Includes pre-configured touchscreen kiosk support, unlimited PublicAI sovereign model inference, local archival RAG indexing, and librarian training workshops.",
    badge: "$1,000/yr Pilot",
    badgeVariant: "teal",
    icon: <MonitorSmartphone className="h-5 w-5" />,
    href: "#apply",
    ctaLabel: "Apply for Pilot",
  },
  {
    title: "Local Archival & Municipal RAG Grounding",
    description:
      "Index local town histories, library catalogs, municipal codes, and social service directories so patrons receive cited, trustworthy community answers.",
    badge: "Local Collections",
    badgeVariant: "secondary",
    icon: <BookOpen className="h-5 w-5" />,
    href: "/projects/libraries",
    ctaLabel: "Read Case Study",
  },
  {
    title: "Ephemeral Patron Privacy Sessions",
    description:
      "Every patron session automatically resets on walk-away with zero personal account requirement, preserving the sacred privacy standard of public libraries.",
    badge: "Patron Privacy",
    badgeVariant: "outline",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    title: "Multilingual & Voice-Accessible Interface",
    description:
      "Serve patrons in 1,800+ languages with high-contrast large typography, camera document scanning, and spoken audio interaction.",
    badge: "ADA & Multilingual",
    badgeVariant: "teal",
    icon: <Globe2 className="h-5 w-5" />,
  },
  {
    title: "Co-Designed with National Library Leaders",
    description:
      "Developed through workshops with the Library of Congress Labs, Metagov, Public Knowledge, Pottsboro Area Library (TX), Utah State Library, and NJ State Library.",
    badge: "Coalition Built",
    badgeVariant: "secondary",
    icon: <Landmark className="h-5 w-5" />,
    href: "/projects/libraries",
    ctaLabel: "Explore Library Coalition",
  },
  {
    title: "Librarian-in-the-Loop Governance",
    description:
      "Librarians control system prompts, curated source allowlists, and community feedback escalation—positioning librarians as civic AI stewards.",
    badge: "Local Stewardship",
    badgeVariant: "outline",
    icon: <Users className="h-5 w-5" />,
  },
];

const PILOT_PARTNERS = [
  "Library of Congress Labs (Workshop Partner)",
  "Pottsboro Area Public Library (Texas)",
  "Utah State Library Division",
  "New Jersey State Library",
  "Metagov & Public Knowledge",
  "EveryLibrary Institute",
];

export default function KiosksProductPage() {
  return (
    <ProductPageTemplate
      badge="Live Civic Pilot · $1,000/yr Library Package"
      badgeVariant="teal"
      title="Public AI Kiosks."
      accentText="Community AI Anchored in Public Libraries."
      accentColor="red"
      description="Bring sovereign, privacy-preserving AI directly into libraries, town halls, and community centers. Co-designed with librarians across the United States to bridge the digital divide without surveillance."
      primaryCta={{
        label: "Apply for Library Pilot ($1,000/yr)",
        href: "#apply",
      }}
      secondaryCta={{
        label: "Read the Libraries Field Report",
        href: "/projects/libraries",
      }}
      featuresTitle="Engineered for Public Libraries & Civic Spaces"
      featuresSubtitle="Combining physical walk-up accessibility with local collection RAG and sovereign open-weight models."
      features={KIOSK_FEATURES}
      featuresColumns={3}
      waitlistSlot={
        <div id="apply" className="scroll-mt-28 space-y-8">
          <WaitlistForm
            product="kiosks-pilot"
            badge="Library & Civic Kiosk Pilot"
            title="Apply for the $1,000/yr Public AI Kiosk Pilot"
            description="Enter your institutional email to receive the pilot specification sheet, grant matching options, and onboarding schedule for your library or municipality."
            buttonLabel="Request Pilot Application"
          />
        </div>
      }
      bottomBanner={{
        title: "Read how libraries are",
        accentText: "shaping Public AI.",
        subtitle:
          "Explore our comprehensive report from the Library of Congress workshop and field pilots in Texas, Utah, and New Jersey.",
        ctaLabel: "Read /projects/libraries",
        ctaHref: "/projects/libraries",
      }}
    >
      {/* Coalition & Case Study Highlight Card */}
      <Card className="rounded-3xl border-border bg-secondary/40 p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <Badge variant="outline" className="rounded-full text-xs">
              Field Report & Case Study
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Built With Librarians, Not Just For Them
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              In partnership with Metagov, Public Knowledge, and library innovators from rural Texas to state libraries in Utah and New Jersey, PublicAI Kiosks transform libraries from passive consumers of commercial tech into active stewards of local knowledge infrastructure.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button asChild className="rounded-full font-semibold">
                <Link href="/projects/libraries">
                  <Building2 className="mr-2 h-4 w-4" />
                  Read the Full Libraries Blog Post
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Card className="rounded-2xl border-border/80 bg-background">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Participating Library & Civic Collaborators
                </CardTitle>
                <CardDescription className="text-xs">
                  Institutions contributing to the Public AI Kiosk curriculum & field pilots
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
                  {PILOT_PARTNERS.map((partner) => (
                    <li key={partner} className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#00B3A4] shrink-0" />
                      <span>{partner}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </Card>
    </ProductPageTemplate>
  );
}
