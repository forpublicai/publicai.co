import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, LucideIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-1 md:grid-cols-3 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: {
  name: string;
  className?: string;
  background?: ReactNode;
  Icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  description: string;
  href: string;
  cta: string;
}) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-1 md:col-span-3 flex flex-col justify-between border border-border overflow-hidden rounded-xl",
      "bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/40",
      className
    )}
  >
    <div>{background}</div>
    <div className="pointer-events-none z-10 flex flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-8">
      {Icon && (
        <Icon className="h-10 w-10 origin-left text-primary transition-all duration-300 ease-in-out group-hover:scale-90 mb-2" />
      )}
      <h3 className="text-xl font-semibold text-foreground">{name}</h3>
      <p className="max-w-lg text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>

    <div
      className={cn(
        "absolute bottom-0 flex w-full translate-y-10 flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
      )}
    >
      <Link
        href={href}
        className={buttonVariants({
          size: "sm",
          variant: "ghost",
          className: "cursor-pointer text-primary hover:text-primary",
        })}
      >
        {cta}
        <ArrowRightIcon className="ml-2 h-4 w-4" />
      </Link>
    </div>
    <div className="pointer-events-none absolute inset-0 transition-all duration-300 group-hover:bg-accent/20" />
  </div>
);

export { BentoCard, BentoGrid };
