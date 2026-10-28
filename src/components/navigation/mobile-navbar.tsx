"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CornerDownRight,
  ExternalLink,
  Menu,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { MEGA_MENU_SECTIONS } from "./nav-links";
import { BrandLockup } from "./navbar";
import { cn } from "@/lib/utils";

export function MobileNavbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <div className="flex lg:hidden items-center">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 rounded-full"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md overflow-y-auto bg-background text-foreground p-6"
        >
          <SheetHeader className="text-left pb-4 border-b border-border">
            <SheetTitle asChild>
              <div onClick={closeMenu}>
                <BrandLockup />
              </div>
            </SheetTitle>
          </SheetHeader>

          <div className="mt-4 flex flex-col gap-4">
            <Accordion
              type="multiple"
              defaultValue={["products", "movement"]}
              className="w-full"
            >
              {MEGA_MENU_SECTIONS.map((section) => (
                <AccordionItem key={section.id} value={section.id}>
                  <AccordionTrigger className="text-base font-bold text-foreground hover:no-underline">
                    {section.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-5 pt-1 pb-2">
                      {/* Primary Destinations + #hash Sub-Features */}
                      <div className="space-y-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {section.primaryHeading}
                        </p>
                        <ul className="space-y-2.5">
                          {section.primaryItems.map((item) => (
                            <li key={item.title} className="space-y-1.5">
                              <Link
                                href={item.href}
                                onClick={closeMenu}
                                className="flex items-center gap-2 rounded-lg py-1 text-base font-bold text-foreground hover:text-primary"
                              >
                                <span>{item.title}</span>
                                {item.badge && (
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "rounded-full px-2 py-0 text-[10px]",
                                      item.badge === "Coming Soon"
                                        ? "bg-warning text-warning-foreground border-transparent"
                                        : "bg-brand-teal/15 text-brand-teal border-brand-teal/30"
                                    )}
                                  >
                                    {item.badge}
                                  </Badge>
                                )}
                              </Link>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {item.description}
                              </p>
                              {item.subFeatures && item.subFeatures.length > 0 && (
                                <div className="pl-3 flex flex-wrap gap-2 pt-1">
                                  {item.subFeatures.map((sub) => (
                                    <Link
                                      key={sub.href}
                                      href={sub.href}
                                      onClick={closeMenu}
                                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/70 px-2.5 py-1 text-xs font-medium text-foreground hover:border-primary/50 hover:text-primary"
                                    >
                                      <CornerDownRight className="h-3 w-3 text-muted-foreground" />
                                      <span>{sub.title}</span>
                                      {sub.badge && (
                                        <span className="rounded-full bg-warning px-1.5 py-0 text-[9px] font-semibold text-warning-foreground">
                                          {sub.badge}
                                        </span>
                                      )}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Separator />

                      {/* Resources */}
                      <div className="space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {section.resourcesHeading}
                        </p>
                        <ul className="grid grid-cols-1 gap-1.5">
                          {section.resourceItems.map((res) => (
                            <li key={res.title + res.href}>
                              <Link
                                href={res.href}
                                onClick={closeMenu}
                                target={res.external ? "_blank" : undefined}
                                rel={
                                  res.external
                                    ? "noopener noreferrer"
                                    : undefined
                                }
                                className="flex items-center justify-between rounded-md py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                              >
                                <span>{res.title}</span>
                                {res.external && (
                                  <ExternalLink className="h-3.5 w-3.5" />
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <Link
              href="/about"
              onClick={closeMenu}
              className="py-2 text-base font-bold text-foreground hover:text-primary border-b border-border"
            >
              About (Our Mission)
            </Link>

            <div className="pt-2 flex flex-col gap-2.5">
              <Button
                asChild
                size="lg"
                className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                <a
                  href="https://chat.publicai.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                >
                  Try Public AI
                  <ArrowUpRight className="ml-1.5 h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full rounded-full font-semibold"
              >
                <Link href="/docs" onClick={closeMenu}>
                  Developer API Docs
                </Link>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNavbar;
