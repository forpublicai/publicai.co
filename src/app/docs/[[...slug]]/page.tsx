import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Info,
  KeyRound,
} from "lucide-react";
import { getDocBySlug, getDocsMeta } from "@/lib/content";
import {
  SidebarContentLayout,
  ModelCatalog,
  type BreadcrumbCrumb,
} from "@/components/sections";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";

interface DocPageProps {
  params: Promise<{ slug?: string[] }>;
}

const DOC_SLUGS: string[][] = [
  [],
  ["models"],
  ["plans"],
  ["batch"],
  ["chat"],
  ["inference-partners-faq"],
  ["support-us"],
];

export function generateStaticParams() {
  return DOC_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: DocPageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) {
    return {
      title: "Documentation Not Found — PublicAI",
    };
  }

  const canonicalPath =
    slug.length === 0 ? "/docs" : `/docs/${slug.join("/")}`;

  return {
    title: `${doc.title} — PublicAI Developer Documentation`,
    description:
      doc.description ??
      "Official developer documentation and guides for the PublicAI sovereign inference utility.",
    alternates: {
      canonical: `https://publicai.co${canonicalPath}`,
    },
  };
}

function extractTextFromChildren(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractTextFromChildren).join("");
  }
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return extractTextFromChildren(node.props.children);
  }
  return "";
}

const mdxComponents = {
  h2: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        "scroll-mt-24 border-b border-border pb-2 text-2xl font-bold tracking-tight mt-10 mb-4 first:mt-0",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        "scroll-mt-24 text-lg font-semibold tracking-tight mt-8 mb-3",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn("leading-7 text-foreground/90 my-4", className)}
      {...props}
    >
      {children}
    </p>
  ),
  ul: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className={cn("my-4 ml-6 list-disc space-y-2 text-foreground/90", className)}
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className={cn(
        "my-4 ml-6 list-decimal space-y-2 text-foreground/90",
        className
      )}
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className={cn("leading-7", className)} {...props}>
      {children}
    </li>
  ),
  a: ({
    href = "",
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = href.startsWith("http://") || href.startsWith("https://");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
          {...props}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href}
        className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
        {...props}
      >
        {children}
      </Link>
    );
  },
  blockquote: ({
    children,
  }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <Alert className="my-6 rounded-2xl border-border bg-secondary/50">
      <Info className="h-4 w-4 text-[#00B3A4]" />
      <AlertDescription className="text-sm leading-relaxed [&>p]:my-0">
        {children}
      </AlertDescription>
    </Alert>
  ),
  Callout: ({
    title,
    children,
  }: {
    title?: string;
    children: React.ReactNode;
  }) => (
    <Alert className="my-6 rounded-2xl border-border bg-secondary/50">
      <Info className="h-4 w-4 text-[#00B3A4]" />
      {title && <AlertTitle className="font-semibold">{title}</AlertTitle>}
      <AlertDescription className="text-sm leading-relaxed">
        {children}
      </AlertDescription>
    </Alert>
  ),
  pre: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLPreElement>) => {
    const rawCode = extractTextFromChildren(children).trimEnd();
    return (
      <div className="theme-navy relative my-6 rounded-2xl border border-border/50 bg-[#0F2D4A] p-4 font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto shadow-md">
        <CopyButton
          text={rawCode}
          className="absolute right-3 top-3 bg-white/10 hover:bg-white/20"
        />
        <pre className="pr-10 leading-relaxed" {...props}>
          {children}
        </pre>
      </div>
    );
  },
  code: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLElement>) => {
    const isBlock = typeof className === "string" && className.includes("language-");
    if (isBlock) {
      return (
        <code className={cn("font-mono", className)} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className={cn(
          "rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[0.85em] font-medium text-foreground",
          className
        )}
        {...props}
      >
        {children}
      </code>
    );
  },
  table: ({
    children,
    ...props
  }: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div
      role="region"
      aria-label="Documentation data table"
      tabIndex={0}
      className="my-6 w-full overflow-x-auto rounded-2xl border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <table className="w-full border-collapse text-left text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="border-b border-border bg-secondary/60 text-xs uppercase text-muted-foreground" {...props}>
      {children}
    </thead>
  ),
  th: ({
    children,
    ...props
  }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th className="px-4 py-3 font-semibold text-foreground" {...props}>
      {children}
    </th>
  ),
  td: ({
    children,
    ...props
  }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="border-t border-border px-4 py-3 align-top" {...props}>
      {children}
    </td>
  ),
  ModelCatalog: () => <ModelCatalog showHeader={false} defaultTab="table" />,
};

export default async function DocsSlugPage({ params }: DocPageProps) {
  const { slug = [] } = await params;
  const doc = getDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  const activeHref =
    slug.length === 0 ? "/docs" : `/docs/${slug.join("/")}`;
  const docsMeta = getDocsMeta(activeHref);

  const breadcrumbs: BreadcrumbCrumb[] = [
    { label: "Docs", href: "/docs" },
  ];
  if (doc.section) {
    breadcrumbs.push({ label: doc.section });
  }
  if (slug.length > 0) {
    breadcrumbs.push({ label: doc.title });
  }

  // Compute Prev / Next internal links from sidebar
  const internalNavItems = docsMeta.sections
    .flatMap((sec) => sec.items)
    .filter((item) => !item.external && item.href.startsWith("/docs"));
  const currentIndex = internalNavItems.findIndex(
    (item) => item.href === activeHref
  );
  const prevItem = currentIndex > 0 ? internalNavItems[currentIndex - 1] : null;
  const nextItem =
    currentIndex >= 0 && currentIndex < internalNavItems.length - 1
      ? internalNavItems[currentIndex + 1]
      : null;

  const isModelsDoc = slug.length === 1 && slug[0] === "models";

  return (
    <SidebarContentLayout
      portalTitle={docsMeta.portalTitle}
      portalSubtitle={docsMeta.portalSubtitle}
      sections={docsMeta.sections}
      breadcrumbs={breadcrumbs}
      tocItems={doc.toc}
      headerSlot={
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full text-xs"
          >
            <Link
              href="https://platform.publicai.co/settings/api-keys"
              target="_blank"
              rel="noopener noreferrer"
            >
              <KeyRound className="mr-1.5 h-3.5 w-3.5" />
              API Keys
              <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </Button>
          <Button asChild size="sm" className="rounded-full text-xs">
            <Link
              href="https://platform.publicai.co/account/billing"
              target="_blank"
              rel="noopener noreferrer"
            >
              Billing ($2 Free)
              <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      }
    >
      <div className="space-y-10">
        {/* Document Header */}
        <div className="space-y-3 border-b border-border pb-6">
          {doc.section && (
            <Badge variant="secondary" className="rounded-full text-xs">
              {doc.section}
            </Badge>
          )}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {doc.title}
          </h1>
          {doc.description && (
            <p className="text-base text-muted-foreground leading-relaxed">
              {doc.description}
            </p>
          )}
        </div>

        {/* Rendered MDX Content */}
        <div className="max-w-none">
          <MDXRemote
            source={doc.content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug],
              },
            }}
          />
        </div>

        {/* Interactive Model Catalog Embedded on /docs/models */}
        {isModelsDoc && (
          <div className="pt-4">
            <ModelCatalog showHeader={false} defaultTab="table" />
          </div>
        )}

        {/* Prev / Next Footer Navigation */}
        {(prevItem || nextItem) && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-border pt-8">
            {prevItem ? (
              <Button
                asChild
                variant="outline"
                className="rounded-full justify-start"
              >
                <Link href={prevItem.href}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {prevItem.title}
                </Link>
              </Button>
            ) : (
              <div />
            )}
            {nextItem && (
              <Button asChild className="rounded-full justify-end">
                <Link href={nextItem.href}>
                  {nextItem.title}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </SidebarContentLayout>
  );
}
