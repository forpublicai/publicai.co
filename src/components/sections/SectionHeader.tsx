import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  badge?: string;
  badgeVariant?: "default" | "secondary" | "outline" | "destructive" | "amber" | "teal";
  title: string;
  accentText?: string;
  accentColor?: "red" | "teal";
  description?: string;
  align?: "left" | "center";
  className?: string;
  children?: React.ReactNode;
}

export function SectionHeader({
  badge,
  badgeVariant = "secondary",
  title,
  accentText,
  accentColor = "red",
  description,
  align = "center",
  className,
  children,
}: SectionHeaderProps) {
  const badgeClasses = cn(
    "rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider",
    badgeVariant === "amber" && "bg-warning text-warning-foreground border-transparent",
    badgeVariant === "teal" && "bg-brand-teal/15 text-brand-teal border-brand-teal/30"
  );

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center mx-auto max-w-3xl" : "items-start text-left max-w-3xl",
        className
      )}
    >
      {badge && (
        <Badge
          variant={
            badgeVariant === "amber" || badgeVariant === "teal"
              ? "outline"
              : badgeVariant
          }
          className={badgeClasses}
        >
          {badge}
        </Badge>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.12]">
        {title}{" "}
        {accentText && (
          <span
            className={cn(
              accentColor === "teal" ? "text-brand-teal" : "text-primary"
            )}
          >
            {accentText}
          </span>
        )}
      </h2>
      {description && (
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
      {children && <div className="mt-2 flex flex-wrap items-center gap-3">{children}</div>}
    </div>
  );
}

export default SectionHeader;
