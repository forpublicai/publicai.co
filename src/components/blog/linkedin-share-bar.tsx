"use client";

import React, { useMemo, useState } from "react";
import {
  Check,
  Copy,
  ExternalLink,
  FileText,
  Link2,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface LinkedInShareBarProps {
  slug: string;
  title: string;
  description: string;
  category: string;
  author: string;
  tags?: string[];
  linkedinHook?: string;
  linkedinBullets?: string[];
  linkedinPost?: string;
  fallbackHeadings?: string[];
  className?: string;
}

export function buildLinkedInDraft({
  slug,
  title,
  description,
  tags = [],
  linkedinHook,
  linkedinBullets,
  linkedinPost,
  fallbackHeadings = [],
}: Omit<LinkedInShareBarProps, "category" | "author" | "className">): string {
  const canonicalUtmUrl = `https://publicai.co/projects/${slug}?utm_source=linkedin&utm_medium=social`;

  if (linkedinPost && linkedinPost.trim().length > 0) {
    return `${linkedinPost.trim()}\n\n${canonicalUtmUrl}`;
  }

  const hook =
    linkedinHook && linkedinHook.trim().length > 0
      ? linkedinHook.trim()
      : `${title} — ${description}`;

  const bullets =
    linkedinBullets && linkedinBullets.length > 0
      ? linkedinBullets
      : fallbackHeadings.slice(0, 4);

  const bulletBlock =
    bullets.length > 0
      ? `\n\nKey takeaways:\n${bullets.map((b) => `• ${b}`).join("\n")}`
      : "";

  const dynamicHashtags = tags
    .slice(0, 3)
    .map((t) => `#${t.replace(/[^a-zA-Z0-9]/g, "")}`)
    .filter((t) => t.length > 1);

  const allHashtags = Array.from(
    new Set(["#PublicAI", "#OpenSourceAI", "#SovereignAI", ...dynamicHashtags])
  ).join(" ");

  return `${hook}${bulletBlock}\n\nRead the full story on Public AI 👇\n${canonicalUtmUrl}\n\n${allHashtags}`;
}

export function LinkedInShareBar({
  slug,
  title,
  description,
  category,
  author,
  tags = [],
  linkedinHook,
  linkedinBullets,
  linkedinPost,
  fallbackHeadings = [],
  className,
}: LinkedInShareBarProps) {
  const defaultDraft = useMemo(
    () =>
      buildLinkedInDraft({
        slug,
        title,
        description,
        tags,
        linkedinHook,
        linkedinBullets,
        linkedinPost,
        fallbackHeadings,
      }),
    [
      slug,
      title,
      description,
      tags,
      linkedinHook,
      linkedinBullets,
      linkedinPost,
      fallbackHeadings,
    ]
  );

  const [draftText, setDraftText] = useState(defaultDraft);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const canonicalUrl = `https://publicai.co/projects/${slug}`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    canonicalUrl
  )}`;

  const handleSharePopup = () => {
    window.open(
      linkedInShareUrl,
      "linkedin-share-dialog",
      "width=620,height=680,noopener,noreferrer"
    );
  };

  const handleCopyDraft = async () => {
    await navigator.clipboard.writeText(draftText);
    setCopiedDraft(true);
    toast.success("LinkedIn post draft copied to clipboard!");
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(canonicalUrl);
    setCopiedUrl(true);
    toast.success("Article link copied to clipboard!");
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-secondary/50 px-4 py-3",
        className
      )}
    >
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline" className="rounded-full font-semibold">
          {category}
        </Badge>
        <span className="hidden sm:inline">By {author}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* 1-Click Share on LinkedIn */}
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleSharePopup}
          className="rounded-full text-xs font-semibold hover:border-primary/50 hover:text-primary"
        >
          <Share2 className="mr-1.5 h-3.5 w-3.5 text-primary" />
          Share on LinkedIn
        </Button>

        {/* Copy LinkedIn Post Draft Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="rounded-full text-xs font-semibold border border-border hover:border-primary/40"
            >
              <FileText className="mr-1.5 h-3.5 w-3.5 text-brand-teal" />
              Copy LinkedIn Post Draft
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Ready-to-Post LinkedIn Draft</DialogTitle>
              <DialogDescription>
                Customize or copy this pre-formatted summary with bullet
                takeaways, hashtags, and canonical link for LinkedIn.
              </DialogDescription>
            </DialogHeader>
            <div className="my-2">
              <Textarea
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                rows={11}
                className="font-sans text-sm leading-relaxed"
              />
            </div>
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                asChild
                className="rounded-full"
              >
                <a
                  href="https://www.linkedin.com/feed/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open LinkedIn Feed
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </a>
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleCopyDraft}
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {copiedDraft ? (
                  <>
                    <Check className="mr-1.5 h-4 w-4" />
                    Copied Draft!
                  </>
                ) : (
                  <>
                    <Copy className="mr-1.5 h-4 w-4" />
                    Copy Post Text
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Copy Canonical URL */}
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={handleCopyLink}
          className="h-8 w-8 rounded-full"
          title="Copy article URL"
          aria-label="Copy article URL"
        >
          {copiedUrl ? (
            <Check className="h-3.5 w-3.5 text-brand-teal" />
          ) : (
            <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </Button>
      </div>
    </div>
  );
}

export default LinkedInShareBar;
