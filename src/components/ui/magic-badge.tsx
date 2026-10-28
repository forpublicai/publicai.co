import React from "react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  className?: string;
}

export const MagicBadge = ({ title, className }: Props) => {
  return (
    <div
      className={cn(
        "relative inline-flex h-8 overflow-hidden rounded-full p-[1.5px] focus:outline-none select-none",
        className
      )}
    >
      <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FF3B30_0%,#00B3A4_50%,#FF3B30_100%)]" />
      <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-background px-4 py-1 text-xs font-semibold uppercase tracking-wider text-foreground backdrop-blur-3xl">
        {title}
      </span>
    </div>
  );
};

export default MagicBadge;
