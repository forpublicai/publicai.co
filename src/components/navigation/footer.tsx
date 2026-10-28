"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  CornerDownRight,
  ExternalLink,
  Mail,
  MessageSquare,
} from "lucide-react";
import { MaxWidthWrapper } from "@/components/global/max-width-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BrandLockup } from "./navbar";

declare global {
  interface Window {
    $chatwoot?: {
      toggle: (state?: "open" | "close") => void;
      [key: string]: unknown;
    };
  }
}

export function Footer() {
  const pathname = usePathname() || "/";
  if (pathname === "/chat" || pathname.startsWith("/chat/")) {
    return null;
  }

  const openSupportChat = () => {
    if (typeof window !== "undefined" && window.$chatwoot?.toggle) {
      window.$chatwoot.toggle("open");
    } else if (typeof window !== "undefined") {
      window.location.href = "mailto:support@publicai.co";
    }
  };

  return (
    <footer className="border-t border-border bg-secondary/50 text-foreground">
      <MaxWidthWrapper className="py-14 lg:py-20">
        {/* 5-Column Institutional Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Column 0 (Left, 4 cols): Brand Lockup, Mission, Newsletter, Live Status Badge & Socials */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6 pr-0 lg:pr-6">
            <div className="space-y-4">
              <BrandLockup />
              <p className="text-sm text-muted-foreground leading-relaxed">
                A nonprofit, open-source inference utility and global research
                coalition making public and sovereign AI accessible to everyone.
                Operated by{" "}
                <a
                  href="https://metagov.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                >
                  Metagov Inc.
                </a>
                , a 501(c)(3) nonprofit organization.
              </p>

              {/* Live System Status Badge (status.publicai.co) */}
              <div className="pt-1">
                <a
                  href="https://status.publicai.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-brand-teal/30 bg-brand-teal/10 px-3.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-brand-teal hover:bg-brand-teal/20"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-teal opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-teal" />
                  </span>
                  <span>All Inference Clusters Operational</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </a>
              </div>

              {/* Substack Newsletter Callout */}
              <div className="pt-1">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full font-semibold"
                >
                  <a
                    href="https://publicai.substack.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Subscribe to Public AI Substack
                    <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Social & Community Links */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <a
                href="https://www.linkedin.com/company/pubai/posts/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                LinkedIn
                <ArrowUpRight className="h-3 w-3" />
              </a>
              <a
                href="https://github.com/forpublicai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                GitHub
                <ArrowUpRight className="h-3 w-3" />
              </a>
              <a
                href="https://huggingface.co/publicai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                Hugging Face
                <ArrowUpRight className="h-3 w-3" />
              </a>
              <a
                href="https://join.slack.com/t/publicainetwork/shared_invite/zt-2v79699b4-91~35241432692544"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                Slack
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Column 1 (2 cols): Products + #hash Sub-Features */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Products
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products/chat"
                  className="font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Public AI Chat
                </Link>
              </li>
              <li className="pl-2.5">
                <Link
                  href="/products/chat#mobile"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <CornerDownRight className="h-3 w-3" />
                  <span>Mobile App</span>
                  <Badge
                    variant="outline"
                    className="rounded-full px-1.5 py-0 text-[9px] bg-warning text-warning-foreground border-transparent"
                  >
                    Soon
                  </Badge>
                </Link>
              </li>
              <li>
                <Link
                  href="/products/api"
                  className="font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Inference API
                </Link>
              </li>
              <li className="pl-2.5">
                <Link
                  href="/products/api#batch"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <CornerDownRight className="h-3 w-3" />
                  <span>Batch API</span>
                  <Badge
                    variant="outline"
                    className="rounded-full px-1.5 py-0 text-[9px] bg-warning text-warning-foreground border-transparent"
                  >
                    Soon
                  </Badge>
                </Link>
              </li>
              <li className="pl-2.5">
                <Link
                  href="/products/api#voice"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <CornerDownRight className="h-3 w-3" />
                  <span>Voice API</span>
                  <Badge
                    variant="outline"
                    className="rounded-full px-1.5 py-0 text-[9px] bg-warning text-warning-foreground border-transparent"
                  >
                    Soon
                  </Badge>
                </Link>
              </li>
              <li>
                <Link
                  href="/products/kiosks"
                  className="inline-flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>Library Kiosks</span>
                  <Badge
                    variant="outline"
                    className="rounded-full px-1.5 py-0 text-[9px] bg-brand-teal/15 text-brand-teal border-brand-teal/30"
                  >
                    Pilot
                  </Badge>
                </Link>
              </li>
              <li>
                <Link
                  href="/products/agents"
                  className="inline-flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>Agents (Hermes)</span>
                  <Badge
                    variant="outline"
                    className="rounded-full px-1.5 py-0 text-[9px] bg-warning text-warning-foreground border-transparent"
                  >
                    Soon
                  </Badge>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 (2 cols): Product Resources */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Resources
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/docs"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  API Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/api"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  OpenAPI 3.1 Reference
                </Link>
              </li>
              <li>
                <Link
                  href="/models"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Models Directory
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Plans & Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/chat"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Chat Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/projects/libraries"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Kiosks Story: Libraries
                </Link>
              </li>
              <li>
                <a
                  href="https://platform.publicai.co/account/billing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>API Keys & Billing</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="/llms.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>LLM Docs (/llms.txt)</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://status.publicai.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>System Status</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 (2 cols): Movement & Research */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Movement
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/projects"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Projects & Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/research"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Research Network
                </Link>
              </li>
              <li>
                <Link
                  href="/contributing"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Partners & Compute
                </Link>
              </li>
              <li>
                <Link
                  href="/research/seminar"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Research Seminars
                </Link>
              </li>
              <li>
                <Link
                  href="/research/publications"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Publications & Briefs
                </Link>
              </li>
              <li>
                <a
                  href="/PublicAIwhitepaper.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>Public AI Whitepaper</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <Link
                  href="/research/sail/spec"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  SAIL Specification
                </Link>
              </li>
              <li>
                <Link
                  href="/dialogue"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Swiss National Dialogue
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 (2 cols): About, Contact & Legal */}
          <div className="lg:col-span-2 space-y-5">
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                About & Community
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Our Mission
                  </Link>
                </li>
                <li>
                  <Link
                    href="/research/advisory"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Advisory Board
                  </Link>
                </li>
                <li>
                  <Link
                    href="/research/handbook"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Public AI Handbook
                  </Link>
                </li>
                <li>
                  <Link
                    href="/research/news"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Press & In the News
                  </Link>
                </li>
                <li>
                  <Link
                    href="/research/jobs"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Careers & Fellowships
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Contact & Support
              </h3>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li>
                  <a
                    href="mailto:hello@publicai.co"
                    className="inline-flex items-center gap-1.5 hover:text-foreground"
                  >
                    <Mail className="h-3 w-3" />
                    <span>hello@publicai.co</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:support@publicai.co"
                    className="inline-flex items-center gap-1.5 hover:text-foreground"
                  >
                    <Mail className="h-3 w-3" />
                    <span>support@publicai.co</span>
                  </a>
                </li>
                <li className="pt-1">
                  <button
                    type="button"
                    onClick={openSupportChat}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary cursor-pointer"
                  >
                    <MessageSquare className="h-3 w-3 text-primary" />
                    <span>Live Support Chat</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Separator className="my-10" />

        {/* Bottom Legal & Copyright Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Public AI Inference Utility &amp;
            Public AI Network. Operated by Metagov Inc., a 501(c)(3) nonprofit.
            Licensed under CC BY 4.0 / MIT.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/tc#1-terms-of-service"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/tc#2-privacy-policy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/tc#14-responsible-use-guidelines"
              className="hover:text-foreground transition-colors"
            >
              Responsible Use
            </Link>
            <Link
              href="/tc#28-cookie-policy"
              className="hover:text-foreground transition-colors"
            >
              Cookies &amp; GDPR
            </Link>
            <Link
              href="/tc#213-subprocessors"
              className="hover:text-foreground transition-colors"
            >
              Subprocessors
            </Link>
            <a
              href="https://status.publicai.co"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Status
            </a>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
}

export default Footer;
