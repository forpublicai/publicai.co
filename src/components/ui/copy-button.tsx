"use client";

import { cn } from "@/lib/utils";
import { Check, Copy, LucideIcon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface Props {
  text: string;
  className?: string;
  icon?: LucideIcon;
}

export const CopyButton = ({ text, className, icon }: Props) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const Comp = icon || Copy;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsCopied(true);
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard!");
    });
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center group bg-foreground/10 p-2 transition-all duration-100 hover:scale-105 hover:bg-foreground/20 rounded-md active:scale-95",
        className
      )}
    >
      <span className="sr-only">Copy</span>
      {isCopied ? (
        <Check className="h-4 w-4 text-brand-teal" />
      ) : (
        <Comp className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
      )}
    </button>
  );
};

export default CopyButton;
