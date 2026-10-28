"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface SidebarNavLink {
  title: string;
  href: string;
  badge?: string;
  external?: boolean;
  isActive?: boolean;
}

export interface SidebarNavSection {
  label: string;
  items: SidebarNavLink[];
}

export interface TocHeadingItem {
  id: string;
  title: string;
  level?: 2 | 3;
}

export interface BreadcrumbCrumb {
  label: string;
  href?: string;
}

export interface SidebarContentLayoutProps {
  portalTitle: string;
  portalSubtitle?: string;
  sections: SidebarNavSection[];
  breadcrumbs?: BreadcrumbCrumb[];
  tocItems?: TocHeadingItem[];
  headerSlot?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function SidebarContentLayout({
  portalTitle,
  portalSubtitle,
  sections,
  breadcrumbs,
  tocItems,
  headerSlot,
  children,
  className,
}: SidebarContentLayoutProps) {
  return (
    <SidebarProvider className={cn("min-h-[calc(100svh-4rem)]", className)}>
      <Sidebar title={portalTitle}>
        <SidebarHeader>
          <div className="px-2 py-1">
            <h2 className="text-sm font-bold tracking-tight text-sidebar-foreground">
              {portalTitle}
            </h2>
            {portalSubtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {portalSubtitle}
              </p>
            )}
          </div>
        </SidebarHeader>
        <SidebarContent>
          {sections.map((section) => (
            <SidebarGroup key={section.label}>
              <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.href + item.title}>
                      <SidebarMenuButton asChild isActive={item.isActive}>
                        <Link
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                          className="flex items-center justify-between"
                        >
                          <span className="truncate">{item.title}</span>
                          <span className="flex items-center gap-1">
                            {item.badge && (
                              <Badge
                                variant="outline"
                                className="rounded-full px-1.5 py-0 text-[10px]"
                              >
                                {item.badge}
                              </Badge>
                            )}
                            {item.external && (
                              <ExternalLink className="h-3 w-3 text-muted-foreground" />
                            )}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        {/* Top bar with mobile SidebarTrigger + Breadcrumb */}
        <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-background/90 px-4 py-3 backdrop-blur md:px-8">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            {breadcrumbs && breadcrumbs.length > 0 && (
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, idx) => {
                    const isLast = idx === breadcrumbs.length - 1;
                    return (
                      <React.Fragment key={crumb.label + idx}>
                        <BreadcrumbItem>
                          {isLast || !crumb.href ? (
                            <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink asChild>
                              <Link href={crumb.href}>{crumb.label}</Link>
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {!isLast && <BreadcrumbSeparator />}
                      </React.Fragment>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>
          {headerSlot && <div className="flex items-center gap-2">{headerSlot}</div>}
        </div>

        {/* Main Content + Optional Right-hand Table of Contents */}
        <div className="mx-auto flex w-full max-w-6xl flex-1 gap-10 px-4 py-8 md:px-8 lg:py-12">
          <article className="min-w-0 flex-1">{children}</article>

          {tocItems && tocItems.length > 0 && (
            <aside className="hidden xl:block w-56 shrink-0">
              <div className="sticky top-24 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  On This Page
                </p>
                <Separator />
                <ul className="space-y-2 text-sm">
                  {tocItems.map((heading) => (
                    <li
                      key={heading.id}
                      className={cn(heading.level === 3 && "pl-3")}
                    >
                      <a
                        href={`#${heading.id}`}
                        className="block text-muted-foreground hover:text-foreground transition-colors line-clamp-1"
                      >
                        {heading.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default SidebarContentLayout;
