"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  ExternalLink,
  GitPullRequest,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MagicCard } from "@/components/ui/magic-card";
import { Post, PROJECT_CATEGORIES, ProjectCategory } from "@/utils/blog-types";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/lib/utils";

interface BlogsProps {
  posts: Post[];
}

function getCategoryBadgeStyle(category: Post["category"]) {
  switch (category) {
    case "Model Launches":
      return "bg-primary/10 text-primary border-primary/30";
    case "Partner Work":
      return "bg-brand-teal/15 text-brand-teal border-brand-teal/30";
    case "Essays & Policy":
      return "bg-warning/20 text-foreground border-warning/40";
    default:
      return "bg-accent text-accent-foreground border-border";
  }
}

export function Blogs({ posts }: BlogsProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<ProjectCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const popularTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      for (const tag of post.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => tag);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return posts
      .filter((post) => {
        if (
          selectedCategory !== "All" &&
          post.category !== selectedCategory
        ) {
          return false;
        }
        if (selectedTag && !post.tags.includes(selectedTag)) {
          return false;
        }
        if (!q) return true;

        const haystack = [
          post.title,
          post.description,
          post.author,
          post.category,
          ...post.tags,
          ...post.models,
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(q);
      })
      .sort((a, b) => {
        if (sortOrder === "oldest") {
          return a.datePublished.localeCompare(b.datePublished);
        }
        return b.datePublished.localeCompare(a.datePublished);
      });
  }, [posts, selectedCategory, selectedTag, searchQuery, sortOrder]);

  return (
    <div className="flex flex-col gap-10 w-full">
      {/* Filter & Search Toolbar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-secondary/40 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Category Tabs */}
          <Tabs
            value={selectedCategory}
            onValueChange={(val) =>
              setSelectedCategory(val as ProjectCategory)
            }
            className="w-full lg:w-auto overflow-x-auto"
          >
            <TabsList className="inline-flex h-auto flex-wrap gap-1 bg-background p-1">
              {PROJECT_CATEGORIES.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Search Input & Chronological Sort Select */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search projects, models, partners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8 bg-background h-9 text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <Select
              value={sortOrder}
              onValueChange={(val) =>
                setSortOrder(val as "newest" | "oldest")
              }
            >
              <SelectTrigger className="w-full sm:w-44 h-9 bg-background text-xs sm:text-sm font-medium">
                <SelectValue placeholder="Sort by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Popular Topic / Model Filter Pills */}
        {popularTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs font-medium text-muted-foreground mr-1">
              Topics:
            </span>
            {popularTags.map((tag) => {
              const active = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(active ? null : tag)}
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors cursor-pointer",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {tag}
                </button>
              );
            })}
            {(selectedCategory !== "All" ||
              selectedTag !== null ||
              searchQuery.trim() !== "") && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedTag(null);
                  setSearchQuery("");
                }}
                className="h-6 px-2 text-xs text-primary hover:text-primary/80"
              >
                Reset filters ({filteredPosts.length}/{posts.length})
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Chronological Project & Story Cards Grid */}
      {filteredPosts.length === 0 ? (
        <Card className="rounded-2xl border-dashed p-12 text-center">
          <CardHeader>
            <CardTitle className="text-xl">No matching projects found</CardTitle>
            <CardDescription>
              Try clearing your search query or switching to the &ldquo;All&rdquo;
              category tab.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <MagicCard
              key={post.slug}
              className="group p-0 md:p-0 flex flex-col justify-between rounded-2xl border border-border bg-card transition-all duration-200 hover:shadow-md hover:border-primary/40"
            >
              <Link
                href={`/projects/${post.slug}`}
                className="flex flex-col h-full justify-between"
              >
                <div>
                  {/* Cover Image or Branded Pattern Header */}
                  <div className="relative h-48 w-full overflow-hidden border-b border-border bg-secondary">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.coverImageAlt || post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="theme-navy flex h-full w-full flex-col justify-between bg-[#0F2D4A] p-6 text-white relative overflow-hidden">
                        <div className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-[#00B3A4]/25 blur-xl" />
                        <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[#FF3B30]/25 blur-xl" />
                        <Sparkles className="h-6 w-6 text-[#00B3A4]" />
                        <p className="text-sm font-bold tracking-tight text-white/90 line-clamp-2">
                          {post.title}
                        </p>
                      </div>
                    )}
                  </div>

                  <CardHeader className="space-y-2.5 p-5 pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                          getCategoryBadgeStyle(post.category)
                        )}
                      >
                        {post.category}
                      </Badge>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <time dateTime={post.datePublished}>
                          {formatDate(post.datePublished)}
                        </time>
                      </span>
                    </div>

                    <CardTitle className="text-xl font-bold tracking-tight text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {post.description}
                    </CardDescription>
                  </CardHeader>
                </div>

                <div>
                  {post.tags.length > 0 && (
                    <CardContent className="px-5 py-2">
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="rounded-md px-2 py-0 text-[11px] font-normal text-muted-foreground"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  )}

                  <CardFooter className="px-5 pt-2 pb-5 flex items-center justify-between text-xs font-semibold text-primary">
                    <span>Read story</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </CardFooter>
                </div>
              </Link>
            </MagicCard>
          ))}
        </div>
      )}

      {/* Submit a Project or Story via GitHub PR Callout */}
      <Card className="rounded-2xl border border-border bg-secondary/50 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-teal">
              <GitPullRequest className="h-4 w-4" />
              <span>Open Community Publishing</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Building with Public AI? Submit your project or case study via PR.
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every article in <code className="rounded bg-background px-1.5 py-0.5 font-mono text-xs">content/projects/</code> is a plain Markdown file with YAML frontmatter and automatic LinkedIn sharing support. Copy{" "}
              <code className="rounded bg-background px-1.5 py-0.5 font-mono text-xs">content/projects/_template.mdx</code> and open a pull request on GitHub.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button asChild className="rounded-full font-semibold">
              <a
                href="https://github.com/forpublicai/publicai.co/tree/main/content/projects"
                target="_blank"
                rel="noopener noreferrer"
              >
                Submit via GitHub PR
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Blogs;
