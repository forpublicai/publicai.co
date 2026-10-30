import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import matter from "gray-matter";
import {
  PROJECT_CATEGORIES,
  type ProjectCategory,
  type Post,
} from "./blog-types";

export { PROJECT_CATEGORIES, type ProjectCategory, type Post };

const postsDirectory = path.join(process.cwd(), "content/projects");

/**
 * Fallback helper: if a Markdown/MDX file in content/projects/ omits `datePublished` / `date`,
 * look up the file's first Git commit date (`YYYY-MM-DD`).
 */
function getGitFirstCommitDate(filePath: string): string {
  try {
    const output = execSync(
      `git log --follow --format="%ad" --date=short -- "${filePath}" | tail -n 1`,
      {
        cwd: process.cwd(),
        stdio: ["ignore", "pipe", "ignore"],
      }
    )
      .toString()
      .trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(output)) {
      return output;
    }
  } catch {
    // Ignore git lookup failures in environments without git history
  }
  return "2025-07-12";
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs
    .readdirSync(postsDirectory)
    .filter(
      (file) =>
        !file.startsWith("_") &&
        (file.endsWith(".mdx") || file.endsWith(".md"))
    )
    .map((file) => file.replace(/\.(mdx|md)$/, ""));
}

export function getPostBySlug(slug: string): Post | null {
  const realSlug = slug.replace(/\.(mdx|md)$/, "");
  if (realSlug.startsWith("_")) {
    return null;
  }

  const mdxPath = path.join(postsDirectory, `${realSlug}.mdx`);
  const mdPath = path.join(postsDirectory, `${realSlug}.md`);
  const fullPath = fs.existsSync(mdxPath)
    ? mdxPath
    : fs.existsSync(mdPath)
    ? mdPath
    : null;

  if (!fullPath) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const rawDate =
    (typeof data.datePublished === "string" && data.datePublished.trim()) ||
    (typeof data.date === "string" && data.date.trim()) ||
    getGitFirstCommitDate(fullPath);

  const description =
    (typeof data.description === "string" && data.description) ||
    (typeof data.excerpt === "string" && data.excerpt) ||
    "";

  const category = (data.category as Exclude<ProjectCategory, "All">) || "Projects & Case Studies";

  const firstContentImage =
    (typeof data.coverImage === "string" && data.coverImage.trim()) ||
    (typeof data.ogImage === "string" && data.ogImage.trim()) ||
    content.match(/!\[.*?\]\((.*?)\)/)?.[1] ||
    content.match(/<PhotoFigure[^>]+src=["']([^"']+)["']/)?.[1] ||
    content.match(/<img[^>]+src=["']([^"']+)["']/)?.[1] ||
    undefined;

  const resolvedCoverImage =
    (typeof data.coverImage === "string" && data.coverImage.trim()) ||
    firstContentImage;

  const resolvedOgImage =
    (typeof data.ogImage === "string" && data.ogImage.trim()) ||
    resolvedCoverImage;

  return {
    slug: realSlug,
    title: typeof data.title === "string" ? data.title : realSlug,
    date: rawDate,
    datePublished: rawDate,
    category,
    description,
    excerpt: description,
    author: typeof data.author === "string" ? data.author : "Public AI Team",
    coverImage: resolvedCoverImage,
    coverImageAlt:
      typeof data.coverImageAlt === "string"
        ? data.coverImageAlt
        : typeof data.title === "string"
        ? data.title
        : realSlug,
    ogImage: resolvedOgImage,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    models: Array.isArray(data.models) ? data.models.map(String) : [],
    linkedinHook:
      typeof data.linkedinHook === "string" ? data.linkedinHook : undefined,
    linkedinBullets: Array.isArray(data.linkedinBullets)
      ? data.linkedinBullets.map(String)
      : undefined,
    linkedinPost:
      typeof data.linkedinPost === "string" ? data.linkedinPost : undefined,
    draft: data.draft === true,
    content,
  };
}

export function getAllPosts(options?: {
  category?: ProjectCategory;
  sortOrder?: "newest" | "oldest";
}): Post[] {
  const slugs = getPostSlugs();
  const sortOrder = options?.sortOrder ?? "newest";

  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null && post.draft !== true)
    .filter((post) => {
      if (!options?.category || options.category === "All") {
        return true;
      }
      return post.category === options.category;
    })
    .sort((a, b) => {
      if (sortOrder === "oldest") {
        return a.datePublished.localeCompare(b.datePublished);
      }
      return b.datePublished.localeCompare(a.datePublished);
    });

  return posts;
}
