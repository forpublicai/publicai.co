"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  ChevronDown,
  CornerDownRight,
  ExternalLink,
  MessageSquare,
  Terminal,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MaxWidthWrapper } from "@/components/global/max-width-wrapper";
import { ThemeToggle } from "@/components/global/theme-toggle";
import { MEGA_MENU_SECTIONS } from "./nav-links";
import { MobileNavbar } from "./mobile-navbar";
import { cn } from "@/lib/utils";

export function BrandLockup({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 focus-visible:outline-none",
        className
      )}
    >
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary shadow-xs transition-transform duration-200 group-hover:scale-105">
        <Image
          src="/logo-mark.png"
          alt="Public AI"
          width={36}
          height={36}
          className="h-9 w-9 object-contain"
          priority
        />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-lg font-extrabold tracking-tight text-foreground">
          Public AI
        </span>
        <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
AI FOR ALL        </span>
      </div>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname() || "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isSectionActive = (prefixes: string[]) =>
    prefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );

  const isAboutActive =
    pathname === "/about" || pathname.startsWith("/about/");

  return (
    <header
      className={cn(
        "sticky top-0 inset-x-0 z-50 h-16 w-full border-b transition-colors duration-200 select-none",
        scrolled
          ? "border-border bg-background/90 backdrop-blur-md shadow-2xs"
          : "border-border/60 bg-background/95 backdrop-blur-xs"
      )}
    >
      <MaxWidthWrapper className="flex h-full items-center justify-between gap-4">
        {/* Left: Brand Lockup */}
        <BrandLockup />

        {/* Center: OpenAI-Style Two-Column Mega-Menu Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="gap-2">
            {MEGA_MENU_SECTIONS.map((section) => {
              const active = isSectionActive(section.activePrefixes);
              return (
                <NavigationMenuItem key={section.id}>
                  <NavigationMenuTrigger
                    className={cn(
                      "relative bg-transparent px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-accent/60 hover:text-foreground data-[state=open]:bg-accent/60 data-[state=open]:text-foreground",
                      active &&
                        "text-foreground after:absolute after:bottom-0 after:inset-x-3 after:h-[2px] after:rounded-full after:bg-primary"
                    )}
                  >
                    {section.title}
                  </NavigationMenuTrigger>

                  <NavigationMenuContent>
                    <div className="grid w-[680px] grid-cols-[1.25fr_1fr] gap-6 p-6 bg-popover text-popover-foreground rounded-2xl">
                      {/* Left Column: Explore Products / Explore the Movement (Large Typographic Links + #hash Sub-Features) */}
                      <div className="flex flex-col justify-between pr-4 border-r border-border">
                        <div className="space-y-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground px-2">
                            {section.primaryHeading}
                          </p>
                          <ul className="space-y-2">
                            {section.primaryItems.map((item) => (
                              <li key={item.title} className="space-y-1">
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={item.href}
                                    className="group/item block rounded-xl p-2.5 transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg font-bold tracking-tight text-foreground group-hover/item:text-primary transition-colors">
                                        {item.title}
                                      </span>
                                      {item.badge && (
                                        <Badge
                                          variant="outline"
                                          className={cn(
                                            "rounded-full px-2 py-0 text-[10px] font-semibold",
                                            item.badge === "Coming Soon"
                                              ? "bg-warning text-warning-foreground border-transparent"
                                              : "bg-brand-teal/15 text-brand-teal border-brand-teal/30"
                                          )}
                                        >
                                          {item.badge}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                      {item.description}
                                    </p>
                                  </Link>
                                </NavigationMenuLink>

                                {/* Nested #hash Sub-Feature Links (e.g. #mobile, #batch, #voice) */}
                                {item.subFeatures && item.subFeatures.length > 0 && (
                                  <div className="pl-4 flex flex-wrap items-center gap-2 pt-0.5">
                                    {item.subFeatures.map((sub) => (
                                      <NavigationMenuLink
                                        key={sub.href}
                                        asChild
                                      >
                                        <Link
                                          href={sub.href}
                                          className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-secondary/70 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-accent hover:text-primary"
                                        >
                                          <CornerDownRight className="h-3 w-3 text-muted-foreground" />
                                          <span>{sub.title}</span>
                                          {sub.badge && (
                                            <span className="rounded-full bg-warning px-1.5 py-0 text-[9px] font-semibold text-warning-foreground">
                                              {sub.badge}
                                            </span>
                                          )}
                                        </Link>
                                      </NavigationMenuLink>
                                    ))}
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Right Column: Resources */}
                      <div className="flex flex-col justify-between">
                        <div className="space-y-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground px-2">
                            {section.resourcesHeading}
                          </p>
                          <ul className="space-y-1">
                            {section.resourceItems.map((res) => (
                              <li key={res.title + res.href}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={res.href}
                                    target={res.external ? "_blank" : undefined}
                                    rel={
                                      res.external
                                        ? "noopener noreferrer"
                                        : undefined
                                    }
                                    className="group/res flex items-start justify-between gap-2 rounded-lg px-2.5 py-2 transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                                  >
                                    <div>
                                      <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground group-hover/res:text-primary transition-colors">
                                        <span>{res.title}</span>
                                        {res.external && (
                                          <ExternalLink className="h-3 w-3 text-muted-foreground group-hover/res:text-primary" />
                                        )}
                                      </div>
                                      {res.description && (
                                        <p className="text-xs text-muted-foreground line-clamp-1">
                                          {res.description}
                                        </p>
                                      )}
                                    </div>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              );
            })}

            {/* Direct Top-Level Link: About */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/about"
                  className={cn(
                    "relative inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground focus-visible:outline-none",
                    isAboutActive &&
                      "text-foreground after:absolute after:bottom-0 after:inset-x-3 after:h-[2px] after:rounded-full after:bg-primary"
                  )}
                >
                  About
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Controls: ThemeToggle + Pill-Shaped Primary Red CTA + Mobile Drawer */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                className="group hidden sm:inline-flex items-center gap-1.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span>Try Public AI</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-80 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-56 p-1.5 rounded-2xl border border-border/80 bg-popover/95 backdrop-blur-md shadow-xl"
            >
              <DropdownMenuItem asChild className="rounded-xl p-2 cursor-pointer focus:bg-accent focus:text-accent-foreground">
                <a
                  href="https://chat.publicai.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full group/item"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-colors">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-semibold text-sm text-foreground">
                        Chat
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Web Chat Interface
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover/item:text-foreground transition-colors" />
                </a>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="rounded-xl p-2 cursor-pointer focus:bg-accent focus:text-accent-foreground">
                <a
                  href="https://platform.publicai.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full group/item"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-colors">
                      <Terminal className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-semibold text-sm text-foreground">
                        API
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        platform.publicai.co
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover/item:text-foreground transition-colors" />
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <MobileNavbar />
        </div>
      </MaxWidthWrapper>
    </header>
  );
}

export default Navbar;
