import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Marquee } from "@/components/ui/marquee";

export interface PartnerLogo {
  name: string;
  src: string;
  alt: string;
  href?: string;
}

const PARTNER_LOGOS: PartnerLogo[] = [
  {
    name: "AWS",
    src: "/inference_partners/aws.png",
    alt: "Amazon Web Services (AWS)",
  },
  {
    name: "Intel",
    src: "/inference_partners/intel.png",
    alt: "Intel Corporation",
  },
  {
    name: "Swiss AI",
    src: "/inference_partners/swissai.png",
    alt: "Swiss AI Initiative & CSCS Alps",
  },
  {
    name: "AI Singapore",
    src: "/inference_partners/aisingapore.png",
    alt: "AI Singapore (AISG)",
  },
  {
    name: "Forschungszentrum Jülich",
    src: "/inference_partners/juelich.png",
    alt: "Jülich Supercomputing Centre",
  },
  {
    name: "National Computational Infrastructure Australia",
    src: "/inference_partners/nciaustralia.png",
    alt: "NCI Australia Supercomputing",
  },
  {
    name: "Exoscale",
    src: "/inference_partners/exoscale.png",
    alt: "Exoscale European Cloud",
  },
  {
    name: "Cudo Compute",
    src: "/inference_partners/cudo.png",
    alt: "Cudo Distributed Compute",
  },
];

export function PartnerLogosCarousel() {
  return (
    <section className="relative w-full overflow-hidden py-4 sm:py-5 border-y border-border/40 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center mb-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/80">
            POWERED BY GLOBAL INFERENCE &amp; COMPUTE PARTNERS
          </p>
        </div>

        {/* Gradient edge fades */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-24 bg-gradient-to-r from-background via-background/80 to-transparent dark:from-background dark:via-background/80" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-24 bg-gradient-to-l from-background via-background/80 to-transparent dark:from-background dark:via-background/80" />

          <Marquee pauseOnHover repeat={3} className="[--duration:30s] [--gap:2.5rem] py-0">
            {PARTNER_LOGOS.map((partner) => (
              <div
                key={partner.name}
                className="group flex h-12 sm:h-14 items-center justify-center rounded-md px-4 py-1 transition-all"
                title={partner.alt}
              >
                <div className="relative h-7 sm:h-8 w-28 sm:w-36 flex items-center justify-center grayscale opacity-65 contrast-125 dark:invert dark:opacity-75 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:contrast-100 dark:group-hover:invert-0">
                  <Image
                    src={partner.src}
                    alt={partner.alt}
                    fill
                    sizes="(max-width: 640px) 112px, 144px"
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </Marquee>
        </div>

        {/*<div className="mt-2 flex items-center justify-center">*/}
        {/*  <Link*/}
        {/*    href="/contributing/inference-partners"*/}
        {/*    className="text-[11px] font-medium text-muted-foreground/80 hover:text-primary transition-colors flex items-center gap-1"*/}
        {/*  >*/}
        {/*    Provide compute or partner with us →*/}
        {/*  </Link>*/}
        {/*</div>*/}
      </div>
    </section>
  );
}
