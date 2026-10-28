import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { ArrowLeft, ArrowRight, Calendar, User } from "lucide-react";
import { MaxWidthWrapper } from "@/components/global/max-width-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PhotoFigure from "@/components/PhotoFigure";
import SubstackBox from "@/components/SubstackBox";
import { LinkedInShareBar } from "@/components/blog/linkedin-share-bar";
import { extractTocHeadings } from "@/lib/content";
import { getAllPosts, getPostBySlug } from "@/utils/blog";
import { formatDate } from "@/utils/format-date";

interface ProjectArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Project Not Found | Public AI",
    };
  }

  const publishedIso = new Date(
    post.datePublished.includes("T")
      ? post.datePublished
      : `${post.datePublished}T00:00:00Z`
  ).toISOString();

  const canonicalUrl = `https://publicai.co/projects/${post.slug}`;

  return {
    title: `${post.title} | Public AI`,
    description: post.description,
    authors: [{ name: post.author }],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonicalUrl,
      siteName: "Public AI",
      type: "article",
      publishedTime: publishedIso,
      authors: [post.author],
      tags: post.tags,
      ...(post.ogImage
        ? {
            images: [
              {
                url: post.ogImage,
                width: 1200,
                height: 630,
                alt: post.title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      ...(post.ogImage ? { images: [post.ogImage] } : {}),
    },
  };
}

export default async function ProjectArticlePage({
  params,
}: ProjectArticlePageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const toc = extractTocHeadings(post.content);
  const fallbackHeadings = toc
    .filter((h) => h.level === 2)
    .map((h) => h.title);

  const allPosts = getAllPosts({ sortOrder: "newest" });
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => {
      const aSameCat = a.category === post.category ? 1 : 0;
      const bSameCat = b.category === post.category ? 1 : 0;
      return bSameCat - aSameCat;
    })
    .slice(0, 3);

  return (
    <div className="py-10 md:py-16">
      <MaxWidthWrapper className="max-w-4xl">
        {/* Back link */}
        <div className="mb-8">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="-ml-3 rounded-full text-muted-foreground hover:text-foreground"
          >
            <Link href="/projects">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              All Projects &amp; Stories
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <header className="space-y-6 mb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <Badge className="rounded-full px-3 py-0.5 font-semibold">
              {post.category}
            </Badge>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <time dateTime={post.datePublished}>
                {formatDate(post.datePublished)}
              </time>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <User className="h-3.5 w-3.5 text-brand-teal" />
              <span>{post.author}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.12]">
            {post.title}
          </h1>

          {post.description && (
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              {post.description}
            </p>
          )}

          {(post.tags.length > 0 || post.models.length > 0) && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {post.models.map((model) => (
                <Badge
                  key={model}
                  variant="outline"
                  className="rounded-md font-mono text-xs bg-brand-teal/10 text-brand-teal border-brand-teal/30"
                >
                  {model}
                </Badge>
              ))}
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="rounded-md text-xs font-normal text-muted-foreground"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Top LinkedIn Share & Draft Bar */}
          <LinkedInShareBar
            slug={post.slug}
            title={post.title}
            description={post.description}
            category={post.category}
            author={post.author}
            tags={post.tags}
            linkedinHook={post.linkedinHook}
            linkedinBullets={post.linkedinBullets}
            linkedinPost={post.linkedinPost}
            fallbackHeadings={fallbackHeadings}
          />
        </header>

        {/* Article Body */}
        <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed prose-li:text-foreground/90 prose-a:text-primary prose-a:font-medium hover:prose-a:underline prose-blockquote:border-l-primary prose-blockquote:bg-secondary/40 prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:rounded-r-xl prose-img:rounded-xl">
          <MDXRemote
            source={post.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug],
              },
            }}
            components={{
              PhotoFigure,
              SubstackBox,
              a: ({
                href,
                children,
                ...props
              }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
                const targetHref = href || "#";
                const isExternal =
                  targetHref.startsWith("http://") ||
                  targetHref.startsWith("https://");
                if (isExternal) {
                  return (
                    <a
                      href={targetHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    >
                      {children}
                    </a>
                  );
                }
                return (
                  <Link href={targetHref} {...props}>
                    {children}
                  </Link>
                );
              },
              img: ({
                src,
                alt,
                ...props
              }: React.ImgHTMLAttributes<HTMLImageElement>) => {
                if (!src || typeof src !== "string") return null;
                return (
                  <span className="my-8 block">
                    <Image
                      src={src}
                      alt={alt || ""}
                      width={800}
                      height={450}
                      className="mx-auto rounded-xl max-w-full h-auto"
                      {...(props as Record<string, unknown>)}
                    />
                  </span>
                );
              },
            }}
          />
        </article>

        <Separator className="my-10" />

        {/* Bottom LinkedIn Share & Draft Bar */}
        <div className="space-y-4">
          <p className="text-sm font-semibold text-foreground">
            Share this project with your network:
          </p>
          <LinkedInShareBar
            slug={post.slug}
            title={post.title}
            description={post.description}
            category={post.category}
            author={post.author}
            tags={post.tags}
            linkedinHook={post.linkedinHook}
            linkedinBullets={post.linkedinBullets}
            linkedinPost={post.linkedinPost}
            fallbackHeadings={fallbackHeadings}
          />
        </div>

        {/* Related Stories */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                More from Public AI
              </h2>
              <Button asChild variant="link" className="text-primary">
                <Link href="/projects">
                  View all {allPosts.length} stories
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedPosts.map((rel) => (
                <Link key={rel.slug} href={`/projects/${rel.slug}`}>
                  <Card className="h-full rounded-2xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-md">
                    <CardHeader className="space-y-2 p-5">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <Badge variant="outline" className="rounded-full text-[10px]">
                          {rel.category}
                        </Badge>
                        <span>{formatDate(rel.datePublished)}</span>
                      </div>
                      <CardTitle className="text-base font-bold line-clamp-2 text-card-foreground">
                        {rel.title}
                      </CardTitle>
                      <CardDescription className="text-xs line-clamp-3">
                        {rel.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </MaxWidthWrapper>
    </div>
  );
}
