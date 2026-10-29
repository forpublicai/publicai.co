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
  Download,
  ExternalLink,
  FileText,
  Github,
  Info,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import {
  getResearchDocBySlug,
  getResearchSidebarSections,
  getAllResearchSlugs,
  getResearchNewsData,
  getResearchAdvisoryData,
  getResearchJobsData,
} from "@/lib/content";
import {
  SidebarContentLayout,
  type BreadcrumbCrumb,
} from "@/components/sections";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";

interface ResearchPageProps {
  params: Promise<{ slug?: string[] }>;
}

export function generateStaticParams() {
  const slugs = getAllResearchSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ResearchPageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const doc = getResearchDocBySlug(slug);

  if (!doc) {
    return {
      title: "Research Not Found — Public AI Network",
    };
  }

  const canonicalPath =
    slug.length === 0 ? "/research" : `/research/${slug.join("/")}`;

  return {
    title: `${doc.title} — Public AI Network Research Hub`,
    description:
      doc.description ??
      "Research publications, seminar archives, governance frameworks, and SAIL ratings from the Public AI Network.",
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
  h1: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn(
        "text-3xl sm:text-4xl font-extrabold tracking-tight mt-6 mb-4 first:mt-0 text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        "scroll-mt-24 border-b border-border pb-2 text-2xl font-bold tracking-tight mt-10 mb-4 first:mt-0 text-foreground",
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
        "scroll-mt-24 text-lg font-semibold tracking-tight mt-8 mb-3 text-foreground",
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
      className={cn("leading-7 text-foreground/90 my-4 text-sm sm:text-base", className)}
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
      className={cn("my-4 ml-6 list-disc space-y-2 text-foreground/90 text-sm sm:text-base", className)}
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
        "my-4 ml-6 list-decimal space-y-2 text-foreground/90 text-sm sm:text-base",
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
    const isExternal = href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:");
    if (isExternal) {
      return (
        <a
          href={href}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
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
      aria-label="Research data table"
      tabIndex={0}
      className="my-6 w-full overflow-x-auto rounded-2xl border border-border bg-card shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
    <thead className="border-b border-border bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground" {...props}>
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
};

export default async function ResearchSlugPage({ params }: ResearchPageProps) {
  const { slug = [] } = await params;
  const doc = getResearchDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  const activeHref =
    slug.length === 0 ? "/research" : `/research/${slug.join("/")}`;
  const sidebarSections = getResearchSidebarSections(activeHref);

  const breadcrumbs: BreadcrumbCrumb[] = [
    { label: "Research", href: "/research" },
  ];
  if (slug.length > 0) {
    const parentSlug = slug.slice(0, -1);
    if (parentSlug.length > 0) {
      breadcrumbs.push({
        label: parentSlug.join("/"),
        href: `/research/${parentSlug.join("/")}`,
      });
    }
    breadcrumbs.push({ label: doc.title });
  }

  // Pre-load structured data
  const isNewsPage = slug.length === 1 && slug[0] === "news";
  const isAdvisoryPage =
    slug.length === 1 && (slug[0] === "advisory" || slug[0] === "advisory-board");
  const isJobsIndex = slug.length === 1 && slug[0] === "jobs";
  const isOverviewPage = slug.length === 0;

  const newsItems = isNewsPage ? getResearchNewsData() : [];
  const advisoryMembers = isAdvisoryPage ? getResearchAdvisoryData() : [];
  const allJobs = isJobsIndex ? getResearchJobsData() : [];
  const openJobs = allJobs.filter((j) => j.status === "open");
  const filledJobs = allJobs.filter((j) => j.status !== "open");

  // Compute Prev / Next navigation
  const internalNavItems = sidebarSections
    .flatMap((sec) => sec.items)
    .filter((item) => !item.external && item.href.startsWith("/research"));
  const currentIndex = internalNavItems.findIndex(
    (item) => item.href === activeHref
  );
  const prevItem = currentIndex > 0 ? internalNavItems[currentIndex - 1] : null;
  const nextItem =
    currentIndex >= 0 && currentIndex < internalNavItems.length - 1
      ? internalNavItems[currentIndex + 1]
      : null;

  return (
    <SidebarContentLayout
      portalTitle="Public AI Research Network"
      portalSubtitle="Open Science, Governance & SAIL"
      sections={sidebarSections}
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
            <a
              href="/PublicAIwhitepaper.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="mr-1.5 h-3.5 w-3.5 text-primary" />
              Whitepaper (PDF)
            </a>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="rounded-full text-xs"
          >
            <a
              href="https://github.com/forpublicai"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="mr-1.5 h-3.5 w-3.5" />
              GitHub
            </a>
          </Button>
        </div>
      }
    >
      <div className="space-y-10">
        {/* Header Hero */}
        <div className="space-y-3 border-b border-border pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="rounded-full border-[#00B3A4]/40 bg-[#00B3A4]/15 text-[#00B3A4] text-xs font-semibold"
            >
              Public AI Network Research Hub
            </Badge>
            {slug.length > 0 && (
              <Badge variant="secondary" className="rounded-full text-xs">
                {slug.join(" / ")}
              </Badge>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {doc.title}
          </h1>
          {doc.description && (
            <p className="text-base text-muted-foreground leading-relaxed">
              {doc.description}
            </p>
          )}
        </div>

        {/* Featured Whitepaper Banner on Research Home */}
        {isOverviewPage && (
          <div className="theme-navy relative overflow-hidden rounded-2xl border border-white/10 bg-[#0F2D4A] p-6 sm:p-8 text-white shadow-lg">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-10 -right-10 h-36 w-60 rotate-12 rounded-full bg-[#00B3A4]/25 blur-2xl"
            />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#38BDF8]">
                  <FileText className="h-4 w-4" />
                  Foundational Publication
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Public AI Whitepaper: The Case for Sovereign Open Infrastructure
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Read our foundational synthesis outlining the economic, civic, and technical imperatives for state-supported compute, open weights, and public digital utilities.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button
                  asChild
                  className="rounded-full bg-[#FF3B30] hover:bg-[#E02E24] text-white font-semibold"
                >
                  <a
                    href="/PublicAIwhitepaper.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-white/20 bg-white/10 hover:bg-white/20 text-white font-semibold"
                >
                  <Link href="/research/whitepaper">Read Online</Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Rendered Markdown/MDX Content */}
        <div className="max-w-none">
          <MDXRemote
            source={doc.content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                format: "md",
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug],
              },
            }}
          />
        </div>

        {/* Jobs Directory on /research/jobs */}
        {isJobsIndex && allJobs.length > 0 && (
          <div className="space-y-8 pt-6 border-t border-border">
            {openJobs.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/15 text-primary border-transparent rounded-full text-xs">
                    {openJobs.length} Open Opportunities
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {openJobs.map((job) => (
                    <Card key={job.slug} className="rounded-2xl border-border/80 flex flex-col justify-between hover:border-primary/40 transition-colors">
                      <CardHeader className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <Badge className="bg-[#00B3A4] text-white border-transparent text-[10px]">
                            Open Role
                          </Badge>
                          {job.date_posted && (
                            <span className="text-[11px] font-mono text-muted-foreground">{job.date_posted}</span>
                          )}
                        </div>
                        <CardTitle className="text-base font-bold">
                          <Link href={`/research/jobs/${job.slug}`} className="hover:underline">
                            {job.title}
                          </Link>
                        </CardTitle>
                        {job.summary && (
                          <CardDescription className="text-xs leading-relaxed">
                            {job.summary}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="pt-0 space-y-1.5 text-xs text-muted-foreground">
                        {job.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-primary" />
                            <span>{job.location}</span>
                          </div>
                        )}
                        {job.commitment && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-[#00B3A4]" />
                            <span>{job.commitment} {job.compensation ? `· ${job.compensation}` : ""}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {filledJobs.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-lg font-bold tracking-tight text-muted-foreground">
                  Past / Filled Roles ({filledJobs.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filledJobs.map((job) => (
                    <Card key={job.slug} className="rounded-xl border-border/60 bg-secondary/30">
                      <CardHeader className="p-4 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-xs text-foreground">
                            <Link href={`/research/jobs/${job.slug}`} className="hover:underline">
                              {job.title}
                            </Link>
                          </span>
                          <Badge variant="outline" className="text-[10px] rounded-full">
                            Filled
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {job.location} {job.commitment ? `· ${job.commitment}` : ""}
                        </p>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Structured News Cards on /research/news */}
        {isNewsPage && newsItems.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-border">
            <h2 className="text-2xl font-bold tracking-tight">
              Network Updates &amp; Press Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {newsItems.map((item, idx) => (
                <Card
                  key={item.title + idx}
                  className="rounded-2xl border-border/80 flex flex-col justify-between hover:border-primary/40 transition-colors"
                >
                  <CardHeader className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span className="font-semibold text-primary">
                        {item.publication ?? "Public AI"}
                      </span>
                      {item.date && (
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="h-3 w-3" />
                          {item.date}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-base font-bold leading-snug">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-start justify-between gap-2"
                      >
                        <span>{item.title}</span>
                        <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      </a>
                    </CardTitle>
                    {item.description && (
                      <CardDescription className="text-xs leading-relaxed">
                        {item.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  {item.author && (
                    <CardContent className="pt-0 text-xs text-muted-foreground">
                      Author: <span className="font-medium text-foreground">{item.author}</span>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Structured Advisory Board Cards on /research/advisory */}
        {isAdvisoryPage && advisoryMembers.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-border">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">
                Distinguished Advisory Members
              </h2>
              <p className="text-sm text-muted-foreground">
                Guiding institutional strategy, research priorities, and governance for the Public AI Network.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {advisoryMembers.map((member) => (
                <Card
                  key={member.name}
                  className="rounded-2xl border-border/80 flex flex-col justify-between"
                >
                  <CardHeader className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-base font-bold">
                        {member.name}
                      </CardTitle>
                      {member.link && (
                        <a
                          href={member.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground"
                          aria-label={`${member.name} profile`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    {member.affiliation && (
                      <Badge
                        variant="secondary"
                        className="w-fit text-[11px] font-normal leading-tight"
                      >
                        {member.affiliation}
                      </Badge>
                    )}
                  </CardHeader>
                  {member.bio && (
                    <CardContent className="text-xs text-muted-foreground leading-relaxed">
                      {member.bio}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
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
