import React from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, LucideIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CardGridItem {
  id?: string;
  title: string;
  description: string;
  badge?: string;
  badgeTone?: "default" | "amber" | "teal" | "outline" | "secondary";
  badgeVariant?: "default" | "amber" | "teal" | "outline" | "secondary";
  icon?: LucideIcon | React.ComponentType<{ className?: string }> | React.ReactNode;
  href?: string;
  ctaLabel?: string;
  external?: boolean;
  meta?: string;
  tags?: string[];
  footerContent?: React.ReactNode;
  children?: React.ReactNode;
}

export interface CardGridProps {
  items: CardGridItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function CardGrid({ items, columns = 3, className }: CardGridProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <div className={cn("grid gap-6", gridCols, className)}>
      {items.map((item, idx) => {
        const Icon = item.icon;
        const tone = item.badgeTone ?? item.badgeVariant;
        const renderIcon = () => {
          if (!Icon) return null;
          if (React.isValidElement(Icon)) return Icon;
          const IconComp = Icon as React.ComponentType<{ className?: string }>;
          return <IconComp className="h-5 w-5" />;
        };
        return (
          <Card
            key={item.id ?? `${item.title}-${idx}`}
            id={item.id}
            className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/40"
          >
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                {Icon ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                    {renderIcon()}
                  </div>
                ) : (
                  <span />
                )}
                {item.badge && (
                  <Badge
                    variant={tone === "outline" ? "outline" : "secondary"}
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      tone === "amber" &&
                        "bg-warning text-warning-foreground border-transparent",
                      tone === "teal" &&
                        "bg-brand-teal/15 text-brand-teal border-brand-teal/30"
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              {item.meta && (
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {item.meta}
                </p>
              )}
              <CardTitle className="text-xl font-bold tracking-tight text-card-foreground">
                {item.title}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </CardDescription>
            </CardHeader>

            {(item.children || (item.tags && item.tags.length > 0)) && (
              <CardContent className="pt-0">
                {item.children}
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="rounded-md text-xs font-normal text-muted-foreground"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            )}

            {(item.href || item.footerContent) && (
              <CardFooter className="pt-2 flex items-center justify-between">
                {item.footerContent}
                {item.href && (
                  <Button
                    asChild
                    variant="link"
                    className="px-0 font-semibold text-primary hover:text-primary/80"
                  >
                    <Link
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                    >
                      {item.ctaLabel ?? "Learn more"}
                      {item.external ? (
                        <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                      ) : (
                        <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      )}
                    </Link>
                  </Button>
                )}
              </CardFooter>
            )}
          </Card>
        );
      })}
    </div>
  );
}

export default CardGrid;
