import fs from "fs";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";
import type { SidebarNavSection, TocHeadingItem } from "@/components/sections";

const docsDirectory = path.join(process.cwd(), "content/docs");
const researchDirectory = path.join(process.cwd(), "content/research");

export interface ContentDocument {
  slug: string[];
  title: string;
  description?: string;
  section?: string;
  content: string;
  frontmatter: Record<string, unknown>;
  toc: TocHeadingItem[];
  sourcePath: string;
}

export interface DocsMetaConfig {
  portalTitle: string;
  portalSubtitle?: string;
  sections: SidebarNavSection[];
}

export interface NewsItem {
  title: string;
  author?: string;
  publication?: string;
  date?: string;
  link: string;
}

export interface AdvisoryMember {
  name: string;
  affiliation?: string;
  link?: string;
}

/**
 * Extracts H2 (##) and H3 (###) headings from Markdown/MDX content to build a sticky right-hand TOC.
 */
export function extractTocHeadings(markdown: string): TocHeadingItem[] {
  const lines = markdown.split("\n");
  const toc: TocHeadingItem[] = [];
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) continue;

    const level = match[1].length as 2 | 3;
    const rawTitle = match[2]
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[`*_~]/g, "")
      .trim();

    const id = rawTitle
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    if (id && rawTitle) {
      toc.push({ id, title: rawTitle, level });
    }
  }

  return toc;
}

/**
 * Loads `/docs` navigation configuration from `content/docs/_meta.json`.
 */
export function getDocsMeta(activeHref?: string): DocsMetaConfig {
  const metaPath = path.join(docsDirectory, "_meta.json");
  const raw = fs.readFileSync(metaPath, "utf8");
  const parsed = JSON.parse(raw) as DocsMetaConfig;

  if (activeHref) {
    parsed.sections = parsed.sections.map((section) => ({
      ...section,
      items: section.items.map((item) => ({
        ...item,
        isActive: item.href === activeHref,
      })),
    }));
  }

  return parsed;
}

/**
 * Loads a documentation page from `content/docs/` by slug array (e.g. `[]` -> `index.mdx`, `['models']` -> `models.mdx`).
 */
export function getDocBySlug(slug: string[] = []): ContentDocument | null {
  const normalized = slug.length === 0 ? ["index"] : slug;
  const relPath = normalized.join("/");
  const mdxPath = path.join(docsDirectory, `${relPath}.mdx`);
  const mdPath = path.join(docsDirectory, `${relPath}.md`);

  const targetPath = fs.existsSync(mdxPath)
    ? mdxPath
    : fs.existsSync(mdPath)
    ? mdPath
    : null;

  if (!targetPath) {
    return null;
  }

  const fileContents = fs.readFileSync(targetPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: typeof data.title === "string" ? data.title : normalized[normalized.length - 1],
    description: typeof data.description === "string" ? data.description : undefined,
    section: typeof data.section === "string" ? data.section : undefined,
    content,
    frontmatter: data,
    toc: extractTocHeadings(content),
    sourcePath: targetPath,
  };
}

/**
 * Loads the OpenAPI 3.1 specification from `content/docs/routes.oas.json`.
 */
export function getOpenApiSpec(): Record<string, unknown> {
  const oasPath = path.join(docsDirectory, "routes.oas.json");
  const raw = fs.readFileSync(oasPath, "utf8");
  return JSON.parse(raw) as Record<string, unknown>;
}

/**
 * Returns the sidebar navigation tree for `/research` (`Public AI Network Research Hub`).
 */
export function getResearchSidebarSections(activeHref?: string): SidebarNavSection[] {
  const sections: SidebarNavSection[] = [
    {
      label: "Research Network",
      items: [
        { title: "Overview & Manifesto", href: "/research" },
        { title: "Public AI Whitepaper", href: "/research/whitepaper" },
        { title: "Research Seminars", href: "/research/seminar" },
        { title: "Publications & Briefs", href: "/research/publications" },
        { title: "Press & In the News", href: "/research/news" },
      ],
    },
    {
      label: "Governance & Community",
      items: [
        { title: "Contributors & Maintainers", href: "/research/contributing" },
        { title: "Advisory Board", href: "/research/advisory" },
        { title: "Public AI Handbook", href: "/research/handbook" },
        { title: "Public AI Atlas", href: "/research/atlas" },
        { title: "Careers & Fellowships", href: "/research/jobs" },
      ],
    },
    {
      label: "SAIL Rating System",
      items: [
        { title: "SAIL Overview", href: "/projects/sail" },
        { title: "SAIL Specification", href: "/research/sail/spec", badge: "7 Layers" },
        { title: "Interest Decoder", href: "/research/sail/interests" },
        { title: "Annotated Case Studies", href: "/research/sail/cases" },
        { title: "Evaluated Models", href: "/research/sail/models" },
        { title: "Country Profiles", href: "/research/sail/countries" },
      ],
    },
  ];

  if (!activeHref) {
    return sections;
  }

  return sections.map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      isActive: item.href === activeHref,
    })),
  }));
}

/**
 * Loads a Markdown page from `content/research/` by slug array, resolving aliases like:
 * - `[]` -> `index.md`
 * - `['advisory-board']` or `['advisory']` -> `advisory.md`
 * - `['whitepaper']` -> `whitepaper/README.md`
 * - `['atlas']` -> `atlas/README.md`
 * - `['jobs']` -> `jobs/index.md`
 */
export function getResearchDocBySlug(slug: string[] = []): ContentDocument | null {
  const cleanSlug = slug.map((segment) => segment.replace(/\.html?$/, ""));

  const candidates: string[] = [];
  if (cleanSlug.length === 0) {
    candidates.push(path.join(researchDirectory, "index.md"));
  } else {
    const joined = cleanSlug.join("/");
    if (joined === "advisory-board") {
      candidates.push(path.join(researchDirectory, "advisory.md"));
    }
    candidates.push(
      path.join(researchDirectory, `${joined}.md`),
      path.join(researchDirectory, `${joined}.mdx`),
      path.join(researchDirectory, joined, "index.md"),
      path.join(researchDirectory, joined, "README.md")
    );
  }

  const targetPath = candidates.find((candidate) => fs.existsSync(candidate)) ?? null;
  if (!targetPath) {
    return null;
  }

  const fileContents = fs.readFileSync(targetPath, "utf8");
  const { data, content } = matter(fileContents);

  const fallbackTitle =
    cleanSlug.length === 0
      ? "Public AI Research Network"
      : cleanSlug[cleanSlug.length - 1]
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    slug: cleanSlug,
    title: typeof data.title === "string" ? data.title : fallbackTitle,
    description: typeof data.description === "string" ? data.description : undefined,
    content,
    frontmatter: data,
    toc: extractTocHeadings(content),
    sourcePath: targetPath,
  };
}

/**
 * Loads `content/research/_data/news.yml`.
 */
export function getResearchNewsData(): NewsItem[] {
  const newsPath = path.join(researchDirectory, "_data/news.yml");
  if (!fs.existsSync(newsPath)) return [];
  const raw = fs.readFileSync(newsPath, "utf8");
  const parsed = yaml.load(raw);
  return Array.isArray(parsed) ? (parsed as NewsItem[]) : [];
}

/**
 * Loads `content/research/_data/advisory.yml`.
 */
export function getResearchAdvisoryData(): AdvisoryMember[] {
  const advPath = path.join(researchDirectory, "_data/advisory.yml");
  if (!fs.existsSync(advPath)) return [];
  const raw = fs.readFileSync(advPath, "utf8");
  const parsed = yaml.load(raw);
  return Array.isArray(parsed) ? (parsed as AdvisoryMember[]) : [];
}
