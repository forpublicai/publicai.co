"use client";

import React, { useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trackEvent } from "@/components/global";
import { cn } from "@/lib/utils";

export type WaitlistProductId =
  | "chat-mobile"
  | "api-batch"
  | "api-voice"
  | "agents-hermes"
  | "kiosks-pilot";

export interface WaitlistFormProps {
  product: WaitlistProductId;
  title?: string;
  description?: string;
  badge?: string;
  badgeText?: string;
  buttonLabel?: string;
  className?: string;
}

const PRODUCT_DEFAULTS: Record<
  WaitlistProductId,
  { title: string; description: string; badge: string }
> = {
  "chat-mobile": {
    title: "Join the iOS & Android Beta Waitlist",
    description:
      "Get early TestFlight & Android beta access to the Public AI Mobile App with voice mode and camera document scanning.",
    badge: "Mobile App · Coming Soon",
  },
  "api-batch": {
    title: "Request Early Access to the Batch API",
    description:
      "Run asynchronous 4-hour and 24-hour batch jobs across spare sovereign GPU clusters at 50–80% lower token cost.",
    badge: "Batch API · Coming Soon",
  },
  "api-voice": {
    title: "Join the Voice API Early Access List",
    description:
      "Build with single-duplex Whisper STT/TTS and full-duplex real-time speech-to-speech powered by NVIDIA PersonaPlex.",
    badge: "Voice API · Coming Soon",
  },
  "agents-hermes": {
    title: "Join the Hermes Agentic Service Waitlist",
    description:
      "Deploy inspectable, open-weight autonomous agents with MCP tool use, web search, and human-in-the-loop governance.",
    badge: "Hermes Agents · Coming Soon",
  },
  "kiosks-pilot": {
    title: "Bring a Public AI Kiosk to Your Library",
    description:
      "Apply for our $1,000/yr turnkey community AI workstation pilot program for public libraries and civic centers.",
    badge: "Library Kiosks · Live Pilot",
  },
};

export function WaitlistForm({
  product,
  title,
  description,
  badge,
  badgeText,
  buttonLabel = "Join Early Access Waitlist",
  className,
}: WaitlistFormProps) {
  const resolvedBadge = badgeText ?? badge;
  const defaults = PRODUCT_DEFAULTS[product];
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [useCase, setUseCase] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          organization,
          useCase,
          product,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Could not submit waitlist request.");
        return;
      }
      setSubmitted(true);
      trackEvent("waitlist_joined", {
        product,
        has_org: Boolean(organization),
        has_use_case: Boolean(useCase),
      });
      toast.success("You're on the waitlist! We'll be in touch soon.");
    } catch {
      toast.error("Network error while joining waitlist.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card
      className={cn(
        "rounded-2xl border border-border bg-card text-card-foreground shadow-sm",
        className
      )}
    >
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="rounded-full bg-warning text-warning-foreground border-transparent px-3 py-0.5 text-xs font-semibold"
          >
            <Sparkles className="mr-1 h-3 w-3 inline" />
            {resolvedBadge ?? defaults.badge}
          </Badge>
        </div>
        <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
          {title ?? defaults.title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground leading-relaxed">
          {description ?? defaults.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {submitted ? (
          <div className="flex items-center gap-3 rounded-xl border border-brand-teal/30 bg-brand-teal/10 p-4 text-sm text-foreground">
            <CheckCircle2 className="h-5 w-5 text-brand-teal shrink-0" />
            <div>
              <p className="font-semibold">
                You&apos;re registered for early access!
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                We&apos;ve recorded <span className="font-mono">{email}</span>{" "}
                for <span className="font-semibold">{defaults.badge}</span>.
              </p>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
          >
            <div className="md:col-span-4 space-y-1.5">
              <Label htmlFor={`waitlist-email-${product}`} className="text-xs">
                Work or Institutional Email *
              </Label>
              <Input
                id={`waitlist-email-${product}`}
                type="email"
                required
                placeholder="you@institution.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background"
              />
            </div>

            <div className="md:col-span-3 space-y-1.5">
              <Label htmlFor={`waitlist-org-${product}`} className="text-xs">
                Organization (Optional)
              </Label>
              <Input
                id={`waitlist-org-${product}`}
                type="text"
                placeholder="University, Lab, or Company"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="bg-background"
              />
            </div>

            <div className="md:col-span-3 space-y-1.5">
              <Label
                htmlFor={`waitlist-usecase-${product}`}
                className="text-xs"
              >
                Primary Use Case (Optional)
              </Label>
              <Input
                id={`waitlist-usecase-${product}`}
                type="text"
                placeholder="e.g. 50k doc batch evaluation"
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                className="bg-background"
              />
            </div>

            <div className="md:col-span-2">
              <Button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full font-semibold"
              >
                {submitting ? "Joining..." : buttonLabel}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export default WaitlistForm;
